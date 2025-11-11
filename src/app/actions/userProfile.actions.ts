"use server";

import dbConnect from "@/lib/dbConnect";
import Customer from "@/models/User";
import { getSession } from "./auth.actions";

const convertToPlainObject = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : JSON.parse(JSON.stringify(doc));
  const convertDeep = (value: any): any => {
    if (value instanceof Date) return value.toISOString();
    if (value && typeof value === "object") {
      if (value._bsontype === "ObjectID" || value.buffer) {
        return value.toString();
      }
      for (const key in value) {
        value[key] = convertDeep(value[key]);
      }
    }
    return value;
  };

  return convertDeep(obj);
};


export const getUserProfile = async (): Promise<{
  success: boolean;
  data?: any;
  message: string;
}> => {
  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    if (!session.email) {
      return {
        success: false,
        message: "Email not found in session",
      };
    }

    await dbConnect();

    const user = await Customer.findOne({ email: session.email }).select(
      "-password -verifyToken -resetToken -loginAttempts -lockUntil"
    );

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const userData = convertToPlainObject(user);

    return {
      success: true,
      data: userData,
      message: "User profile retrieved successfully",
    };
  } catch (error: any) {
    console.error("Get user profile error:", error);
    return {
      success: false,
      message: error.message || "Failed to get user profile",
    };
  }
};
const { createSession } = await import("./auth.actions");
export const updateUserProfile = async (
  updates: Partial<{
    name: string;
    email: string;
    profilePic:string
    phone: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  }>
): Promise<{
  status: number;
  success: boolean;
  data?: any;
  message: string;
}> => {
  try {
    const session = await getSession();

    if (!session || !session.email) {
      return {
        status: 401,
        success: false,
        message: "Not authenticated",
      };
    }

    await dbConnect();

    const updatedUser = await Customer.findOneAndUpdate(
      { email: session.email },
      updates,
      { new: true, runValidators: true }
    ).select("-password -verifyToken -resetToken -loginAttempts -lockUntil");

    if (!updatedUser) {
      return {
        status: 404,
        success: false,
        message: "User not found",
      };
    }
    if (updates.email || updates.name) {
      await createSession(updatedUser);
    }

    const userData = convertToPlainObject(updatedUser);

    return {
      status: 200,
      success: true,
      data: userData,
      message: "Profile updated successfully",
    };
  } catch (error: any) {
    console.error("Update profile error:", error);

    if (error.code === 11000) {
      return {
        status: 400,
        success: false,
        message: "Email already exists",
      };
    }

    return {
      status: 500,
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
};
