// hooks/useAppointmentsData.ts
import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import appointmentsService from "@/services/appointments.service";
import type { Appointment, AppointmentsResponse, AppointmentFormData   } from "@/types/appointment.types";
import { useDebouncedValue } from "./useDebouncedValue";

export const useAppointmentsData = () => {
  const queryClient = useQueryClient();

  // ------------------------------
  // Pagination / search / sorting
  // ------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Appointment | "createdAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounced search term
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const handleSort = useCallback(
    (column: keyof Appointment | "createdAt") => {
      setSortOrder((prev) =>
        sortColumn === column ? (prev === "asc" ? "desc" : "asc") : "asc"
      );
      setSortColumn(column);
    },
    [sortColumn]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // ------------------------------
  // Fetch appointments
  // ------------------------------
  const { data, isLoading, isError } = useQuery<AppointmentsResponse, Error>({
    queryKey: [
      "appointments",
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      sortColumn,
      sortOrder,
    ],
    queryFn: async () => {
      const res = await appointmentsService.getAll(
        currentPage,
        itemsPerPage,
        debouncedSearchTerm,
        sortColumn,
        sortOrder
      );
      return res;
    },
    placeholderData: () =>
      queryClient.getQueryData([
        "appointments",
        currentPage - 1,
        itemsPerPage,
        debouncedSearchTerm,
        sortColumn,
        sortOrder,
      ]) as AppointmentsResponse,
  });

  const appointments = data?.data.appointments ?? [];
  const pagination = data?.data.pagination;

  // ------------------------------
  // Modal / editing state
  // ------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openCreateModal = useCallback(() => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  }, []);

  // ------------------------------
  // CRUD handlers
  // ------------------------------
  const handleSaveAppointment = useCallback(
    async (formData: AppointmentFormData) => {
      try {
        if (editingAppointment) {
          await appointmentsService.updateAppointment(editingAppointment.id, formData);
          toast.success("Appointment updated successfully.");
        } else {
          await appointmentsService.createAppointment(formData);
          toast.success("Appointment created successfully.");
        }
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        closeModal();
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
        console.error("❌ Error saving appointment:", err);
      }
    },
    [editingAppointment, closeModal, queryClient]
  );

  const requestDelete = useCallback((id: string) => {
    setConfirmDeleteId(id);
    setIsConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!confirmDeleteId) return;
    try {
      await appointmentsService.deleteAppointment(confirmDeleteId);
      toast.success("Appointment deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (err: unknown) {
      console.error("❌ Error deleting appointment:", err);
      toast.error("Failed to delete appointment.");
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
    appointments,
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
    editingAppointment,
    openCreateModal,
    openEditModal,
    closeModal,

    // Delete
    requestDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,

    // CRUD
    handleSaveAppointment,
  };
};
