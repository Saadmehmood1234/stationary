import crypto from "crypto";

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateRandomCode = (length: number = 6): string => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

export const sanitizeUser = (user: any) => {
  const { password, verifyToken, resetToken, loginAttempts, lockUntil, ...sanitized } = user.toObject ? user.toObject() : user;
  return sanitized;
};