// Visitors.tsx
import React from "react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import AdminCard from "@/components/ui/AdminCard";
import VisitorsTable from "@/components/visitors/VisitorTable";
import VisitorStats from "@/components/visitors/VisitorStats";
import VisitorCreateModal from "@/components/visitors/VisitorCreateModal";
import { useVisitorsData } from "@/hooks/useVisitorsData";
import { Plus } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import PaginationControls from "@/components/common/PaginationControls";
import ActionConfirmModal from "@/components/ui/ActionConfirmModal";

const Visitors: React.FC = () => {
  const {
    // Data
    visitors,
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
    editingVisitor,
    openCreateModal,
    openEditModal,
    closeModal,

    // Delete
    requestDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,

    // CRUD
    handleSaveVisitor,
  } = useVisitorsData();

  if (isLoading) return <Spinner fullscreen message="Loading..." />;
  if (isError) return <p>Failed to load visitors.</p>;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Visitors Management"
        description="Manage and monitor detailed visitor information."
      />

      <VisitorStats
        totalVisitors={pagination?.totalRecords ?? 0}
        activeVisitors={0}
        inactiveVisitors={0}
      />

      <AdminCard
        title="Visitors List"
        icon={faUsers}
        headerActions={
          <Button
            onClick={() => openCreateModal()}
            className="bg-primary hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Visitor
          </Button>
        }
      >
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search visitors..."
        />

        <VisitorsTable
          data={visitors}
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

      <VisitorCreateModal
        isOpen={isModalOpen}
        editingVisitor={editingVisitor}
        onCancel={closeModal}
        onSave={handleSaveVisitor}
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

export default Visitors;
