import { create } from "zustand";

interface DashboardStats {
  totalVisitors: number;
  currentlyInside: number;
  checkedOut: number;
  todayVisitors: number;
}

interface Visitor {
  id: string;
  name: string;
  status: "checked-in" | "checked-out";
  company: string;
  purpose: string;
  checkInTime: string;
}

interface DashboardStore {
  stats: DashboardStats;
  recentVisitors: Visitor[];
  loading: boolean;
  error: string | null;
  fetchDashboardStats: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: {
    totalVisitors: 120,
    currentlyInside: 15,
    checkedOut: 95,
    todayVisitors: 10,
  },
  recentVisitors: [
    {
      id: "1",
      name: "Alice Johnson",
      status: "checked-in",
      company: "TechCorp",
      purpose: "Meeting",
      checkInTime: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Bob Smith",
      status: "checked-out",
      company: "Global Inc.",
      purpose: "Interview",
      checkInTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "3",
      name: "Charlie Davis",
      status: "checked-in",
      company: "StartupHub",
      purpose: "Delivery",
      checkInTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "4",
      name: "Diana Lee",
      status: "checked-out",
      company: "BizSolutions",
      purpose: "Consultation",
      checkInTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: "5",
      name: "Ethan Clark",
      status: "checked-in",
      company: "NextGen",
      purpose: "Maintenance",
      checkInTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ],
  loading: false,
  error: null,

  fetchDashboardStats: () => {
    // static mock; later replace with API call
    set((state) => ({
      stats: state.stats,
      recentVisitors: state.recentVisitors,
      loading: false,
      error: null,
    }));
  },
}));
