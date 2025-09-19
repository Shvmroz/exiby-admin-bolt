"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface TeamFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  createdFrom: string;
  setCreatedFrom: (value: string) => void;
  createdTo: string;
  setCreatedTo: (value: string) => void;
  isDateRangeInvalid: boolean;
}

const TeamFilters: React.FC<TeamFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  createdFrom,
  setCreatedFrom,
  createdTo,
  setCreatedTo,
  isDateRangeInvalid,
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

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Start Date
        </label>
        <Input
          type="date"
          value={createdFrom}
          onChange={(e) => setCreatedFrom(e.target.value)}
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          End Date
        </label>
        <Input
          type="date"
          value={createdTo}
          onChange={(e) => setCreatedTo(e.target.value)}
        />
        {isDateRangeInvalid && (
          <div className="flex items-center text-xs text-orange-400 mt-1">
            <AlertTriangle className="w-4 h-4 mr-1 text-orange-400" />
            End date cannot be earlier than start date
          </div>
        )}
      </div>

    
    </div>
  );
};

export default TeamFilters;
