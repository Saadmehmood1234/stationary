"use server";

import { uploadFile, deleteFile, validateFile } from '@/lib/fileUpload';
import { UploadedImage, IUploadedImage } from '@/models/UploadedImage';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/dbConnect';
import { Types } from 'mongoose';

// Interface for the serialized image data returned to client
interface SerializedUploadedImage {
  _id: string;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  publicId: string;
  folder?: string;
  tags?: string[];
  uploadedAt: string;
  updatedAt: string;
}

export async function uploadImageAction(formData: FormData): Promise<{
  success: boolean;
  data?: SerializedUploadedImage;
  error?: string;
}> {
  try {
    await dbConnect();
    
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const tags = formData.get('tags') as string;
    const uploadedBy = formData.get('uploadedBy') as string || 'anonymous';

    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Only image files are allowed'
      };
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadFile(file);

    // Store in database
    const imageData = {
      url: cloudinaryResult.url,
      fileName: cloudinaryResult.fileName,
      fileSize: cloudinaryResult.fileSize,
      fileType: cloudinaryResult.fileType,
      publicId: cloudinaryResult.publicId,
      folder,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      uploadedBy,
    };

    const savedImage = await UploadedImage.create(imageData);

    // Use the document directly to access timestamps
    const serializedImage: SerializedUploadedImage = {
      _id: savedImage._id.toString(),
      url: savedImage.url,
      fileName: savedImage.fileName,
      fileSize: savedImage.fileSize,
      fileType: savedImage.fileType,
      publicId: savedImage.publicId,
      folder: savedImage.folder,
      tags: savedImage.tags,
      uploadedAt: savedImage.createdAt.toISOString(),
      updatedAt: savedImage.updatedAt.toISOString(),
    };

    revalidatePath('/upload');
    revalidatePath('/admin/media');

    return {
      success: true,
      data: serializedImage
    };

  } catch (error) {
    console.error('Upload action error:', error);
    
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
}

export async function getUploadedImagesAction(options?: {
  page?: number;
  limit?: number;
  folder?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data?: SerializedUploadedImage[];
  total?: number;
  error?: string;
}> {
  try {
    await dbConnect();

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    let query: any = {};

    // Filter by folder
    if (options?.folder) {
      query.folder = options.folder;
    }

    // Search by filename
    if (options?.search) {
      query.fileName = { $regex: options.search, $options: 'i' };
    }

    const images = await UploadedImage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await UploadedImage.countDocuments(query);

    const serializedImages: SerializedUploadedImage[] = images.map(image => ({
      _id: image._id.toString(),
      url: image.url,
      fileName: image.fileName,
      fileSize: image.fileSize,
      fileType: image.fileType,
      publicId: image.publicId,
      folder: image.folder,
      tags: image.tags,
      uploadedAt: image.createdAt.toISOString(),
      updatedAt: image.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: serializedImages,
      total,
    };

  } catch (error) {
    console.error('Get images action error:', error);
    return {
      success: false,
      error: 'Failed to fetch images'
    };
  }
}

export async function deleteImageAction(publicId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await dbConnect();

    if (!publicId) {
      return {
        success: false,
        error: 'No public ID provided'
      };
    }

    // Delete from Cloudinary
    await deleteFile(publicId);

    // Delete from database
    await UploadedImage.findOneAndDelete({ publicId });

    revalidatePath('/upload');
    revalidatePath('/admin/media');

    return {
      success: true
    };

  } catch (error) {
    console.error('Delete action error:', error);
    return {
      success: false,
      error: 'Failed to delete image'
    };
  }
}

export async function getImageStatsAction(): Promise<{
  success: boolean;
  data?: {
    totalImages: number;
    totalSize: number;
    imagesByType: Record<string, number>;
    recentUploads: number;
  };
  error?: string;
}> {
  try {
    await dbConnect();

    const totalImages = await UploadedImage.countDocuments();
    
    const totalSizeResult = await UploadedImage.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$fileSize' }
        }
      }
    ]);

    const imagesByType = await UploadedImage.aggregate([
      {
        $group: {
          _id: '$fileType',
          count: { $sum: 1 }
        }
      }
    ]);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentUploads = await UploadedImage.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    const stats = {
      totalImages,
      totalSize: totalSizeResult[0]?.totalSize || 0,
      imagesByType: imagesByType.reduce((acc: Record<string, number>, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentUploads,
    };

    return {
      success: true,
      data: stats
    };

  } catch (error) {
    console.error('Stats action error:', error);
    return {
      success: false,
      error: 'Failed to fetch stats'
    };
  }
}

export async function updateImageMetadataAction(
  publicId: string, 
  updates: { folder?: string; tags?: string[]; }
): Promise<{
  success: boolean;
  data?: SerializedUploadedImage;
  error?: string;
}> {
  try {
    await dbConnect();

    const updatedImage = await UploadedImage.findOneAndUpdate(
      { publicId },
      { $set: updates },
      { new: true }
    );

    if (!updatedImage) {
      return {
        success: false,
        error: 'Image not found'
      };
    }

    // Use the document directly to access timestamps
    const serializedImage: SerializedUploadedImage = {
      _id: updatedImage._id.toString(),
      url: updatedImage.url,
      fileName: updatedImage.fileName,
      fileSize: updatedImage.fileSize,
      fileType: updatedImage.fileType,
      publicId: updatedImage.publicId,
      folder: updatedImage.folder,
      tags: updatedImage.tags,
      uploadedAt: updatedImage.createdAt.toISOString(),
      updatedAt: updatedImage.updatedAt.toISOString(),
    };

    revalidatePath('/upload');
    revalidatePath('/admin/media');

    return {
      success: true,
      data: serializedImage
    };

  } catch (error) {
    console.error('Update metadata action error:', error);
    return {
      success: false,
      error: 'Failed to update image metadata'
    };
  }
}