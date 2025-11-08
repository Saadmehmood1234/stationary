"use client";
import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
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
                Privacy Policy
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
                title: "Information We Collect",
                content: "We collect information you provide directly to us, including name, email address, shipping address, payment information, and any other information you choose to provide when making a purchase or creating an account."
              },
              {
                title: "How We Use Your Information",
                content: "We use the information we collect to process your orders, communicate with you about products and services, provide customer support, improve our website and services, and comply with legal obligations."
              },
              {
                title: "Information Sharing",
                content: "We do not sell your personal information. We may share information with third-party service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential."
              },
              {
                title: "Cookies and Tracking",
                content: "We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier."
              },
              {
                title: "Data Security",
                content: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
              },
              {
                title: "Your Rights",
                content: "You have the right to access, correct, or delete your personal information. You may also object to our processing of your personal information, ask us to restrict processing, or request portability of your personal information."
              },
              {
                title: "Changes to This Policy",
                content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'last updated' date."
              },
              {
                title: "Contact Us",
                content: "If you have any questions about this Privacy Policy, please contact us at privacy@alibook.com."
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
                  <span className="w-2 h-2 bg-[#D5D502] rounded-full mr-3"></span>
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
            className="text-center mt-8"
          >
            <p className="text-gray-400 text-sm">
              By using our website, you consent to our Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;