import type { Appointment, AppointmentsResponse, AppointmentFormData } from "@/types/appointment.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_ENDPOINTS = {
  appointments: `${API_BASE_URL}/api/appointments`,
  stats: `${API_BASE_URL}/api/appointments/stats`,
  profile: `${API_BASE_URL}/api/appointments/profile`,
} as const;

class AppointmentsService {
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

  /** Create appointment (admin) */
  async createAppointment(payload: AppointmentFormData): Promise<AppointmentFormData> {
    const res = await this.makeAuthenticatedRequest(API_ENDPOINTS.appointments, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data: AppointmentFormData = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to create appointment");
    return data;
  }

  /** Get all appointments (with pagination + search + role + sorting) */
  async getAll(
    page = 1,
    limit = 10,
    search = "",
    sortColumn = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<AppointmentsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortColumn,
      sortOrder,
    });

    if (search) params.append("search", search);

    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.appointments}?${params.toString()}`
    );
    const data: AppointmentsResponse = await res.json();

    if (!res.ok)
      throw new Error((data as any).message || "Failed to fetch appointments");
    return data;
  }

  /** Get appointment by ID (admin) */
  async getById(id: string): Promise<Appointment> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.appointments}/${id}`
    );
    const data: Appointment = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to fetch appointment");
    return data;
  }

  /** Update appointment by ID (admin) */
  async updateAppointment(id: string, payload: AppointmentFormData): Promise<Appointment> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.appointments}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    console.log("Updateres:", res);
    const data: Appointment = await res.json();
    if (!res.ok)
      throw new Error((data as any).message || "Failed to update appointment");
    return data;
  }

  /** Delete appointment by ID (admin) */
  async deleteAppointment(id: string): Promise<void> {
    const res = await this.makeAuthenticatedRequest(
      `${API_ENDPOINTS.appointments}/${id}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete appointment");
    }
  }
}

// Export singleton instance
export const appointmentsService = new AppointmentsService();
export default appointmentsService;
