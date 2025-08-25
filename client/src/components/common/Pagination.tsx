import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  maxPageButtons?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage = 5,
  maxPageButtons = 5,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  if (totalPages <= 1) return null;

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    let start = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let end = start + maxPageButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxPageButtons + 1, 1);
    }

    if (start > 1) pages.push(1, "...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) pages.push("...", totalPages);

    return pages;
  };

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-4 flex-wrap">
      {/* Entries info */}
      <div className="text-sm text-muted-foreground">
        Showing {startEntry} to {endEntry} of {totalItems} entries
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="rounded-l-md !rounded-r-none"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-1 select-none">
              ...
            </span>
          ) : (
            <Button
              key={page}
              size="sm"
              variant={page === currentPage ? "default" : "outline"}
              className="!rounded-none"
              onClick={() => setCurrentPage(Number(page))}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          className="rounded-r-md !rounded-l-none"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
