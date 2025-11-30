"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, X, ShoppingCart, User, LogIn, UserPlus } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface MobileMenuProps {
  itemCount: number;
}

export function MobileMenu({ itemCount }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/printing", label: "Printing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[320px] sm:w-[400px] bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-l border-white/10 backdrop-blur-lg"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
              onClick={() => setOpen(false)}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D5D502] to-[#D5D502] rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-xs">AB</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-[#D5D502] to-[#D5D502] rounded-xl blur-sm opacity-50"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
                Ali Books
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center py-4 px-4 text-lg font-medium text-white hover:bg-white/10 rounded-full transition-all duration-300 group border-l-4 border-transparent hover:border-[#D5D502]"
                  >
                    <div className="w-2 h-2 bg-[#D5D502] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-3"></div>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {user && (
            <div className="p-6 border-t border-white/10">
              <Link href="/profile">
              <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D5D502] to-[#D5D502]">
                  <span className="text-sm font-medium text-gray-900">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-300 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              </Link>
            </div>
          )}

          <div className="p-6 border-t border-white/10">
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-white group-hover:text-[#D5D502] transition-colors duration-200" />
                  {itemCount > 0 && (
                    <>
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#D5D502] to-[#D5D502] text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-900">
                        {itemCount}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-white font-medium">Shopping Cart</span>
              </div>
              {itemCount > 0 && (
                <span className="text-[#D5D502] font-bold">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </Link>
          </div>


          {!user ? (
            <div className="p-6 border-t border-white/10 space-y-3">
              <Button asChild className="w-full rounded-full bg-gradient-to-r from-[#D5D502] to-[#D5D502] text-gray-900 hover:from-[#D5D502] hover:to-[#D5D502] transition-all duration-300">
                <Link href="/auth/signin" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white/20 text-gray-900 rounded-full bg-white hover:bg-white/80">
                <Link href="/auth/signup" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          ) : (
            <div className="p-6 border-t border-white/10">
              <Button 
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                variant="outline" 
                className="w-full bg-white text-gray-900 hover:bg-red-500/10 hover:text-red-300"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}