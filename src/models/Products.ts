import mongoose, { Schema, Document } from "mongoose";

const ProductSpecSchema = new Schema({
  color: String,
  material: String,
  size: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  penType: {
    type: String,
    enum: ["ballpoint", "gel", "fountain", "marker"],
  },
  inkColor: String,
  pointSize: String,
  paperType: {
    type: String,
    enum: ["lined", "blank", "grid", "dot"],
  },
  pageCount: Number,
  binding: {
    type: String,
    enum: ["spiral", "perfect", "hardcover"],
  },
});


const ProductSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    comparePrice: {
      type: Number,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    lowStockAlert: {
      type: Number,
      default: 10,
    },
    trackQuantity: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: String,
    tags: [String],
    brand: {
      type: String,
      required: true,
    },
    images: [String],
    primaryImage: {
      type: String,
      required: true,
    },
    specifications: ProductSpecSchema,
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock", "discontinued"],
      default: "active",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    sellCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product =mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default {
  Product,
};
