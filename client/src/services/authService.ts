// src/services/userService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // so cookies/session are sent
});

// Register
export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/api/auth/register", { name, email, password });
  return res.data;
};

// Manual login
export const login = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
};

// Google login
export const googleLogin = async (token: string) => {
  const res = await api.post("/api/auth/google-login", { token });
  return res.data;
};

// Get current user
export const getMe = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};

// Logout
export const logout = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};
