'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Search,
  Filter,
  Plus,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Organization {
  _id: string;
  orgn_user: {
    _id: string;
    name: string;
  };
  bio: {
    description: string;
    website: string;
    industry?: string;
  };
  subscription_status: string;
  subscription_start: string;
  subscription_end: string;
  status: boolean;
  total_events: number;
  total_companies: number;
  total_revenue: number;
  total_attendees: number;
  created_at: string;
}

// Dummy data
const dummyData = {
  data: {
    organizations: [
      {
        _id: "org_123",
        orgn_user: { _id: "orguser_456", name: "TechCorp Events" },
        bio: { description: "Leading tech event organizer", website: "https://techcorp.com", industry: "Technology" },
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
        bio: { description: "Cutting-edge innovation events", website: "https://innovationlabs.io", industry: "Technology" },
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
        bio: { description: "Startup networking and pitch events", website: "https://startuphub.com", industry: "Business" },
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
        bio: { description: "Digital transformation conferences", website: "https://digitalsummit.co", industry: "Technology" },
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
        bio: { description: "Professional event management services", website: "https://eventmasters.com", industry: "Events" },
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

const TABLE_HEAD: TableHeader[] = [
  { key: 'organization', label: 'Organization', type: 'custom' },
  { key: 'subscription_status', label: 'Status', type: 'custom' },
  { key: 'subscription_period', label: 'Subscription Period', type: 'custom' },
  { key: 'total_events', label: 'Events', type: 'custom' },
  { key: 'total_companies', label: 'Companies', type: 'custom' },
  { key: 'total_revenue', label: 'Revenue', type: 'custom' },
  { key: 'total_attendees', label: 'Attendees', type: 'custom' },
  { key: 'action', label: '', type: 'action', width: 'w-12' },
];

const OrganizationsPage: React.FC = () => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    organization: Organization | null;
  }>({ open: false, organization: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    organization: Organization | null;
  }>({ open: false, organization: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  // Load organizations
  const loadOrganizations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter data based on search and status
      let filteredData = dummyData.data.organizations;
      
      if (searchQuery) {
        filteredData = filteredData.filter(org =>
          org.orgn_user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          org.bio.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        filteredData = filteredData.filter(org => org.subscription_status === statusFilter);
      }

      setOrganizations(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, [searchQuery, statusFilter, pagination.page, pagination.limit]);

  const handleChangePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

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
      
      // Remove from local state
      setOrganizations(prev => 
        prev.filter(org => org._id !== deleteDialog.organization!._id)
      );
      
      setDeleteDialog({ open: false, organization: null });
      await loadOrganizations(); // Refresh the list
    } catch (error) {
      console.error('Error deleting organization:', error);
    } finally {
      setDeleteLoading(false);
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

  const handleRowClick = (organization: Organization) => {
    router.push(`/organizations/${organization._id}`);
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

  const renderCell = (organization: Organization, header: TableHeader) => {
    switch (header.key) {
      case 'organization':
        return (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">
                {organization.orgn_user.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {organization.bio.description}
              </div>
              {organization.bio.website && (
                <a
                  href={organization.bio.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-[#0077ED] hover:text-[#0066CC] mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Website
                </a>
              )}
            </div>
          </div>
        );

      case 'subscription_status':
        return getStatusBadge(organization.subscription_status);

      case 'subscription_period':
        return (
          <div className="text-sm">
            <div className="text-gray-900 dark:text-white">
              {formatDate(organization.subscription_start)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              to {formatDate(organization.subscription_end)}
            </div>
          </div>
        );

      case 'total_events':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {organization.total_events}
            </span>
          </div>
        );

      case 'total_companies':
        return (
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {organization.total_companies}
            </span>
          </div>
        );

      case 'total_revenue':
        return (
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">
              ${organization.total_revenue.toLocaleString()}
            </span>
          </div>
        );

      case 'total_attendees':
        return (
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {organization.total_attendees.toLocaleString()}
            </span>
          </div>
        );

      default:
        return <span>{organization[header.key as keyof Organization] as string}</span>;
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Organizations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and monitor all organizations on your platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => router.push('/organizations/create')}
            className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <CustomTable
        data={organizations}
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
        onRowClick={handleRowClick}
        renderCell={renderCell}
        loading={loading}
        emptyMessage="No organizations found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, organization: null })}
        title="Delete Organization"
        content={`Are you sure you want to delete "${deleteDialog.organization?.orgn_user.name}"? This action cannot be undone and will remove all associated data.`}
        confirmButtonText="Delete Organization"
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
    </div>
  );
};

export default OrganizationsPage;