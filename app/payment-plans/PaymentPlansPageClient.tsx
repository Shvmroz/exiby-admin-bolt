"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Users,
  Building,
  Star,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import CustomTable, {
  TableHeader,
  MenuOption,
} from "@/components/ui/custom-table";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import PaymentPlanEditDialog from "@/components/payment-plans/PaymentPlanEditDialog";
import PaymentPlanCreateDialog from "@/components/payment-plans/PaymentPlanCreateDialog";
import CustomDrawer from "@/components/ui/custom-drawer";
import PaymentFilters from "@/components/payment-plans/PaymentFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CsvExportDialog from "@/components/ui/csv-export-dialog";

import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { useSnackbar } from "notistack";
import { _payment_plans_list_api } from "@/DAL/paymentPlanAPI";

interface PaymentPlan {
  _id: string;
  plan_name: string;
  description: string;
  plan_type: string;
  billing_cycle: string;
  price: number;
  currency: string;
  max_events: number;
  max_attendees: number;
  max_companies: number;
  is_active: boolean;
  is_popular: boolean;
  trial_days: number;
  target_audience?: string;
  created_at: string;
  deleted_at?: string;
  is_deleted?: boolean;
}

const PaymentPlansPageClient: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    plan: PaymentPlan | null;
  }>({ open: false, plan: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    plan: PaymentPlan | null;
  }>({ open: false, plan: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Local pagination (handled fully by frontend)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const [filtersApplied, setFiltersApplied] = useState({
    search: "",
    sort_by: "createdAt",
    sort_order: "desc",
    page: 1,
    limit: 50,
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // Table helpers
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1); // reset to first page
  };

  const TABLE_HEAD: TableHeader[] = [
    {
      key: "index",
      label: "#",
      renderData: (_row, rowIndex) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {rowIndex !== undefined ? rowIndex + 1 : "-"}.
        </span>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      renderData: (plan) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {plan.plan_name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {plan.description.length > 50
                ? `${plan.description.substring(0, 50)}...`
                : plan.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "pricing",
      label: "Pricing",
      renderData: (plan) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(plan.price, plan.currency)}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            per {plan.billing_cycle}
          </div>
        </div>
      ),
    },
    {
      key: "max_events",
      label: "Max Events",
      renderData: (plan) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {plan.max_events}
          </span>
        </div>
      ),
    },
    {
      key: "max_attendees",
      label: "Max Attendees",
      renderData: (plan) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {plan.max_attendees.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "max_companies",
      label: "Max Companies",
      renderData: (plan) => (
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-orange-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {plan.max_companies}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderData: (plan) => getStatusBadge(plan.is_active, plan.is_popular),
    },
    {
      key: "trial_days",
      label: "Trial",
      renderData: (plan) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {plan.trial_days} days
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      renderData: (plan) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(plan.created_at)}
        </span>
      ),
    },
    {
      key: "action",
      label: "",
      type: "action",
      width: "w-12",
    },
  ];

  // Load payment plans
  const getPaymentPlansList = async (
    searchQuery?: string,
    filters?: { status?: string; created_from?: string; created_to?: string }
  ) => {
    setLoading(true);
    try {
      const apiFilters = {
        status: filters?.status ?? "",
        created_from: filters?.created_from ?? "",
        created_to: filters?.created_to ?? "",
      };

      // Call API with search query and filters
      const result = await _payment_plans_list_api(
        currentPage,
        rowsPerPage,
        searchQuery || "",
        apiFilters
      );

      if (result?.code === 200) {
        setPaymentPlans(result.data.payment_plans || []);
        setTotalCount(result.data.total_count);
        setTotalPages(result.data.total_pages);
        // setFiltersApplied(result.data.filters_applied || filtersApplied);
      } else {
        enqueueSnackbar(
          result?.message || "Failed to load list of payment plans",
          {
            variant: "error",
          }
        );
        setPaymentPlans([]);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Something went wrong", { variant: "error" });
      setPaymentPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentPlansList();
  }, [searchQuery, currentPage, rowsPerPage]);

  if (loading && paymentPlans.length === 0) {
    return <TableSkeleton rows={8} columns={8} showFilters={true} />;
  }

  const handleEdit = (plan: PaymentPlan) => {
    setEditDialog({ open: true, plan });
  };

  const handleDelete = (plan: PaymentPlan) => {
    setDeleteDialog({ open: true, plan });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.plan) return;

    setDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Remove plan permanently
      setPaymentPlans((prev) =>
        prev.filter((plan) => plan._id !== deleteDialog.plan!._id)
      );

      // Update total count
      setTotalCount((prev) => prev - 1);
      setTotalPages(Math.ceil((totalCount - 1) / rowsPerPage));

      setDeleteDialog({ open: false, plan: null });
    } catch (error) {
      console.error("Error deleting payment plan:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (updatedPlan: PaymentPlan) => {
    setEditLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state
      setPaymentPlans((prev) =>
        prev.map((plan) => (plan._id === updatedPlan._id ? updatedPlan : plan))
      );

      setEditDialog({ open: false, plan: null });
    } catch (error) {
      console.error("Error updating payment plan:", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (newPlan: PaymentPlan) => {
    setCreateLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add to local state
      setPaymentPlans((prev) => [newPlan, ...prev]);
      setTotalCount((prev) => prev + 1);
      setTotalPages(Math.ceil((totalCount + 1) / rowsPerPage));

      setCreateDialog(false);
    } catch (error) {
      console.error("Error creating payment plan:", error);
    } finally {
      setCreateLoading(false);
    }
  };


  // filters
  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );


  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count += 1;
    if (createdFrom) count += 1;
    if (createdTo) count += 1;
    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setCreatedFrom("");
    setCreatedTo("");
    getAllTeamList();
    setFilterDrawerOpen(false);
  };

  const handleApplyFilters = async () => {
    setFilterLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredData = dummyData.data.payment_plans;

      if (statusFilter !== "all") {
        const isActive = statusFilter === "active";
        filteredData = filteredData.filter(
          (plan) => plan.is_active === isActive
        );
      }

      if (typeFilter !== "all") {
        filteredData = filteredData.filter(
          (plan) => plan.plan_type === typeFilter
        );
      }

      if (billingCycleFilter !== "all") {
        filteredData = filteredData.filter(
          (plan) => plan.billing_cycle === billingCycleFilter
        );
      }

      if (popularOnly) {
        filteredData = filteredData.filter((plan) => plan.is_popular);
      }

      setPaymentPlans(filteredData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
      setFilterDrawerOpen(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  const MENU_OPTIONS: MenuOption[] = [
    {
      label: "Edit",
      action: handleEdit,
      icon: <Edit className="w-4 h-4" />,
    },
    {
      label: "Delete",
      action: handleDelete,
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
    },
  ];

  const getStatusBadge = (isActive: boolean, isPopular: boolean) => {
    return (
      <div className="flex items-center space-x-2">
        {isActive ? (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        )}
        {isPopular && (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage subscription plans and pricing for your platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setExportDialog(true)}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Plan
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search payment plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setFilterDrawerOpen(true)}
              variant="outline"
              className="relative border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {getAppliedFiltersCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs px-2">
                  {getAppliedFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Plans Table */}
      <CustomTable
        data={paymentPlans}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={MENU_OPTIONS}
        custom_pagination={{
          total_count: totalCount,
          rows_per_page: rowsPerPage,
          page: currentPage,
          handleChangePage,
          onRowsPerPageChange,
        }}
        totalPages={totalPages}
        loading={loading}
        emptyMessage="No payment plans found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, plan: null })}
        title="Delete Payment Plan"
        content={`Are you sure you want to delete "${deleteDialog.plan?.plan_name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Payment Plan Dialog */}
      <PaymentPlanEditDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, plan: null })}
        plan={editDialog.plan}
        onSaveEdit={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Payment Plan Dialog */}
      <PaymentPlanCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleCreate}
        loading={createLoading}
      />

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="payment_plans"
        title="Payment Plans"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Payment Plans"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
      >
        <PaymentFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          createdFrom={createdFrom}
          setCreatedFrom={setCreatedFrom}
          createdTo={createdTo}
          setCreatedTo={setCreatedTo}
          isDateRangeInvalid={isDateRangeInvalid}
        />
      </CustomDrawer>
    </div>
  );
};

export default PaymentPlansPageClient;
