export type Status = "checked-in" | "checked-out";

// src/types/visitor.ts
export interface Visitor {
  id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  fullname: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitRecord {
  id: string;
  date: Date;
  purpose: string;
  checkInTime: Date;
  checkOutTime?: Date;
  hostName: string;
}
