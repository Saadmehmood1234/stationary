"use client";

import Link from "next/link";
import { useCart } from "../providers/CartProvider";
import { Input } from "../ui/input";
import { MobileMenu } from "./MobileMenu";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  Moon,
  Sun,
} from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useTheme } from "../theme-provider";

export function Header() {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const { theme, setTheme } = useTheme();
  return (
    <header className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center group">
            <div className="relative w-14 flex justify-center items-center h-14 transform group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="Ali Books Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
              Ali Books
            </span>
          </Link>

          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300/50 transition-colors"
                placeholder="Search books, stationery, printing..."
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop" },
              { href: "/printing", label: "Printing" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="relative text-gray-200 hover:text-white transition-colors duration-300 py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#FDC700] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Menubar className="bg-transparent border-none max-md:hidden">
              <MenubarMenu>
                <MenubarTrigger className="text-gray-200 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/10 p-2">
                  <div className="flex items-center space-x-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </div>
                </MenubarTrigger>
                <MenubarContent className="min-w-[200px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {user ? (
                    <MenubarItem
                      onClick={() => router.push("/profile")}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </MenubarItem>
                  ) : (
                    <>
                      <MenubarItem
                        onClick={() => router.push("/auth/signin")}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => router.push("/auth/signup")}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </MenubarItem>
                    </>
                  )}

                  <MenubarSeparator />
                  <MenubarItem
                    onClick={() => router.push("/cart")}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {itemCount > 0 && (
                      <span className="ml-auto bg-[#FDC700] text-[#027068] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </MenubarItem>

                  <MenubarSeparator />

                  <MenubarSub>
                    <MenubarSubTrigger className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full border border-current" />
                        </div>
                        Theme
                      </div>
                    </MenubarSubTrigger>
                    <MenubarSubContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <MenubarItem
                        onClick={() => setTheme("light")}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Sun className="h-4 w-4" />
                        Light
                        {theme === "light" && (
                          <span className="ml-auto text-[#02726A]">✓</span>
                        )}
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => setTheme("dark")}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                        {theme === "dark" && (
                          <span className="ml-auto text-[#02726A]">✓</span>
                        )}
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  {/* Logout for logged-in users */}
                  {user && (
                    <>
                      <MenubarSeparator />
                      <MenubarItem
                        onClick={logout}
                        className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </MenubarItem>
                    </>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Mobile Search Icon */}
            <div className="md:hidden">
              <Search className="h-5 w-5 text-gray-200" />
            </div>

            {/* Mobile Menu (Hamburger) */}
            <MobileMenu itemCount={itemCount} />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 text-white placeholder:text-gray-400 bg-white/10 border-white/20 focus:bg-white/15 focus:border-white/30"
              placeholder="Search books, stationery, printing..."
            />
          </div>
        </div>
      </div>
    </header>
  );
}
