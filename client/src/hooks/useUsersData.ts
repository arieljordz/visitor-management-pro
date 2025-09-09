// hooks/useUsersData.ts
import { useState, useCallback } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usersService } from "@/services/users.service";
import type { User, UsersResponse } from "@/types/user.types";
import { useDebouncedValue } from "./useDebouncedValue";

export const useUsersData = () => {
  const queryClient = useQueryClient();

  // ------------------------------
  // Pagination / search / sorting
  // ------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof User | "createdAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounced search
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const handleSort = useCallback(
    (column: keyof User | "createdAt") => {
      setSortOrder((prev) =>
        sortColumn === column ? (prev === "asc" ? "desc" : "asc") : "asc"
      );
      setSortColumn(column);
    },
    [sortColumn]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // reset page when searching
  }, []);

  // ------------------------------
  // Fetch users
  // ------------------------------
  const { data, isLoading, isError } = useQuery<UsersResponse["data"], Error>({
    queryKey: [
      "users",
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      sortColumn,
      sortOrder,
    ],
    queryFn: async () => {
      const res = await usersService.getAll(
        currentPage,
        itemsPerPage,
        debouncedSearchTerm,
        sortColumn,
        sortOrder as any
      );
      return res.data;
    },
    placeholderData: () =>
      queryClient.getQueryData([
        "users",
        currentPage - 1,
        itemsPerPage,
        debouncedSearchTerm,
        sortColumn,
        sortOrder,
      ]) as UsersResponse["data"],
  });

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  // ------------------------------
  // Modal / editing state
  // ------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openCreateModal = useCallback(() => {
    setEditingUser(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
  }, []);

  // ------------------------------
  // CRUD handlers
  // ------------------------------
  const handleSaveUser = useCallback(
    async (formData: Partial<User>) => {
      try {
        if (editingUser) {
          await usersService.updateUser(editingUser.id, formData);
          toast.success("User updated successfully.");
        } else {
          await usersService.createUser(formData);
          toast.success("User created successfully.");
        }
        queryClient.invalidateQueries({ queryKey: ["users"] });
        closeModal();
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
        console.error("❌ Error saving user:", err);
      }
    },
    [editingUser, closeModal, queryClient]
  );

  const requestDelete = useCallback((id: string) => {
    setConfirmDeleteId(id);
    setIsConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!confirmDeleteId) return;
    try {
      await usersService.deleteUser(confirmDeleteId);
      toast.success("User deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err: unknown) {
      console.error("❌ Error deleting user:", err);
      toast.error("Failed to delete user.");
    } finally {
      setConfirmDeleteId(null);
      setIsConfirmOpen(false);
    }
  }, [confirmDeleteId, queryClient]);

  // ------------------------------
  // Return values
  // ------------------------------
  return {
    // Data
    users,
    pagination,

    // Loading / error
    isLoading,
    isError,

    // Pagination / search / sort
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    handleSearchChange,
    sortColumn,
    sortOrder,
    handleSort,

    // Modal / editing
    isModalOpen,
    editingUser,
    openCreateModal,
    openEditModal,
    closeModal,

    // Delete
    requestDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,

    // CRUD
    handleSaveUser,
  };
};
