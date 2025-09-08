// hooks/useVisitorsData.ts
import { useState, useCallback } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import visitorsService from "@/services/visitors.service";
import type { Visitor, VisitorsResponse } from "@/types/visitor.types";

export const useVisitorsData = () => {
  const queryClient = useQueryClient();

  // 🔹 Pagination + search + sorting state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [sortColumn, setSortColumn] = useState<keyof Visitor | "createdAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 🔹 Fetch visitors with server-side pagination + sorting
  const { data, isLoading, isError } = useQuery<VisitorsResponse>({
    queryKey: [
      "visitors",
      currentPage,
      itemsPerPage,
      searchTerm,
      sortColumn,
      sortOrder,
    ],
    queryFn: () =>
      visitorsService.getAll(
        currentPage,
        itemsPerPage,
        searchTerm,
        sortColumn,
        sortOrder
      ),
    placeholderData: keepPreviousData,
  });

  const visitors: Visitor[] = data?.data.visitors ?? [];
  const pagination = data?.data.pagination;

  // 🔹 Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  /** 🔹 Modal Handlers */
  const openCreateModal = useCallback(() => {
    setEditingVisitor(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((visitor: Visitor) => {
    setEditingVisitor(visitor);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingVisitor(null);
  }, []);

  /** 🔹 Save Handler */
  const handleSaveVisitor = useCallback(
    async (formData: Partial<Visitor>) => {
      try {
        if (editingVisitor) {
          await visitorsService.updateVisitor(editingVisitor.id, formData);
          toast.success("Visitor updated successfully.");
        } else {
          await visitorsService.createVisitor(formData);
          toast.success("Visitor created successfully.");
        }

        // 🔄 Refresh list
        queryClient.invalidateQueries({ queryKey: ["visitors"] });
        closeModal();
      } catch (err: any) {
        console.error("❌ Error saving visitor:", err.message);
        toast.error(err.message);
      }
    },
    [editingVisitor, closeModal, queryClient]
  );

  /** 🔹 Delete Handler */
  const requestDelete = useCallback((id: string) => {
    setConfirmDeleteId(id);
    setIsConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!confirmDeleteId) return;
    try {
      await visitorsService.deleteVisitor(confirmDeleteId);
      toast.success("Visitor deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    } catch (err: any) {
      console.error("❌ Error deleting visitor:", err.message);
      toast.error("Failed to delete visitor.");
    } finally {
      setIsConfirmOpen(false);
      setConfirmDeleteId(null);
    }
  }, [confirmDeleteId, queryClient]);

  /** 🔹 Sorting Handler */
  const handleSort = useCallback(
    (column: keyof Visitor | "createdAt") => {
      setSortOrder((prev) =>
        sortColumn === column ? (prev === "asc" ? "desc" : "asc") : "asc"
      );
      setSortColumn(column);
    },
    [sortColumn]
  );

  return {
    // Data
    visitors,
    pagination,

    // State
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortColumn,
    sortOrder,

    // Status
    isLoading,
    isError,

    // Modal
    isModalOpen,
    editingVisitor,
    openCreateModal,
    openEditModal,
    closeModal,

    // Handlers
    handleSaveVisitor,
    handleSort,
    requestDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,
  };
};
