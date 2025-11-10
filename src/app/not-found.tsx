"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Compass,
  FileQuestion,
  Ghost
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#D5D502] rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.8, 0.3],
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="min-h-screen flex items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="relative mb-8"
            >
              <div className="text-[180px] sm:text-[240px] font-black bg-gradient-to-r from-[#D5D502] via-yellow-400 to-[#D5D502] bg-clip-text text-transparent leading-none">
                404
              </div>
              
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Ghost className="h-24 w-24 text-white/10" />
              </motion.div>
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">
                  Page Not Found
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Lost in the{" "}
                <span className="bg-gradient-to-r from-[#D5D502] to-yellow-400 bg-clip-text text-transparent">
                  Digital Void
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg sm:text-xl max-w-md mx-auto leading-relaxed">
                The page you're looking for seems to have wandered off into the 
                digital unknown. Don't worry, even the best explorers get lost sometimes!
              </p>
            </motion.div>

            {/* Helpful Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <Compass className="h-6 w-6 text-[#D5D502]" />
                  <h3 className="text-lg font-semibold text-white">Quick Navigation</h3>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-[#D5D502] rounded-full"></div>
                    <span>Check the URL for typos</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-[#D5D502] rounded-full"></div>
                    <span>Use the search bar to find what you need</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-[#D5D502] rounded-full"></div>
                    <span>Browse our popular categories below</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button
                asChild
                className="bg-gradient-to-r from-[#D5D502] to-yellow-500 text-slate-900 hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 px-8 py-3 rounded-full font-semibold text-lg"
              >
                <Link href="/" className="flex items-center gap-3">
                  <Home className="h-5 w-5" />
                  Go Home
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="border-[#D5D502] bg-gry-700 text-[#D5D502] hover:bg-gradient-to-r hover:from-[#D5D502] hover:to-yellow-500 hover:text-slate-900 ] transition-all duration-300 px-8 py-3 rounded-full font-semibold text-lg"
              >
                <Link href="/shop" className="flex items-center gap-3">
                  <Search className="h-5 w-5" />
                  Browse Shop
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-gray-400 cursor-pointer hover:text-white hover:bg-white/5 transition-all duration-300 px-6 py-3 rounded-full font-semibold"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </motion.div>

            {/* Popular Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mb-12"
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                Popular Destinations
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                {[
                  { name: "Shop", href: "/shop", emoji: "📓" },
                  { name: "Printing", href: "/printing", emoji: "🖨️" },
                ].map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      href={category.href}
                      className="block p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:border-[#D5D502]/30 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {category.emoji}
                      </div>
                      <span className="text-white text-sm font-medium group-hover:text-[#D5D502] transition-colors">
                        {category.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                <FileQuestion className="h-4 w-4" />
                <span>Need help? </span>
                <Link 
                  href="/contact" 
                  className="text-[#D5D502] hover:text-yellow-400 transition-colors font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}