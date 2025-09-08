
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;             
  sortColumn?: string;       
  sortOrder?: "asc" | "desc"; 
}
