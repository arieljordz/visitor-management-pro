import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserCheck, 
  UserX,
  MoreHorizontal 
} from 'lucide-react';
import { useVisitorStore } from '@/stores/visitorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { VisitorModal } from '@/components/visitors/VisitorModal';
import { Visitor } from '@/types/visitor';
import { useToast } from '@/hooks/use-toast';

export default function Visitors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    getFilteredVisitors,
    deleteVisitor,
    checkInVisitor,
    checkOutVisitor,
  } = useVisitorStore();

  const { toast } = useToast();

  const filteredVisitors = getFilteredVisitors();

  const handleAddVisitor = () => {
    setModalMode('add');
    setSelectedVisitor(null);
    setIsModalOpen(true);
  };

  const handleEditVisitor = (visitor: Visitor) => {
    setModalMode('edit');
    setSelectedVisitor(visitor);
    setIsModalOpen(true);
  };

  const handleDeleteVisitor = (visitor: Visitor) => {
    deleteVisitor(visitor.id);
    toast({
      title: 'Visitor removed',
      description: `${visitor.name} has been removed from the system.`,
    });
  };

  const handleToggleStatus = (visitor: Visitor) => {
    if (visitor.status === 'checked-in') {
      checkOutVisitor(visitor.id);
      toast({
        title: 'Visitor checked out',
        description: `${visitor.name} has been checked out.`,
      });
    } else {
      checkInVisitor(visitor.id);
      toast({
        title: 'Visitor checked in',
        description: `${visitor.name} has been checked in.`,
      });
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

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
        <Button onClick={handleAddVisitor} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Visitor
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {filteredVisitors.length} visitors
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visitors Table */}
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
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id} className="table-row">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {visitor.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {visitor.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {visitor.company}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {visitor.purpose}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {visitor.hostName}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDateTime(visitor.checkInTime)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          visitor.status === 'checked-in'
                            ? 'status-success'
                            : 'status-warning'
                        }
                      >
                        {visitor.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
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
                            onClick={() => handleToggleStatus(visitor)}
                            className="gap-2"
                          >
                            {visitor.status === 'checked-in' ? (
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
                            onClick={() => handleEditVisitor(visitor)}
                            className="gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteVisitor(visitor)}
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

            {filteredVisitors.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No visitors found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Get started by adding your first visitor'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddVisitor} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Visitor
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visitor Modal */}
      <VisitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        visitor={selectedVisitor}
        mode={modalMode}
      />
    </div>
  );
}