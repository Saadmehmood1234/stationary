import mongoose, { Schema, Document,Types, Model } from 'mongoose';
export interface IUploadedImage extends Document {
  _id: Types.ObjectId;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  publicId: string;
  folder?: string;
  tags?: string[];
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    resourceType?: string;
  };
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
const UploadedImageSchema: Schema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    folder: {
      type: String,
      default: 'uploads',
    },
    tags: [{
      type: String,
    }],
    metadata: {
      width: Number,
      height: Number,
      format: String,
      resourceType: String,
    },
    uploadedBy: {
      type: String,
      default: 'anonymous',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
UploadedImageSchema.index({ publicId: 1 });
UploadedImageSchema.index({ uploadedAt: -1 });
UploadedImageSchema.index({ folder: 1 });
UploadedImageSchema.index({ tags: 1 });

// Export both the model and the interface
export const UploadedImage: Model<IUploadedImage> = 
  mongoose.models.UploadedImage || mongoose.model<IUploadedImage>('UploadedImage', UploadedImageSchema);
