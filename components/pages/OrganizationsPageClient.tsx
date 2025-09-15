'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Users,
  DollarSign,
  Building,
} from 'lucide-react';
import CustomTable, { TableHeader, MenuOption } from '@/components/ui/custom-table';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import OrganizationEditDialog from '@/components/organizations/OrganizationEditDialog';
import OrganizationCreateDialog from '@/components/organizations/OrganizationCreateDialog';
import OrganizationDetailView from '@/components/organizations/OrganizationDetailView';
import CustomDrawer from '@/components/ui/custom-drawer';
import OrganizationFilters from '@/components/organizations/OrganizationFilters';
import SoftDeleteTable from '@/components/ui/soft-delete-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CsvExportDialog from '@/components/ui/csv-export-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TableSkeleton from '@/components/ui/skeleton/table-skeleton';

interface Organization {
  _id: string;
  orgn_user: {
    _id: string;
    name: string;
  };
  bio: {
    description: string;
    website: string;
  };
  category: string;
  subscription_status: string;
  subscription_start: string;
  subscription_end: string;
  status: boolean;
  total_events: number;
  total_companies: number;
  total_revenue: number;
  total_attendees: number;
  created_at: string;
  deleted_at?: string;
  is_deleted?: boolean;
}

// Dummy data
const dummyData = {
  data: {
    organizations: [
      {
        _id: "org_123",
        orgn_user: { _id: "orguser_456", name: "TechCorp Events" },
        bio: { description: "Leading tech event organizer", website: "https://techcorp.com" },
        category: "organization",
        subscription_status: "active",
        subscription_start: "2025-08-01T00:00:00.000Z",
        subscription_end: "2025-09-01T00:00:00.000Z",
        status: true,
        total_events: 25,
        total_companies: 150,
        total_revenue: 125000,
        total_attendees: 5000,
        created_at: "2025-07-15T10:30:00.000Z"
      },
      {
        _id: "org_124",
        orgn_user: { _id: "orguser_457", name: "Innovation Labs" },
        bio: { description: "Cutting-edge innovation events", website: "https://innovationlabs.io" },
        category: "company",
        subscription_status: "active",
        subscription_start: "2025-07-15T00:00:00.000Z",
        subscription_end: "2025-08-15T00:00:00.000Z",
        status: true,
        total_events: 18,
        total_companies: 89,
        total_revenue: 95000,
        total_attendees: 3200,
        created_at: "2025-07-10T14:20:00.000Z"
      },
      {
        _id: "org_125",
        orgn_user: { _id: "orguser_458", name: "StartupHub" },
        bio: { description: "Startup networking and pitch events", website: "https://startuphub.com" },
        category: "organization",
        subscription_status: "inactive",
        subscription_start: "2025-06-01T00:00:00.000Z",
        subscription_end: "2025-07-01T00:00:00.000Z",
        status: false,
        total_events: 12,
        total_companies: 45,
        total_revenue: 67000,
        total_attendees: 1800,
        created_at: "2025-06-05T09:15:00.000Z"
      },
      {
        _id: "org_126",
        orgn_user: { _id: "orguser_459", name: "Digital Summit Co" },
        bio: { description: "Digital transformation conferences", website: "https://digitalsummit.co" },
        category: "company",
        subscription_status: "active",
        subscription_start: "2025-07-20T00:00:00.000Z",
        subscription_end: "2025-08-20T00:00:00.000Z",
        status: true,
        total_events: 15,
        total_companies: 78,
        total_revenue: 89000,
        total_attendees: 2500,
        created_at: "2025-07-01T16:45:00.000Z"
      },
      {
        _id: "org_127",
        orgn_user: { _id: "orguser_460", name: "Event Masters" },
        bio: { description: "Professional event management services", website: "https://eventmasters.com" },
        category: "organization",
        subscription_status: "pending",
        subscription_start: "2025-08-10T00:00:00.000Z",
        subscription_end: "2025-09-10T00:00:00.000Z",
        status: true,
        total_events: 8,
        total_companies: 32,
        total_revenue: 45000,
        total_attendees: 1200,
        created_at: "2025-07-25T11:30:00.000Z"
      }
    ],
    total: 150,
    page: 1,
    limit: 20
  }
};



const OrganizationsPageClient: React.FC = () => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [deletedOrganizations, setDeletedOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    organization: Organization | null;
  }>({ open: false, organization: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    organization: Organization | null;
  }>({ open: false, organization: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [detailView, setDetailView] = useState<{
    open: boolean;
    organization: Organization | null;
  }>({ open: false, organization: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [permanentDeleteLoading, setPermanentDeleteLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeOnly, setActiveOnly] = useState(false);
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState('all');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Local pagination (handled fully by frontend)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  // API meta (comes only from server)
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
      key: "organization",
      label: "Organization",
      renderData: (organization) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {organization.orgn_user.name}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {organization.bio.description}
            </div>
            {organization.bio.website && (
              <a
                href={organization.bio.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-[#0077ED] dark:text-[#4A9AFF] hover:text-[#0066CC] dark:hover:text-[#6BB6FF] mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Website
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          {organization.category === "organization" ? (
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <Building className="w-4 h-4 text-green-600 dark:text-green-400" />
          )}
          <span className="font-medium text-gray-900 dark:text-white capitalize">
            {organization.category}
          </span>
        </div>
      ),
    },
    {
      key: "subscription_status",
      label: "Status",
      renderData: (organization) => getStatusBadge(organization.subscription_status),
    },
    {
      key: "subscription_period",
      label: "Subscription Period",
      renderData: (organization) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-white">
            {formatDate(organization.subscription_start)}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            to {formatDate(organization.subscription_end)}
          </div>
        </div>
      ),
    },
    {
      key: "total_events",
      label: "Events",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {organization.total_events}
          </span>
        </div>
      ),
    },
    {
      key: "total_companies",
      label: "Companies",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {organization.total_companies}
          </span>
        </div>
      ),
    },
    {
      key: "total_revenue",
      label: "Revenue",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="font-medium text-green-600 dark:text-green-400">
            ${organization.total_revenue.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "total_attendees",
      label: "Attendees",
      renderData: (organization) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {organization.total_attendees.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      label: "",
      type: "action",
      width: "w-12",
    },
  ];
  

  // Load organizations
  const loadOrganizations = async (includeDeleted = false) => {
    if (includeDeleted) {
      setDeletedLoading(true);
    } else {
      setLoading(true);
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get active organizations (exclude deleted ones)
      const activeOrganizations = dummyData.data.organizations.filter(org => 
        !deletedOrganizations.some(deleted => deleted._id === org._id)
      );
      
      // Filter data based on search and status
      let filteredData = includeDeleted
        ? deletedOrganizations
        : activeOrganizations;
      
      if (searchQuery) {
        filteredData = filteredData.filter(org =>
          org.orgn_user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          org.bio.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        filteredData = filteredData.filter(org => org.subscription_status === statusFilter);
      }
      
      if (categoryFilter !== 'all') {
        filteredData = filteredData.filter(org => org.category === categoryFilter);
      }

      if (includeDeleted) {
        setDeletedOrganizations(filteredData);
      } else {
        setOrganizations(filteredData);
        setTotalCount(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
      }
    } catch (error) {
      console.error(`Error loading ${includeDeleted ? 'deleted' : 'active'} organizations:`, error);
    } finally {
      if (includeDeleted) {
        setDeletedLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'all') {
      loadOrganizations(false);
    } else if (activeTab === 'deleted') {
      loadOrganizations(true);
    }
  }, [searchQuery, currentPage, rowsPerPage, activeTab]);

  if (loading && organizations.length === 0) {
    return <TableSkeleton rows={8} columns={8} showFilters={true} />;
  }

  const handleEdit = (organization: Organization) => {
    setEditDialog({ open: true, organization });
  };

  const handleDelete = (organization: Organization) => {
    setDeleteDialog({ open: true, organization });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.organization) return;
    
    setDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to deleted organizations (soft delete)
      const deletedOrganization = {
        ...deleteDialog.organization,
        deleted_at: new Date().toISOString(),
        is_deleted: true,
      };

      setDeletedOrganizations(prev => [deletedOrganization, ...prev]);
      setOrganizations(prev => 
        prev.filter(org => org._id !== deleteDialog.organization!._id)
      );
      
      // Update total count
      setTotalCount(prev => prev - 1);
      setTotalPages(Math.ceil((totalCount - 1) / rowsPerPage));
      
      setDeleteDialog({ open: false, organization: null });
    } catch (error) {
      console.error('Error deleting organization:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async (organization: Organization) => {
    setRestoreLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Remove deleted_at and is_deleted properties
      const { deleted_at, is_deleted, ...restoredOrganization } = organization;

      // Move back to active organizations
      setOrganizations(prev => [restoredOrganization, ...prev]);
      setDeletedOrganizations(prev => prev.filter(org => org._id !== organization._id));
    } catch (error) {
      console.error('Error restoring organization:', error);
    } finally {
      setRestoreLoading(false);
    }
  };

  const handlePermanentDelete = async (organization: Organization) => {
    setPermanentDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Remove from deleted organizations permanently
      setDeletedOrganizations(prev => prev.filter(org => org._id !== organization._id));
    } catch (error) {
      console.error('Error permanently deleting organization:', error);
    } finally {
      setPermanentDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (updatedOrganization: Organization) => {
    setEditLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setOrganizations(prev =>
        prev.map(org => org._id === updatedOrganization._id ? updatedOrganization : org)
      );
      
      setEditDialog({ open: false, organization: null });
    } catch (error) {
      console.error('Error updating organization:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (newOrganization: Organization) => {
    setCreateLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to local state
      setOrganizations(prev => [newOrganization, ...prev]);
      setTotalCount(prev => prev + 1);
      setTotalPages(Math.ceil((totalCount + 1) / rowsPerPage));
      
      setCreateDialog(false);
    } catch (error) {
      console.error('Error creating organization:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRowClick = (organization: Organization) => {
    setDetailView({ open: true, organization });
  };

  // Helper to count active filters
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (categoryFilter !== 'all') count++;
    if (subscriptionStatusFilter !== 'all') count++;
    if (activeOnly) count++;
    return count;
  };

  const handleClearFilters = () => {
    // Reset all filters
    setStatusFilter('all');
    setCategoryFilter('all');
    setSubscriptionStatusFilter('all');
    setActiveOnly(false);
    
    // Get active organizations (exclude deleted ones)
    const activeOrganizations = dummyData.data.organizations.filter(org => 
      !deletedOrganizations.some(deleted => deleted._id === org._id)
    );
    setOrganizations(activeOrganizations);
    setTotalCount(activeOrganizations.length);
    setTotalPages(Math.ceil(activeOrganizations.length / rowsPerPage));
    setFilterDrawerOpen(false);
    setFilterLoading(false);
  };

  // Helper functions for soft delete table
  const getItemName = (org: Organization) => org.orgn_user.name;
  const getDeletedAt = (org: Organization) => org.deleted_at || '';
  const getDaysUntilPermanentDelete = (org: Organization) => {
    if (!org.deleted_at) return 30;
    
    const deletedDate = new Date(org.deleted_at);
    const permanentDeleteDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const now = new Date();
    const daysLeft = Math.ceil((permanentDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    return Math.max(0, daysLeft);
  };


  const handleApplyFilters = async () => {
    setFilterLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get active organizations (exclude deleted ones)
      const activeOrganizations = dummyData.data.organizations.filter(org => 
        !deletedOrganizations.some(deleted => deleted._id === org._id)
      );
      let filteredData = activeOrganizations;

      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredData = filteredData.filter(org => org.status === isActive);
      }

      if (categoryFilter !== 'all') {
        filteredData = filteredData.filter(org => org.category === categoryFilter);
      }

      if (subscriptionStatusFilter !== 'all') {
        filteredData = filteredData.filter(org => org.subscription_status === subscriptionStatusFilter);
      }

      if (activeOnly) {
        filteredData = filteredData.filter(org => org.status);
      }

      // Apply search query if exists
      if (searchQuery) {
        filteredData = filteredData.filter(org =>
          org.orgn_user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          org.bio.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setOrganizations(filteredData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
      setFilterDrawerOpen(false);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setFilterLoading(false);
    }
  };

  const MENU_OPTIONS: MenuOption[] = [
    {
      label: 'Edit',
      action: handleEdit,
      icon: <Edit className="w-4 h-4" />,
    },
    {
      label: 'Delete',
      action: handleDelete,
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'destructive',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      inactive: { label: 'Inactive', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      expired: { label: 'Expired', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Organizations
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Manage and monitor all organizations on your platform
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
            Add Organization
          </Button>
       
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
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
      </div>

      {/* Organizations Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Organizations ({organizations.length})
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:text-red-500" value="deleted">
            Deleted Organizations ({deletedOrganizations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <CustomTable
            data={organizations}
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
            onRowClick={handleRowClick}
            loading={loading}
            emptyMessage="No organizations found"
          />
        </TabsContent>

        <TabsContent value="deleted" className="space-y-6">
          <SoftDeleteTable
            data={deletedOrganizations}
            loading={deletedLoading}
            emptyMessage="No deleted organizations found"
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
            getItemName={getItemName}
            getDeletedAt={getDeletedAt}
            getDaysUntilPermanentDelete={getDaysUntilPermanentDelete}
            restoreLoading={restoreLoading}
            deleteLoading={permanentDeleteLoading}
            pagination={{
              total_count: totalCount,
              rows_per_page: rowsPerPage,
              page: currentPage,
              handleChangePage,
              onRowsPerPageChange,
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, organization: null })}
        title="Move to Deleted Organizations"
        content={`Are you sure you want to move "${deleteDialog.organization?.orgn_user.name}" to deleted organizations? You can restore it within 30 days before it's permanently deleted.`}
        confirmButtonText="Move to Deleted"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Organization Dialog */}
      <OrganizationEditDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, organization: null })}
        organization={editDialog.organization}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Organization Dialog */}
      <OrganizationCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleCreate}
        loading={createLoading}
      />

      {/* Organization Detail View */}
      {detailView.open && detailView.organization && (
        <OrganizationDetailView
          organization={detailView.organization}
          onClose={() => setDetailView({ open: false, organization: null })}
      
        />
      )}

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="organizations"
        title="Organizations"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Organizations"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
      >
        <OrganizationFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          activeOnly={activeOnly}
          setActiveOnly={setActiveOnly}
          subscriptionStatusFilter={subscriptionStatusFilter}
          setSubscriptionStatusFilter={setSubscriptionStatusFilter}
        />
      </CustomDrawer>
    </div>
  );
};

export default OrganizationsPageClient;