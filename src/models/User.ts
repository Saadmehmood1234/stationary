import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface ICustomer extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  profilePic: string;
  verified: boolean;
  verifyToken: string;
  verifyTokenExpires: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
  phone?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences: {
    marketingEmails: boolean;
    smsNotifications: boolean;
  };
  lastLogin: Date;
  role: "user" | "admin" | "employee" | "vendor";
  loginAttempts: number;
  lockUntil?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  isVerifyTokenValid(): boolean;
  isResetTokenValid(): boolean;
}

const CustomerSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // ✅ This already creates an index
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be longer than 50 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "employee", "vendor"],
      default: "user",
    },
    profilePic: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: "",
    },
    verifyTokenExpires: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 60 * 1000),
    },
    resetToken: {
      type: String,
    },
    resetTokenExpires: {
      type: Date,
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    preferences: {
      marketingEmails: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


CustomerSchema.index({ verifyToken: 1 });
CustomerSchema.index({ resetToken: 1 });


CustomerSchema.pre<ICustomer>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(
      Number(process.env.BCRYPT_SALT_ROUNDS) || 12
    );
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
CustomerSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
CustomerSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Check if verify token is valid
CustomerSchema.methods.isVerifyTokenValid = function (): boolean {
  return !!(this.verifyToken && new Date() < this.verifyTokenExpires);
};

// Check if reset token is valid
CustomerSchema.methods.isResetTokenValid = function (): boolean {
  return !!(
    this.resetToken &&
    this.resetTokenExpires &&
    new Date() < this.resetTokenExpires
  );
};

// Increment login attempts
CustomerSchema.methods.incrementLoginAttempts =
  async function (): Promise<ICustomer> {
    if (this.lockUntil && this.lockUntil < new Date()) {
      return this.updateOne({
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 },
      });
    }

    let updates: any = { $inc: { loginAttempts: 1 } };

    if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
      updates = {
        $inc: { loginAttempts: 1 },
        $set: { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) },
      };
    }

    return this.updateOne(updates);
  };

export const Customer =
  models.Customer || model<ICustomer>("Customer", CustomerSchema);
export default Customer;
