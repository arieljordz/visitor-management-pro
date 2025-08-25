import React from "react";
import { Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { Visitor } from "@/types/visitor";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getStatusClass, formatDateTimePH } from "@/helpers/commonHelpers";

interface VisitorTableProps {
  visitors: Visitor[];
  isAdmin: boolean;
  onEdit: (visitor: Visitor) => void;
  onDelete: (visitor: Visitor) => void;
}

export const VisitorTable: React.FC<VisitorTableProps> = ({
  visitors,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  // -----------------------------
  // Render Actions Menu
  // -----------------------------
  const renderActions = (visitor: Visitor) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="inline-block w-auto min-w-[160px] p-2"
      >
        <div className="flex flex-col gap-2">
          <DropdownMenuItem
            onClick={() => onEdit(visitor)}
            className="gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(visitor)}
            className="gap-2 bg-red-50 hover:bg-red-100 text-red-700 rounded"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // -----------------------------
  // Render Table
  // -----------------------------
  return (
    <div className="rounded-lg border border-card-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="table-header">
            <TableHead>Visitor</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visitors?.map((visitor, index) => (
            <TableRow key={index + 1} className="table-row">
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">
                    {visitor?.fullname}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {visitor?.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>{visitor?.company || "-"}</TableCell>
              <TableCell>{visitor?.phone || "-"}</TableCell>
              <TableCell>{visitor?.hostId || "-"}</TableCell>
              <TableCell>{visitor?.address || "-"}</TableCell>
              <TableCell>
                <span className={getStatusClass("")}>
                  {visitor?.address
                    ? visitor?.address.charAt(0).toUpperCase() +
                      visitor?.address.slice(1)
                    : "Unknown"}
                </span>
              </TableCell>
              <TableCell>
                {visitor?.createdAt
                  ? formatDateTimePH(visitor?.createdAt)
                  : "-"}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">{renderActions(visitor)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {visitors?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            No visitors found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or add a new visitor.
          </p>
        </div>
      )}
    </div>
  );
};
