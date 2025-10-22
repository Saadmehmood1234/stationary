
export interface CartItem {
  product: Product;
  quantity: 
  number;
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
  verified: boolean;
  iat?: number;
  exp?: number;
}

export interface ContactFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  subject?: string;
}
export interface ContactFormData {
  _id?:string
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
  variantId?: string;
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
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  collectionMethod: 'pickup' | 'delivery';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}


export interface Customer {
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    marketingEmails: boolean;
    smsNotifications: boolean;
  };
  createdAt: Date;
  lastLogin?: Date;
}