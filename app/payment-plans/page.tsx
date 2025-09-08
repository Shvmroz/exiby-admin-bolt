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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SoftDeleteTable from "@/components/ui/soft-delete-table";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";

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

// Dummy data
const dummyData = {
  data: {
    payment_plans: [
      {
        _id: "plan_123",
        plan_name: "Starter Plan",
        description:
          "Perfect for small organizations getting started with event management",
        plan_type: "recurring",
        billing_cycle: "monthly",
        price: 29,
        currency: "USD",
        max_events: 5,
        max_attendees: 500,
        max_companies: 10,
        is_active: true,
        is_popular: false,
        trial_days: 14,
        target_audience: "Small Organizations",
        created_at: "2025-08-15T10:30:00.000Z",
      },
      {
        _id: "plan_124",
        plan_name: "Professional Plan",
        description:
          "Ideal for growing organizations with moderate event needs",
        plan_type: "recurring",
        billing_cycle: "monthly",
        price: 99,
        currency: "USD",
        max_events: 20,
        max_attendees: 2000,
        max_companies: 50,
        is_active: true,
        is_popular: true,
        trial_days: 14,
        target_audience: "Medium Organizations",
        created_at: "2025-08-10T14:20:00.000Z",
      },
      {
        _id: "plan_125",
        plan_name: "Enterprise Plan",
        description:
          "Perfect for large organizations with extensive event requirements",
        plan_type: "recurring",
        billing_cycle: "monthly",
        price: 299,
        currency: "USD",
        max_events: 50,
        max_attendees: 10000,
        max_companies: 500,
        is_active: true,
        is_popular: false,
        trial_days: 14,
        target_audience: "Large Organizations",
        created_at: "2025-08-05T09:15:00.000Z",
      },
      {
        _id: "plan_126",
        plan_name: "Basic Plan",
        description: "Entry-level plan for testing and small events",
        plan_type: "recurring",
        billing_cycle: "monthly",
        price: 9,
        currency: "USD",
        max_events: 2,
        max_attendees: 100,
        max_companies: 5,
        is_active: false,
        is_popular: false,
        trial_days: 7,
        target_audience: "Individuals",
        created_at: "2025-07-28T16:45:00.000Z",
      },
      {
        _id: "plan_127",
        plan_name: "Annual Starter",
        description: "Starter plan with annual billing for better savings",
        plan_type: "recurring",
        billing_cycle: "yearly",
        price: 290,
        currency: "USD",
        max_events: 5,
        max_attendees: 500,
        max_companies: 10,
        is_active: true,
        is_popular: false,
        trial_days: 30,
        target_audience: "Small Organizations",
        created_at: "2025-07-20T11:30:00.000Z",
      },
    ],
    deleted_plans: [],
    total: 5,
  },
};

const TABLE_HEAD: TableHeader[] = [
  { key: "plan", label: "Plan", type: "custom" },
  { key: "pricing", label: "Pricing", type: "custom" },
  { key: "max_events", label: "Max Events", type: "custom" },
  { key: "max_attendees", label: "Max Attendees", type: "custom" },
  { key: "max_companies", label: "Max Companies", type: "custom" },
  { key: "status", label: "Status", type: "custom" },
  { key: "trial_days", label: "Trial", type: "custom" },
  { key: "created_at", label: "Created", type: "custom" },
  { key: "action", label: "", type: "action", width: "w-12" },
];

const PaymentPlansPage: React.FC = () => {
  const router = useRouter();
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [deletedPlans, setDeletedPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [permanentDeleteLoading, setPermanentDeleteLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  // filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [billingCycleFilter, setBillingCycleFilter] = useState("all");
  const [popularOnly, setPopularOnly] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // Load payment plans
  const loadPaymentPlans = async (includeDeleted = false) => {
    if (includeDeleted) {
      setDeletedLoading(true);
    } else {
      setLoading(true);
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let filteredData = includeDeleted
        ? deletedPlans // ✅ keep state
        : dummyData.data.payment_plans;

      if (searchQuery) {
        filteredData = filteredData.filter(
          (plan) =>
            plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            plan.target_audience
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      if (includeDeleted) {
        setDeletedPlans(filteredData);
      } else {
        setPaymentPlans(filteredData);
        setPagination((prev) => ({ ...prev, total: filteredData.length }));
      }
    } catch (error) {
      console.error(
        `Error loading ${includeDeleted ? "deleted" : "active"} payment plans:`,
        error
      );
    } finally {
      if (includeDeleted) {
        setDeletedLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === "all") {
      loadPaymentPlans(false);
    } else if (activeTab === "deleted") {
      loadPaymentPlans(true);
    }
  }, [searchQuery, pagination.page, pagination.limit, activeTab]);

  if (loading && paymentPlans.length === 0) {
    return <TableSkeleton rows={8} columns={8} showFilters={true} />;
  }

  const handleChangePage = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

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

      // Move to deleted plans (soft delete)
      const deletedPlan = {
        ...deleteDialog.plan,
        deleted_at: new Date().toISOString(),
        is_deleted: true,
      };

      setDeletedPlans((prev) => [deletedPlan, ...prev]); // ✅ adds in real-time
      setPaymentPlans((prev) =>
        prev.filter((plan) => plan._id !== deleteDialog.plan!._id)
      );

      // Update pagination total
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));

      setDeleteDialog({ open: false, plan: null });
    } catch (error) {
      console.error("Error deleting payment plan:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async (plan: PaymentPlan) => {
    setRestoreLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Remove deleted_at and is_deleted properties
      const { deleted_at, is_deleted, ...restoredPlan } = plan;

      // Move back to active plans
      setPaymentPlans((prev) => [restoredPlan, ...prev]);
      setDeletedPlans((prev) => prev.filter((p) => p._id !== plan._id));
    } catch (error) {
      console.error("Error restoring payment plan:", error);
    } finally {
      setRestoreLoading(false);
    }
  };

  const handlePermanentDelete = async (plan: PaymentPlan) => {
    setPermanentDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Remove from deleted plans permanently
      setDeletedPlans((prev) => prev.filter((p) => p._id !== plan._id));
    } catch (error) {
      console.error("Error permanently deleting payment plan:", error);
    } finally {
      setPermanentDeleteLoading(false);
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
      setPagination((prev) => ({ ...prev, total: prev.total + 1 }));

      setCreateDialog(false);
    } catch (error) {
      console.error("Error creating payment plan:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  // Helper to count active filters
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (typeFilter !== "all") count++;
    if (billingCycleFilter !== "all") count++;
    if (popularOnly) count++;
    return count;
  };

  const handleClearFilters = () => {
    // Reset all filters
    setStatusFilter("all");
    setTypeFilter("all");
    setBillingCycleFilter("all");
    setPopularOnly(false);
    setPaymentPlans(dummyData.data.payment_plans);
    setPagination((prev) => ({
      ...prev,
      total: dummyData.data.payment_plans.length,
    }));
    setFilterDrawerOpen(false);
    setFilterLoading(false);
  };

  // Helper functions for soft delete table
  const getItemName = (plan: PaymentPlan) => plan.plan_name;

  const getDeletedAt = (plan: PaymentPlan) => plan.deleted_at || "";

  const getDaysUntilPermanentDelete = (plan: PaymentPlan) => {
    if (!plan.deleted_at) return 30;

    const deletedDate = new Date(plan.deleted_at);
    const permanentDeleteDate = new Date(
      deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000
    ); // 30 days
    const now = new Date();
    const daysLeft = Math.ceil(
      (permanentDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    );

    return Math.max(0, daysLeft);
  };

  // Pagination for deleted plans
  const deletedPagination = {
    total_count: deletedPlans.length,
    rows_per_page: pagination.limit,
    page: pagination.page,
    handleChangePage,
    onRowsPerPageChange,
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
      setPagination((prev) => ({ ...prev, total: filteredData.length }));
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

  const renderCell = (plan: PaymentPlan, header: TableHeader) => {
    switch (header.key) {
      case "plan":
        return (
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
        );

      case "pricing":
        return (
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
        );

      case "max_events":
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {plan.max_events}
            </span>
          </div>
        );

      case "max_attendees":
        return (
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {plan.max_attendees.toLocaleString()}
            </span>
          </div>
        );

      case "max_companies":
        return (
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {plan.max_companies}
            </span>
          </div>
        );

      case "status":
        return getStatusBadge(plan.is_active, plan.is_popular);

      case "trial_days":
        return (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {plan.trial_days} days
            </span>
          </div>
        );

      case "created_at":
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(plan.created_at)}
          </span>
        );

      default:
        return <span>{plan[header.key as keyof PaymentPlan] as string}</span>;
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

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
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Plans ({paymentPlans.length})
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:text-red-500"
            value="deleted"
          >
            Deleted Plans ({deletedPlans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <CustomTable
            data={paymentPlans}
            TABLE_HEAD={TABLE_HEAD}
            MENU_OPTIONS={MENU_OPTIONS}
            custom_pagination={{
              total_count: pagination.total,
              rows_per_page: pagination.limit,
              page: pagination.page,
              handleChangePage,
              onRowsPerPageChange,
            }}
            pageCount={pagination.limit}
            totalPages={totalPages}
            handleChangePages={handleChangePage}
            selected={selected}
            setSelected={setSelected}
            checkbox_selection={true}
            renderCell={renderCell}
            loading={loading}
            emptyMessage="No payment plans found"
          />
        </TabsContent>

        <TabsContent value="deleted" className="space-y-6">
          <SoftDeleteTable
            data={deletedPlans}
            TABLE_HEAD={TABLE_HEAD}
            loading={deletedLoading}
            emptyMessage="No deleted payment plans found"
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
            renderCell={renderCell}
            getItemName={getItemName}
            getDeletedAt={getDeletedAt}
            getDaysUntilPermanentDelete={getDaysUntilPermanentDelete}
            restoreLoading={restoreLoading}
            deleteLoading={permanentDeleteLoading}
            pagination={deletedPagination}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, plan: null })}
        title="Move to Deleted Plans"
        content={`Are you sure you want to move "${deleteDialog.plan?.plan_name}" to deleted plans? You can restore it within 30 days before it's permanently deleted.`}
        confirmButtonText="Move to Deleted"
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
          popularOnly={popularOnly}
          setPopularOnly={setPopularOnly}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          billingCycleFilter={billingCycleFilter}
          setBillingCycleFilter={setBillingCycleFilter}
        />
      </CustomDrawer>
    </div>
  );
};

export default PaymentPlansPage;
