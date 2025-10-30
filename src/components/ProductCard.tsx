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
        bg: "bg-red-500/10 border-red-400/30",
        icon: AlertCircle,
      };
    if (product.stock <= (product.lowStockAlert || 10))
      return {
        text: "Low Stock",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-400/30",
        icon: Zap,
      };
    return {
      text: "In Stock",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-400/30",
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
      return "bg-gray-600/20 text-gray-400 border-gray-500/30 cursor-not-allowed";
    }
    if (isAdding) {
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500/50 scale-105";
    }
    return "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-cyan-500/50 hover:scale-105";
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
        <Card className="bg-white/5 backdrop-blur-lg border border-white/20 hover:border-cyan-300/30 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-cyan-500/10 h-full flex flex-col overflow-hidden relative max-w-xs mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {isHovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-300 rounded-full"
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
            <div className="aspect-[3/2] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 relative overflow-hidden">
              {" "}
              {!imageLoaded && (
                <Skeleton className="absolute inset-0 w-full h-full bg-white/10" />
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
              />
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {hasDiscount && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="relative"
                  >
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 border-0 text-white font-bold shadow-lg text-[10px] px-1.5 py-0">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" />-
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
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white font-bold shadow-lg text-[10px] px-1.5 py-0">
                      <Star className="w-2.5 h-2.5 mr-0.5 fill-white" />
                      Featured
                    </Badge>
                  </motion.div>
                )}
              </div>
              <Badge
                variant="outline"
                className={`absolute top-2 right-2 ${stockStatus.bg} ${stockStatus.color} border backdrop-blur-sm text-[10px] px-1.5 py-0`}
              >
                <StockIcon className="w-2.5 h-2.5 mr-0.5" />
                {stockStatus.text}
              </Badge>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="transform transition-all duration-300"
                >
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.status === "out_of_stock" || isAdding}
                    size="sm"
                    className={`gap-1 border-0 shadow-xl transition-all duration-300 text-sm ${getButtonStyle()} backdrop-blur-sm`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Quick Add
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 flex-1 flex flex-col relative z-10">
            <div className="mb-1">
              <Badge
                variant="outline"
                className="bg-white/10 border-white/20 text-cyan-200 text-[10px] px-1.5 py-0"
              >
                <Tag className="w-2.5 h-2.5 mr-1" />
                {product.category}
              </Badge>
            </div>

            <h3 className="font-semibold text-white group-hover:text-cyan-200 transition-colors line-clamp-2 leading-tight mb-1 flex-1 text-sm">
              {product.name}
            </h3>

            <p className="text-gray-300 text-xs mb-2 line-clamp-2 leading-relaxed">
              {product.shortDescription ||
                product.description?.substring(0, 80)}
            </p>

            {product.specifications?.color && (
              <div className="mb-2">
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-cyan-200 border-white/20 text-[10px] px-1.5 py-0"
                >
                  Color: {product.specifications.color}
                </Badge>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-3 pt-0 relative z-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  ${product.price?.toFixed(2) || "0.00"}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    ${product.comparePrice!.toFixed(2)}
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
                  size="sm"
                  variant="outline"
                  className={`gap-1 border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 text-xs h-8 px-2 ${
                    isAdding
                      ? "bg-green-500/20 text-green-300 border-green-400/30"
                      : ""
                  }`}
                >
                  {isAdding ? (
                    <Check className="w-3 h-3" />
                  ) : product.status === "out_of_stock" ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    <ShoppingCart className="w-3 h-3" />
                  )}
                  <span className="hidden xs:inline">
                    {product.status === "out_of_stock"
                      ? "Out"
                      : isAdding
                      ? "Added"
                      : "Add"}
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
