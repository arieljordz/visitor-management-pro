import { create } from "zustand";

export interface ReportVisitor {
  id: string;
  name: string;
  company: string;
  purpose: string;
  hostName: string;
  status: "checked-in" | "checked-out";
  checkInTime: string;
  checkOutTime?: string;
}

interface ReportStats {
  totalVisitors: number;
  checkedIn: number;
  checkedOut: number;
  companies: number;
}

interface ReportStore {
  visitors: ReportVisitor[];
  getDashboardStats: () => ReportStats;
  loading: boolean;
  error: string | null;
  fetchReports: () => void; // mock fetch
}

export const useReportStore = create<ReportStore>((set, get) => ({
  visitors: [
    {
      id: "1",
      name: "John Doe",
      company: "Acme Corp",
      purpose: "Meeting",
      hostName: "Alice",
      status: "checked-in",
      checkInTime: "2025-08-24T09:30:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      company: "TechSoft",
      purpose: "Interview",
      hostName: "Bob",
      status: "checked-out",
      checkInTime: "2025-08-24T10:00:00Z",
      checkOutTime: "2025-08-24T11:15:00Z",
    },
    {
      id: "3",
      name: "Michael Johnson",
      company: "Acme Corp",
      purpose: "Delivery",
      hostName: "Charlie",
      status: "checked-in",
      checkInTime: "2025-08-25T13:45:00Z",
    },
    {
      id: "4",
      name: "Emily Davis",
      company: "Global Solutions",
      purpose: "Consulting",
      hostName: "Diana",
      status: "checked-out",
      checkInTime: "2025-08-25T09:00:00Z",
      checkOutTime: "2025-08-25T12:00:00Z",
    },
  ],

  getDashboardStats: () => {
    const visitors = get().visitors;
    return {
      totalVisitors: visitors.length,
      checkedIn: visitors.filter((v) => v.status === "checked-in").length,
      checkedOut: visitors.filter((v) => v.status === "checked-out").length,
      companies: new Set(visitors.map((v) => v.company)).size,
    };
  },

  loading: false,
  error: null,

  fetchReports: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ loading: false, error: null });
    }, 500); // simulate API delay
  },
}));
