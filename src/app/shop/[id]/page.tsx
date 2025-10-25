"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductFormData } from "@/types";
import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { getProductById } from "@/app/actions/product.actions";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { dispatch } = useCart();
const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (params.id) {
          const result = await getProductById(params.id as string);
          if (result.success && result.product) {
            setProduct(result.product);
          } else {
            setProduct(null);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

const handleAddToCart = useCallback(() => {
  if (!product) return;

  setIsAddingToCart(true);
  
  dispatch({ 
    type: 'ADD_ITEM', 
    payload: product
  });
  
  setTimeout(() => setIsAddingToCart(false), 600);
}, [dispatch, product]);

  const hasDiscount = product?.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  const getStockStatus = () => {
    if (!product) return { text: "Loading...", color: "text-gray-600" };
    if (product.status === "out_of_stock") return { text: "Out of Stock", color: "text-red-600" };
    if (product.status === "inactive") return { text: "Inactive", color: "text-gray-600" };
    if (product.status === "discontinued") return { text: "Discontinued", color: "text-gray-600" };
    if (product.stock <= product.lowStockAlert) return { text: "Low Stock", color: "text-orange-600" };
    return { text: "In Stock", color: "text-green-600" };
  };

  const stockStatus = getStockStatus();

  const renderSpecifications = () => {
    if (!product?.specifications) return null;

    const specs = product.specifications;
    const hasSpecs = Object.values(specs).some(value => value !== undefined && value !== null && value !== '');

    if (!hasSpecs) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specs.color && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Color:</dt>
            <dd className="text-gray-900 capitalize">{specs.color}</dd>
          </div>
        )}
        {specs.material && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Material:</dt>
            <dd className="text-gray-900 capitalize">{specs.material}</dd>
          </div>
        )}
        {specs.size && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Size:</dt>
            <dd className="text-gray-900">{specs.size}</dd>
          </div>
        )}
        {specs.weight && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Weight:</dt>
            <dd className="text-gray-900">{specs.weight}g</dd>
          </div>
        )}
        {specs.penType && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Pen Type:</dt>
            <dd className="text-gray-900 capitalize">{specs.penType}</dd>
          </div>
        )}
        {specs.inkColor && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Ink Color:</dt>
            <dd className="text-gray-900 capitalize">{specs.inkColor}</dd>
          </div>
        )}
        {specs.pointSize && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Point Size:</dt>
            <dd className="text-gray-900">{specs.pointSize}</dd>
          </div>
        )}
        {specs.paperType && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Paper Type:</dt>
            <dd className="text-gray-900 capitalize">{specs.paperType}</dd>
          </div>
        )}
        {specs.pageCount && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Page Count:</dt>
            <dd className="text-gray-900">{specs.pageCount}</dd>
          </div>
        )}
        {specs.binding && (
          <div className="flex">
            <dt className="text-gray-600 font-medium w-32">Binding:</dt>
            <dd className="text-gray-900 capitalize">{specs.binding}</dd>
          </div>
        )}
        {specs.dimensions && (
          <div className="flex md:col-span-2">
            <dt className="text-gray-600 font-medium w-32">Dimensions:</dt>
            <dd className="text-gray-900">
              {specs.dimensions.length} × {specs.dimensions.width} × {specs.dimensions.height} cm
            </dd>
          </div>
        )}
      </div>
    );
  };

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

  const displayImages = product.images && product.images.length > 0 ? product.images : [product.primaryImage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#027068] transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-[#027068] transition-colors">
              Shop
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-gray-500 hover:text-[#027068] transition-colors capitalize"
            >
              {product.category.replace(/-/g, ' ')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">
              {product.name}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#027068] scale-105"
                          : "border-transparent hover:border-gray-300"
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

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category and Brand */}
              <div className="flex items-center space-x-4">
                <span className="bg-[#027068]/10 text-[#027068] text-sm font-medium px-3 py-1 rounded-full capitalize">
                  {product.category.replace(/-/g, ' ')}
                </span>
                <span className="text-gray-600 text-sm font-medium">{product.brand}</span>
                {product.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Ratings and Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                  <span className="ml-1">4.8 (24 reviews)</span>
                </div>
                <span className="text-gray-400">•</span>
                <span>{product.sellCount} sold</span>
                <span className="text-gray-400">•</span>
                <span>{product.viewCount} views</span>
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

              {/* Stock Status */}
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

              {/* Short Description */}
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.shortDescription}
              </p>

              {/* Add to Cart Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 hover:text-[#027068] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 font-medium min-w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={product.trackQuantity && quantity >= product.stock}
                      className="px-4 py-2 text-gray-600 hover:text-[#027068] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.status !== "active" || isAddingToCart}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                      product.status !== "active"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : isAddingToCart
                        ? "bg-green-500 text-white scale-105"
                        : "bg-[#027068] text-white hover:bg-[#025c55] hover:scale-105 active:scale-95"
                    }`}
                  >
                    {product.status !== "active"
                      ? "Not Available"
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

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#027068]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#027068]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#027068]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">Quality Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#027068]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="border-t border-gray-200 mt-8">
            <div className="px-8">
              <div className="flex space-x-8 border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-4 px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "description"
                      ? "border-[#027068] text-[#027068] font-medium"
                      : "border-transparent text-gray-500 hover:text-[#027068]"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`py-4 px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "specifications"
                      ? "border-[#027068] text-[#027068] font-medium"
                      : "border-transparent text-gray-500 hover:text-[#027068]"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-4 px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "details"
                      ? "border-[#027068] text-[#027068] font-medium"
                      : "border-transparent text-gray-500 hover:text-[#027068]"
                  }`}
                >
                  Product Details
                </button>
              </div>

              <div className="py-8">
                {activeTab === "description" && (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Product Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {product.description}
                    </p>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Product Specifications
                    </h3>
                    {renderSpecifications()}
                    {!product.specifications && (
                      <p className="text-gray-500 italic">No specifications available for this product.</p>
                    )}
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Product Information
                      </h4>
                      <dl className="space-y-3">
                        <div className="flex">
                          <dt className="text-gray-600 font-medium w-32">SKU:</dt>
                          <dd className="text-gray-900 font-mono">{product.sku}</dd>
                        </div>
                        <div className="flex">
                          <dt className="text-gray-600 font-medium w-32">Category:</dt>
                          <dd className="text-gray-900 capitalize">{product.category.replace(/-/g, ' ')}</dd>
                        </div>
                        {product.subcategory && (
                          <div className="flex">
                            <dt className="text-gray-600 font-medium w-32">Subcategory:</dt>
                            <dd className="text-gray-900 capitalize">{product.subcategory.replace(/-/g, ' ')}</dd>
                          </div>
                        )}
                        <div className="flex">
                          <dt className="text-gray-600 font-medium w-32">Brand:</dt>
                          <dd className="text-gray-900">{product.brand}</dd>
                        </div>
                        {product.tags.length > 0 && (
                          <div className="flex">
                            <dt className="text-gray-600 font-medium w-32">Tags:</dt>
                            <dd className="text-gray-900">
                              {product.tags.map(tag => (
                                <span key={tag} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mr-2 mb-1 capitalize">
                                  {tag.replace(/-/g, ' ')}
                                </span>
                              ))}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}