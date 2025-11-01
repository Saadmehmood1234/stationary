"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  initialProducts: Product[];
}

type ViewMode = "grid" | "list";

export default function ShopClientHome({ initialProducts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "newest">("newest");

  const filteredProducts = useMemo(() => {
    let filtered = initialProducts.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
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
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 w-full max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D6D402]/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-[#D6D402]/50 transition-colors"
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className={
                viewMode === "grid" 
                  ? "grid  xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                  : "flex flex-col gap-4 max-w-4xl mx-auto"
              }
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20  rounded-3xl shadow-2xl shadow-[#D6D402]/10 border border-white/20 relative"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-br from-[#D6D402]/10 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D6D402]/30"
                >
                  <Search className="w-10 h-10 text-[#D6D402]" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-[#D6D402] bg-clip-text text-transparent mb-4"
                >
                  No products found
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed"
                >
                  Try adjusting your search or filter criteria to find what you're looking for.
                </motion.p>
                
                <motion.button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-3 cursor-pointer bg-gradient-to-r from-yellow-500 to-primary text-gray-900 rounded-full hover:from-yellow-600 hover:to-primary transition-all duration-300 font-semibold overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                  <span className="relative">Clear all filters</span>
                </motion.button>
              </div>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#D6D402] rounded-full opacity-40"
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + Math.random() * 40}%`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
