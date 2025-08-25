import { useState, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";
import { useAppointmentsStore } from "@/stores/appointmentsStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/types/appointment";
import { AppointmentModal } from "@/components/appointments/AppointmentModal";
import { AppointmentTable } from "@/components/appointments/AppointmentTable";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const itemsPerPage = 5;

  const { isAdmin } = useUserStore();
  const {
    appointments,
    searchTerm,
    message,
    setSearchTerm,
    clearMessage,
    fetchAppointments,
    deleteAppointment,
    approveAppointment,
    declineAppointment,
  } = useAppointmentsStore();

  const { toast } = useToast();

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Show toast on store message change
  useEffect(() => {
    if (message) {
      toast({
        title: message,
        variant: message.toLowerCase().includes("failed")
          ? "destructive"
          : "default",
      });
      clearMessage();
    }
  }, [message, toast, clearMessage]);

  // Filter appointments based on search
  const filteredAppointments = Array.isArray(appointments)
    ? appointments.filter((a) =>
        searchTerm
          ? [a.name, a.hostName, a.purpose].some((field) =>
              field.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : true
      )
    : [];

  // Pagination logic
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (mode: "add" | "edit", appointment?: Appointment) => {
    setModalMode(mode);
    setSelectedAppointment(appointment || null);
    setIsModalOpen(true);
  };

  // Confirm before deleting
  const handleDelete = (appt: Appointment) => {
    setDeleteTarget(appt);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteAppointment(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all appointments
          </p>
        </div>
        {!isAdmin && (
          <Button onClick={() => openModal("add")} className="gap-2">
            <Plus className="h-4 w-4" />
            Request Appointment
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <SearchInput
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1); // Reset to first page on search
            }}
            placeholder="Search appointments..."
          />
        </CardContent>
      </Card>

      {/* Appointment Table */}
      <Card className="card-elevated relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            All Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentTable
            appointments={paginatedAppointments}
            isAdmin={isAdmin}
            onEdit={(appt) => openModal("edit", appt)}
            onDelete={handleDelete}
            onApprove={(appt) => approveAppointment(appt.id)}
            onDecline={(appt) => declineAppointment(appt.id)}
          />

          {/* Pagination */}
          <Pagination
            totalItems={filteredAppointments.length}
            itemsPerPage={5}
            maxPageButtons={5}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </CardContent>
      </Card>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        mode={modalMode}
      />

      {/* Confirmation Modal for Deletion */}
      {deleteTarget && (
        <ConfirmationModal
          isOpen={true}
          title="Confirm Delete"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
