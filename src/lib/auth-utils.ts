import crypto from "crypto";

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateRandomCode = (length: number = 6): string => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

export const sanitizeUser = (user: any) => {
  if (!user) return null;
  
  // Convert Mongoose document to plain object and handle ObjectId
  let userObject;
  if (user.toObject) {
    userObject = user.toObject();
  } else if (user.toJSON) {
    userObject = JSON.parse(JSON.stringify(user));
  } else {
    userObject = { ...user };
  }
  
  // Convert ObjectId to string if it exists
  if (userObject._id && typeof userObject._id === 'object') {
    if (userObject._id.toString && typeof userObject._id.toString === 'function') {
      userObject._id = userObject._id.toString();
    } else if (userObject._id.buffer) {
      // Handle Buffer representation of ObjectId
      userObject._id = userObject._id.toString('hex');
    }
  }
  
  // Remove sensitive fields
  const { 
    password, 
    verifyToken, 
    resetToken, 
    loginAttempts, 
    lockUntil, 
    resetTokenExpires,
    verifyTokenExpires,
    ...sanitized 
  } = userObject;
  
  return sanitized;
};