import {
  Users,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Visitor } from "@/types/visitor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VisitorTableProps {
  visitors: Visitor[];
  searchTerm: string;
  onAddVisitor: () => void;
  onEditVisitor: (visitor: Visitor) => void;
  onDeleteVisitor: (visitor: Visitor) => void;
  onToggleStatus: (visitor: Visitor) => void;
}

export default function VisitorTable({
  visitors,
  searchTerm,
  onAddVisitor,
  onEditVisitor,
  onDeleteVisitor,
  onToggleStatus,
}: VisitorTableProps) {
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          All Visitors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-card-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Visitor</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((visitor) => (
                <TableRow key={visitor.id} className="table-row">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {visitor.company}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {visitor.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{visitor.company}</TableCell>
                  <TableCell>{visitor.company}</TableCell>
                  <TableCell>{visitor.company}</TableCell>
                  {/* <TableCell>{formatDateTime(visitor.checkInTime)}</TableCell> */}
                  <TableCell>
                    <span
                      className={
                        visitor.company === "checked-in"
                          ? "status-success"
                          : "status-warning"
                      }
                    >
                      {visitor.company === "checked-in"
                        ? "Checked In"
                        : "Checked Out"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(visitor)}
                          className="gap-2"
                        >
                          {visitor.company === "checked-in" ? (
                            <>
                              <UserX className="h-4 w-4" />
                              Check Out
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" />
                              Check In
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditVisitor(visitor)}
                          className="gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteVisitor(visitor)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Visitor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {visitors.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No visitors found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first visitor"}
              </p>
              {!searchTerm && (
                <Button onClick={onAddVisitor} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Visitor
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
