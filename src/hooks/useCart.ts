import { create } from 'zustand';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  total: 0,
  addItem: (product) => set((state) => {
    const existing = state.items.find(i => i.id === product.id);
    if (existing) {
      const newItems = state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return { items: newItems, total: state.total + (product.discount_price || product.price) };
    }
    return { 
      items: [...state.items, { ...product, quantity: 1 }], 
      total: state.total + (product.discount_price || product.price) 
    };
  }),
  removeItem: (id) => set((state) => {
    const item = state.items.find(i => i.id === id);
    if (!item) return state;
    return {
      items: state.items.filter(i => i.id !== id),
      total: state.total - ((item.discount_price || item.price) * item.quantity)
    };
  }),
  clearCart: () => set({ items: [], total: 0 }),
}));
