import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    _id: 'cat-1',
    name: 'Pens & Writing',
    slug: 'pens-writing',
    description: 'Writing instruments for every need',
    image: '/pen1.webp',
    sortOrder: 1,
    isActive: true
  },
  {
    _id: 'cat-2',
    name: 'Notebooks',
    slug: 'notebooks',
    description: 'Notebooks and journals',
    image: '/notebook1.avif',
    sortOrder: 2,
    isActive: true
  },
  {
    _id: 'cat-3',
    name: 'Art Supplies',
    slug: 'art-supplies',
    description: 'Creative tools and materials',
    image: '/aRT.jpg',
    sortOrder: 3,
    isActive: true
  },
  {
    _id: 'cat-4',
    name: 'Office Supplies',
    slug: 'office-supplies',
    description: 'Essential office tools',
    image: '/office_supplies.webp',
    sortOrder: 4,
    isActive: true
  }
];

export const products: Product[] = [
  {
    _id: 'prod-1',
    sku: 'PEN-GEL-BLUE-07',
    name: 'Premium Gel Pen - Blue',
    description: 'Smooth writing gel pen with comfortable grip and vibrant blue ink',
    shortDescription: 'Smooth gel pen with comfortable grip',
    price: 3.99,
    comparePrice: 4.99,
    costPrice: 1.50,
    stock: 150,
    lowStockAlert: 20,
    trackQuantity: true,
    category: 'pens-writing',
    subcategory: 'gel-pens',
    tags: ['bestseller', 'smooth-writing', 'student'],
    brand: 'InkWell',
    images: [
      '/images/products/gel-pen-blue-1.jpg',
      '/images/products/gel-pen-blue-2.jpg'
    ],
    primaryImage: '/pen1.webp',
    specifications: {
      color: 'Blue',
      material: 'Plastic with rubber grip',
      penType: 'gel',
      inkColor: 'Blue',
      pointSize: '0.7mm'
    },
    status: 'active',
    isFeatured: true,
    isBestSeller: true,
    hasVariants: true,
    variants: [
      {
        _id: 'var-1',
        sku: 'PEN-GEL-BLACK-07',
        name: 'Premium Gel Pen - Black',
        price: 3.99,
        stock: 100,
        attributes: {
          color: 'Black',
          pointSize: '0.7mm'
        },
        image: '/images/products/gel-pen-black.jpg'
      },
      {
        _id: 'var-2',
        sku: 'PEN-GEL-RED-05',
        name: 'Premium Gel Pen - Red',
        price: 3.99,
        stock: 80,
        attributes: {
          color: 'Red',
          pointSize: '0.5mm'
        },
        image: '/images/products/gel-pen-red.jpg'
      }
    ],
    slug: 'premium-gel-pen-blue',
    metaTitle: 'Premium Gel Pen - Smooth Writing | InkWell',
    metaDescription: 'Buy our premium gel pen with smooth writing experience. Perfect for students and professionals.',
    viewCount: 1245,
    sellCount: 89,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: 'prod-2',
    sku: 'NB-A5-LIN-120',
    name: 'A5 Lined Notebook',
    description: 'High-quality 120-page lined notebook with durable cover and elastic closure',
    shortDescription: '120-page lined notebook with durable cover',
    price: 8.99,
    comparePrice: 12.99,
    costPrice: 3.20,
    stock: 75,
    lowStockAlert: 15,
    trackQuantity: true,
    category: 'notebooks',
    subcategory: 'lined-notebooks',
    tags: ['popular', 'student', 'journal'],
    brand: 'PaperCraft',
    images: [
      '/images/products/a5-notebook-1.jpg',
      '/images/products/a5-notebook-2.jpg'
    ],
    primaryImage: '/notebook1.avif',
    specifications: {
      color: 'Black',
      material: 'Paper, Cardboard',
      size: 'A5',
      paperType: 'lined',
      pageCount: 120,
      binding: 'perfect',
      dimensions: {
        length: 21,
        width: 14.8,
        height: 1.5
      },
      weight: 280
    },
    status: 'active',
    isFeatured: true,
    isBestSeller: false,
    hasVariants: false,
    slug: 'a5-lined-notebook',
    metaTitle: 'A5 Lined Notebook | Premium Quality | InkWell',
    metaDescription: 'High-quality A5 lined notebook with 120 pages, perfect for students and professionals.',
    viewCount: 890,
    sellCount: 67,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  },
  {
    _id: 'prod-3',
    sku: 'MARKER-ART-12SET',
    name: 'Art Marker Set - 12 Colors',
    description: 'Professional art markers with dual tips for illustration and design work',
    shortDescription: '12-color dual tip art marker set',
    price: 24.99,
    comparePrice: 29.99,
    costPrice: 12.00,
    stock: 30,
    lowStockAlert: 5,
    trackQuantity: true,
    category: 'art-supplies',
    subcategory: 'markers',
    tags: ['professional', 'artist', 'dual-tip'],
    brand: 'ArtPro',
    images: [
      '/images/products/art-markers-1.jpg',
      '/images/products/art-markers-2.jpg'
    ],
    primaryImage: '/aRT.jpg',
    specifications: {
      color: 'Assorted',
      material: 'Plastic, Ink',
      size: '12-piece set'
    },
    status: 'active',
    isFeatured: false,
    isBestSeller: false,
    hasVariants: false,
    slug: 'art-marker-set-12-colors',
    metaTitle: 'Art Marker Set | 12 Colors | Dual Tip',
    metaDescription: 'Professional art marker set with 12 colors and dual tips for various art techniques.',
    viewCount: 345,
    sellCount: 23,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  }
];