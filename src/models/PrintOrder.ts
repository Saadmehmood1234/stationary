import mongoose from 'mongoose';

const PrintOrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  paperSize: {
    type: String,
    enum: ['A4', 'A3', 'Letter', 'Legal'],
    default: 'A4'
  },
  colorType: {
    type: String,
    enum: ['bw', 'color'],
    default: 'bw'
  },
  pageCount: {
    type: Number,
    required: [true, 'Page count is required'],
    min: [1, 'Page count must be at least 1']
  },
  binding: {
    type: String,
    enum: ['none', 'spiral', 'stapler'],
    default: 'none'
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'express'],
    default: 'normal'
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Instructions too long']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'printing', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedCost: {
    type: Number,
    required: true
  },
  finalCost: {
    type: Number
  },
  fileUrl: {
    type: String
  },
  fileName: {
    type: String
  },
  fileSize: {
    type: Number
  },
  fileType: {
    type: String
  },
  publicId: {
    type: String 
  }
}, {
  timestamps: true
});

export default mongoose.models.PrintOrder || mongoose.model('PrintOrder', PrintOrderSchema);