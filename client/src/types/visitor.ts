
export type Status = "checked-in" | "checked-out";

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;
  hostName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: Status;
  photo?: string;
  visitHistory?: VisitRecord[];
}

export interface VisitRecord {
  id: string;
  date: Date;
  purpose: string;
  checkInTime: Date;
  checkOutTime?: Date;
  hostName: string;
}
