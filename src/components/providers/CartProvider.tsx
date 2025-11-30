"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  total: number;
  buyNowItem: CartItem | null; // Add buyNowItem to state
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }
  | { type: "BUY_NOW"; payload: Product; quantity?: number } // Add BUY_NOW action
  | { type: "CLEAR_BUY_NOW" }; // Add CLEAR_BUY_NOW action

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
    }
  | undefined
>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART":
      return action.payload;

    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload._id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.productId === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const newState = {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify(newState));
        }
        return newState;
      }

      const newCartItem: CartItem = {
        productId: action.payload._id!,
        product: action.payload,
        quantity: 1,
        price: action.payload.price,
        addedAt: new Date(),
      };

      const newItems = [...state.items, newCartItem];
      const newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState));
      }
      return newState;
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter(
        (item) => item.productId !== action.payload
      );
      const newState = {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState));
      }
      return newState;
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity === 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: action.payload.id,
        });
      }

      const updatedItems = state.items.map((item) =>
        item.productId === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const newState = {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState));
      }
      return newState;
    }

    case "CLEAR_CART": {
      const newState = {
        items: [],
        total: 0,
        buyNowItem: state.buyNowItem, // Preserve buyNowItem when clearing cart
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState));
      }
      return newState;
    }

    case "BUY_NOW": {
      const buyNowQuantity = action.quantity || 1;
      const buyNowItem: CartItem = {
        productId: action.payload._id!,
        product: action.payload,
        quantity: buyNowQuantity,
        price: action.payload.price,
        addedAt: new Date(),
      };

      // Clear regular cart and set buy now item
      const newState = {
        items: [], // Clear existing cart items
        total: action.payload.price * buyNowQuantity,
        buyNowItem: buyNowItem,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState));
      }
      return newState;
    }

    case "CLEAR_BUY_NOW": {
      // Clear the buy now item but keep regular cart items
      const newState = {
        ...state,
        buyNowItem: null,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState));
      }
      return newState;
    }

    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

const initialState: CartState = {
  items: [],
  total: 0,
  buyNowItem: null, // Initialize buyNowItem as null
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          // Ensure backward compatibility with old cart data
          const normalizedCartData = {
            items: cartData.items || [],
            total: cartData.total || 0,
            buyNowItem: cartData.buyNowItem || null,
          };
          dispatch({ type: "LOAD_CART", payload: normalizedCartData });
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}