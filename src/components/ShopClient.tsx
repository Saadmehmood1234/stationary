"use client";

import { useState, useMemo, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";
import { Search, Filter, Grid, List, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  initialProducts: Product[];
}

type ViewMode = "grid" | "list";

export default function ShopClient({ initialProducts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "newest">("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Map(
        initialProducts.map((p) => [p.category, { 
          _id: p.category, 
          name: p.category,
          count: initialProducts.filter(prod => prod.category === p.category).length
        }])
      ).values()
    );
    return [{ _id: "all", name: "All Products", count: initialProducts.length }, ...uniqueCategories];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = initialProducts.filter((p) => {
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const selectedCategoryName = categories.find(cat => cat._id === selectedCategory)?.name || "All Products";

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryDropdown(false);
    setShowFilters(false);
  }, []);

  const handleSortChange = useCallback((value: "name" | "price" | "newest") => {
    setSortBy(value);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === "grid" ? "list" : "grid");
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setShowFilters(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-[#D5D502] rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "50%", right: "10%" }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
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

      <div className="relative">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.h3
              className="text-center text-lg font-bold bg-gradient-to-r from-[#D5D502] to-blue-300 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              DISCOVER STATIONARY ITEMS
            </motion.h3>
            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent">
                Shop
              </span>
              <span className="bg-gradient-to-r from-[#D5D502] via-white to-purple-200 bg-clip-text text-transparent ml-4">
                Collection
              </span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-stretch lg:items-center justify-between mb-6">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D5D502] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-full focus:ring-2 focus:ring-[#D5D502] focus:border-transparent text-white placeholder-gray-400 text-base shadow-lg transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-white/10 transition-all duration-300 min-w-[160px] justify-between"
                  >
                    <span className="truncate capitalize">
                      {selectedCategoryName.replace(/-/g, " ")}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border border-white/20 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
                      >
                        <div className="p-2 space-y-1">
                          {categories.map((category) => (
                            <button
                              key={category._id}
                              onClick={() => handleCategorySelect(category._id)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                                selectedCategory === category._id
                                  ? "bg-[#D5D502]/30 text-[#D5D502]"
                                  : "text-gray-300 hover:bg-white/5"
                              }`}
                            >
                              <span className="font-medium capitalize text-sm">
                                {category.name.replace(/-/g, " ")}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                selectedCategory === category._id
                                  ? "bg-[#D5D502] text-white"
                                  : "bg-white/10 text-gray-400"
                              }`}>
                                {category.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              
              {(searchQuery || selectedCategory !== "all") && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={clearFilters}
                  className="text-sm text-[#D5D502] hover:text-[#D5D502] transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={product}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#D5D502]/20 to-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D5D502]/30">
                    <Search className="w-8 h-8 text-[#D5D502]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Try adjusting your search or filter criteria.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-primary text-white rounded-full hover:from-yellow-600 hover:to-primary cursor-pointer transition-all duration-300 font-medium"
                  >
                    Clear all filters
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}