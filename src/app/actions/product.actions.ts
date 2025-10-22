"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Product } from "@/models/Products";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";

export interface ProductFormData {
  _id?: string;
  sku: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  costPrice: number;
  stock: number;
  lowStockAlert: number;
  trackQuantity: boolean;
  category: string;
  subcategory?: string;
  tags: string[];
  brand: string;
  images: string[];
  primaryImage: string;
  specifications: {
    color?: string;
    material?: string;
    size?: string;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    penType?: "ballpoint" | "gel" | "fountain" | "marker";
    inkColor?: string;
    pointSize?: string;
    paperType?: "lined" | "blank" | "grid" | "dot";
    pageCount?: number;
    binding?: "spiral" | "perfect" | "hardcover";
  };
  status: "active" | "inactive" | "out_of_stock" | "discontinued";
  isFeatured: boolean;
  isBestSeller: boolean;
  slug: string;
  viewCount: number;
  sellCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function createProduct(formData: ProductFormData) {
  try {
    console.log("Before", formData);
    await dbConnect();
    if (
      !formData.name ||
      !formData.sku ||
      !formData.price ||
      !formData.category ||
      !formData.brand
    ) {
      return {
        success: false,
        error:
          "Missing required fields: name, SKU, price, category, and brand are required",
      };
    }
    console.log("After", formData);
    const slug = formData.slug || generateSlug(formData.name);
    const existingSku = await Product.findOne({ sku: formData.sku });
    if (existingSku) {
      return {
        success: false,
        error: "SKU already exists. Please use a unique SKU.",
      };
    }

    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return {
        success: false,
        error:
          "Slug already exists. Please use a different product name or slug.",
      };
    }

    const productData = {
      ...formData,
      slug,
      primaryImage: formData.images[0] || formData.primaryImage,
      specifications: {
        ...formData.specifications,
        penType: formData.specifications.penType || undefined,
        paperType: formData.specifications.paperType || undefined,
        binding: formData.specifications.binding || undefined,
      },
    };
    const product = await Product.create(productData);

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return {
      success: true,
      message: "Product created successfully",
      productId: product._id.toString(),
    };
  } catch (error: any) {
    console.error("Error creating product:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return {
        success: false,
        error: `${field} already exists. Please use a unique ${field}.`,
      };
    }

    return {
      success: false,
      error: error.message || "Failed to create product. Please try again.",
    };
  }
}

export async function getProductById(id: string) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: "Invalid product ID",
      };
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      product: {
        ...product,
        _id: (product as any)._id.toString(),
        createdAt: (product as any).createdAt.toISOString(),
        updatedAt: (product as any).updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch product",
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    await dbConnect();

    const product = (await Product.findOne({ slug }).lean()) as any;

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    await Product.findByIdAndUpdate(product._id, {
      $inc: { viewCount: 1 },
    });

    return {
      success: true,
      product: {
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Error fetching product by slug:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch product",
    };
  }
}

export async function getProducts(
  options: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    sort?: string;
  } = {}
) {
  try {
    await dbConnect();

    const {
      page = 1,
      limit = 10,
      category,
      status,
      search,
      sort = "-createdAt",
    } = options;

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    const serializedProducts = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      specifications: product.specifications ? {
        ...product.specifications,
        dimensions: product.specifications.dimensions ? {
          ...product.specifications.dimensions
        } : undefined
      } : {},
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
    }));

    return {
      success: true,
      products: serializedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch products",
    };
  }
}
export async function updateProduct(
  id: string,
  formData: Partial<ProductFormData>
) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: "Invalid product ID",
      };
    }
    const existingProduct = (await Product.findById(
      id
    )) as ProductFormData | null;
    if (!existingProduct) {
      return {
        success: false,
        error: "Product not found",
      };
    }
    if (formData.slug && formData.slug !== existingProduct.slug) {
      const existingSlug = await Product.findOne({
        slug: formData.slug,
        _id: { $ne: id },
      });
      if (existingSlug) {
        return {
          success: false,
          error: "Slug already exists. Please use a different slug.",
        };
      }
    }

    if (formData.sku && formData.sku !== existingProduct.sku) {
      const existingSku = await Product.findOne({
        sku: formData.sku,
        _id: { $ne: id },
      });
      if (existingSku) {
        return {
          success: false,
          error: "SKU already exists. Please use a unique SKU.",
        };
      }
    }
    const updatedProduct = (await Product.findByIdAndUpdate(
      id,
      {
        ...formData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean()) as ProductFormData | null;

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${updatedProduct?.slug}`);

    return {
      success: true,
      message: "Product updated successfully",
      product: {
        ...updatedProduct,
        _id: (updatedProduct as any)?._id.toString(),
        createdAt: (updatedProduct as any)?.createdAt?.toISOString(),
        updatedAt: (updatedProduct as any)?.updatedAt?.toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Error updating product:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return {
        success: false,
        error: `${field} already exists. Please use a unique ${field}.`,
      };
    }

    return {
      success: false,
      error: error.message || "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: "Invalid product ID",
      };
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error: error.message || "Failed to delete product",
    };
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
