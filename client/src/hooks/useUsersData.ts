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

export const useUsersData = () => {
  const queryClient = useQueryClient();

  // 🔹 Pagination + search + sorting state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [sortColumn, setSortColumn] = useState<keyof User | "createdAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 🔹 Fetch users with server-side pagination + sorting
  const { data, isLoading, isError } = useQuery<UsersResponse["data"]>({
    queryKey: [
      "users",
      currentPage,
      itemsPerPage,
      searchTerm,
      sortColumn,
      sortOrder,
    ],
    queryFn: async () =>
      (
        await usersService.getAll(
          currentPage,
          itemsPerPage,
          searchTerm,
          sortColumn,
          sortOrder as any
        )
      ).data,
    placeholderData: keepPreviousData, // ✅ replaces keepPreviousData
  });
  console.log("data:", data);
  const users: User[] = data?.users ?? [];
  const pagination = data?.pagination;

  // 🔹 Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  /** 🔹 Modal Handlers */
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

  /** 🔹 Save Handler */
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

        // 🔄 Refresh list
        queryClient.invalidateQueries({ queryKey: ["users"] });
        closeModal();
      } catch (err: any) {
        console.error("❌ Error saving user:", err.message);
        toast.error("Failed to save user.");
      }
    },
    [editingUser, closeModal, queryClient]
  );

  /** 🔹 Sorting Handler */
  const handleSort = useCallback(
    (column: keyof User | "createdAt") => {
      setSortOrder((prev) =>
        sortColumn === column ? (prev === "asc" ? "desc" : "asc") : "asc"
      );
      setSortColumn(column);
    },
    [sortColumn]
  );

  return {
    // Data
    users,
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
    editingUser,
    openCreateModal,
    openEditModal,
    closeModal,

    // Handlers
    handleSaveUser,
    handleSort,
  };
};
