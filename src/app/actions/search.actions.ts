"use server";

import { getProducts } from "./product.actions";

export async function searchProducts(query: string, limit: number = 8) {
  try {
    if (!query.trim()) {
      return {
        success: true,
        products: [],
        total: 0
      };
    }

    const result = await getProducts({
      search: query,
      limit,
      status: "active"
    });

    return result;
  } catch (error: any) {
    console.error("Search error:", error);
    return {
      success: false,
      error: error.message || "Failed to search products",
      products: [],
      total: 0
    };
  }
}

export async function getPopularSearches() {
  try {
    // You can implement logic to get popular searches from analytics
    // For now, return some default popular searches
    return {
      success: true,
      searches: [
        "notebook",
        "pen",
        "printing",
        "stationery",
        "art supplies",
        "office supplies"
      ]
    };
  } catch (error: any) {
    console.error("Error getting popular searches:", error);
    return {
      success: false,
      error: error.message || "Failed to get popular searches",
      searches: []
    };
  }
}