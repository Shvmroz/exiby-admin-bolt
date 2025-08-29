'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  content?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onOpenChange,
  title = 'Are you sure?',
  content = 'This action cannot be undone. This will permanently delete the item.',
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
  onConfirm,
  loading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
            {content}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300"
          >
            {cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </div>
            ) : (
              confirmButtonText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;