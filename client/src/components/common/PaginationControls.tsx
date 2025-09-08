// components/common/PaginationControls.tsx
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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
  totalRecords: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const renderPaginationItems = () => {
    const pageNumbers: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pageNumbers.push(i);

      if (currentPage < totalPages - 2) pageNumbers.push("ellipsis");
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((num, idx) =>
      num === "ellipsis" ? (
        <PaginationItem key={`ellipsis-${idx}`}>
          <PaginationEllipsis />
        </PaginationItem>
      ) : (
        <PaginationItem key={num}>
          <PaginationLink
            isActive={currentPage === num}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(num);
            }}
          >
            {num}
          </PaginationLink>
        </PaginationItem>
      )
    );
  };

  return (
    <div className="flex w-full items-center justify-between mt-4 text-sm text-muted-foreground">
      {/* Left: Showing X entries out of Y */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span>Showing</span>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(val) => onItemsPerPageChange(Number(val))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>
          entries out of <strong>{totalRecords}</strong>
        </span>
      </div>

      {/* Right: Pagination numbers */}
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
          )}

          {renderPaginationItems()}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
