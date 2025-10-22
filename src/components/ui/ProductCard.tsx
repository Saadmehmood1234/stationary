'use client';

import { Product } from '@/types';
import { useCart } from '../providers/CartProvider';
import Link from 'next/link';
import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ShoppingCart, 
  Check, 
  AlertCircle, 
  Star,
  Tag
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

function ProductCardComponent({ product, viewMode = "grid" }: ProductCardProps) {
  const { dispatch } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: product
    });
    
    setTimeout(() => setIsAdding(false), 600);
  }, [dispatch, product]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  const getStockStatus = useCallback(() => {
    if (product.status === 'out_of_stock') return { 
      text: 'Out of Stock', 
      color: 'text-red-600', 
      bg: 'bg-red-50 border-red-200',
      icon: AlertCircle
    };
    if (product.stock <= (product.lowStockAlert || 10)) return { 
      text: 'Low Stock', 
      color: 'text-amber-600', 
      bg: 'bg-amber-50 border-amber-200',
      icon: AlertCircle
    };
    return { 
      text: 'In Stock', 
      color: 'text-green-600', 
      bg: 'bg-green-50 border-green-200',
      icon: Check
    };
  }, [product.status, product.stock, product.lowStockAlert]);

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  const productImage = imageError 
    ? '/school-tools-with-calculator.jpg'
    : product.primaryImage || product.images?.[0] || '/school-tools-with-calculator.jpg';
  console.log(productImage)  
  if (viewMode === "list") {
    return (
      <Link href={`/shop/${product.slug || product._id}`} className="block group">
        <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary/20 h-full">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-48 md:flex-shrink-0 relative">
              <div className="aspect-square md:h-48 bg-muted/50 relative overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                {!imageLoaded && (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {hasDiscount && (
                    <Badge variant="destructive" className="font-semibold">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      <Star className="w-3 h-3 mr-1 fill-amber-500" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className="mb-2">
                  <Tag className="w-3 h-3 mr-1" />
                  {product.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`${stockStatus.bg} ${stockStatus.color} border`}
                >
                  <StockIcon className="w-3 h-3 mr-1" />
                  {stockStatus.text}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                {product.shortDescription || product.description?.substring(0, 120)}
              </p>

              {product.specifications?.color && (
                <div className="mb-4">
                  <Badge variant="secondary" className="text-xs">
                    Color: {product.specifications.color}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price?.toFixed(2) || '0.00'}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.comparePrice!.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={product.status === 'out_of_stock' || isAdding}
                  size="sm"
                  className={`gap-2 ${
                    isAdding ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added
                    </>
                  ) : product.status === 'out_of_stock' ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Out of Stock
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Grid View Layout (Default)
  return (
    <Link href={`/shop/${product.slug || product._id}`} className="block group h-full">
      <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary/20 h-full flex flex-col overflow-hidden">
        {/* Image Section */}
        <CardHeader className="p-0 relative">
          <div className="aspect-[4/3] bg-muted/50 relative overflow-hidden">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <Image
              src={productImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {hasDiscount && (
                <Badge variant="destructive" className="font-semibold">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.isFeatured && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <Star className="w-3 h-3 mr-1 fill-amber-500" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <Badge 
              variant="outline" 
              className={`absolute top-3 right-3 ${stockStatus.bg} ${stockStatus.color} border`}
            >
              <StockIcon className="w-3 h-3 mr-1" />
              {stockStatus.text}
            </Badge>

            {/* Quick Add Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock' || isAdding}
                size="lg"
                className={`transform transition-all duration-300 gap-2 ${
                  product.status === 'out_of_stock' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : isAdding
                    ? 'scale-110 bg-green-600 hover:bg-green-700'
                    : 'translate-y-4 group-hover:translate-y-0 hover:scale-105'
                }`}
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
            </div>
          </div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {product.category}
            </Badge>
          </div>

          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2 flex-1">
            {product.name}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.shortDescription || product.description?.substring(0, 100)}
          </p>

          {product.specifications?.color && (
            <div className="mb-3">
              <Badge variant="secondary" className="text-xs">
                Color: {product.specifications.color}
              </Badge>
            </div>
          )}
        </CardContent>

        {/* Footer with Price and CTA */}
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                ${product.price?.toFixed(2) || '0.00'}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.comparePrice!.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Mobile/Secondary Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock' || isAdding}
              size="sm"
              variant="outline"
              className={`gap-2 ${
                isAdding ? 'bg-green-50 text-green-700 border-green-200' : ''
              }`}
            >
              {isAdding ? (
                <Check className="w-4 h-4" />
              ) : product.status === 'out_of_stock' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {product.status === 'out_of_stock' ? 'Out of Stock' : isAdding ? 'Added' : 'Add'}
              </span>
            </Button>
          </div>
        </CardFooter>
      </Card>
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