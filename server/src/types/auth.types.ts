// src/types/auth.types.ts
import { Request } from "express";

// Extend Request interface for authenticated requests
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    name: string;
    email: string;
  };
}
