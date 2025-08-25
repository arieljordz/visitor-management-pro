// src/services/visitorService.ts
import axios from "axios";
import type { Visitor } from "@/types/visitor";

const API_URL = import.meta.env.VITE_BASE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies/session
});

// ✅ Get all visitors with pagination
export const getVisitors = async (
  page = 1,
  limit = 10
): Promise<{ visitors: Visitor[]; total: number; page: number; pages: number }> => {
  const res = await api.get("/api/visitors", { params: { page, limit } });
  return res.data; // { visitors, total, page, pages }
};

// ✅ Get a single visitor by ID
export const getVisitorById = async (id: string): Promise<Visitor> => {
  const res = await api.get(`/api/visitors/${id}`);
  return res.data; // backend returns a normalized Visitor
};

// ✅ Search visitors with pagination
export const searchVisitors = async (
  q: string,
  page = 1,
  limit = 10
): Promise<{ visitors: Visitor[]; total: number; page: number; pages: number }> => {
  const res = await api.get("/api/visitors/search", {
    params: { q, page, limit },
  });
  return res.data; // { visitors, total, page, pages }
};

// ✅ Add a new visitor
export const addVisitor = async (
  visitor: Omit<Visitor, "id" | "fullname" | "createdAt" | "updatedAt">
): Promise<Visitor> => {
  const res = await api.post("/api/visitors", visitor);
  return res.data; // backend returns created Visitor
};

// ✅ Update an existing visitor
export const updateVisitor = async (
  visitor: Visitor
): Promise<Visitor> => {
  const res = await api.put(`/api/visitors/${visitor.id}`, visitor);
  return res.data; // backend returns updated Visitor
};

// ✅ Delete a visitor
export const deleteVisitor = async (
  id: string
): Promise<{ message: string }> => {
  const res = await api.delete(`/api/visitors/${id}`);
  return res.data; // returns { message: string }
};
