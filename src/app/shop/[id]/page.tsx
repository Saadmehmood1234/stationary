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
  const [showShareModal, setShowShareModal] = useState(false);

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
        console.error("Error fetching product:", error);
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
      type: "ADD_ITEM",
      payload: product,
    });

    setTimeout(() => setIsAddingToCart(false), 600);
  }, [dispatch, product]);

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
    if (product.status === "inactive")
      return { text: "Inactive", color: "text-gray-600" };
    if (product.status === "discontinued")
      return { text: "Discontinued", color: "text-gray-600" };
    if (product.stock <= product.lowStockAlert)
      return { text: "Low Stock", color: "text-orange-600" };
    return { text: "In Stock", color: "text-green-600" };
  };
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${product?.name} at Ali Book Store - ${product?.shortDescription}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowShareModal(true);
        setTimeout(() => setShowShareModal(false), 3000);
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  const stockStatus = getStockStatus();

  const renderSpecifications = () => {
    if (!product?.specifications) return null;

    const specs = product.specifications;
    const hasSpecs = Object.values(specs).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasSpecs) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specs.color && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Color:</dt>
            <dd className="text-gray-200 capitalize">{specs.color}</dd>
          </div>
        )}
        {specs.material && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Material:</dt>
            <dd className="text-gray-200 capitalize">{specs.material}</dd>
          </div>
        )}
        {specs.size && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Size:</dt>
            <dd className="text-gray-200">{specs.size}</dd>
          </div>
        )}
        {/* {specs.weight && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Weight:</dt>
            <dd className="text-gray-200">{specs.weight}</dd>
          </div>
        )} */}
        {specs.penType && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Pen Type:</dt>
            <dd className="text-gray-200 capitalize">{specs.penType}</dd>
          </div>
        )}
        {specs.inkColor && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Ink Color:</dt>
            <dd className="text-gray-200 capitalize">{specs.inkColor}</dd>
          </div>
        )}
        {specs.pointSize && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Point Size:</dt>
            <dd className="text-gray-200">{specs.pointSize}</dd>
          </div>
        )}
        {specs.paperType && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Paper Type:</dt>
            <dd className="text-gray-200 capitalize">{specs.paperType}</dd>
          </div>
        )}
        {specs.pageCount && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Page Count:</dt>
            <dd className="text-gray-200">{specs.pageCount}</dd>
          </div>
        )}
        {specs.binding && (
          <div className="flex">
            <dt className="text-gray-400 font-medium w-32">Binding:</dt>
            <dd className="text-gray-200 capitalize">{specs.binding}</dd>
          </div>
        )}
        {specs.dimensions && (
          <div className="flex md:col-span-2">
            <dt className="text-gray-400 font-medium w-32">Dimensions:</dt>
            <dd className="text-gray-200">
              {specs.dimensions.length} × {specs.dimensions.width} ×{" "}
              {specs.dimensions.height} cm
            </dd>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5D502]"></div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Product Not Found
          </h2>
          <Link
            href="/shop"
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-full group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-white rounded-full opacity-30 group-hover:rotate-90 ease"></span>
            <span className="relative text-lg font-semibold">Back to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.primaryImage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
      <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-[#D5D502] transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href="/shop"
              className="text-gray-400 hover:text-[#D5D502] transition-colors"
            >
              Shop
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-gray-400 hover:text-[#D5D502] transition-colors capitalize"
            >
              {product.category.replace(/-/g, " ")}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium truncate max-w-xs">
              {product.name}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2 sm:p-8">
            <div className="space-y-4">
              <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10">
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
                      className={`aspect-square cursor-pointer bg-white/5 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#D5D502] scale-105"
                          : "border-transparent hover:border-white/30"
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
              <div className="flex flex-wrap items-center space-x-4">
                <span className="bg-[#D5D502]/20 text-[#D5D502] text-sm font-medium px-3 py-1 rounded-full capitalize border border-[#D5D502]/30">
                  {product.category.replace(/-/g, " ")}
                </span>
                <span className="bg-[#6d8a7e]/20 px-4 py-1 rounded-full border border-gray-400 text-gray-400 text-sm font-medium">
                  {product.brand}
                </span>
                {product.isFeatured && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-sm font-medium px-3 py-1 rounded-full border border-yellow-500/30">
                    Featured
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-green-500/20 text-green-400 text-sm font-medium px-3 py-1 rounded-full border border-green-500/30">
                    Best Seller
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-400">
                <div className="flex flex-wrap items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-white">4.8</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center space-x-3">
                <span className="text-3xl font-bold text-[#D5D502]">
                  ₹{product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.comparePrice!.toFixed(2)}
                    </span>
                    <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2 py-1 rounded border border-red-500/30">
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
                  <span className="text-gray-400 text-sm">
                    ({product.stock} units available)
                  </span>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                {product.shortDescription}
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-white/20 rounded-lg bg-white/5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2 cursor-pointer text-gray-400 hover:text-[#D5D502] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-white/20 font-medium min-w-12 text-center text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={
                        product.trackQuantity && quantity >= product.stock
                      }
                      className="px-4 py-2 cursor-pointer text-gray-400 hover:text-[#D5D502] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.status !== "active" || isAddingToCart}
                    className={`flex-1 cursor-pointer py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                      product.status !== "active"
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-500 to-[#D5D502] text-gray-900 hover:shadow-lg hover:shadow-[#D5D502]/20"
                    }`}
                  >
                    {product.status !== "active" ? "Not Available" : "Buy Now"}
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 cursor-pointer border border-white/20 py-2 px-4 rounded-full font-medium transition-all duration-300 
    ${
      isAddingToCart
        ? "bg-green-500 text-white scale-105 shadow-md shadow-green-500/30"
        : "bg-white/5 text-gray-300 hover:border-[#D5D502] hover:text-[#D5D502]"
    }
  `}
                  >
                    {isAddingToCart ? "Added!" : "Add to Cart"}
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex-1 cursor-pointer  border border-white/20 text-gray-300 py-2 px-4 rounded-full font-medium hover:border-[#D5D502] hover:text-[#D5D502] transition-colors bg-white/5"
                  >
                    Share
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#D5D502]"
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
                  <span className="text-sm text-gray-400">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#D5D502]"
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
                  <span className="text-sm text-gray-400">30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#D5D502]"
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
                  <span className="text-sm text-gray-400">
                    Quality Guarantee
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#D5D502]"
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
                  <span className="text-sm text-gray-400">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8">
            <div className="px-8">
              <div className="flex space-x-8 border-b border-white/20 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-4 cursor-pointer px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "description"
                      ? "border-[#D5D502] text-[#D5D502] font-medium"
                      : "border-transparent text-gray-400 hover:text-[#D5D502]"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`py-4 cursor-pointer px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "specifications"
                      ? "border-[#D5D502] text-[#D5D502] font-medium"
                      : "border-transparent text-gray-400 hover:text-[#D5D502]"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-4 cursor-pointer px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "details"
                      ? "border-[#D5D502] text-[#D5D502] font-medium"
                      : "border-transparent text-gray-400 hover:text-[#D5D502]"
                  }`}
                >
                  Product Details
                </button>
              </div>

              <div className="py-8">
                {activeTab === "description" && (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Product Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {product.description}
                    </p>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">
                      Product Specifications
                    </h3>
                    {renderSpecifications()}
                    {!product.specifications && (
                      <p className="text-gray-500 italic">
                        No specifications available for this product.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Product Information
                      </h4>
                      <dl className="space-y-3">
                        <div className="flex">
                          <dt className="text-gray-400 font-medium w-32">
                            SKU:
                          </dt>
                          <dd className="text-white font-mono">
                            {product.sku}
                          </dd>
                        </div>
                        <div className="flex">
                          <dt className="text-gray-400 font-medium w-32">
                            Category:
                          </dt>
                          <dd className="text-white capitalize">
                            {product.category.replace(/-/g, " ")}
                          </dd>
                        </div>
                        {product.subcategory && (
                          <div className="flex">
                            <dt className="text-gray-400 font-medium w-32">
                              Subcategory:
                            </dt>
                            <dd className="text-white capitalize">
                              {product.subcategory.replace(/-/g, " ")}
                            </dd>
                          </div>
                        )}
                        <div className="flex">
                          <dt className="text-gray-400 font-medium w-32">
                            Brand:
                          </dt>
                          <dd className="text-white">{product.brand}</dd>
                        </div>
                        {product.tags.length > 0 && (
                          <div className="flex">
                            <dt className="text-gray-400 font-medium w-32">
                              Tags:
                            </dt>
                            <dd className="text-white">
                              {product.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm mr-2 mb-1 capitalize border border-white/20"
                                >
                                  {tag.replace(/-/g, " ")}
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
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-sm mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#D5D502]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#D5D502]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Link Copied!
              </h3>
              <p className="text-gray-400 text-sm">
                Product link has been copied to clipboard
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
