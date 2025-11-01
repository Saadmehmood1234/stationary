"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";
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
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                href="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-[#D5D502] transition-colors py-2 px-3 rounded-full hover:bg-white/5"
              >
                <Store className="w-4 h-4" />
                <span>View Store</span>
              </Link>
            </nav>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-block text-sm text-gray-300">
                Admin User
              </span>
              <button className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5">
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
