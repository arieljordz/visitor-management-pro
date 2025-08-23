import { create } from 'zustand';
import { Visitor, User, DashboardStats } from '@/types/visitor';
import { mockVisitors, mockUser } from '@/services/mockData';

interface VisitorStore {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Visitors
  visitors: Visitor[];
  selectedVisitor: Visitor | null;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;

  // Actions
  addVisitor: (visitor: Omit<Visitor, 'id' | 'checkInTime' | 'status'>) => void;
  updateVisitor: (id: string, updates: Partial<Visitor>) => void;
  deleteVisitor: (id: string) => void;
  checkInVisitor: (id: string) => void;
  checkOutVisitor: (id: string) => void;
  setSelectedVisitor: (visitor: Visitor | null) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;

  // Computed
  getFilteredVisitors: () => Visitor[];
  getDashboardStats: () => DashboardStats;
}

export const useVisitorStore = create<VisitorStore>((set, get) => ({
  // Authentication
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Mock authentication - accept any email/password for demo
    if (email && password) {
      set({ user: mockUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  // Visitors
  visitors: mockVisitors,
  selectedVisitor: null,
  searchTerm: '',
  currentPage: 1,
  itemsPerPage: 10,

  // Actions
  addVisitor: (visitorData) => {
    const newVisitor: Visitor = {
      ...visitorData,
      id: Date.now().toString(),
      checkInTime: new Date(),
      status: 'checked-in'
    };
    set((state) => ({
      visitors: [newVisitor, ...state.visitors]
    }));
  },

  updateVisitor: (id, updates) => {
    set((state) => ({
      visitors: state.visitors.map((visitor) =>
        visitor.id === id ? { ...visitor, ...updates } : visitor
      )
    }));
  },

  deleteVisitor: (id) => {
    set((state) => ({
      visitors: state.visitors.filter((visitor) => visitor.id !== id),
      selectedVisitor: state.selectedVisitor?.id === id ? null : state.selectedVisitor
    }));
  },

  checkInVisitor: (id) => {
    set((state) => ({
      visitors: state.visitors.map((visitor) =>
        visitor.id === id
          ? { ...visitor, status: 'checked-in' as const, checkOutTime: undefined }
          : visitor
      )
    }));
  },

  checkOutVisitor: (id) => {
    set((state) => ({
      visitors: state.visitors.map((visitor) =>
        visitor.id === id
          ? { ...visitor, status: 'checked-out' as const, checkOutTime: new Date() }
          : visitor
      )
    }));
  },

  setSelectedVisitor: (visitor) => set({ selectedVisitor: visitor }),
  setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  // Computed
  getFilteredVisitors: () => {
    const { visitors, searchTerm } = get();
    if (!searchTerm) return visitors;
    
    return visitors.filter((visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  getDashboardStats: (): DashboardStats => {
    const { visitors } = get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayVisitors = visitors.filter(
      (visitor) => visitor.checkInTime >= today
    );

    return {
      totalVisitors: visitors.length,
      currentlyInside: visitors.filter((v) => v.status === 'checked-in').length,
      checkedOut: visitors.filter((v) => v.status === 'checked-out').length,
      todayVisitors: todayVisitors.length
    };
  }
}));