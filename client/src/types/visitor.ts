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
  status: 'checked-in' | 'checked-out';
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'receptionist';
}

export interface DashboardStats {
  totalVisitors: number;
  currentlyInside: number;
  checkedOut: number;
  todayVisitors: number;
}