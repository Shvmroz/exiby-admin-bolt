'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Filter } from 'lucide-react';

interface CustomDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
  onFilter?: () => void;
  clearButtonText?: string;
  filterButtonText?: string;
  clearButtonIcon?: React.ReactNode;
  filterButtonIcon?: React.ReactNode;
  showClearButton?: boolean;
  showFilterButton?: boolean;
  loading?: boolean;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onOpenChange,
  title,
  children,
  onClear,
  onFilter,
  clearButtonText = 'Clear',
  filterButtonText = 'Apply Filters',
  clearButtonIcon = <RotateCcw className="w-4 h-4" />,
  filterButtonIcon = <Filter className="w-4 h-4" />,
  showClearButton = true,
  showFilterButton = true,
  loading = false,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <Filter className="w-5 h-5 mr-2 text-[#0077ED]" />
            {title}
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {children}
        </div>

        {/* Fixed Footer */}
        <SheetFooter className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {showClearButton && onClear && (
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                disabled={loading}
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {clearButtonIcon && <span className="mr-2">{clearButtonIcon}</span>}
                {clearButtonText}
              </Button>
            )}
            {showFilterButton && onFilter && (
              <Button
                type="button"
                onClick={onFilter}
                disabled={loading}
                className="flex-1 bg-[#0077ED] hover:bg-[#0066CC] text-white"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Applying...
                  </div>
                ) : (
                  <>
                    {filterButtonIcon && <span className="mr-2">{filterButtonIcon}</span>}
                    {filterButtonText}
                  </>
                )}
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CustomDrawer;