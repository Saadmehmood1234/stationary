export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SessionUser {
  _id: string;
  email: string;
  name: string;
  verified: boolean;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  profilePic: string;
  verified: boolean;
  iat?: number;
  phone?: string;
  role: "user" | "admin" | "employee" | "vendor";
  exp?: number;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  lastLogin: Date;
}

export interface ContactFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  subject?: string;
}
export interface ContactFormData {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactDocument extends ContactFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PaginatedContactsResponse {
  contacts: ContactDocument[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalContacts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}
export interface Product {
  _id: string;
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
  specifications?: {
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
  createdAt: string;
  updatedAt: string;
}
export interface CreateProductInput
  extends Omit<Product, "_id" | "createdAt" | "updatedAt"> {}
export interface ProductFormData
  extends Omit<Product, "_id" | "createdAt" | "updatedAt"> {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UploadedImage {
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

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface Cart {
  _id?: string;
  userId?: string;
  sessionId: string;
  items: CartItem[];
  total: number;
  updatedAt: Date;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  collectionMethod: "pickup" | "delivery";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}
export interface PrintOrder {
  _id: string;
  name: string;
  email: string;
  phone: string;
  paperSize: "A4" | "A3" | "Letter" | "Legal";
  colorType: "bw" | "color";
  pageCount: number;
  binding: "none" | "spiral" | "stapler";
  urgency: "normal" | "urgent" | "express";
  specialInstructions?: string;
  status: "pending" | "confirmed" | "printing" | "completed" | "cancelled";
  estimatedCost: number;
  finalCost?: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  publicId?: string; // Cloudinary public ID
  createdAt: string;
  updatedAt: string;
}

export type CreatePrintOrderInput = Omit<
  PrintOrder,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "estimatedCost"
  | "finalCost"
  | "fileName"
  | "fileSize"
  | "fileType"
  | "publicId"
> & {
  file?: File;
};

export interface PrintOrderResponse {
  success: boolean;
  data?: PrintOrder;
  error?: string;
}

export interface PrintOrdersResponse {
  success: boolean;
  data?: PrintOrder[];
  error?: string;
}
