"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import dbConnect from "@/lib/dbConnect";
import Customer from "@/models/User";
import { generateToken, sanitizeUser } from "@/lib/auth-utils";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/email-service";
import { checkRateLimit } from "@/lib/rate-limit";
import { SessionPayload } from "@/types";
import { revalidatePath } from "next/cache";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret"
);

const broadcastSessionUpdate = () => {
  // This will trigger the storage event in other tabs
  if (typeof window !== "undefined") {
    localStorage.setItem("session-update", Date.now().toString());
    setTimeout(() => {
      localStorage.removeItem("session-update");
    }, 100);
  }
  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/admin", "page");
  revalidatePath("/auth/signin", "page");
  revalidatePath("/auth/signup", "page");
};

export const createSession = async (user: any) => {
  let userId: string;

  if (user && user._id) {
    if (
      typeof user._id === "object" &&
      user._id.toString &&
      typeof user._id.toString === "function"
    ) {
      userId = user._id.toString();
    } else if (typeof user._id === "string") {
      userId = user._id;
    } else {
      userId = String(user._id);
    }
  } else {
    throw new Error("User ID is required to create session");
  }

  console.log("Creating session with userId:", userId, "Type:", typeof userId);

  const token = await new SignJWT({
    userId: userId,
    email: user.email || "",
    name: user.name || "",
    verified: user.verified || false,
    profilePic: user.profilePic,
    phone: user.phone || "",
    iat: user.iat,
    lastLogin: user.lastLogin,
    exp: user.exp,
    address: user.address,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15d")
    .setIssuedAt()
    .sign(JWT_SECRET);
console.log(token)
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 15,
    path: "/",
  });
  broadcastSessionUpdate();
  return token;
};

export const getSession = async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = (await jwtVerify(token, JWT_SECRET)) as {
      payload: any;
    };

    if (!payload || !payload.userId) {
      console.error("Invalid session payload:", payload);
      return null;
    }
    let userId = payload.userId;
    if (userId && typeof userId === "object") {
      if (typeof userId.toString === "function") {
        userId = userId.toString();
      } else if (userId._id) {
        userId = userId._id;
      } else if (userId.id) {
        userId = userId.id;
      } else {
        const stringValues = Object.values(userId).filter(
          (val) => typeof val === "string"
        );
        userId = stringValues[0] || null;
      }
    }
    if (typeof userId !== "string") {
      console.error("userId is not a string:", userId);
      return null;
    }

    return {
      userId: userId,
      email: payload.email || "",
      name: payload.name || "",
      profilePic: payload.profilePic,
      phone: payload.phone || "",
      verified: payload.verified || false,
      iat: payload.iat,
      lastLogin: payload.lastLogin,
      exp: payload.exp,
      address: payload.address,
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  broadcastSessionUpdate();
};

export const registerUser = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    await dbConnect();

    if (!checkRateLimit(`register:${formData.email}`, 3)) {
      return {
        success: false,
        message: "Too many registration attempts. Please try again later.",
      };
    }

    const existingUser = await Customer.findOne({
      email: formData.email.toLowerCase(),
    });
    if (existingUser) {
      return {
        success: false,
        message: "User already exists with this email.",
      };
    }

    const verifyToken = generateToken();
    const user = await Customer.create({
      ...formData,
      email: formData.email.toLowerCase(),
      verifyToken,
      verifyTokenExpires: new Date(Date.now() + 3 * 60 * 1000),
    });

    await sendVerificationEmail(user.email, verifyToken);

    const fullUser = await Customer.findById(user._id).select(
      "-password -verifyToken -resetToken -loginAttempts -lockUntil"
    );

    await createSession(fullUser);

    return {
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      data: sanitizeUser(user),
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "Registration failed. Please try again.",
    };
  }
};

export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    await dbConnect();
    if (!checkRateLimit(`login:${formData.email}`, 5)) {
      return {
        success: false,
        message: "Too many login attempts. Please try again later.",
      };
    }

    const user = await Customer.findOne({
      email: formData.email.toLowerCase(),
    }).select("+password +loginAttempts +lockUntil");

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    if (user.isLocked()) {
      return {
        success: false,
        message: "Account temporarily locked due to too many failed attempts.",
      };
    }

    const isPasswordValid = await user.comparePassword(formData.password);
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Reset login attempts and update last login
    await Customer.findByIdAndUpdate(user._id, {
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: new Date(),
    });

    // Get the updated user without sensitive fields
    const fullUser = await Customer.findById(user._id).select(
      "-password -verifyToken -resetToken -loginAttempts -lockUntil"
    );

    if (!fullUser) {
      return {
        success: false,
        message: "User not found after login",
      };
    }

    // Create session and wait for it to complete
    await createSession(fullUser);

    // Broadcast session update to refresh the app state
    await broadcastSessionUpdate();

    return {
      success: true,
      message: "Login successful!",
      data: sanitizeUser(fullUser), // Use fullUser instead of user
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "Login failed. Please try again.",
    };
  }
};

export const logoutUser = async () => {
  await deleteSession();
  broadcastSessionUpdate(); // Add this line
  redirect("/auth/signin");
};
export const verifyEmail = async (token: string) => {
  try {
    await dbConnect();

    const user = await Customer.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid or expired verification token.",
      };
    }

    user.verified = true;
    user.verifyToken = "";
    user.verifyTokenExpires = new Date(0);
    await user.save();
    await createSession(user);

    return {
      success: true,
      message: "Email verified successfully!",
    };
  } catch (error: any) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: error.message || "Email verification failed.",
    };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    await dbConnect();
    if (!checkRateLimit(`forgot-password:${email}`, 3)) {
      return {
        success: false,
        message: "Too many password reset attempts. Please try again later.",
      };
    }

    const user = await Customer.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent.",
      };
    }

    const resetToken = generateToken();
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    return {
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    };
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: error.message || "Password reset failed. Please try again.",
    };
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    await dbConnect();

    const user = await Customer.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return {
        success: false,
        message: "Invalid or expired reset token.",
      };
    }

    user.password = newPassword;
    user.resetToken = "";
    user.resetTokenExpires = new Date(0);
    await user.save();

    return {
      success: true,
      message:
        "Password reset successfully! You can now login with your new password.",
    };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.message || "Password reset failed.",
    };
  }
};
