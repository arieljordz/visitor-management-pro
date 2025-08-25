// src/pages/Visitors.tsx
import { useState, useEffect } from "react";
import { User, Plus } from "lucide-react";
import { useVisitorStore } from "@/stores/visitorStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Visitor } from "@/types/visitor";
import { VisitorModal } from "@/components/visitors/VisitorModal";
import { VisitorTable } from "@/components/visitors/VisitorTable";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

export default function Visitors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Visitor | null>(null);
  const itemsPerPage = 5;

  const { isAdmin } = useUserStore();
  const {
    visitors,
    total,
    searchTerm,
    message,
    setSearchTerm,
    clearMessage,
    fetchVisitors,
    searchVisitors,
    deleteVisitor,
  } = useVisitorStore();

  const { toast } = useToast();

  // Fetch visitors on mount + when page changes
  useEffect(() => {
    fetchVisitors(currentPage, itemsPerPage);
  }, [fetchVisitors, currentPage]);

  // Show toast on store message (errors/success)
  useEffect(() => {
    if (message) {
      toast({
        title: "Notice",
        description: message,
        variant: message.toLowerCase().includes("error")
          ? "destructive"
          : "default",
      });
      clearMessage();
    }
  }, [message, toast, clearMessage]);

  // Filter visitors based on search
  const filteredData = Array.isArray(visitors)
    ? visitors.filter((v) => {
        if (!searchTerm) return true;

        const lowerSearch = searchTerm.toLowerCase();

        return [v.fullname, v.firstname, v.lastname, v.email, v.company].some(
          (field) => (field ?? "").toLowerCase().includes(lowerSearch)
        );
      })
    : [];

  // Pagination logic
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Open modal for add/edit
  const openModal = (mode: "add" | "edit", visitor?: Visitor) => {
    setModalMode(mode);
    setSelectedVisitor(visitor || null);
    setIsModalOpen(true);
  };

  // Confirm delete
  const handleDelete = (visitor: Visitor) => {
    setDeleteTarget(visitor);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteVisitor(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Visitors</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all visitor activities
          </p>
        </div>
        {!isAdmin && (
          <Button onClick={() => openModal("add")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Visitor
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
              setCurrentPage(1);
            }}
            placeholder="Search visitors..."
          />
        </CardContent>
      </Card>

      {/* Visitors Table */}
      <Card className="card-elevated relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            All Visitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorTable
            visitors={paginatedData}
            isAdmin={isAdmin}
            onEdit={(v: any) => openModal("edit", v)}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <Pagination
            totalItems={total}
            itemsPerPage={itemsPerPage}
            maxPageButtons={5}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </CardContent>
      </Card>

      {/* Visitor Modal */}
      <VisitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        visitor={selectedVisitor}
        mode={modalMode}
      />

      {/* Confirmation Modal for Delete */}
      {deleteTarget && (
        <ConfirmationModal
          isOpen={true}
          title="Confirm Delete"
          message={`Are you sure you want to delete ${deleteTarget.fullname}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
