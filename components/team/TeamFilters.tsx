'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, XCircle, Users } from 'lucide-react';

interface TeamFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  activeOnly: boolean;
  setActiveOnly: (value: boolean) => void;
}

const TeamFilters: React.FC<TeamFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  activeOnly,
  setActiveOnly,
}) => {
  return (
    <div className="space-y-6">

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Active
              </div>
            </SelectItem>
            <SelectItem value="inactive">
              <div className="flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                Inactive
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TeamFilters;