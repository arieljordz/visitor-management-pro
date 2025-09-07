export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  role: string;
  name: string;
  email: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;              // ✅ make sure this is included
  sortColumn?: string;        // ✅ new: backend returns this
  sortOrder?: "asc" | "desc"; // ✅ new: backend returns this
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: Pagination;
  };
}
