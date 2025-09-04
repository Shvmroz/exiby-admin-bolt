"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Star, CheckCircle, XCircle } from "lucide-react";

interface PaymentFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  popularOnly: boolean;
  setPopularOnly: (value: boolean) => void;
  billingCycleFilter: string;
  setBillingCycleFilter: (value: string) => void;
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  popularOnly,
  setPopularOnly,
  billingCycleFilter,
  setBillingCycleFilter,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Popular Plans Only
          </span>
        </div>
        <Switch
          checked={popularOnly}
          onCheckedChange={setPopularOnly}
          className="data-[state=checked]:bg-[#0077ED]"
        />
      </div>

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

      {/* Plan Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Plan Type
        </label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="recurring">Recurring</SelectItem>
            <SelectItem value="one-time">One-time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Billing Cycle Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Billing Cycle
        </label>
        <Select
          value={billingCycleFilter}
          onValueChange={setBillingCycleFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by billing cycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cycles</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PaymentFilters;
