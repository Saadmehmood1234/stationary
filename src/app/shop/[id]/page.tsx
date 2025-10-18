"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductVariant } from "@/types";
import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { products } from "@/lib/data";
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
useEffect(() => {
  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const foundProduct = products.find(p => p._id === params.id || p.slug === params.id);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (params.id) {
    fetchProduct();
  }
}, [params.id]);
  const handleAddToCart = () => {
    if (!product) return;

    setIsAddingToCart(true);
    const itemToAdd = selectedVariant
      ? { ...product, ...selectedVariant }
      : product;

    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: itemToAdd,
      });
    }

    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // Find image index for this variant
    const variantImageIndex = product?.images.findIndex((img) =>
      img.includes(variant.attributes.color?.toLowerCase() || "")
    );
    if (variantImageIndex && variantImageIndex >= 0) {
      setSelectedImage(variantImageIndex);
    }
  };

  const hasDiscount =
    product?.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) * 100
      )
    : 0;

  const getStockStatus = () => {
    if (!product) return { text: "Loading...", color: "text-gray-600" };
    if (product.status === "out_of_stock")
      return { text: "Out of Stock", color: "text-red-600" };
    if (product.stock <= product.lowStockAlert)
      return { text: "Low Stock", color: "text-orange-600" };
    return { text: "In Stock", color: "text-green-600" };
  };

  const stockStatus = getStockStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#027068]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#027068]">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-[#027068]">
              Shop
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-gray-500 hover:text-[#027068]"
            >
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={product.images[selectedImage] || product.primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-[#027068]"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="bg-[#027068]/10 text-[#027068] text-sm font-medium px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-gray-600 text-sm">{product.brand}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-gray-600 text-sm ml-1">
                    4.8 (24 reviews)
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 text-sm">
                  {product.sellCount} sold
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 text-sm">
                  {product.viewCount} views
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-[#027068]">
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.comparePrice!.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
                {product.trackQuantity && product.stock > 0 && (
                  <span className="text-gray-600 text-sm">
                    ({product.stock} units available)
                  </span>
                )}
              </div>
              {product.hasVariants && product.variants && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Select Option:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => handleVariantSelect(variant)}
                        className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                          selectedVariant?._id === variant._id
                            ? "border-[#027068] bg-[#027068] text-white"
                            : "border-gray-300 text-gray-700 hover:border-[#027068]"
                        } ${
                          variant.stock === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={variant.stock === 0}
                      >
                        {variant.attributes.color || variant.name}
                        {variant.stock === 0 && " (Out of Stock)"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:text-[#027068] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:text-[#027068] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={
                      product.status === "out_of_stock" || isAddingToCart
                    }
                    className={`flex-1 bg-[#027068] text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                      product.status === "out_of_stock"
                        ? "opacity-50 cursor-not-allowed"
                        : isAddingToCart
                        ? "bg-green-500 scale-105"
                        : "hover:bg-[#025c55] hover:scale-105 active:scale-95"
                    }`}
                  >
                    {product.status === "out_of_stock"
                      ? "Out of Stock"
                      : isAddingToCart
                      ? "Added to Cart!"
                      : "Add to Cart"}
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:border-[#027068] hover:text-[#027068] transition-colors">
                    Add to Wishlist
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:border-[#027068] hover:text-[#027068] transition-colors">
                    Share
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#027068]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#027068]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#027068]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Quality Guarantee
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#027068]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8">
            <div className="px-8">
              <div className="flex space-x-8 border-b border-gray-200">
                <button className="py-4 px-2 border-b-2 border-[#027068] text-[#027068] font-medium">
                  Description
                </button>
                <button className="py-4 px-2 text-gray-500 hover:text-[#027068] font-medium">
                  Specifications
                </button>
                <button className="py-4 px-2 text-gray-500 hover:text-[#027068] font-medium">
                  Reviews (24)
                </button>
                <button className="py-4 px-2 text-gray-500 hover:text-[#027068] font-medium">
                  Shipping & Returns
                </button>
              </div>

              <div className="py-8">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Product Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Key Features:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Smooth gel ink for effortless writing</li>
                    <li>Comfortable rubber grip for extended use</li>
                    <li>Vibrant, quick-drying ink colors</li>
                    <li>Durable construction for long-lasting performance</li>
                    <li>Perfect for writing, drawing, and note-taking</li>
                  </ul>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Product Specifications
                    </h4>
                    <dl className="space-y-3">
                      {product.specifications.color && (
                        <div className="flex">
                          <dt className="text-gray-600 font-medium w-32">
                            Color:
                          </dt>
                          <dd className="text-gray-900">
                            {product.specifications.color}
                          </dd>
                        </div>
                      )}
                      {product.specifications.material && (
                        <div className="flex">
                          <dt className="text-gray-600 font-medium w-32">
                            Material:
                          </dt>
                          <dd className="text-gray-900">
                            {product.specifications.material}
                          </dd>
                        </div>
                      )}
                      {product.specifications.penType && (
                        <div className="flex">
                          <dt className="text-gray-600 font-medium w-32">
                            Pen Type:
                          </dt>
                          <dd className="text-gray-900">
                            {product.specifications.penType}
                          </dd>
                        </div>
                      )}
                      {product.specifications.inkColor && (
                        <div className="flex">
                          <dt className="text-gray-600 font-medium w-32">
                            Ink Color:
                          </dt>
                          <dd className="text-gray-900">
                            {product.specifications.inkColor}
                          </dd>
                        </div>
                      )}
                      {product.specifications.pointSize && (
                        <div className="flex">
                          <dt className="text-gray-600 font-medium w-32">
                            Point Size:
                          </dt>
                          <dd className="text-gray-900">
                            {product.specifications.pointSize}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Product Details
                    </h4>
                    <dl className="space-y-3">
                      <div className="flex">
                        <dt className="text-gray-600 font-medium w-32">SKU:</dt>
                        <dd className="text-gray-900">{product.sku}</dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-600 font-medium w-32">
                          Category:
                        </dt>
                        <dd className="text-gray-900">{product.category}</dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-600 font-medium w-32">
                          Brand:
                        </dt>
                        <dd className="text-gray-900">{product.brand}</dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-600 font-medium w-32">
                          Tags:
                        </dt>
                        <dd className="text-gray-900">
                          {product.tags.join(", ")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
