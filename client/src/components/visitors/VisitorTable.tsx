// VisitorTable.tsx
import React from "react";
import AdminTable, { Column } from "@/components/ui/AdminTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import type { Visitor } from "@/types/visitor.types";

interface VisitorTableProps {
  data: Visitor[];
  sortColumn: keyof Visitor | "createdAt";
  sortDirection: "asc" | "desc";
  onSort: (column: keyof Visitor | "createdAt") => void;
  onEdit: (data: Partial<Visitor>) => void;
  onDelete: (id: string) => void;
}

const VisitorTable: React.FC<VisitorTableProps> = ({
  data,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}) => {
  const columns: Column[] = [
    {
      key: "fullname",
      header: "Name",
      sortable: true,
      render: (_: any, row: Visitor) =>
        row.fullname || `${row.firstname} ${row.lastname}`,
    },
    { key: "email", header: "Email", sortable: true },
    { key: "phone", header: "Phone", sortable: true },
    { key: "company", header: "Company", sortable: true },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (_: any, row: Visitor) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Visitor) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400"
            onClick={() => onEdit(row)}
          >
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

export default VisitorTable;
