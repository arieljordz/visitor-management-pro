// src/hooks/usePagination.ts
import { useState, useMemo } from "react";

export const usePagination = <T>(data: T[], initialItemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // reset to page 1 whenever itemsPerPage changes
  const handleSetItemsPerPage = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage: handleSetItemsPerPage,
    paginatedData,
    totalPages,
  };
};
