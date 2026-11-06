"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/types/store";

const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

type CartState = {
  items: CartItem[];
  favoriteProducts: Product[];
  hydrated: boolean;
  addItem: (product: Product, quantity?: number, variant?: Record<string, string>) => void;
  toggleFavorite: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number, variant?: Record<string, string>) => void;
  removeItem: (productId: string, variant?: Record<string, string>) => void;
  clearCart: () => void;
  setHydrated: (hydrated: boolean) => void;
};

function sameVariant(a?: Record<string, string>, b?: Record<string, string>) {
  return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      favoriteProducts: [],
      hydrated: false,
      toggleFavorite: (product) =>
        set((state) => ({
          favoriteProducts: state.favoriteProducts.some((favorite) => favorite.id === product.id)
            ? state.favoriteProducts.filter((favorite) => favorite.id !== product.id)
            : [...state.favoriteProducts, product],
        })),
      addItem: (product, quantity = 1, variant) =>
        set((state) => {
          const index = state.items.findIndex(
            (item) => item.product.id === product.id && sameVariant(item.variant, variant),
          );
          if (index < 0) return { items: [...state.items, { product, quantity, variant }] };
          return {
            items: state.items.map((item, itemIndex) =>
              itemIndex === index
                ? { ...item, quantity: Math.min(item.product.stock, item.quantity + quantity) }
                : item,
            ),
          };
        }),
      updateQuantity: (productId, quantity, variant) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.product.id !== productId || !sameVariant(item.variant, variant))
              : state.items.map((item) =>
                  item.product.id === productId && sameVariant(item.variant, variant)
                    ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                    : item,
                ),
        })),
      removeItem: (productId, variant) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId || !sameVariant(item.variant, variant)),
        })),
      clearCart: () => set({ items: [] }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "atelier-cart",
      storage: createJSONStorage(() => (typeof window === "undefined" ? serverStorage : window.localStorage)),
      skipHydration: true,
      partialize: (state) => ({ items: state.items, favoriteProducts: state.favoriteProducts }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
