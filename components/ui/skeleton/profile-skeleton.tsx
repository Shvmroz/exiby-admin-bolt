'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* Main Profile Section Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Image Skeleton */}
          <div className="md:col-span-5 flex flex-col items-center">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="h-3 w-32 mt-2" />
            <div className="flex items-center mt-3 space-x-2">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>

          {/* Right Column - Form Fields Skeleton */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <div className="relative">
                    <Skeleton className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons Skeleton */}
            <div className="mt-6 flex justify-end space-x-3">
              <Skeleton className="h-12 w-20 rounded-lg" />
              <Skeleton className="h-12 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;