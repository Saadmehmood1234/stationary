"use client";

import { useState, useMemo, useCallback } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/types";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";

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

  // Memoize categories
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

  // Memoize filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts.filter((p) => {
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort products
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

  // Memoize event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shop Stationery
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our wide range of premium stationery products for all your creative and professional needs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, description, or brand..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Results Count */}
            <div className="text-gray-600">
              Showing <span className="font-semibold">{filteredProducts.length}</span> of{" "}
              <span className="font-semibold">{initialProducts.length}</span> products
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as "name" | "price" | "newest")}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price">Price: Low to High</option>
              </select>

              {/* View Mode Toggle */}
              <button
                onClick={toggleViewMode}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
              >
                {viewMode === "grid" ? (
                  <List className="w-5 h-5 text-gray-600" />
                ) : (
                  <Grid className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Mobile Filter Toggle */}
              <button
                onClick={toggleFilters}
                className="lg:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Hidden on mobile by default */}
          <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </h3>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategorySelect(category._id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      selectedCategory === category._id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <span className="font-medium capitalize">
                      {category.name.replace(/-/g, " ")}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      selectedCategory === category._id
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Mobile close button */}
              <button
                onClick={toggleFilters}
                className="lg:hidden w-full mt-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-6"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}