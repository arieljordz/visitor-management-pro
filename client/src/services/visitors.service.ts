import type { Visitor, VisitorsResponse } from "@/types/visitor.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_ENDPOINTS = {
  visitors: `${API_BASE_URL}/api/visitors`,
  stats: `${API_BASE_URL}/api/visitors/stats`,
  profile: `${API_BASE_URL}/api/visitors/profile`,
} as const;

class VisitorsService {
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

  /** Create visitor (admin) */
  async createVisitor(payload: Partial<Visitor>): Promise<Visitor> {
    const res = await this.makeAuthenticatedRequest(API_ENDPOINTS.visitors, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data: Visitor = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to create visitor");
    return data;
  }

  /** Get all visitors (with pagination + search + role + sorting) */
  async getAll(
    page = 1,
    limit = 10,
    search = "",
    sortColumn = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<VisitorsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortColumn,
      sortOrder,
    });

    if (search) params.append("search", search);

    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.visitors}?${params.toString()}`
    );
    const data: VisitorsResponse = await res.json();

    if (!res.ok)
      throw new Error((data as any).message || "Failed to fetch visitors");
    return data;
  }

  /** Get visitor by ID (admin) */
  async getById(id: string): Promise<Visitor> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.visitors}/${id}`
    );
    const data: Visitor = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to fetch visitor");
    return data;
  }

  /** Update visitor by ID (admin) */
  async updateVisitor(id: string, payload: Partial<Visitor>): Promise<Visitor> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.visitors}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    console.log("Updateres:", res);
    const data: Visitor = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to update visitor");
    return data;
  }

  /** Delete visitor by ID (admin) */
  async deleteVisitor(id: string): Promise<void> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.visitors}/${id}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete visitor");
    }
  }
}

// Export singleton instance
export const visitorsService = new VisitorsService();
export default visitorsService;
