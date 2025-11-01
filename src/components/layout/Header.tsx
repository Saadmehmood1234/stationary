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
  X,
} from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

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
import { useState } from "react";
import { Button } from "../ui/button";

export function Header() {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: "/", label: "Home" },

    { href: "/printing", label: "Printing" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchVisible(false);
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    setIsSearchVisible(true);
  };

  const handleSearchClose = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  return (
    <header className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#D5D502] rounded-full blur-[60px] opacity-10"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full blur-[40px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-[#D5D502]  rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  <span className="text-gray-900 font-bold text-sm">AB</span>
                </div>
                <div className="absolute -inset-1 hover:shadow-lg hover:shadow-[#D5D502]/25  rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-xl max-sm:hidden font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent group-hover:from-[#D5D502] group-hover:to-white transition-all duration-300">
                Ali Books
              </span>
            </Link>
          </motion.div>

          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
              onSubmit={handleSearchSubmit}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5  border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D5D502]/50 transition-all duration-300"
                placeholder="Search books, stationery, printing..."
              />
            </motion.form>
          </div>

          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative text-gray-300 hover:text-white transition-colors duration-300 py-2 px-3 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#D5D502] to-[#D5D502] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="flex justify-end max-lg:w-[60%] max-sm:w-[40%] mx-2">
            <Link href="/shop">
              <Button
                className={`px-8 max-md:px-4 py-3 font-semibold text-gray-900 bg-gradient-to-r from-yellow-500 to-[#D5D502] 
      hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300
      rounded-full shadow-lg focus:ring-2 
      focus:ring-[#D5D402]/50 cursor-pointer`}
              >
                Shop Now
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <div className="lg:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSearchClick}
                className="p-2 text-gray-300 hover:text-[#D5D502] transition-colors"
              >
                <Search className="h-5 w-5" />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <Link
                href="/cart"
                className="flex items-center justify-center w-10 h-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full hover:bg-white/10 hover:border-[#D5D502]/30 transition-all duration-300 group"
              >
                <ShoppingCart className="h-5 w-5 text-gray-300 group-hover:text-[#D5D502] transition-colors" />
                {itemCount > 0 && (
                  <>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-[#D5D502] to-[#D5D502] text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-950"
                    >
                      {itemCount}
                    </motion.span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 h-5 w-5 bg-[#D5D502] rounded-full opacity-20"
                    />
                  </>
                )}
              </Link>
            </motion.div>

            <MobileMenu itemCount={itemCount} />
            <Menubar className="bg-transparent border-none max-lg:hidden">
              <MenubarMenu>
                <MenubarTrigger className="text-gray-300 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/10 p-2 rounded-full transition-all duration-300">
                  <div className="flex items-center">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </div>
                </MenubarTrigger>
                <MenubarContent className="min-w-[200px] bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 backdrop-blur-lg dark:bg-slate-900/95 border-white/20 dark:border-slate-700/50">
                  {user ? (
                    <MenubarItem
                      onClick={() => router.push("/profile")}
                      className="flex items-center text-white gap-2 cursor-pointer hover:bg-[#D5D502]/10 dark:hover:bg-[#D5D502]/20 transition-colors"
                    >
                      <User className="h-4 w-4 text-white" />
                      Profile
                    </MenubarItem>
                  ) : (
                    <>
                      <MenubarItem
                        onClick={() => router.push("/auth/signin")}
                        className="flex text-white items-center gap-2 cursor-pointer hover:bg-[#D5D502]/10 dark:hover:bg-[#D5D502]/20 transition-colors"
                      >
                        <LogIn className="h-4 w-4 text-white" />
                        Sign In
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => router.push("/auth/signup")}
                        className="flex text-white items-center gap-2 cursor-pointer hover:bg-[#D5D502]/10 dark:hover:bg-[#D5D502]/20 transition-colors"
                      >
                        <UserPlus className="h-4 w-4 text-white" />
                        Sign Up
                      </MenubarItem>
                    </>
                  )}

                  <MenubarSeparator className="bg-white/20" />
                  <MenubarItem
                    onClick={() => router.push("/cart")}
                    className="flex items-center gap-2 text-white cursor-pointer hover:bg-[#D5D502]/10 dark:hover:bg-[#D5D502]/20 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4 text-white" />
                    Cart
                    {itemCount > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-[#D5D502] to-[#D5D502] text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </MenubarItem>

                  <MenubarSeparator className="bg-white/20" />

                  <MenubarSub>
                    {/* <MenubarSubTrigger className="hover:bg-[#D5D502]/10 text-white dark:hover:bg-[#D5D502]/20 transition-colors">
                      <div className="flex  items-center gap-2">
                        <div className="h-4 w-4 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full border border-current" />
                        </div>
                        Theme
                      </div>
                    </MenubarSubTrigger> */}
                    <MenubarSubContent className="bg-white/95 backdrop-blur-lg dark:bg-slate-900/95 border-white/20 dark:border-slate-700/50">
                      <MenubarItem
                        onClick={() => setTheme("light")}
                        className="flex items-center gap-2 cursor-pointer hover:bg-[#D5D502]/10 dark:hover:bg-[#D5D502]/20 transition-colors"
                      >
                        <Sun className="h-4 w-4" />
                        Light
                        {theme === "light" && (
                          <span className="ml-auto text-[#D5D502]">✓</span>
                        )}
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => setTheme("dark")}
                        className="flex items-center gap-2 cursor-pointer hover:bg-[#D5D502]/10 dark:hover:bg-[#D5D502]/20 transition-colors"
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                        {theme === "dark" && (
                          <span className="ml-auto text-[#D5D502]">✓</span>
                        )}
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  {user && (
                    <>
                      <MenubarSeparator className="bg-white/20" />
                      <MenubarItem
                        onClick={logout}
                        className="cursor-pointer text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Logout
                      </MenubarItem>
                    </>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>

        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative py-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full  pl-12 pr-12  text-white placeholder:text-gray-400 bg-white/5 backdrop-blur-lg border border-white/10 focus:bg-white/10 focus:border-[#D5D502]/50 rounded-2xl"
                  placeholder="Search books, stationery, printing..."
                  autoFocus
                />
                <motion.button
                  type="button"
                  onClick={handleSearchClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
