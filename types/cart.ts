import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number; // in CZK
  subtotalHalere: number; // in haléře
}

export interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clearCart: () => void;
}

export type CartContextValue = CartState & CartActions;
