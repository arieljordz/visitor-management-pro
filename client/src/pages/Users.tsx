// Users.tsx
import React from "react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import AdminCard from "@/components/ui/AdminCard";
import UsersTable from "@/components/users/UserTable";
import UserStats from "@/components/users/UserStats";
import UserCreateModal from "@/components/users/UserCreateModal";
import { useUsersData } from "@/hooks/useUsersData";
import { Plus } from "lucide-react";
import Spinner from "@/components/ui/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import PaginationControls from "@/components/common/PaginationControls";
import ActionConfirmModal from "@/components/ui/ActionConfirmModal";

const Users: React.FC = () => {
  const {
     // Data
    users,
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
  } = useUsersData();

  if (isLoading) return  <Spinner fullscreen message="Loading..." />;
  if (isError) return <p>Failed to load users.</p>;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Users Management"
        description="Manage your application users and their permissions."
      />

      <UserStats
        totalUsers={pagination?.totalRecords ?? 0}
        activeUsers={0}
        inactiveUsers={0}
      />

      <AdminCard
        title="Users List"
        icon={faUsers}
        headerActions={
          <Button
            onClick={() => openCreateModal()}
            className="bg-primary hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add User
          </Button>
        }
      >
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search users..."
        />

        <UsersTable
          data={users}
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

      <UserCreateModal
        isOpen={isModalOpen}
        editingUser={editingUser}
        onCancel={closeModal}
        onSave={handleSaveUser}
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

export default Users;
