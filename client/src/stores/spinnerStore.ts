// src/stores/spinnerStore.ts
import { create } from "zustand";

interface SpinnerStore {
  isLoading : boolean;
  show: () => void;
  hide: () => void;
}

export const useSpinnerStore = create<SpinnerStore>((set) => ({
  isLoading : false,
  show: () => set({ isLoading : true }),
  hide: () => set({ isLoading : false }),
}));
