"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  itemCount: number;
}

export function MobileMenu({ itemCount }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

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
          className="md:hidden text-gray-200 hover:text-white hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-none">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <Link 
              href="/" 
              className="flex items-center space-x-3"
              onClick={() => setOpen(false)}
            >
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Ali Books Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">Ali Books</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 p-6">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-4 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-colors duration-200 border-l-4 border-transparent hover:border-[#FDC700]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme Toggler for Mobile */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>

          {/* User Section (if logged in) */}
          {user && (
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDC700]">
                  <span className="text-sm font-medium text-[#027068]">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-200 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cart Section */}
          <div className="p-6 border-t border-white/20">
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-white group-hover:text-[#FDC700] transition-colors duration-200" />
                  {itemCount > 0 && (
                    <>
                      <span className="absolute -top-2 -right-2 bg-[#FDC700] text-[#027068] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                      <span className="absolute -top-2 -right-2 h-5 w-5 bg-[#FDC700] rounded-full animate-ping opacity-75"></span>
                    </>
                  )}
                </div>
                <span className="text-white font-medium">Shopping Cart</span>
              </div>
              {itemCount > 0 && (
                <span className="text-[#FDC700] font-bold">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </Link>
          </div>

          {/* Auth Links (if not logged in) */}
          {!user && (
            <div className="p-6 border-t border-white/20 space-y-3">
              <Button asChild className="w-full bg-[#FDC700] text-[#027068] hover:bg-[#fdc800]">
                <Link href="/auth/signin" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white/10">
                <Link href="/auth/signup" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}