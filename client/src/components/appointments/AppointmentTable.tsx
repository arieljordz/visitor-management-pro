// AppointmentTable.tsx
import React from "react";
import AdminTable, { Column } from "@/components/ui/AdminTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import type { Appointment } from "@/types/appointment.types";

interface AppointmentTableProps {
  data: Appointment[];
  sortColumn: keyof Appointment | "createdAt";
  sortDirection: "asc" | "desc";
  onSort: (column: keyof Appointment | "createdAt") => void;
  onEdit: (data: Appointment) => void;
  onDelete: (id: string) => void;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  data,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}) => {
  const columns: Column[] = [
    {
      key: "visitor",
      header: "Name",
      sortable: true,
      render: (_: any, row: Appointment) =>
        row.visitorId?.fullname ||
        `${row.visitorId?.firstname} ${row.visitorId?.lastname}`,
    },
    {
      key: "visitorEmail",
      header: "Email",
      sortable: false,
      render: (_: any, row: Appointment) => row.visitorId?.email,
    },
    {
      key: "visitorPhone",
      header: "Phone",
      sortable: false,
      render: (_: any, row: Appointment) => row.visitorId?.phone,
    },
    {
      key: "visitorCompany",
      header: "Company",
      sortable: false,
      render: (_: any, row: Appointment) => row.visitorId?.company || "-",
    },
    {
      key: "purpose",
      header: "Purpose",
      sortable: true,
      render: (_: any, row: Appointment) => row.purpose,
    },
    {
      key: "visitDate",
      header: "Visit Date",
      sortable: true,
      render: (_: any, row: Appointment) => formatDate(row.visitDate),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (_: any, row: Appointment) => formatDate(row.createdAt),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (_: any, row: Appointment) =>
        row.status.charAt(0).toUpperCase() + row.status.slice(1),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Appointment) => (
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

export default AppointmentTable;
