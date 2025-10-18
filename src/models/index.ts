import mongoose, { Schema, Document } from 'mongoose';

const ProductSpecSchema = new Schema({
  color: String,
  material: String,
  size: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  penType: {
    type: String,
    enum: ['ballpoint', 'gel', 'fountain', 'marker']
  },
  inkColor: String,
  pointSize: String,
  paperType: {
    type: String,
    enum: ['lined', 'blank', 'grid', 'dot']
  },
  pageCount: Number,
  binding: {
    type: String,
    enum: ['spiral', 'perfect', 'hardcover']
  }
});

const ProductVariantSchema = new Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  attributes: {
    type: Map,
    of: String
  },
  image: String
}, { _id: true });

const ProductSchema = new Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  lowStockAlert: {
    type: Number,
    default: 10
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: String,
  tags: [String],
  brand: {
    type: String,
    required: true
  },
  images: [String],
  primaryImage: {
    type: String,
    required: true
  },
  specifications: ProductSpecSchema,
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  hasVariants: {
    type: Boolean,
    default: false
  },
  variants: [ProductVariantSchema],
  slug: {
    type: String,
    required: true,
    unique: true
  },
  metaTitle: String,
  metaDescription: String,
  viewCount: {
    type: Number,
    default: 0
  },
  sellCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  image: String,
  parentCategory: String,
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  sessionId: {
    type: String,
    required: true
  },
  items: [CartItemSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: String,
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const OrderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  collectionMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  notes: String
}, {
  timestamps: true
});


const CustomerSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    marketingEmails: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    }
  },
  lastLogin: Date
}, {
  timestamps: true
});


export const Product = mongoose.model('Product', ProductSchema);
export const Category = mongoose.model('Category', CategorySchema);
export const Cart = mongoose.model('Cart', CartSchema);
export const Order = mongoose.model('Order', OrderSchema);
export const Customer = mongoose.model('Customer', CustomerSchema);

export default {
  Product,
  Category,
  Cart,
  Order,
  Customer
};