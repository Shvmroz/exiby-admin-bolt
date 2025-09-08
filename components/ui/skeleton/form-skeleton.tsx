'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface FormSkeletonProps {
  fields?: number;
  showHeader?: boolean;
  showActions?: boolean;
  columns?: 1 | 2;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 6,
  showHeader = true,
  showActions = true,
  columns = 2,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          {showActions && <Skeleton className="h-10 w-32" />}
        </div>
      )}

      {/* Form Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="w-5 h-5 mr-2" />
            <Skeleton className="h-6 w-40" />
          </div>
          
          <div className="space-y-6">
            <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : ''} gap-6`}>
              {Array.from({ length: fields }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <div className="relative">
                    <Skeleton className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>

            {/* Large Text Area */}
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>

            {/* Last Updated Info */}
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <div className="relative">
                <Skeleton className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;