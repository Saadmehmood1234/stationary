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
  Clock,
  TrendingUp,
  Loader2,
  RefreshCw,
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
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { useSearchOperations } from "@/hooks/useSearchOperations";
import { Product } from "@/types";
import { useSearch } from "../context/SearchContext";
import { useSession } from "@/components/providers/SessionWrapper";
export function Header() {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
const { session, loading } = useSession();
  const {
    query,
    results,
    isLoading,
    isOpen,
    recentSearches,
    performSearch,
    handleSearchSubmit,
    quickSearch,
    clearSearch,
    openSearch,
    closeSearch,
    setQuery,
  } = useSearchOperations();
  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/printing", label: "Printing" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest(".search-container")) {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeSearch]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        performSearch("");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  const handleSearchSubmitWrapper = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(e);
  };

  const handleSearchClickWrapper = () => {
    openSearch();
  };

  const handleSearchCloseWrapper = () => {
    closeSearch();
    setQuery("");
  };

  return (
    <header className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#D5D502] rounded-full blur-[60px] opacity-10"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full blur-[40px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-14 h-14 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full">
                <Image
                  src="/logo1.png"
                  alt="Ali Books Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="sr-only">Ali Books</span>
            </Link>
          </motion.div>

          <div className="hidden lg:block flex-1 max-w-lg mx-8 search-container">
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
              onSubmit={handleSearchSubmitWrapper}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleSearchClickWrapper}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D5D502]/50 transition-all duration-300"
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
                className={`px-8 max-md:px-4 py-5 font-semibold text-gray-900 bg-gradient-to-r from-yellow-500 to-[#D5D502] 
      hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300
      rounded-full shadow-lg focus:ring-2 
      focus:ring-[#D5D402]/50 cursor-pointer`}
              >
                Shop Now
              </Button>
            </Link>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <div className="lg:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSearchClickWrapper}
                className="p-2 text-gray-300 hover:text-[#D5D502] transition-colors"
              >
                <Search className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Cart */}
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

            {/* Desktop Menu */}
            <Menubar className="bg-transparent border-none max-lg:hidden">
              <MenubarMenu>
                <MenubarTrigger className="text-gray-300 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/10 p-2 rounded-full transition-all duration-300">
                  <div className="flex items-center">
                    <Menu className="h-5 w-5 cursor-pointer" />
                    <span className="sr-only">Menu</span>
                  </div>
                </MenubarTrigger>
                <MenubarContent className="min-w-[200px] bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 backdrop-blur-lg dark:bg-slate-900/95 border-white/20 dark:border-slate-700/50">
                  {session ? (
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


                  {session && (
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
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 mx-4 lg:mx-8 bg-gradient-to-br from-[#171E21] to-slate-900 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-lg overflow-hidden search-container hidden lg:block"
            >
              <SearchResultsContent
                query={query}
                results={results}
                isLoading={isLoading}
                recentSearches={recentSearches}
                onQuickSearch={quickSearch}
                onClose={closeSearch}
              />
            </motion.div>
          )}
        </AnimatePresence>

 
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-white/10 search-container"
            >
              <div className="py-4">
                <form
                  onSubmit={handleSearchSubmitWrapper}
                  className="relative mb-4"
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-12 text-white placeholder:text-gray-400 bg-white/5 backdrop-blur-lg border border-white/10 focus:bg-white/10 focus:border-[#D5D502]/50 rounded-2xl"
                    placeholder="Search books, stationery, printing..."
                    autoFocus
                  />
                  <motion.button
                    type="button"
                    onClick={handleSearchCloseWrapper}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </form>

      
                <SearchResultsContent
                  query={query}
                  results={results}
                  isLoading={isLoading}
                  recentSearches={recentSearches}
                  onQuickSearch={quickSearch}
                  onClose={closeSearch}
                  isMobile={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}


interface SearchResultsContentProps {
  query: string;
  results: Product[];
  isLoading: boolean;
  recentSearches: string[];
  onQuickSearch: (query: string) => void;
  onClose: () => void;
  isMobile?: boolean;
}

const SearchResultsContent: React.FC<SearchResultsContentProps> = ({
  query,
  results,
  isLoading,
  recentSearches,
  onQuickSearch,
  onClose,
  isMobile = false,
}) => {
  const router = useRouter();
  const { dispatch } = useSearch();

  const popularSearches = [
    {
      name: "Notebook",
      link: "/shop/notebooks",
    },
    {
      name: "Pen",
      link: "/shop/pens",
    },
    {
      name: "Art Supplies",
      link: "/shop/art-supplies",
    },
    {
      name: "Office Supplies",
      link: "/shop/office-supplies",
    },
    {
      name: "Printing Services",
      link: "/printing",
    },
  ];

  const clearIndividualSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    const updatedSearches = recentSearches.filter(search => search !== searchToRemove);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
    
    dispatch({ type: 'SET_RECENT_SEARCHES', payload: updatedSearches });
  };

  const clearAllSearches = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
    dispatch({ type: 'CLEAR_RECENT_SEARCHES' });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <RefreshCw className="h-12 w-12 animate-spin text-[#D5D502] mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Searching...</p>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "px-4" : "max-h-96 overflow-y-auto"}`}>
      {/* Search Results */}
      {query && results.length > 0 && (
        <div className={`${isMobile ? "" : "p-4 border-b border-white/10"}`}>
          <h3 className="text-sm font-semibold text-white mb-3">
            Search Results ({results.length})
          </h3>
          <div className="space-y-2">
            {results.slice(0, 5).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/shop/${product._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    {product.primaryImage ? (
                      <Image
                        src={product.primaryImage}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-[#D5D502] rounded-full opacity-60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-[#D5D502] transition-colors">
                      {product.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {product.brand} • ₹{product.price}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {results.length > 5 && (
            <Link
              href={`/shop?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="block text-center mt-3 p-2 text-[#D5D502] text-sm font-medium hover:bg-white/5 rounded-lg transition-colors"
            >
              View all {results.length} results
            </Link>
          )}
        </div>
      )}

      {/* No Results */}
      {query && results.length === 0 && !isLoading && (
        <div className="p-4 text-center">
          <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            No results found for "{query}"
          </p>
          <p className="text-gray-500 text-xs mt-1">Try different keywords</p>
        </div>
      )}


      {!query && recentSearches.length > 0 && (
        <div className={`${isMobile ? "" : "p-4 border-b border-white/10"}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center cursor-pointer gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-white">
                Recent Searches
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllSearches}
              className="text-xs cursor-pointer text-gray-400 hover:text-red-400 transition-colors duration-200 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all
            </motion.button>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                <button
                  onClick={() => onQuickSearch(search)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm flex-1 truncate">
                    {search}
                  </span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => clearIndividualSearch(search, e)}
                  className="opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/10 rounded-lg"
                  title="Remove this search"
                >
                  <X className="h-3 w-3 text-gray-400 hover:text-red-400 transition-colors" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!query && recentSearches.length === 0 && (
        <div className={`${isMobile ? "" : "p-4 border-b border-white/10"}`}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-white">
              Recent Searches
            </h3>
          </div>
          <div className="text-center py-4">
            <Clock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No recent searches</p>
            <p className="text-gray-500 text-xs mt-1">
              Your search history will appear here
            </p>
          </div>
        </div>
      )}

      {!query && (
        <div className={`${isMobile ? "" : "p-4"}`}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-white">
              Popular Searches
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onQuickSearch(search.link)}
                className="px-3 cursor-pointer py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200"
              >
                {search.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};