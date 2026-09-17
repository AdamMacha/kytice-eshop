"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { CartContextValue, CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";

const CART_STORAGE_KEY = "moodbox_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        queueMicrotask(() => {
          setItems(parsed);
          setIsInitialized(true);
        });
        return;
      }
    } catch (err) {
      console.error("[Cart] Error reading localStorage:", err);
    }
    queueMicrotask(() => {
      setIsInitialized(true);
    });
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("[Cart] Error writing to localStorage:", err);
    }
  }, [items, isInitialized]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.slug === product.slug
      );

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        const newQuantity = Math.min(
          newItems[existingIndex].quantity + quantity,
          MAX_QUANTITY_PER_ITEM
        );
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newQuantity,
        };
        return newItems;
      }

      return [
        ...prevItems,
        {
          product,
          quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM),
        },
      ];
    });
  };

  const removeItem = (productSlug: string) => {
    setItems((prev) =>
      prev.filter((item) => item.product.slug !== productSlug)
    );
  };

  const updateQuantity = (productSlug: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productSlug);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.slug === productSlug
          ? {
              ...item,
              quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM),
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const subtotalHalere = items.reduce(
    (sum, item) => sum + item.product.priceHalere * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        subtotalHalere,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
