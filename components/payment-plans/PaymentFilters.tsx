'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  DollarSign, 
  Calendar, 
  Users, 
  Building, 
  Clock,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PaymentFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  billingCycleFilter: string;
  setBillingCycleFilter: (value: string) => void;
  popularOnly: boolean;
  setPopularOnly: (value: boolean) => void;
  activeOnly: boolean;
  setActiveOnly: (value: boolean) => void;
  maxEventsRange: number[];
  setMaxEventsRange: (value: number[]) => void;
  maxAttendeesRange: number[];
  setMaxAttendeesRange: (value: number[]) => void;
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  priceRange,
  setPriceRange,
  billingCycleFilter,
  setBillingCycleFilter,
  popularOnly,
  setPopularOnly,
  activeOnly,
  setActiveOnly,
  maxEventsRange,
  setMaxEventsRange,
  maxAttendeesRange,
  setMaxAttendeesRange,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Plans
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Quick Filters
        </h3>
        
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

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Active Plans Only
            </span>
          </div>
          <Switch
            checked={activeOnly}
            onCheckedChange={setActiveOnly}
            className="data-[state=checked]:bg-[#0077ED]"
          />
        </div>
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
        <Select value={billingCycleFilter} onValueChange={setBillingCycleFilter}>
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

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price Range
        </label>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Max Events Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Max Events Range
        </label>
        <div className="space-y-3">
          <Slider
            value={maxEventsRange}
            onValueChange={setMaxEventsRange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{maxEventsRange[0]} events</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{maxEventsRange[1]} events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Max Attendees Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Max Attendees Range
        </label>
        <div className="space-y-3">
          <Slider
            value={maxAttendeesRange}
            onValueChange={setMaxAttendeesRange}
            max={20000}
            min={0}
            step={500}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{maxAttendeesRange[0].toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{maxAttendeesRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Active Filters
        </h3>
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="outline" className="text-xs">
              Search: {searchQuery}
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Status: {statusFilter}
            </Badge>
          )}
          {typeFilter !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Type: {typeFilter}
            </Badge>
          )}
          {billingCycleFilter !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Cycle: {billingCycleFilter}
            </Badge>
          )}
          {popularOnly && (
            <Badge variant="outline" className="text-xs">
              Popular only
            </Badge>
          )}
          {activeOnly && (
            <Badge variant="outline" className="text-xs">
              Active only
            </Badge>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <Badge variant="outline" className="text-xs">
              Price: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </Badge>
          )}
          {(maxEventsRange[0] > 0 || maxEventsRange[1] < 100) && (
            <Badge variant="outline" className="text-xs">
              Events: {maxEventsRange[0]} - {maxEventsRange[1]}
            </Badge>
          )}
          {(maxAttendeesRange[0] > 0 || maxAttendeesRange[1] < 20000) && (
            <Badge variant="outline" className="text-xs">
              Attendees: {maxAttendeesRange[0].toLocaleString()} - {maxAttendeesRange[1].toLocaleString()}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDrawer;