"use client";

import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Store,
} from "lucide-react";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#D5D502] rounded-full blur-[100px] opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-[#D5D502] to-[#c4c400] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-16 h-16 text-slate-900" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#D5D502] to-[#c4c400] rounded-full blur-xl opacity-30"></div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <div className="w-2 h-2 bg-[#D5D502] rounded-full animate-pulse"></div>
              <span className="text-[#D5D502] text-sm font-medium">
                Shopping Cart
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
              Your Cart is Empty
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-sm mx-auto">
              Discover amazing stationery and printing services. Start adding
              items to your cart!
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/shop"
                className="bg-gradient-to-r from-[#D5D502] to-[#c4c400] text-slate-900 px-8 py-4 rounded-full font-semibold hover:from-[#c4c400] hover:to-[#b3b300] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Store className="w-5 h-5" />
                Explore Shop
              </Link>
              <Link
                href="/printing"
                className="border-2 border-[#D5D502] text-[#D5D502] px-8 py-4 rounded-full font-semibold hover:bg-[#D5D502] hover:text-slate-900 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Start Printing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#D5D502] rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
            <div className="w-2 h-2 bg-[#D5D502] rounded-full animate-pulse"></div>
            <span className="text-[#D5D502] text-sm font-medium">
              Shopping Cart
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
            Your Shopping Cart
          </h1>
          <p className="text-gray-300 text-lg">
            Review your items and proceed to checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-[#D5D502]" />
                    <h2 className="text-2xl font-bold text-white">
                      Cart Items (
                      {state.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                      )
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearCart}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </motion.button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <AnimatePresence>
                  {state.items.map((item, index) => (
                    <motion.div
                      key={item.product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto_auto] gap-4 sm:gap-6 p-4 sm:p-6 bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/10 hover:border-[#D5D502]/30 transition-all duration-300 mb-4 last:mb-0 group"
                    >
                      {/* Product Image */}
                      <div className="flex items-center gap-4 sm:gap-6 sm:col-span-1">
                        <div className="flex-shrink-0 relative">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <span className="text-gray-400 text-xs sm:text-sm font-medium">
                              Image
                            </span>
                          </div>
                          <div className="absolute -inset-1 bg-gradient-to-br from-[#D5D502] to-[#c4c400] rounded-xl sm:rounded-2xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </div>

                        {/* Mobile-only product info */}
                        <div className="sm:hidden flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-base mb-1 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-[#D5D502] font-bold text-base">
                            ${item.product.price}
                          </p>
                        </div>
                      </div>

                      {/* Product Details - Hidden on mobile */}
                      <div className="hidden sm:block flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg mb-2 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {item.product.shortDescription}
                        </p>
                        <p className="text-[#D5D502] font-bold text-lg">
                          ${item.product.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-3">
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(
                                item.product._id!,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/10 flex items-center justify-center hover:border-[#D5D502] hover:bg-[#D5D502]/10 transition-all duration-200"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-[#D5D502]" />
                          </motion.button>

                          <span className="w-8 sm:w-12 text-center font-bold text-white text-base sm:text-lg">
                            {item.quantity}
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(
                                item.product._id!,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/10 flex items-center justify-center hover:border-[#D5D502] hover:bg-[#D5D502]/10 transition-all duration-200"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-[#D5D502]" />
                          </motion.button>
                        </div>

                        {/* Mobile total price */}
                        <div className="sm:hidden flex flex-col items-end">
                          <p className="font-bold text-white text-base">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Total Price & Remove - Hidden on mobile */}
                      <div className="hidden sm:flex flex-col items-end justify-between">
                        <p className="font-bold text-white text-lg mb-2">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeItem(item.product._id!)}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </motion.button>
                      </div>
                      <div className="sm:hidden flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeItem(item.product._id!)}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl sticky top-8"
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Order Summary
                </h2>
                <p className="text-gray-400 text-sm">
                  Review your order details
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-semibold text-white">
                      ${state.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tax</span>
                    <span className="text-gray-400">$0.00</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Shipping</span>
                    <span className="text-[#D5D502] font-semibold">Free</span>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-[#D5D502]">
                        ${state.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/checkout"
                      className="w-full bg-gradient-to-r from-[#D5D502] to-[#c4c400] text-slate-900 py-2 px-6 rounded-full font-semibold hover:from-[#c4c400] hover:to-[#b3b300] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/shop"
                      className="w-full border-2 border-[#D5D502] text-[#D5D502] py-2 px-6 rounded-full font-semibold hover:bg-[#D5D502] hover:text-slate-900 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      Continue Shopping
                    </Link>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 p-4 bg-gradient-to-r from-[#D5D502]/10 to-[#c4c400]/10 rounded-2xl border border-[#D5D502]/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#D5D502] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-900 text-sm">🎉</span>
                    </div>
                    <div>
                      <p className="text-[#D5D502] text-sm font-semibold">
                        Free In-Store Pickup
                      </p>
                      <p className="text-[#D5D502]/80 text-xs mt-1">
                        No shipping fees required. Ready in 1-2 hours!
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
