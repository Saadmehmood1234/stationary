'use client';

import { useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    console.log('Order placed:', { customerInfo, items: state.items, total: state.total });
    alert('Order placed successfully! We will contact you shortly to confirm.');
    dispatch({ type: 'CLEAR_CART' });
    // Redirect to confirmation page or home
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No items in cart</h1>
          <Link 
            href="/shop" 
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-full group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-white rounded-full opacity-30 group-hover:rotate-90 ease"></span>
            <span className="relative text-lg font-semibold">Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "20%", left: "5%" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "60%", right: "10%" }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
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

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent mb-8"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-6"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Customer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-2 focus:ring-[#D5D502]/20 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-2 focus:ring-[#D5D502]/20 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-2 focus:ring-[#D5D502]/20 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-2 focus:ring-[#D5D502]/20 transition-colors resize-none"
                    placeholder="Any special instructions or requests..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Collection Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-6"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Collection Method</h2>
              <div className="p-4 border-2 border-[#D5D502] rounded-xl bg-[#D5D502]/10 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D5D502] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-white">In-Store Pickup</p>
                    <p className="text-sm text-gray-300">Free • Ready in 1-2 hours</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-2 ml-9">
                  123 Stationery Street, Creative District, City 12345
                </p>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {state.items.map(item => (
                  <div key={item.product._id} className="flex justify-between items-center py-3 border-b border-white/10">
                    <div className="flex-1">
                      <p className="font-medium text-white">{item.product.name}</p>
                      <p className="text-sm text-gray-400">Qty: {item.quantity} × ₹{item.product.price}</p>
                    </div>
                    <p className="font-semibold text-[#D5D502]">₹{(item.product.price * item.quantity).toFixed(2)}</p>
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
                  <span className="text-[#D5D502]">₹{state.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-[#D5D502] text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 mt-6"
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
                By placing your order, you agree to our terms and conditions. 
                Payment will be collected when you pick up your order.
              </p>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}