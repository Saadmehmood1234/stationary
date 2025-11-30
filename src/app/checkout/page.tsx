"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import { createOrder } from "../actions/order.actions";
import { CheckCircle, Package, Clock, Mail, Store, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
interface OrderData {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  collectionMethod: "pickup" | "delivery";
  paymentMethod: string;
  notes?: string;
}

 function CheckoutContent() {
  const { state, dispatch } = useCart();
  const searchParams = useSearchParams();
  const productIdsFromParams = searchParams?.getAll("products") || [];
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const displayItems = state.buyNowItem ? [state.buyNowItem] : state.items;
  const displayTotal = state.buyNowItem ? state.total : state.total;
  useEffect(() => {
    if (productIdsFromParams.length > 0) {
      console.log("Products from URL params:", productIdsFromParams);
    }
  }, [productIdsFromParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const orderData = {
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
        items: displayItems.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          sku: item.product.sku || `SKU-${item.productId}`,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal: displayTotal,
        tax: 0,
        total: displayTotal,
        collectionMethod: "pickup" as const,
        paymentMethod: "razorpay",
        notes: customerInfo.notes || undefined,
      };

      // Create order
      const result = await createOrder(orderData);

      if (result.success) {
        // Clear both regular cart and buyNowItem after successful order
        dispatch({ type: "CLEAR_CART" });
        dispatch({ type: "CLEAR_BUY_NOW" });

        setOrderDetails(result.data);
        setOrderSubmitted(true);
      } else {
        alert(`Failed to place order: ${result.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  // if (state.items.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-white mb-4">
  //           No items in cart
  //         </h1>
  //         <Link
  //           href="/shop"
  //           className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-gray-800 transition duration-300 ease-out rounded-full group"
  //         >
  //           <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full"></span>
  //           <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-white rounded-full opacity-30 group-hover:rotate-90 ease"></span>
  //           <span className="relative text-lg font-semibold">
  //             Continue Shopping
  //           </span>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {orderSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-16"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-green-500/30 relative">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold  mb-4 bg-gradient-to-r from-green-400 to-[#D5D502] bg-clip-text text-transparent">
              Order Placed Successfully!
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Thank you for your order! We've sent a confirmation email to{" "}
              <span className="text-[#D5D502] font-semibold">
                {customerInfo.email}
              </span>
              . Your order will be ready for pickup in 1-2 hours.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 max-w-2xl mx-auto mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#D5D502]" />
                      Order Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Order Number:</span>
                        <span className="text-white font-semibold">
                          {orderDetails?.orderNumber || "ORD-001"}
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-slate-400">Total Amount:</span>
                        <span className="text-[#D5D502] font-bold text-lg">
                          ₹{state.total.toFixed(2)}
                        </span>
                      </div> */}
                      {/* <div className="flex justify-between">
                        <span className="text-slate-400">Items:</span>
                        <span className="text-white">
                          {state.items.reduce(
                            (total, item) => total + item.quantity,
                            0
                          )}
                        </span>
                      </div> */}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-yellow-400 font-semibold">
                          Preparing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#D5D502]" />
                      Pickup Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Est. Ready:</span>
                        <span className="text-white">1-2 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white text-right">
                          Store Pickup
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#D5D502]/10 rounded-xl border border-[#D5D502]/20">
                <h4 className="font-semibold text-[#D5D502] mb-2 flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Pickup Location
                </h4>
                <p className="text-slate-300 text-start text-sm">
                  123 Stationery Street, Creative District, City 12345
                </p>
                <p className="text-slate-400 text-start text-xs mt-1">
                  Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/shop"
                className="bg-gradient-to-r from-[#EDB600] to-[#c4c400] text-slate-900 px-8 py-4 rounded-full font-semibold hover:from-[#EDB600] hover:to-[#b3b300] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Store className="w-5 h-5" />
                Continue Shopping
              </Link>
              <Link
                href="/profile"
                className="border-2 border-[#D5D502] text-[#D5D502] px-8 py-4 rounded-full font-semibold hover:bg-[#D5D502] hover:text-slate-900 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Package className="w-5 h-5" />
                View My Orders
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-slate-400 text-sm">
                A detailed order confirmation has been sent to your email.
                Please bring your order number and ID when picking up.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent mb-8"
            >
              Checkout
            </motion.h1>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-6"
                >
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Customer Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-2 focus:ring-[#D5D502]/20 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-2 focus:ring-[#D5D502]/20 transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-2 focus:ring-[#D5D502]/20 transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Order Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={customerInfo.notes}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-2 focus:ring-[#D5D502]/20 transition-colors resize-none"
                        placeholder="Any special instructions or requests..."
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-6"
                >
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Collection Method
                  </h2>
                  <div className="p-4 border-2 border-[#D5D502] rounded-xl bg-[#D5D502]/10 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[#D5D502] rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          In-Store Pickup
                        </p>
                        <p className="text-sm text-gray-300">
                          Free • Ready in 1-2 hours
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-2 ml-9">
                      Ali Book, Tayyab Mosque\nShaheen Bagh Okhla New Delhi
                      110025
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sticky top-8">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {state.items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex justify-between items-center py-3 border-b border-white/10"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-white">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            Qty: {item.quantity} × ₹{item.product.price}
                          </p>
                        </div>
                        <p className="font-semibold text-[#D5D502]">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/20 pt-4 space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>₹{state.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-white/20 pt-3">
                      <span className="text-white">Total</span>
                      <span className="text-[#D5D502]">
                        ₹{state.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-[#D5D502] text-gray-900 cursor-pointer py-3 px-6 rounded-full font-semibold hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 mt-6"
                  >
                    Place Order
                  </button>

                  <Link
                    href="/cart"
                    className="w-full border border-white/20 text-gray-300 py-3 px-6 rounded-full font-medium hover:border-[#D5D502] hover:text-[#D5D502] transition-colors bg-white/5 text-center block mt-3"
                  >
                    Back to Cart
                  </Link>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    By placing your order, you agree to our terms and
                    conditions. Payment will be collected when you pick up your
                    order.
                  </p>
                </div>
              </motion.div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function CheckoutLoading() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "30%", left: "10%" }}
          />
          <motion.div
            className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "60%", right: "15%" }}
          />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Animated Icon Container */}
            <motion.div
              className="relative mb-8"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30 flex items-center justify-center mx-auto shadow-2xl shadow-[#D5D502]/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <RefreshCw className="h-10 w-10 text-[#D5D502]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent mb-4">
                Loading Checkout
              </h2>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                Preparing your checkout experience...
              </p>

              {/* Progress Bar */}
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D5D502] to-[#c4c400]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-[#D5D502] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
  );
}
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}