// src/services/userService.ts
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth";

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
  const res = await api.post("/register", { name, email, password });
  return res.data;
};

// Manual login
export const login = async (email: string, password: string) => {
  const res = await api.post("/login", { email, password });
  return res.data;
};

// Google login
export const googleLogin = async (token: string) => {
  const res = await api.post("/google-login", { token });
  return res.data;
};

// Get current user
export const getMe = async () => {
  const res = await api.get("/me");
  return res.data;
};

// Logout
export const logout = async () => {
  const res = await api.post("/logout");
  return res.data;
};
