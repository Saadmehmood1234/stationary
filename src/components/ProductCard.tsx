"use client";

import { Product } from "@/types";
import { useCart } from "./providers/CartProvider";
import Link from "next/link";
import { useState, useCallback, memo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Check,
  AlertCircle,
  Star,
  Eye,
  Heart,
  Zap,
  TrendingUp,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  className?: string;
}

function ProductCardComponent({
  product,
  viewMode = "grid",
  className = "",
}: ProductCardProps) {
  const { dispatch } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsAdding(true);
      dispatch({
        type: "ADD_ITEM",
        payload: product,
      });

      setTimeout(() => setIsAdding(false), 600);
    },
    [dispatch, product]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) * 100
      )
    : 0;

  const isOutOfStock = product.status === "out_of_stock";
  const isLowStock =
    !isOutOfStock && product.stock <= (product.lowStockAlert || 10);

  const productImage = imageError
    ? "/school-tools-with-calculator.jpg"
    : product.primaryImage ||
      product.images?.[0] ||
      "/school-tools-with-calculator.jpg";

  // Grid View Layout
  if (viewMode === "grid") {
    return (
      <Link href={`/shop/${product._id}`} className="block group">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className={`relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-[#D5D502]/40 transition-all duration-500 overflow-hidden h-full ${className}`}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full bg-gray-700/50" />
            )}

            {productImage && productImage !== "" && (
              <Image
                src={productImage}
                alt={product.name || "Product image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                className={`object-cover transition-transform duration-700 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } ${isHovered ? "scale-110" : "scale-100"}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority={false}
              />
            )}

            {/* Top Left Badges */}
            {(hasDiscount || product.isFeatured || product.isBestSeller) && (
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {hasDiscount && discountPercentage > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full text-white text-xs font-bold shadow-lg"
                  >
                    -{discountPercentage}%
                  </motion.div>
                )}
                {product.isFeatured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1"
                  >
                    <Star className="w-3 h-3 fill-white" />
                    Featured
                  </motion.div>
                )}
                {product.isBestSeller && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                    Best Seller
                  </motion.div>
                )}
              </div>
            )}

            {/* Top Right Stock Status */}
            {(isOutOfStock || isLowStock) && (
              <div className="absolute top-3 right-3">
                {isOutOfStock ? (
                  <div className="px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-white text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span className="hidden sm:inline">Out of Stock</span>
                  </div>
                ) : isLowStock ? (
                  <div className="px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded-full text-white text-xs">
                    Low Stock
                  </div>
                ) : null}
              </div>
            )}

            {/* Hover Overlay Actions */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <Button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || isAdding}
                      size="sm"
                      className="rounded-full cursor-pointer text-gray-900 bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 font-semibold shadow-lg"
                    >
                      {isAdding ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full cursor-pointer bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content Area */}
          <div className="p-4 space-y-3">
            {/* Category */}
            {product.category && product.category !== "" && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#D5D502] bg-[#D5D502]/10 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
            )}

            {/* Product Name */}
            {product.name && product.name !== "" && (
              <h3 className="font-semibold text-white line-clamp-2 leading-tight text-sm sm:text-base group-hover:text-[#D5D502] transition-colors">
                {product.name}
              </h3>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Price and Action Row */}
            {product.price !== undefined && product.price !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg sm:text-xl font-bold text-[#D5D502]">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {hasDiscount && product.comparePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <div className="sm:hidden">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdding}
                    size="sm"
                    className="rounded-full cursor-pointer text-gray-900 bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 font-semibold shadow-lg min-w-[40px] h-9"
                  >
                    {isOutOfStock ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : isAdding ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="hidden sm:block">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdding}
                    size="sm"
                    className="rounded-full cursor-pointer text-gray-900 bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 px-3"
                  >
                    {isOutOfStock ? (
                      <>
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Out of Stock</span>
                      </>
                    ) : isAdding ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        <span className="text-xs">Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        <span className="text-xs">Add</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Elegant Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D5D502] to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </Link>
    );
  }

  // List View Layout
  return (
    <Link href={`/shop/${product._id}`} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
        className={`relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-[#D5D502]/40 transition-all duration-500 overflow-hidden ${className}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image Container - Smaller in list view */}
          <div className="relative sm:w-48 md:w-56 h-48 sm:h-auto bg-gradient-to-br from-gray-800 to-gray-900">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full bg-gray-700/50" />
            )}

            {productImage && productImage !== "" && (
              <Image
                src={productImage}
                alt={product.name || "Product image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-transform duration-700 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } ${isHovered ? "scale-105" : "scale-100"}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority={false}
              />
            )}

            {/* Top Left Badges */}
            {(hasDiscount || product.isFeatured || product.isBestSeller) && (
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {hasDiscount && discountPercentage > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full text-white text-xs font-bold shadow-lg"
                  >
                    -{discountPercentage}%
                  </motion.div>
                )}
                {product.isFeatured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1"
                  >
                    <Star className="w-3 h-3 fill-white" />
                  </motion.div>
                )}
                {product.isBestSeller && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                  </motion.div>
                )}
              </div>
            )}

            {/* Stock Status Badge */}
            {(isOutOfStock || isLowStock) && (
              <div className="absolute top-3 right-3">
                {isOutOfStock ? (
                  <div className="px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-white text-xs">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                ) : isLowStock ? (
                  <div className="px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded-full text-white text-xs">
                    Low
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Content Area - Expanded in list view */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col h-full">
              {/* Header with Category and Stats */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {product.category && product.category !== "" && (
                    <span className="text-xs font-medium text-[#D5D502] bg-[#D5D502]/10 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  )}
                  {product.brand && (
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                      {product.brand}
                    </span>
                  )}
                </div>
                
                {/* Desktop Stats */}
                <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400">
                  {product.viewCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{product.viewCount}</span>
                    </div>
                  )}
                  {product.sellCount > 0 && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{product.sellCount} sold</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Name */}
              {product.name && product.name !== "" && (
                <h3 className="font-semibold text-white text-lg sm:text-xl mb-2 group-hover:text-[#D5D502] transition-colors line-clamp-2">
                  {product.name}
                </h3>
              )}

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.specifications.color && (
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                      Color: {product.specifications.color}
                    </span>
                  )}
                  {product.specifications.material && (
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                      {product.specifications.material}
                    </span>
                  )}
                  {product.specifications.penType && (
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                      {product.specifications.penType}
                    </span>
                  )}
                </div>
              )}

              {/* Footer with Price and Actions */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-[#D5D502]">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {hasDiscount && product.comparePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Stats */}
                  <div className="flex sm:hidden items-center gap-3 text-xs text-gray-400">
                    {product.viewCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{product.viewCount}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdding}
                    size="sm"
                    className="rounded-full cursor-pointer text-gray-900 bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 font-semibold px-4"
                  >
                    {isOutOfStock ? (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span>Out of Stock</span>
                      </>
                    ) : isAdding ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D5D502] to-transparent"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </Link>
  );
}

const areEqual = (prevProps: ProductCardProps, nextProps: ProductCardProps) => {
  return (
    prevProps.product._id === nextProps.product._id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.status === nextProps.product.status &&
    prevProps.product.primaryImage === nextProps.product.primaryImage &&
    prevProps.product.isFeatured === nextProps.product.isFeatured &&
    prevProps.product.comparePrice === nextProps.product.comparePrice &&
    prevProps.viewMode === nextProps.viewMode
  );
};

export const ProductCard = memo(ProductCardComponent, areEqual);