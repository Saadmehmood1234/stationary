"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Product } from "@/types";

interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  isOpen: boolean;
  recentSearches: string[];
}

type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_RESULTS"; payload: Product[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "ADD_RECENT_SEARCH"; payload: string }
  | { type: "SET_RECENT_SEARCHES"; payload: string[] } // Add this
  | { type: "CLEAR_RECENT_SEARCHES" };

const SearchContext = createContext<
  | {
      state: SearchState;
      dispatch: React.Dispatch<SearchAction>;
    }
  | undefined
>(undefined);

const searchReducer = (
  state: SearchState,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };

    case "SET_RESULTS":
      return { ...state, results: action.payload, isLoading: false };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_OPEN":
      return { ...state, isOpen: action.payload };

    case "ADD_RECENT_SEARCH":
      const updatedSearches = [
        action.payload,
        ...state.recentSearches.filter((s) => s !== action.payload),
      ].slice(0, 5);
      if (typeof window !== "undefined") {
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      }
      return { ...state, recentSearches: updatedSearches };

    case "SET_RECENT_SEARCHES": // Add this new case
      if (typeof window !== "undefined") {
        localStorage.setItem("recentSearches", JSON.stringify(action.payload));
      }
      return { ...state, recentSearches: action.payload };

    case "CLEAR_RECENT_SEARCHES":
      if (typeof window !== "undefined") {
        localStorage.removeItem("recentSearches");
      }
      return { ...state, recentSearches: [] };

    default:
      return state;
  }
};

const initialState: SearchState = {
  query: "",
  results: [],
  isLoading: false,
  isOpen: false,
  recentSearches:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("recentSearches") || "[]")
      : [],
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
