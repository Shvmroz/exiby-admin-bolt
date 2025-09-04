'use client';

import React from 'react';
import CustomTable, { TableHeader, MenuOption } from '@/components/ui/custom-table';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Trash2, Clock, AlertTriangle } from 'lucide-react';

interface SoftDeleteTableProps<T> {
  data: T[];
  TABLE_HEAD: TableHeader[];
  loading?: boolean;
  emptyMessage?: string;
  onRestore: (item: T) => void;
  onPermanentDelete: (item: T) => void;
  renderCell: (item: T, header: TableHeader) => React.ReactNode;
  getItemName: (item: T) => string;
  getDeletedAt: (item: T) => string;
  getDaysUntilPermanentDelete: (item: T) => number;
  restoreLoading?: boolean;
  deleteLoading?: boolean;
  // Pagination props
  pagination: {
    total_count: number;
    rows_per_page: number;
    page: number;
    handleChangePage: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
  };
}

function SoftDeleteTable<T extends { _id: string }>({
  data,
  TABLE_HEAD,
  loading = false,
  emptyMessage = "No deleted items found",
  onRestore,
  onPermanentDelete,
  renderCell,
  getItemName,
  getDeletedAt,
  getDaysUntilPermanentDelete,
  restoreLoading = false,
  deleteLoading = false,
  pagination,
}: SoftDeleteTableProps<T>) {
  const [restoreDialog, setRestoreDialog] = React.useState<{
    open: boolean;
    item: T | null;
  }>({ open: false, item: null });
  
  const [permanentDeleteDialog, setPermanentDeleteDialog] = React.useState<{
    open: boolean;
    item: T | null;
  }>({ open: false, item: null });

  const handleRestore = (item: T) => {
    setRestoreDialog({ open: true, item });
  };

  const handlePermanentDelete = (item: T) => {
    setPermanentDeleteDialog({ open: true, item });
  };

  const confirmRestore = () => {
    if (restoreDialog.item) {
      onRestore(restoreDialog.item);
      setRestoreDialog({ open: false, item: null });
    }
  };

  const confirmPermanentDelete = () => {
    if (permanentDeleteDialog.item) {
      onPermanentDelete(permanentDeleteDialog.item);
      setPermanentDeleteDialog({ open: false, item: null });
    }
  };

  const getDaysLeftBadge = (daysLeft: number) => {
    if (daysLeft <= 3) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {daysLeft} days left
        </Badge>
      );
    } else if (daysLeft <= 7) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          {daysLeft} days left
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          {daysLeft} days left
        </Badge>
      );
    }
  };

  // Enhanced table headers with soft delete specific columns
  const enhancedTableHead: TableHeader[] = [
    ...TABLE_HEAD.filter(header => header.key !== 'action'), // Remove original action column
    { key: 'deleted_at', label: 'Deleted At', type: 'custom' },
    { key: 'days_left', label: 'Days Until Permanent Delete', type: 'custom' },
    { key: 'restore', label: 'Restore', type: 'custom', width: 'w-24' },
    { key: 'permanent_delete', label: 'Permanent Delete', type: 'custom', width: 'w-32' },
  ];

  const enhancedRenderCell = (item: T, header: TableHeader) => {
    switch (header.key) {
      case 'deleted_at':
        return (
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {new Date(getDeletedAt(item)).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        );

      case 'days_left':
        return getDaysLeftBadge(getDaysUntilPermanentDelete(item));

      case 'restore':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRestore(item);
            }}
            disabled={restoreLoading}
            className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Restore
          </Button>
        );

      case 'permanent_delete':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handlePermanentDelete(item);
            }}
            disabled={deleteLoading}
            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        );

      default:
        return renderCell(item, header);
    }
  };

  const totalPages = Math.ceil(pagination.total_count / pagination.rows_per_page);

  return (
    <>
      <CustomTable
        data={data}
        TABLE_HEAD={enhancedTableHead}
        MENU_OPTIONS={[]} // No menu options for soft delete table
        custom_pagination={pagination}
        pageCount={pagination.rows_per_page}
        totalPages={totalPages}
        handleChangePages={pagination.handleChangePage}
        selected={[]}
        setSelected={() => {}}
        checkbox_selection={false}
        renderCell={enhancedRenderCell}
        loading={loading}
        emptyMessage={emptyMessage}
      />

      {/* Restore Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={restoreDialog.open}
        onOpenChange={(open) => setRestoreDialog({ open, item: null })}
        title="Restore Item"
        content={`Are you sure you want to restore "${restoreDialog.item ? getItemName(restoreDialog.item) : ''}"? This will move the item back to the active list.`}
        confirmButtonText="Restore"
        cancelButtonText="Cancel"
        onConfirm={confirmRestore}
        loading={restoreLoading}
      />

      {/* Permanent Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={permanentDeleteDialog.open}
        onOpenChange={(open) => setPermanentDeleteDialog({ open, item: null })}
        title="Permanent Delete"
        content={`Are you sure you want to permanently delete "${permanentDeleteDialog.item ? getItemName(permanentDeleteDialog.item) : ''}"? This action cannot be undone and will completely remove all data.`}
        confirmButtonText="Permanently Delete"
        cancelButtonText="Cancel"
        onConfirm={confirmPermanentDelete}
        loading={deleteLoading}
      />
    </>
  );
}

export default SoftDeleteTable;