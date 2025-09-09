import type { Pagination } from "@/types/pagination.types";
import type { Visitor } from "@/types/visitor.types";

export interface Appointment {
  id: string;
  visitorId: Visitor;
  purpose: string;
  visitDate: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentsResponse {
  success: boolean;
  message: string;
  data: {
    appointments: Appointment[];
    pagination: Pagination;
  };
}

export interface AppointmentFormData {
  visitorId: string;
  purpose: string;
  visitDate: string;
  status: "pending" | "approved" | "declined";
}