import type { User, UsersResponse } from "@/types/user.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_ENDPOINTS = {
  users: `${API_BASE_URL}/api/users`,
  stats: `${API_BASE_URL}/api/users/stats`,
  profile: `${API_BASE_URL}/api/users/profile`,
} as const;

class UsersService {
  private async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
    });

    if (response.status === 401 && token) {
      throw new Error("Unauthorized");
    }

    return response;
  }

  /** Create user (admin) */
  async createUser(payload: Partial<User>): Promise<User> {
    const res = await this.makeAuthenticatedRequest(API_ENDPOINTS.users, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data: User = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to create user");
    return data;
  }

  /** Get all users (with pagination + search + role + sorting) */
  async getAll(
    page = 1,
    limit = 10,
    search = "",
    sortColumn = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<UsersResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortColumn,
      sortOrder,
    });

    if (search) params.append("search", search);

    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.users}?${params.toString()}`
    );
    const data: UsersResponse = await res.json();

    if (!res.ok)
      throw new Error((data as any).message || "Failed to fetch users");
    return data;
  }

  /** Get user by ID (admin) */
  async getById(id: string): Promise<User> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.users}/${id}`
    );
    const data: User = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to fetch user");
    return data;
  }

  /** Update user by ID (admin) */
  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.users}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    console.log("Updateres:", res);
    const data: User = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to update user");
    return data;
  }

  /** Delete user by ID (admin) */
  async deleteUser(id: string): Promise<void> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.users}/${id}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete user");
    }
  }

  /** Toggle user status (admin) */
  async toggleStatus(id: string): Promise<User> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.users}/${id}/toggle-status`,
      { method: "PATCH" }
    );
    const data: User = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to toggle status");
    return data;
  }

  /** Get current profile */
  async getProfile(): Promise<User> {
    const res = await this.makeAuthenticatedRequest(API_ENDPOINTS.profile);
    const data: User = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to fetch profile");
    return data;
  }

  /** Update profile */
  async updateProfile(payload: Partial<User>): Promise<User> {
    const res = await this.makeAuthenticatedRequest(API_ENDPOINTS.profile, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data: User = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to update profile");
    return data;
  }

  /** Change password */
  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.profile}/change-password`,
      { method: "PATCH", body: JSON.stringify(payload) }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to change password");
    }
  }

  /** Delete current account */
  async deleteAccount(): Promise<void> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.profile}/account`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete account");
    }
  }
}

// Export singleton instance
export const usersService = new UsersService();
export default usersService;
