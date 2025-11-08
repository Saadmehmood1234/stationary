"use client";
import React from "react";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "50%", right: "10%" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-25"
          animate={{
            x: [0, 60, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: "15%", left: "15%" }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
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
      <div className="relative z-10 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent">
                Terms & Conditions
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-8 md:p-12 space-y-8"
          >
            {[
              {
                title: "Agreement to Terms",
                content: "By accessing and using Ali Book's website and services, you accept and agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services."
              },
              {
                title: "Products and Services",
                content: "All products and services available on our website are subject to availability. We reserve the right to discontinue any products at any time. Prices for our products are subject to change without notice."
              },
              {
                title: "Orders and Payment",
                content: "When you place an order, you agree that all information you provide is accurate and complete. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available, inaccuracies, or errors in product information."
              },
              {
                title: "Shipping and Delivery",
                content: "Shipping times are estimates and not guaranteed. We are not responsible for delays due to customs, weather, or other factors beyond our control. Risk of loss and title for items pass to you upon delivery to the carrier."
              },
              {
                title: "Returns and Refunds",
                content: "We accept returns within 30 days of delivery for unused items in original packaging. Return shipping costs are the responsibility of the customer unless the return is due to our error. Refunds will be processed to the original payment method."
              },
              {
                title: "Intellectual Property",
                content: "All content on this website, including text, graphics, logos, images, and software, is the property of Ali Book and protected by intellectual property laws. You may not use our content without express written permission."
              },
              {
                title: "User Accounts",
                content: "When you create an account with us, you must provide accurate information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer."
              },
              {
                title: "Limitation of Liability",
                content: "Ali Book shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service or products."
              },
              {
                title: "Governing Law",
                content: "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Ali Book operates, without regard to its conflict of law provisions."
              },
              {
                title: "Changes to Terms",
                content: "We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new Terms and Conditions on this site and updating the 'last updated' date."
              },
              {
                title: "Contact Information",
                content: "For any questions about these Terms and Conditions, please contact us at terms@alibook.com."
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0"
              >
                <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
                  <span className="text-[#D5D502] mr-3 text-xl">§{index + 1}</span>
                  {section.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-8 p-6 bg-[#D5D502]/10 rounded-2xl border border-[#D5D502]/30"
          >
            <p className="text-white font-semibold">
              By using our website and services, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms and Conditions.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;