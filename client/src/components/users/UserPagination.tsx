import React from "react";
import { Button } from "@/components/ui/button";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  totalItems,
}) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="text-sm text-muted-foreground">
      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
      {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
    </div>
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  </div>
);

export default UserPagination;
