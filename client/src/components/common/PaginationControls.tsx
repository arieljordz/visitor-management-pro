// src/components/common/PaginationControls.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  totalItems: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
}) => (
  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="text-sm text-muted-foreground">
      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
      {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
    </div>

    <div className="flex items-center gap-3">
      {/* Page size selector */}
      <span className="text-sm text-muted-foreground">Show</span>
      <Select
        value={String(itemsPerPage)}
        onValueChange={(val) => setItemsPerPage(Number(val))}
      >
        <SelectTrigger className="w-[80px] h-8 px-2 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="text-sm">
          {[5, 10, 25, 50].map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Prev/Next */}
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
  </div>
);

export default PaginationControls;
