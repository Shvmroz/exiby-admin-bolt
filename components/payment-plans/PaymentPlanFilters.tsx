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
import { Switch } from "@/components/ui/switch";
import { Star, CheckCircle, XCircle, CreditCard, Calendar } from "lucide-react";

interface PaymentPlanFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  billingCycleFilter: string;
  setBillingCycleFilter: (value: string) => void;
  popularOnly: boolean;
  setPopularOnly: (value: boolean) => void;
  createdFrom: string;
  setCreatedFrom: (value: string) => void;
  createdTo: string;
  setCreatedTo: (value: string) => void;
  isDateRangeInvalid: boolean;
}

const PaymentPlanFilters: React.FC<PaymentPlanFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  billingCycleFilter,
  setBillingCycleFilter,
  popularOnly,
  setPopularOnly,
  createdFrom,
  setCreatedFrom,
  createdTo,
  setCreatedTo,
  isDateRangeInvalid,
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
            <SelectItem value="recurring">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                Recurring
              </div>
            </SelectItem>
            <SelectItem value="one-time">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                One time
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Billing Cycle Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Billing Cycle
        </label>
        <Select value={billingCycleFilter} onValueChange={setBillingCycleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by billing cycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cycles</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Created From
        </label>
        <Input
          type="date"
          value={createdFrom}
          onChange={(e) => setCreatedFrom(e.target.value)}
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:bg">
          Created To
        </label>
        <Input
          type="date"
          value={createdTo}
          onChange={(e) => setCreatedTo(e.target.value)}
        />
        {isDateRangeInvalid && (
          <p className="text-xs text-red-500 mt-1">
            End date cannot be earlier than start date
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentPlanFilters;