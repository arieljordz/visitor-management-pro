import type { Pagination } from "@/types/pagination.types";

export interface Visitor {
  id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  fullname?: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorsResponse {
  success: boolean;
  message: string;
  data: {
    visitors: Visitor[];
    pagination: Pagination;
  };
}
