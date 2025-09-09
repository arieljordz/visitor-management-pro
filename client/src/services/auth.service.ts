// services/auth.service.ts
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth.types";
import {  User } from "@/types/user.types";

// Configuration
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";
const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  refresh: `${API_BASE_URL}/api/auth/refresh`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  me: `${API_BASE_URL}/api/auth/me`,
} as const;

// Token management
const TOKEN_KEY = "accessToken";

class AuthService {
  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Set access token in localStorage
   */
  setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Remove access token from localStorage
   */
  removeAccessToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Make authenticated API request with automatic token refresh
   */
  private async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getAccessToken();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include", // Include cookies for refresh token
    });

    // If token expired (401), try to refresh and retry
    if (response.status === 401 && token) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        const newToken = this.getAccessToken();
        return fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(newToken && { Authorization: `Bearer ${newToken}` }),
            ...options.headers,
          },
          credentials: "include",
        });
      } else {
        // Refresh failed, user needs to login again
        this.removeAccessToken();
        throw new Error("Session expired. Please login again.");
      }
    }

    return response;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.accessToken) {
        this.setAccessToken(data.accessToken);
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error instanceof Error ? error : new Error("Registration failed");
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.accessToken) {
        this.setAccessToken(data.accessToken);
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error instanceof Error ? error : new Error("Login failed");
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINTS.refresh, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.success && data.accessToken) {
        this.setAccessToken(data.accessToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await fetch(API_ENDPOINTS.logout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always remove token from localStorage
      this.removeAccessToken();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.makeAuthenticatedRequest(API_ENDPOINTS.me);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get user profile");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to get user profile");
      }

      return data.user;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error instanceof Error ? error : new Error("Failed to get user profile");
    }
  }

  /**
   * Check if current access token is valid
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Initialize auth service - check token validity on app start
   */
  async initialize(): Promise<User | null> {
    const token = this.getAccessToken();
    
    if (!token) {
      return null;
    }

    try {
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      // Token invalid, try to refresh
      const refreshed = await this.refreshAccessToken();
      
      if (refreshed) {
        try {
          const user = await this.getCurrentUser();
          return user;
        } catch (refreshError) {
          this.removeAccessToken();
          return null;
        }
      } else {
        this.removeAccessToken();
        return null;
      }
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;