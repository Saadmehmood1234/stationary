import cloudinary from '@/lib/cloudinary';

export async function uploadFile(file: File): Promise<{ 
  url: string; 
  fileName: string; 
  fileSize: number; 
  fileType: string;
  publicId: string;
}> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'print-orders',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
    });

    return {
      url: result.secure_url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFile(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('Failed to delete file');
  }
}

export function validateFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not supported. Please upload PDF, Word, PowerPoint, or image files.' };
  }

  return { isValid: true };
}


export function getOptimizedImageUrl(publicId: string, width: number = 800): string {
  return cloudinary.url(publicId, {
    width,
    quality: 'auto',
    fetch_format: 'auto',
  });
}


export function getPdfThumbnailUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    format: 'jpg',
    page: 1,
    width: 300,
    quality: 'auto',
  });
}