// components/layout/SearchResults.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Search, Clock, TrendingUp, Loader2, X } from "lucide-react";

interface SearchResultsProps {
  query: string;
  results: Product[];
  isLoading: boolean;
  recentSearches: string[];
  onQuickSearch: (query: string) => void;
  onClose: () => void;
}

export function SearchResults({
  query,
  results,
  isLoading,
  recentSearches,
  onQuickSearch,
  onClose,
}: SearchResultsProps) {
  const popularSearches = [
    "Notebook",
    "Pen",
    "Art Supplies",
    "Office Supplies",
    "Printing Services"
  ];

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#D5D502] mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Searching...</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {/* Search Results */}
      {query && results.length > 0 && (
        <div className="p-4 border-b border-white/10">
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
                  href={`/products/${product.slug}`}
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
              href={`${query}`}
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
        <div className="p-6 text-center">
          <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No results found for "{query}"</p>
          <p className="text-gray-500 text-xs mt-1">Try different keywords</p>
        </div>
      )}

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-white">Recent Searches</h3>
            </div>
            <button
              onClick={() => {/* Clear recent searches logic */}}
              className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onQuickSearch(search)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200 text-left"
              >
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm flex-1">{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-white">Popular Searches</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => onQuickSearch(search)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}