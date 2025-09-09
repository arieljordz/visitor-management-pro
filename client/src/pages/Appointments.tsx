// Appointments.tsx
import React from "react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import AdminCard from "@/components/ui/AdminCard";
import AppointmentsTable from "@/components/appointments/AppointmentTable";
import AppointmentStats from "@/components/appointments/AppointmentStats";
import AppointmentCreateModal from "@/components/appointments/AppointmentCreateModal";
import { useAppointmentsData } from "@/hooks/useAppointmentsData";
import { useVisitorsData } from "@/hooks/useVisitorsData";
import { Plus } from "lucide-react";
import Spinner from "@/components/ui/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import PaginationControls from "@/components/common/PaginationControls";
import ActionConfirmModal from "@/components/ui/ActionConfirmModal";

const Appointments: React.FC = () => {
  const {
    // Data
    appointments,
    pagination,

    // Loading / error
    isLoading,
    isError,

    // Pagination / search / sort
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
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
  } = useAppointmentsData();
  const { visitors } = useVisitorsData();

  if (isLoading) return <Spinner fullscreen message="Loading..." />;
  if (isError) return <p>Failed to load appointments.</p>;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Appointments Management"
        description="Manage and monitor detailed appointment information."
      />

      <AppointmentStats
        totalAppointments={pagination?.totalRecords ?? 0}
        activeAppointments={0}
        inactiveAppointments={0}
      />

      <AdminCard
        title="Appointments List"
        icon={faUsers}
        headerActions={
          <Button
            onClick={() => openCreateModal()}
            className="bg-primary hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Appointment
          </Button>
        }
      >
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search appointments..."
        />

        <AppointmentsTable
          data={appointments}
          sortColumn={sortColumn}
          sortDirection={sortOrder}
          onSort={handleSort}
          onEdit={openEditModal}
          onDelete={requestDelete}
        />

        {/* ✅ Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalRecords={pagination.totalRecords}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </AdminCard>

      <AppointmentCreateModal
        isOpen={isModalOpen}
        editingAppointment={editingAppointment}
        visitors={visitors}
        onCancel={closeModal}
        onSave={handleSaveAppointment}
      />

      <ActionConfirmModal
        isOpen={isConfirmOpen}
        type="delete"
        message="Are you sure you want to delete?"
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Appointments;
