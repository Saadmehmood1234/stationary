"use client";

import Link from "next/link";
import { useCart } from "../providers/CartProvider";

export function Header() {
  const { state } = useCart();
  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="bg-[#027068] sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-[#FDC700] rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
            <span className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
              Ali Books
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop" },
              { href: "/printing", label: "Printing" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                href={item.href}
                className="relative text-gray-200 hover:text-white transition-colors duration-300 py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#FDC700] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-200 hover:text-[#FDC700] transition-colors duration-300 group"
            >
              <svg
                className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FDC700] text-[#027068] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {itemCount}
                </span>
              )}

              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#FDC700] rounded-full animate-ping opacity-75"></span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
