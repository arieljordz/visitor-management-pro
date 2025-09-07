import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faSearch, 
  faPlus, 
  faEdit, 
  faTrash,
  faEye,
  faUserCheck,
  faUserTimes
} from '@fortawesome/free-solid-svg-icons';
import AdminCard from '../components/ui/AdminCard';
import AdminTable, { Column } from '../components/ui/AdminTable';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  joinDate: string;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample user data
  const [users] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: '2024-01-15', joinDate: '2023-06-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', lastLogin: '2024-01-14', joinDate: '2023-08-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'inactive', lastLogin: '2024-01-10', joinDate: '2023-09-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Editor', status: 'active', lastLogin: '2024-01-15', joinDate: '2023-07-05' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'User', status: 'pending', lastLogin: 'Never', joinDate: '2024-01-15' },
    { id: 6, name: 'Lisa Davis', email: 'lisa@example.com', role: 'Admin', status: 'active', lastLogin: '2024-01-13', joinDate: '2023-05-12' },
    { id: 7, name: 'David Miller', email: 'david@example.com', role: 'User', status: 'active', lastLogin: '2024-01-12', joinDate: '2023-11-08' },
    { id: 8, name: 'Amy Taylor', email: 'amy@example.com', role: 'Editor', status: 'inactive', lastLogin: '2024-01-08', joinDate: '2023-10-22' },
  ]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn as keyof User];
        const bValue = b[sortColumn as keyof User];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, searchTerm, sortColumn, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline'
    };
    
    const colors: Record<string, string> = {
      active: 'text-success',
      inactive: 'text-muted-foreground',
      pending: 'text-warning'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: Column[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      sortable: true,
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground">Manage your application users and their permissions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-primary mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUserCheck} className="h-5 w-5 text-success mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUserTimes} className="h-5 w-5 text-destructive mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-warning mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'pending').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <AdminCard 
        title="Users List" 
        icon={faUsers}
        headerActions={
          <Button className="bg-primary hover:bg-primary-hover">
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      >
        {/* Search and Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={paginatedUsers}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} entries
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default Users;