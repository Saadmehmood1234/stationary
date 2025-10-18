import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import { Product } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const productData = await request.json();

    // Validate required fields
    const requiredFields = ['sku', 'name', 'description', 'shortDescription', 'price', 'costPrice', 'stock', 'category', 'brand', 'slug'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists
    const existingSku = await Product.findOne({ sku: productData.sku });
    if (existingSku) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSlug = await Product.findOne({ slug: productData.slug });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // Create new product
    const product = new Product(productData);
    await product.save();

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}