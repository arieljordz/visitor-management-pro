import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

export interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface AdminTableProps {
  columns: Column[];
  data: any[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const AdminTable: React.FC<AdminTableProps> = ({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = 'No data available'
}) => {
  const handleSort = (column: string) => {
    if (onSort) {
      onSort(column);
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return faSort;
    return sortDirection === 'asc' ? faSortUp : faSortDown;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-sm font-medium text-muted-foreground ${
                  column.sortable ? 'cursor-pointer hover:text-foreground' : ''
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && (
                    <FontAwesomeIcon 
                      icon={getSortIcon(column.key)} 
                      className="ml-2 h-3 w-3"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-muted/50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;