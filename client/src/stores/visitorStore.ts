// src/stores/visitorStore.ts
import { create } from "zustand";
import * as visitorService from "@/services/visitorService";
import { useSpinnerStore } from "./spinnerStore";
import { Visitor } from "@/types/visitor";

const showSpinner = () => useSpinnerStore.getState().show();
const hideSpinner = () => useSpinnerStore.getState().hide();

interface VisitorStore {
  visitors: Visitor[];
  total: number;
  page: number;
  pages: number;
  searchTerm: string;
  message: string | null;

  setSearchTerm: (term: string) => void;
  clearMessage: () => void;

  fetchVisitors: (page?: number, limit?: number) => Promise<void>;
  searchVisitors: (q: string, page?: number, limit?: number) => Promise<void>;
  addVisitor: (
    visitor: Omit<
      Visitor,
      "id" | "fullname" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
  updateVisitor: (visitor: Visitor) => Promise<void>;
  deleteVisitor: (id: string) => Promise<void>;
}

export const useVisitorStore = create<VisitorStore>((set, get) => ({
  visitors: [],
  total: 0,
  page: 1,
  pages: 1,
  searchTerm: "",
  message: null,

  setSearchTerm: (term) => set({ searchTerm: term }),
  clearMessage: () => set({ message: null }),

  fetchVisitors: async (page = 1, limit = 10) => {
    showSpinner();
    try {
      const data = await visitorService.getVisitors(page, limit);
      console.log("Fetched visitors:", data);
      set({
        visitors: data.visitors,
        total: data.total,
        page: data.page,
        pages: data.pages,
        message: null,
      });
    } catch (err: any) {
      set({
        visitors: [],
        total: 0,
        page: 1,
        pages: 1,
        message: err?.message || "Error fetching visitors",
      });
    } finally {
      hideSpinner();
    }
  },

  searchVisitors: async (q: string, page = 1, limit = 10) => {
    showSpinner();
    try {
      const data = await visitorService.searchVisitors(q, page, limit);
      console.log("Searched visitors:", data);
      set({
        visitors: data.visitors,
        total: data.total,
        page: data.page,
        pages: data.pages,
        message: null,
      });
    } catch (err: any) {
      set({
        visitors: [],
        total: 0,
        page: 1,
        pages: 1,
        message: err?.message || "Error searching visitors",
      });
    } finally {
      hideSpinner();
    }
  },

  addVisitor: async (visitor) => {
    showSpinner();
    try {
      const newVisitor = await visitorService.addVisitor(visitor);
      console.log("Added visitor:", newVisitor);
      set((state) => ({
        visitors: [...state.visitors, newVisitor],
        total: state.total + 1,
        message: "Visitor added successfully",
      }));
    } catch (err: any) {
      set({ message: err?.message || "Failed to add visitor" });
    } finally {
      hideSpinner();
    }
  },

  updateVisitor: async (visitor) => {
    showSpinner();
    try {
      const updated = await visitorService.updateVisitor(visitor);
      console.log("Updated visitor:", updated);
      set((state) => ({
        visitors: state.visitors.map((v) =>
          v.id === updated.id ? updated : v
        ),
        message: "Visitor updated successfully",
      }));
    } catch (err: any) {
      set({ message: err?.message || "Failed to update visitor" });
    } finally {
      hideSpinner();
    }
  },

  deleteVisitor: async (id) => {
    showSpinner();
    try {
      await visitorService.deleteVisitor(id);
      set((state) => ({
        visitors: state.visitors.filter((v) => v.id !== id),
        total: state.total - 1,
        message: "Visitor deleted successfully",
      }));
    } catch (err: any) {
      set({ message: err?.message || "Failed to delete visitor" });
    } finally {
      hideSpinner();
    }
  },
}));
