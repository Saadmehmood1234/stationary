"use client";

import { useState, useMemo, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";
import {
  Search,
  Grid,
  List,
  X,
  ChevronDown,
  Star,
  SlidersHorizontal,
  TrendingUp,
  Zap,
  ArrowUpDown,
  Calendar,
  AArrowUp,
  AArrowDown,
  Trophy,
  DollarSign,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  initialProducts: Product[];
}

type ViewMode = "grid" | "list";
type SortBy =
  | "name"
  | "price-low"
  | "price-high"
  | "newest"
  | "best-seller"
  | "featured"
  | "trending";
type PriceRange = [number, number];
type StockStatus = "all" | "in-stock" | "low-stock" | "out-of-stock";

export default function ShopClient({ initialProducts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StockStatus>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Extract all unique brands, price range, and categories from products
  const { brands, maxPrice, subcategories } = useMemo(() => {
    const uniqueBrands = Array.from(
      new Set(initialProducts.map((p) => p.brand))
    );
    const prices = initialProducts.map((p) => p.price);
    const uniqueSubcategories = Array.from(
      new Set(
        initialProducts.flatMap((p) => (p.subcategory ? [p.subcategory] : []))
      )
    );

    return {
      brands: uniqueBrands,
      maxPrice: Math.ceil(Math.max(...prices)),
      subcategories: uniqueSubcategories,
    };
  }, [initialProducts]);

  // Categories with counts
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Map(
        initialProducts.map((p) => [
          p.category,
          {
            _id: p.category,
            name: p.category,
            count: initialProducts.filter(
              (prod) => prod.category === p.category
            ).length,
          },
        ])
      ).values()
    );
    return [
      { _id: "all", name: "All Products", count: initialProducts.length },
      ...uniqueCategories,
    ];
  }, [initialProducts]);

  // Filter and sort products based on actual Product type
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchesFeatured = !featuredOnly || p.isFeatured;

      // Stock status filtering
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "in-stock" &&
          p.stock > p.lowStockAlert &&
          p.status === "active") ||
        (selectedStatus === "low-stock" &&
          p.stock <= p.lowStockAlert &&
          p.stock > 0 &&
          p.status === "active") ||
        (selectedStatus === "out-of-stock" &&
          (p.stock === 0 || p.status === "out_of_stock"));

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice &&
        matchesBrand &&
        matchesFeatured &&
        matchesStatus
      );
    });

    // Sorting logic based on actual Product properties
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "best-seller":
        filtered.sort((a, b) => b.sellCount - a.sellCount);
        break;
      case "featured":
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.sellCount - a.sellCount;
        });
        break;
      case "trending":
        // Combine view count and sell count for trending calculation
        filtered.sort((a, b) => {
          const aScore = a.viewCount + a.sellCount * 2;
          const bScore = b.viewCount + b.sellCount * 2;
          return bScore - aScore;
        });
        break;
    }

    return filtered;
  }, [
    initialProducts,
    selectedCategory,
    searchQuery,
    sortBy,
    priceRange,
    selectedBrands,
    featuredOnly,
    selectedStatus,
  ]);

  // Selected category name for display
  const selectedCategoryName =
    categories.find((cat) => cat._id === selectedCategory)?.name ||
    "All Products";

  // Filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (searchQuery) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (selectedBrands.length > 0) count++;
    if (featuredOnly) count++;
    if (selectedStatus !== "all") count++;
    return count;
  }, [
    selectedCategory,
    searchQuery,
    priceRange,
    maxPrice,
    selectedBrands,
    featuredOnly,
    selectedStatus,
  ]);

  // Event handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryDropdown(false);
  }, []);

  const handleSortChange = useCallback((value: SortBy) => {
    setSortBy(value);
    setShowSortDropdown(false);
  }, []);

  const handleBrandToggle = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }, []);

  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    setPriceRange([min, max]);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, maxPrice]);
    setSelectedBrands([]);
    setSelectedStatus("all");
    setFeaturedOnly(false);
    setShowFilters(false);
  }, [maxPrice]);

  const sortOptions = [
    {
      value: "newest" as SortBy,
      label: "Newest",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      value: "name" as SortBy,
      label: "Name A-Z",
      icon: <AArrowUp className="h-4 w-4" />,
    },
    {
      value: "price-low" as SortBy,
      label: "Price: Low to High",
      icon: <IndianRupee className="h-4 w-4" />,
    },
    {
      value: "price-high" as SortBy,
      label: "Price: High to Low",
      icon: <IndianRupee className="h-4 w-4" />,
    },
    {
      value: "best-seller" as SortBy,
      label: "Best Sellers",
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      value: "featured" as SortBy,
      label: "Featured",
      icon: <Star className="h-4 w-4" />,
    },
    {
      value: "trending" as SortBy,
      label: "Trending",
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];
  const stockStatusOptions = [
    { value: "all" as StockStatus, label: "All Status" },
    { value: "in-stock" as StockStatus, label: "In Stock" },
    { value: "low-stock" as StockStatus, label: "Low Stock" },
    { value: "out-of-stock" as StockStatus, label: "Out of Stock" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
      {/* Background animations */}
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
                    placeholder="Search products by name, brand, tags, or description..."
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
                    onClick={() =>
                      setShowCategoryDropdown(!showCategoryDropdown)
                    }
                    className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-white/10 transition-all duration-300 min-w-[160px] justify-between"
                  >
                    <span className="truncate capitalize">
                      {selectedCategoryName.replace(/-/g, " ")}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showCategoryDropdown ? "rotate-180" : ""
                      }`}
                    />
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
                              className={`w-full text-left px-3 py-2 cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-between group ${
                                selectedCategory === category._id
                                  ? "bg-[#D5D502]/30 text-[#D5D502]"
                                  : "text-gray-300 hover:bg-white/5"
                              }`}
                            >
                              <span className="font-medium capitalize text-sm">
                                {category.name.replace(/-/g, " ")}
                              </span>
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  selectedCategory === category._id
                                    ? "bg-[#D5D502] text-gray-900"
                                    : "bg-white/10 text-gray-400"
                                }`}
                              >
                                {category.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-white/10 transition-all duration-300 min-w-[180px] justify-between"
                  >
                    <span className="truncate flex items-center gap-2">
                      <span>
                        {sortOptions.find((opt) => opt.value === sortBy)?.icon}
                      </span>
                      {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showSortDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showSortDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border border-white/20 rounded-xl shadow-lg z-50"
                      >
                        <div className="p-2 space-y-1">
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleSortChange(option.value)}
                              className={`w-full text-left px-3 py-2 cursor-pointer rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                sortBy === option.value
                                  ? "bg-[#D5D502]/30 text-[#D5D502]"
                                  : "text-gray-300 hover:bg-white/5"
                              }`}
                            >
                              <span className="flex-shrink-0">
                                {option.icon}
                              </span>
                              <span className="font-medium text-sm">
                                {option.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleViewMode}
                  className="p-2.5 cursor-pointer bg-white/5 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-white/10 transition-all duration-300"
                  title={viewMode === "grid" ? "List view" : "Grid view"}
                >
                  {viewMode === "grid" ? (
                    <List className="w-5 h-5" />
                  ) : (
                    <Grid className="w-5 h-5" />
                  )}
                </motion.button>

                {/* Filters Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFilters}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-white/10 transition-all duration-300 relative"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D5D502] text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-300"
              >
                Showing {filteredProducts.length} of {initialProducts.length}{" "}
                products
                {searchQuery && (
                  <span className="text-[#D5D502] ml-2">
                    for "{searchQuery}"
                  </span>
                )}
              </motion.p>

              {activeFilterCount > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={clearFilters}
                  className="text-sm cursor-pointer text-[#D5D502] hover:text-[#D5D502]/80 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3 " />
                  Clear all filters
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-lg border-t border-b border-white/20 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range Filter */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          value={priceRange[0]}
                          onChange={(e) =>
                            handlePriceRangeChange(
                              Number(e.target.value),
                              priceRange[1]
                            )
                          }
                          className="w-full accent-[#D5D502]"
                        />
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) =>
                            handlePriceRangeChange(
                              priceRange[0],
                              Number(e.target.value)
                            )
                          }
                          className="w-full accent-[#D5D502]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Brands</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {brands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="rounded border-white/20 bg-white/5 text-[#D5D502] focus:ring-[#D5D502] accent-[#D5D502]"
                          />
                          <span className="text-gray-300 group-hover:text-white transition-colors capitalize">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stock Status Filter */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Stock Status</h3>
                    <div className="space-y-2">
                      {stockStatusOptions.map((status) => (
                        <label
                          key={status.value}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="stockStatus"
                            checked={selectedStatus === status.value}
                            onChange={() => setSelectedStatus(status.value)}
                            className="border-white/20 bg-white/5 text-[#D5D502] focus:ring-[#D5D502] accent-[#D5D502]"
                          />
                          <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
                            {status.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special Filters */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Special</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={featuredOnly}
                          onChange={(e) => setFeaturedOnly(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-[#D5D502] focus:ring-[#D5D502] accent-[#D5D502]"
                        />
                        <span className="text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          Featured Products
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
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
                      Try adjusting your search or filter criteria to find what
                      you're looking for.
                    </motion.p>

                    <motion.button
                      onClick={clearFilters}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
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
                        className="absolute w-1 h-1 bg-[#D6D402] rounded-full opacity-100"
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
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
