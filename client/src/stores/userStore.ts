import { create } from "zustand";
import * as userService from "@/services/authService";
import { useSpinnerStore } from "./spinnerStore";
import type { User, UserRole } from "@/types/user";

const showSpinner = () => useSpinnerStore.getState().show();
const hideSpinner = () => useSpinnerStore.getState().hide();

interface UserStore {
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  isStaff: boolean;
  isAuthenticated: boolean;
  loadingUser: boolean;
  error: string | null;

  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUserState: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  role: null,
  isAdmin: false,
  isStaff: false,
  isAuthenticated: false,
  loadingUser: true,
  error: null,

  setUserState: (user) => {
    set({
      user,
      role: user.role,
      isAdmin: user.role === "admin",
      isStaff: user.role === "staff",
      isAuthenticated: true,
      loadingUser: false,
    });
  },

  register: async (name, email, password) => {
    showSpinner();
    try {
      const user = await userService.register(name, email, password);
      set({
        user,
        role: user.role,
        isAdmin: user.role === "admin",
        isStaff: user.role === "staff",
        isAuthenticated: true,
        loadingUser: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Registration failed", loadingUser: false });
      throw err;
    } finally {
      hideSpinner();
    }
  },

  login: async (email, password) => {
    showSpinner();
    try {
      const user = await userService.login(email, password);
      set({
        user,
        role: user.role,
        isAdmin: user.role === "admin",
        isStaff: user.role === "staff",
        isAuthenticated: true,
        loadingUser: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Login failed", loadingUser: false });
      throw err;
    } finally {
      hideSpinner();
    }
  },

  googleLogin: async (token) => {
    showSpinner();
    try {
      const user = await userService.googleLogin(token);
      set({
        user,
        role: user.role,
        isAdmin: user.role === "admin",
        isStaff: user.role === "staff",
        isAuthenticated: true,
        loadingUser: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Google login failed", loadingUser: false });
      throw err;
    } finally {
      hideSpinner();
    }
  },

  fetchUser: async () => {
    showSpinner();
    try {
      const user = await userService.getMe();
      set({
        user,
        role: user.role,
        isAdmin: user.role === "admin",
        isStaff: user.role === "staff",
        isAuthenticated: true,
        loadingUser: false,
      });
    } catch {
      set({
        user: null,
        role: null,
        isAdmin: false,
        isStaff: false,
        isAuthenticated: false,
        loadingUser: false,
      });
    } finally {
      hideSpinner();
    }
  },

  logout: async () => {
    showSpinner();
    try {
      await userService.logout();
      set({
        user: null,
        role: null,
        isAdmin: false,
        isStaff: false,
        isAuthenticated: false,
      });
    } finally {
      hideSpinner();
    }
  },
}));
