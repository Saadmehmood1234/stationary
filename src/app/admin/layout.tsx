"use client";
import { motion } from "framer-motion";
import type { Metadata } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "@/components/providers/SessionWrapper";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Printer,
  Store,
  LogOut,
  Menu,
  X,
  Users,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();
  const router = useRouter();
  const { logout } = useAuth();
  useEffect(() => {
    if (session !== undefined) {
      setIsLoading(false);

    }
  }, [session, router]);

  if (isLoading) {
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
                Loading Dashboard
              </h2>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                Preparing your analytics and insights...
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

  if (!session || session.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900">
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-[#D5D502] transition-colors rounded-full hover:bg-white/5"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <Link
                href="/admin"
                className="text-xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent"
              >
                Ali Book Admin
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                href="/admin"
                className="flex items-center space-x-2 text-gray-300 hover:text-[#D5D502] transition-colors py-2 px-3 rounded-full hover:bg-white/5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center space-x-2 text-gray-300 hover:text-[#D5D502] transition-colors py-2 px-3 rounded-full hover:bg-white/5"
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center space-x-2 text-gray-300 hover:text-[#D5D502] transition-colors py-2 px-3 rounded-full hover:bg-white/5"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Orders</span>
              </Link>
              <Link
                href="/admin/print-orders"
                className="flex items-center space-x-2 text-gray-300 hover:text-[#D5D502] transition-colors py-2 px-3 rounded-full hover:bg-white/5"
              >
                <Printer className="w-4 h-4" />
                <span>Prints</span>
              </Link>
              <Link
                href="/admin/contact-page"
                className="flex items-center space-x-2 text-gray-300 hover:text-[#D5D502] transition-colors py-2 px-3 rounded-full hover:bg-white/5"
              >
                <Users className="w-4 h-4" />
                <span>Contact</span>
              </Link>
              <Link
                href="/admin/images"
                className="flex items-center space-x-2 text-gray-300 hover:text-[#D5D502] transition-colors py-2 px-3 rounded-full hover:bg-white/5"
              >
                <Store className="w-4 h-4" />
                <span>Images</span>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-block text-sm text-gray-300">
                Welcome, {session?.name || session?.email || "Admin"}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline-block text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/10 py-4">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#D5D502] transition-colors py-3 px-4 rounded-full hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin/products"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#D5D502] transition-colors py-3 px-4 rounded-full hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="w-5 h-5" />
                  <span>Products</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#D5D502] transition-colors py-3 px-4 rounded-full hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/admin/print-orders"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#D5D502] transition-colors py-3 px-4 rounded-full hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Printer className="w-5 h-5" />
                  <span>Prints</span>
                </Link>
                <Link
                  href="/admin/contact-page"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#D5D502] transition-colors py-3 px-4 rounded-full hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="w-5 h-5" />
                  <span>Contacts</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#D5D502] transition-colors py-3 px-4 rounded-full hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Store className="w-5 h-5" />
                  <span>View Store</span>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
