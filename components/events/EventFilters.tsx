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
import { CheckCircle, XCircle, Calendar, DollarSign, Globe, MapPin } from "lucide-react";

interface EventFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  venueTypeFilter: string;
  setVenueTypeFilter: (value: string) => void;
  paidOnlyFilter: boolean;
  setPaidOnlyFilter: (value: boolean) => void;
  publicOnlyFilter: boolean;
  setPublicOnlyFilter: (value: boolean) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  venueTypeFilter,
  setVenueTypeFilter,
  paidOnlyFilter,
  setPaidOnlyFilter,
  publicOnlyFilter,
  setPublicOnlyFilter,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Paid Events Only
          </span>
        </div>
        <Switch
          checked={paidOnlyFilter}
          onCheckedChange={setPaidOnlyFilter}
          className="data-[state=checked]:bg-[#0077ED]"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Public Events Only
          </span>
        </div>
        <Switch
          checked={publicOnlyFilter}
          onCheckedChange={setPublicOnlyFilter}
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
            <SelectItem value="published">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Published
              </div>
            </SelectItem>
            <SelectItem value="draft">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
                Draft
              </div>
            </SelectItem>
            <SelectItem value="cancelled">
              <div className="flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                Cancelled
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                Completed
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Venue Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Venue Type
        </label>
        <Select value={venueTypeFilter} onValueChange={setVenueTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by venue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Venue Types</SelectItem>
            <SelectItem value="physical">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                Physical
              </div>
            </SelectItem>
            <SelectItem value="virtual">
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-purple-500" />
                Virtual
              </div>
            </SelectItem>
            <SelectItem value="hybrid">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                Hybrid
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EventFilters;