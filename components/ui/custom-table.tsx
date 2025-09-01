'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface TableHeader {
  key: string;
  label: string;
  type?: 'text' | 'action' | 'custom';
  sortable?: boolean;
  width?: string;
}

export interface MenuOption {
  label: string;
  action: (item: any) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export interface PaginationConfig {
  total_count: number;
  rows_per_page: number;
  page: number;
  handleChangePage: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

interface CustomTableProps {
  data: any[];
  TABLE_HEAD: TableHeader[];
  MENU_OPTIONS: MenuOption[];
  custom_pagination: PaginationConfig;
  pageCount: number;
  totalPages: number;
  handleChangePages: (page: number) => void;
  selected: string[];
  setSelected: (selected: string[]) => void;
  checkbox_selection?: boolean;
  onRowClick?: (item: any) => void;
  renderCell?: (item: any, header: TableHeader) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  data,
  TABLE_HEAD,
  MENU_OPTIONS,
  custom_pagination,
  pageCount,
  totalPages,
  handleChangePages,
  selected,
  setSelected,
  checkbox_selection = false,
  onRowClick,
  renderCell,
  loading = false,
  emptyMessage = 'No data available',
}) => {
  const { total_count, rows_per_page, page, handleChangePage, onRowsPerPageChange } = custom_pagination;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(data.map(item => item._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter(selectedId => selectedId !== id));
    }
  };

  const isAllSelected = data.length > 0 && selected.length === data.length;
  const isIndeterminate = selected.length > 0 && selected.length < data.length;

  const startItem = (page - 1) * rows_per_page + 1;
  const endItem = Math.min(page * rows_per_page, total_count);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077ED] mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700/50">
              {checkbox_selection && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(ref) => {
                      if (ref) ref.indeterminate = isIndeterminate;
                    }}
                  />
                </TableHead>
              )}
              {TABLE_HEAD.map((header) => (
                <TableHead
                  key={header.key}
                  className={`text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${header.width || ''}`}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={TABLE_HEAD.length + (checkbox_selection ? 1 : 0)}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(item)}
                >
                  {checkbox_selection && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.includes(item._id)}
                        onCheckedChange={(checked) => handleSelectRow(item._id, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {TABLE_HEAD.map((header) => (
                    <TableCell key={header.key} className="py-4">
                      {header.type === 'action' ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {MENU_OPTIONS.map((option, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={() => option.action(item)}
                                  className={option.variant === 'destructive' ? 'text-red-600' : ''}
                                >
                                  {option.icon && <span className="mr-2">{option.icon}</span>}
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : renderCell ? (
                        renderCell(item, header)
                      ) : (
                        <span className="text-gray-900 dark:text-white">
                          {item[header.key]}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startItem} to {endItem} of {total_count} results
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
              <Select
                value={rows_per_page.toString()}
                onValueChange={(value) => onRowsPerPageChange(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChangePage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;