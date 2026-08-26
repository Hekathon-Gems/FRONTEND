import { create } from "zustand";

interface CartStoreState {
  itemCount: number;
  setItemCount: (count: number) => void;
}

export const useCartStore = create<CartStoreState>((set) => ({
  itemCount: 0,
  setItemCount: (count) => set({ itemCount: count }),
}));
