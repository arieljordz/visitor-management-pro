// types/auth.types.ts
import type { User } from "@/types/user.types";

// Form data interfaces
export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Auth response from backend
export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: User;
}

// Token payload
export interface TokenPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  getCurrentUser: () => Promise<User>;
}

// API error response
export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Auth states for UI
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}