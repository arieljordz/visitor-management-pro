import { create } from "zustand";
import * as userService from "@/services/authService";
import { useSpinnerStore } from "./spinnerStore";

const showSpinner = () => useSpinnerStore.getState().show();
const hideSpinner = () => useSpinnerStore.getState().hide();

interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  isVerified: boolean;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  loadingUser: boolean;
  error: string | null;

  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loadingUser: true,
  error: null,

  // REGISTER
  register: async (name, email, password) => {
    showSpinner();
    try {
      const data = await userService.register(name, email, password);
      set({ user: data, isAuthenticated: true });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Registration failed" });
      throw err;
    } finally {
      hideSpinner();
    }
  },

  // LOGIN
  login: async (email, password) => {
    showSpinner();
    try {
      const data = await userService.login(email, password);
      console.log("Login data:", data);
      set({ user: data, isAuthenticated: true });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Login failed" });
      throw err;
    } finally {
      hideSpinner();
    }
  },

  // GOOGLE LOGIN
  googleLogin: async (token) => {
    showSpinner();
    try {
      const data = await userService.googleLogin(token);
      set({ user: data, isAuthenticated: true });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Google login failed" });
      throw err;
    } finally {
      hideSpinner();
    }
  },

  // FETCH CURRENT USER
  fetchUser: async () => {
    showSpinner();
    try {
      const data = await userService.getMe();
      set({ user: data, isAuthenticated: true, loadingUser: false });
    } catch {
      set({ user: null, isAuthenticated: false, loadingUser: false });
    } finally {
      hideSpinner();
    }
  },

  // LOGOUT
  logout: async () => {
    showSpinner();
    try {
      await userService.logout();
      set({ user: null, isAuthenticated: false });
    } finally {
      hideSpinner();
    }
  },
}));
