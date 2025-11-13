import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, deleteFile } from '@/lib/fileUpload';

export async function POST(request: NextRequest) {  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const result = await uploadFile(file);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No public ID provided' },
        { status: 400 }
      );
    }

    await deleteFile(publicId);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
}