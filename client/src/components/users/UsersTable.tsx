// UsersTable.tsx
import React from "react";
import AdminTable, { Column } from "@/components/ui/AdminTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

interface UsersTableProps {
  data: User[];
  sortColumn: keyof User | "createdAt";
  sortDirection: "asc" | "desc";
  onSort: (column: keyof User | "createdAt") => void;
  onEdit: (data: Partial<User>) => void;
  onDelete: (id: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  data,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}) => {
  const columns: Column[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "role", header: "Role", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (_: any, row: User) => (
        <span>{row.isEmailVerified ? "Active" : "Inactive"}</span>
      ),
    },
    { key: "createdAt", header: "Joined", sortable: true },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: User) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => onDelete(row.id)}
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={data}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
};

export default UsersTable;
