"use client";

import { Product } from "@/types";
import { useCart } from "./providers/CartProvider";
import Link from "next/link";
import { useState, useCallback, memo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Check,
  AlertCircle,
  Star,
  Tag,
  Zap,
  Sparkles,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

function ProductCardComponent({
  product,
  viewMode = "grid",
}: ProductCardProps) {
  const { dispatch } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  console.log("Product", product);
  
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

  const getStockStatus = useCallback(() => {
    if (product.status === "out_of_stock")
      return {
        text: "Out of Stock",
        color: "text-red-400",
        bg: "bg-red-500/50 border-red-400/50",
        icon: AlertCircle,
      };
    if (product.stock <= (product.lowStockAlert || 10))
      return {
        text: "Low Stock",
        color: "text-amber-400",
        bg: "bg-amber-500/50 border-amber-400/50",
        icon: Zap,
      };
    return {
      text: "In Stock",
      color: "text-gray-800",
      bg: "bg-green-500/50 border-green-400/50",
      icon: Check,
    };
  }, [product.status, product.stock, product.lowStockAlert]);

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  const productImage = imageError
    ? "/school-tools-with-calculator.jpg"
    : product.primaryImage ||
      product.images?.[0] ||
      "/school-tools-with-calculator.jpg";

  const getButtonStyle = () => {
    if (product.status === "out_of_stock") {
      return "bg-gray-600/60 text-gray-300 border-gray-500/50 cursor-not-allowed";
    }
    if (isAdding) {
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500 scale-105";
    }
    return "bg-gradient-to-r from-[#D5D502] to-[#D5D508] hover:from-[#D5D502] hover:to-[#D5D508] text-gray-900 border-[#D5D502] hover:scale-105";
  };

  return (
    <Link href={`/shop/${product._id}`} className="block group h-full">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Card className="bg-gray-700/5 backdrop-blur-xl border border-white/40 hover:border-[#D5D502]/60 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#D5D502]/20 h-full flex flex-col overflow-hidden relative w-full max-w-sm mx-auto">

          {isHovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#D5D502] rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                    y: [0, -30, -60],
                    x: Math.sin(i) * 20,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                    bottom: "10%",
                  }}
                />
              ))}
            </>
          )}
          
          <CardHeader className="p-0 relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-[#D5D502]/20 to-[#D5D508]/20 relative overflow-hidden">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0 w-full h-full bg-white/20" />
              )}
              <Image
                src={productImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority={false}
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {hasDiscount && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="relative"
                  >
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 border-0 text-white font-bold shadow-lg text-xs px-2 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />-
                      {discountPercentage}%
                    </Badge>
                  </motion.div>
                )}
                {product.isFeatured && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white font-bold shadow-lg text-xs px-2 py-1">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Featured
                    </Badge>
                  </motion.div>
                )}
              </div>
              
              <Badge
                variant="outline"
                className={`absolute top-3 right-3 ${stockStatus.bg} ${stockStatus.color} border backdrop-blur-sm text-xs px-2 py-1`}
              >
                <StockIcon className="w-3 h-3 mr-1" />
                {stockStatus.text}
              </Badge>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="transform transition-all duration-300"
                >
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.status === "out_of_stock" || isAdding}
                    size="default"
                    className={`gap-2 border-2 shadow-xl transition-all duration-300 text-sm font-semibold ${getButtonStyle()} backdrop-blur-sm px-6 py-2`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Quick Add
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 flex-1 flex flex-col relative z-10">
            <div className="mb-2">
              <Badge
                variant="outline"
                className="bg-[#D5D502]/20 border-[#D5D502]/40 text-[#D5D502] font-medium text-xs px-2 py-1"
              >
                <Tag className="w-3 h-3 mr-1" />
                {product.category}
              </Badge>
            </div>

            <h3 className="font-bold text-white group-hover:text-[#D5D502] transition-colors line-clamp-2 leading-tight mb-2 flex-1 text-base">
              {product.name}
            </h3>

            <p className="text-gray-200 text-sm mb-3 line-clamp-2 leading-relaxed">
              {product.shortDescription ||
                product.description?.substring(0, 100)}
            </p>

            {product.specifications?.color && (
              <div className="mb-2">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-[#D5D502] border-white/30 font-medium text-xs px-2 py-1"
                >
                  Color: {product.specifications.color}
                </Badge>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 pt-0 relative z-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-[#D5D502] to-[#D5D508] bg-clip-text text-transparent">
                  ₹{product.price?.toFixed(2) || "0.00"}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-300 line-through">
                    ₹{product.comparePrice!.toFixed(2)}
                  </span>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={product.status === "out_of_stock" || isAdding}
                  size="default"
                  variant="outline"
                  className={`gap-2 cursor-pointer rounded-full border-2 text-gray-900 bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 text-sm h-10 px-4 font-medium ${
                    isAdding
                      ? "bg-green-500/30 text-green-200 border-green-400/50"
                      : "border-white/40"
                  }`}
                >
                  {isAdding ? (
                    <Check className="w-4 h-4" />
                  ) : product.status === "out_of_stock" ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {product.status === "out_of_stock"
                      ? "Out of Stock"
                      : isAdding
                      ? "Added"
                      : "Add to Cart"}
                  </span>
                </Button>
              </motion.div>
            </div>
          </CardFooter>
        </Card>
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