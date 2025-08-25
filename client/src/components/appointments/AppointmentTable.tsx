import React from "react";
import { Edit2, Trash2, Check, X, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppointmentTableProps } from "@/types/appointment";
import {
  toLocalDatetimeString,
  toUTCISOString,
  formatDateTimePH,
  formatDatePH,
  getStatusClass,
} from "@/helpers/commonHelpers";

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  isAdmin,
  onEdit,
  onDelete,
  onApprove,
  onDecline,
}) => {
  const renderActions = (appt: (typeof appointments)[0]) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {/* Dropdown menu width auto-adjusts */}
      <DropdownMenuContent
        align="end"
        className="inline-block w-auto min-w-[180px] p-2"
      >
        <div className="flex flex-col gap-2">
          {!isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => onEdit(appt)}
                className="gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(appt)}
                className="gap-2 bg-red-50 hover:bg-red-100 text-red-700 rounded"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && appt.status === "pending" && (
            <>
              <DropdownMenuItem
                onClick={() => onApprove(appt)}
                className="gap-2 bg-green-50 hover:bg-green-100 text-green-700 rounded"
              >
                <Check className="h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDecline(appt)}
                className="gap-2 bg-red-50 hover:bg-red-100 text-red-700 rounded"
              >
                <X className="h-4 w-4" />
                Decline
              </DropdownMenuItem>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="rounded-lg border border-card-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="table-header">
            <TableHead>Visitor</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Visit Date</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt, index) => (
            <TableRow key={index + 1} className="table-row">
              <TableCell>{appt.name}</TableCell>
              <TableCell>{appt.company}</TableCell>
              <TableCell>{appt.phone}</TableCell>
              <TableCell>{appt.hostName}</TableCell>
              <TableCell>{appt.purpose}</TableCell>
              <TableCell>{formatDateTimePH(appt.visitDate)}</TableCell>
              <TableCell>
                <span className={getStatusClass(appt.status)}>
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>{formatDatePH(appt.appointmentDate)}</TableCell>
              <TableCell className="text-right">
                {renderActions(appt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            No appointments found
          </h3>
        </div>
      )}
    </div>
  );
};
