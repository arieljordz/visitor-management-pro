// UsersPage.tsx
import React from "react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import AdminCard from "@/components/ui/AdminCard";
import UsersTable from "@/components/users/UsersTable";
import UserStats from "@/components/users/UserStats";
import UserCreateModal from "@/components/users/UserCreateModal";
import { useUsersData } from "@/hooks/useUsersData";
import { Plus } from "lucide-react";
import SearchBar from "@/components/common/SearchBar";
import PaginationControls from "@/components/common/PaginationControls";
import ActionConfirmModal from "@/components/ui/ActionConfirmModal";

const UsersPage: React.FC = () => {
  const {
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
    requestDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,
  } = useUsersData();

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Failed to load users.</p>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground">
          Manage your application users and their permissions.
        </p>
      </div>

      <UserStats
        totalUsers={pagination?.totalUsers ?? 0}
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

        {pagination && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalItems={pagination.totalUsers}
          />
        )}
      </AdminCard>

      <UserCreateModal
        isOpen={isModalOpen}
        editingUser={editingUser}
        onCancel={() => closeModal()}
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

export default UsersPage;
