'use client';

import { Product } from '@/types';
import { useCart } from '../providers/CartProvider';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: product // Fixed: Just pass the product directly
    });
    
    setTimeout(() => setIsAdding(false), 600);
  };

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  const getStockStatus = () => {
    if (product.status === 'out_of_stock') return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };
    if (product.stock <= product.lowStockAlert) return { text: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const stockStatus = getStockStatus();

  return (
    <Link href={`/shop/${product.slug || product._id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 hover:border-[#027068]/20">
        
        {/* Image Container */}
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
          )}
          
          {/* Product Image */}
          <img 
            src={product.primaryImage || product.images[0] || '/placeholder-product.jpg'} 
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.jpg';
              setImageLoaded(true);
            }}
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {/* Discount Badge */}
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercentage}%
              </span>
            )}
            
            {/* Featured Badge */}
            {product.isFeatured && (
              <span className="bg-[#FDC700] text-[#027068] text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Stock Status Badge */}
          <div className={`absolute top-3 right-3 ${stockStatus.bg} ${stockStatus.color} text-xs font-semibold px-2 py-1 rounded-full`}>
            {stockStatus.text}
          </div>

          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock' || isAdding}
              className={`bg-[#027068] text-white px-6 py-2 rounded-lg font-semibold text-sm transform transition-all duration-300 ${
                product.status === 'out_of_stock' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : isAdding
                  ? 'scale-110 bg-green-500 opacity-100'
                  : 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:scale-105'
              } shadow-lg hover:shadow-xl`}
            >
              {product.status === 'out_of_stock' ? 'Out of Stock' : 
               isAdding ? 'Added!' : 'Quick Add'}
            </button>
          </div>
        </div>
        
        {/* Content Container - Only Essential Info */}
        <div className="p-4">
          {/* Category */}
          <div className="mb-2">
            <span className="text-xs font-medium text-[#027068] bg-[#027068]/10 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-gray-800 group-hover:text-[#027068] transition-colors duration-300 line-clamp-2 leading-tight mb-2">
            {product.name}
          </h3>
          
          {/* Short Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Key Specification - Only show one most important */}
          {product.specifications.color && (
            <div className="mb-3">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Color: {product.specifications.color}
              </span>
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#027068]">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.comparePrice!.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock' || isAdding}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                product.status === 'out_of_stock'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAdding
                  ? 'bg-green-500 text-white scale-105'
                  : 'bg-[#027068] text-white hover:bg-[#025c55] hover:scale-105'
              }`}
            >
              {product.status === 'out_of_stock' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : isAdding ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}