import { NextResponse } from "next/server";
import Customer from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await dbConnect();

    // Find user with the token and check expiration
    const user = await Customer.findOne({
      verifyToken: token, // Changed from verificationToken to verifyToken
      verifyTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.verified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ 
      success: true,
      message: "Email verified successfully" 
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}