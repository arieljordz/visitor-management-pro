// src/stores/spinnerStore.ts
import { create } from "zustand";

interface SpinnerStore {
  loading: boolean;
  show: () => void;
  hide: () => void;
}

export const useSpinnerStore = create<SpinnerStore>((set) => ({
  loading: false,
  show: () => set({ loading: true }),
  hide: () => set({ loading: false }),
}));
