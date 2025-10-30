"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Product } from "@/models/Products";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { Product as ProductFormData } from "@/types";

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
      _id: undefined,
      slug,
      primaryImage: formData.images?.[0] || formData.primaryImage || "",
      images: formData.images || [],
      tags: formData.tags || [],
      specifications: {
        ...formData.specifications,
        penType: formData.specifications?.penType || undefined,
        paperType: formData.specifications?.paperType || undefined,
        binding: formData.specifications?.binding || undefined,
      },
      viewCount: 0,
      sellCount: 0,
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


export async function getProductById(id: string): Promise<{
  success: boolean;
  product?: ProductFormData;
  error?: string;
}> {
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

    const productObj = product as any;
    
    const serializedProduct: ProductFormData = {
      _id: productObj._id.toString(),
      sku: productObj.sku,
      name: productObj.name,
      description: productObj.description,
      shortDescription: productObj.shortDescription,
      price: productObj.price,
      comparePrice: productObj.comparePrice,
      costPrice: productObj.costPrice,
      stock: productObj.stock,
      lowStockAlert: productObj.lowStockAlert,
      trackQuantity: productObj.trackQuantity,
      category: productObj.category,
      subcategory: productObj.subcategory,
      tags: productObj.tags || [],
      brand: productObj.brand,
      images: productObj.images || [],
      primaryImage: productObj.primaryImage,
      specifications: productObj.specifications ? {
        color: productObj.specifications.color,
        material: productObj.specifications.material,
        size: productObj.specifications.size,
        weight: productObj.specifications.weight,
        dimensions: productObj.specifications.dimensions ? {
          length: productObj.specifications.dimensions.length,
          width: productObj.specifications.dimensions.width,
          height: productObj.specifications.dimensions.height,
        } : undefined,
        penType: productObj.specifications.penType,
        inkColor: productObj.specifications.inkColor,
        pointSize: productObj.specifications.pointSize,
        paperType: productObj.specifications.paperType,
        pageCount: productObj.specifications.pageCount,
        binding: productObj.specifications.binding,
      } : undefined,
      status: productObj.status,
      isFeatured: productObj.isFeatured,
      isBestSeller: productObj.isBestSeller,
      slug: productObj.slug,
      viewCount: productObj.viewCount,
      sellCount: productObj.sellCount,
      createdAt: productObj.createdAt?.toISOString(),
      updatedAt: productObj.updatedAt?.toISOString(),
    };

    return {
      success: true,
      product: serializedProduct,
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
    
    // Proper serialization for Client Components
    const serializedProducts = products.map((product: any) => {
      // Create a plain object with only serializable properties
      const serialized: any = {
        _id: product._id.toString(),
        sku: product.sku,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        comparePrice: product.comparePrice,
        costPrice: product.costPrice,
        stock: product.stock,
        lowStockAlert: product.lowStockAlert,
        trackQuantity: product.trackQuantity,
        category: product.category,
        subcategory: product.subcategory,
        tags: product.tags || [],
        brand: product.brand,
        images: product.images || [],
        primaryImage: product.primaryImage,
        status: product.status,
        isFeatured: product.isFeatured,
        isBestSeller: product.isBestSeller,
        slug: product.slug,
        viewCount: product.viewCount,
        sellCount: product.sellCount,
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
      };

      // Handle specifications with proper serialization
      if (product.specifications) {
        serialized.specifications = {
          color: product.specifications.color,
          material: product.specifications.material,
          size: product.specifications.size,
          weight: product.specifications.weight,
          penType: product.specifications.penType,
          inkColor: product.specifications.inkColor,
          pointSize: product.specifications.pointSize,
          paperType: product.specifications.paperType,
          pageCount: product.specifications.pageCount,
          binding: product.specifications.binding,
        };

        // Handle dimensions separately to avoid any Mongoose objects
        if (product.specifications.dimensions) {
          serialized.specifications.dimensions = {
            length: product.specifications.dimensions.length,
            width: product.specifications.dimensions.width,
            height: product.specifications.dimensions.height,
          };
        }
      }

      return serialized;
    });

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
