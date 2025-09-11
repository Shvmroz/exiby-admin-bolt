"use client";

import React from "react";
import CustomTable, { TableHeader } from "@/components/ui/custom-table";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2, Clock, AlertTriangle } from "lucide-react";

interface SoftDeleteTableProps<T> {
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRestore: (item: T) => void;
  onPermanentDelete: (item: T) => void;
  getItemName: (item: T) => string;
  getDeletedAt: (item: T) => string;
  getDaysUntilPermanentDelete: (item: T) => number;
  restoreLoading?: boolean;
  deleteLoading?: boolean;
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
  loading = false,
  emptyMessage = "No deleted items found",
  onRestore,
  onPermanentDelete,
  getItemName,
  getDeletedAt,
  getDaysUntilPermanentDelete,
  restoreLoading = false,
  deleteLoading = false,
  pagination,
}: SoftDeleteTableProps<T>) {
  const [restoreDialog, setRestoreDialog] = React.useState<{ open: boolean; item: T | null }>({ open: false, item: null });
  const [permanentDeleteDialog, setPermanentDeleteDialog] = React.useState<{ open: boolean; item: T | null }>({ open: false, item: null });

  const handleRestore = (item: T) => setRestoreDialog({ open: true, item });
  const handlePermanentDelete = (item: T) => setPermanentDeleteDialog({ open: true, item });

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

  // Table headers with renderData for SoftDeleteTable
  const TABLE_HEAD: TableHeader[] = [
    {
      key: "index",
      label: "#",
      renderData: (_item, index) => <span className="text-gray-500 dark:text-gray-400 text-sm">{index !== undefined ? index + 1 : "-"}</span>,
    },
    {
      key: "name",
      label: "Item",
      renderData: (item) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="font-medium text-gray-800 dark:text-gray-200">{getItemName(item)}</span>
        </div>
      ),
    },
    {
      key: "deleted_at",
      label: "Deleted At",
      renderData: (item) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {new Date(getDeletedAt(item)).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "days_left",
      label: "Days Until Permanent Delete",
      renderData: (item) => getDaysLeftBadge(getDaysUntilPermanentDelete(item)),
    },
    {
      key: "restore",
      label: "Restore",
      width: "w-24",
      renderData: (item) => (
        <Badge
          onClick={(e) => {
            e.stopPropagation();
            handleRestore(item);
          }}
          className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Restore
        </Badge>
      ),
    },
    {
      key: "permanent_delete",
      label: "Permanent Delete",
      width: "w-32",
      renderData: (item) => (
        <Badge
          onClick={(e) => {
            e.stopPropagation();
            handlePermanentDelete(item);
          }}
          className="cursor-pointer bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Delete Permanently
        </Badge>
      ),
    },
  ];

  const totalPages = Math.ceil(pagination.total_count / pagination.rows_per_page);

  return (
    <>
      <CustomTable
        data={data}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={[]}
        custom_pagination={pagination}
        pageCount={pagination.rows_per_page}
        totalPages={totalPages}
        handleChangePages={pagination.handleChangePage}
        loading={loading}
        emptyMessage={emptyMessage}
      />

      {/* Restore Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={restoreDialog.open}
        onOpenChange={(open) => setRestoreDialog({ open, item: null })}
        title="Restore Item"
        content={`Are you sure you want to restore "${restoreDialog.item ? getItemName(restoreDialog.item) : ""}"? This will move the item back to the active list.`}
        confirmButtonClass="bg-green-600 hover:bg-green-700 text-white"
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
        content={`Are you sure you want to permanently delete "${permanentDeleteDialog.item ? getItemName(permanentDeleteDialog.item) : ""}"? This action cannot be undone and will completely remove all data.`}
        confirmButtonText="Permanently Delete"
        cancelButtonText="Cancel"
        onConfirm={confirmPermanentDelete}
        loading={deleteLoading}
      />
    </>
  );
}

export default SoftDeleteTable;
