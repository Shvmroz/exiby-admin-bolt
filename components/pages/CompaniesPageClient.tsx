'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Linkedin,
  DollarSign,
  Calendar,
} from 'lucide-react';
import CustomTable, { TableHeader, MenuOption } from '@/components/ui/custom-table';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import CompanyEditDialog from '@/components/companies/CompanyEditDialog';
import CompanyCreateDialog from '@/components/companies/CompanyCreateDialog';
import CompanyDetailView from '@/components/companies/CompanyDetailView';
import CustomDrawer from '@/components/ui/custom-drawer';
import CompanyFilters from '@/components/companies/CompanyFilters';
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

interface Company {
  _id: string;
  orgn_user: {
    _id: string;
    name: string;
  };
  bio: {
    description: string;
    industry: string;
  };
  social_links: {
    website: string;
    linkedin: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  qr_code: {};
  status: boolean;
  total_events: number;
  total_payments: number;
  created_at: string;
  deleted_at?: string;
  is_deleted?: boolean;
}

// Dummy data
const dummyData = {
  data: {
    companies: [
      {
        _id: "comp_789",
        orgn_user: {
          _id: "orguser_456",
          name: "Microsoft Corp"
        },
        bio: {
          description: "Technology solutions provider",
          industry: "Technology"
        },
        social_links: {
          website: "https://microsoft.com",
          linkedin: "https://linkedin.com/company/microsoft"
        },
        contact: {
          email: "events@microsoft.com",
          phone: "+1-555-0123"
        },
        qr_code: {},
        status: true,
        total_events: 15,
        total_payments: 45000,
        created_at: "2025-07-10T14:20:00.000Z"
      },
      {
        _id: "comp_790",
        orgn_user: {
          _id: "orguser_457",
          name: "Google LLC"
        },
        bio: {
          description: "Search and cloud computing services",
          industry: "Technology"
        },
        social_links: {
          website: "https://google.com",
          linkedin: "https://linkedin.com/company/google"
        },
        contact: {
          email: "partnerships@google.com",
          phone: "+1-555-0124"
        },
        qr_code: {},
        status: true,
        total_events: 22,
        total_payments: 67000,
        created_at: "2025-07-08T09:15:00.000Z"
      },
      {
        _id: "comp_791",
        orgn_user: {
          _id: "orguser_458",
          name: "Apple Inc"
        },
        bio: {
          description: "Consumer electronics and software",
          industry: "Technology"
        },
        social_links: {
          website: "https://apple.com",
          linkedin: "https://linkedin.com/company/apple"
        },
        contact: {
          email: "events@apple.com",
          phone: "+1-555-0125"
        },
        qr_code: {},
        status: true,
        total_events: 18,
        total_payments: 89000,
        created_at: "2025-07-05T16:30:00.000Z"
      },
      {
        _id: "comp_792",
        orgn_user: {
          _id: "orguser_459",
          name: "Amazon Web Services"
        },
        bio: {
          description: "Cloud computing platform",
          industry: "Technology"
        },
        social_links: {
          website: "https://aws.amazon.com",
          linkedin: "https://linkedin.com/company/amazon-web-services"
        },
        contact: {
          email: "events@aws.amazon.com",
          phone: "+1-555-0126"
        },
        qr_code: {},
        status: false,
        total_events: 12,
        total_payments: 34000,
        created_at: "2025-06-28T11:45:00.000Z"
      },
      {
        _id: "comp_793",
        orgn_user: {
          _id: "orguser_460",
          name: "Tesla Motors"
        },
        bio: {
          description: "Electric vehicles and clean energy",
          industry: "Automotive"
        },
        social_links: {
          website: "https://tesla.com",
          linkedin: "https://linkedin.com/company/tesla-motors"
        },
        contact: {
          email: "corporate@tesla.com",
          phone: "+1-555-0127"
        },
        qr_code: {},
        status: true,
        total_events: 8,
        total_payments: 28000,
        created_at: "2025-06-20T13:20:00.000Z"
      },
      {
        _id: "comp_794",
        orgn_user: {
          _id: "orguser_461",
          name: "Netflix Inc"
        },
        bio: {
          description: "Streaming entertainment service",
          industry: "Entertainment"
        },
        social_links: {
          website: "https://netflix.com",
          linkedin: "https://linkedin.com/company/netflix"
        },
        contact: {
          email: "events@netflix.com",
          phone: "+1-555-0128"
        },
        qr_code: {},
        status: true,
        total_events: 10,
        total_payments: 38000,
        created_at: "2025-06-15T08:10:00.000Z"
      }
    ],
    total: 300,
    page: 1,
    limit: 20
  }
};

const TABLE_HEAD: TableHeader[] = [
  { key: 'company', label: 'Company', type: 'custom' },
  { key: 'industry', label: 'Industry', type: 'custom' },
  { key: 'contact', label: 'Contact', type: 'custom' },
  { key: 'status', label: 'Status', type: 'custom' },
  { key: 'total_events', label: 'Events', type: 'custom' },
  { key: 'total_payments', label: 'Payments', type: 'custom' },
  { key: 'created_at', label: 'Created', type: 'custom' },
  { key: 'action', label: '', type: 'action', width: 'w-12' },
];

const CompaniesPageClient: React.FC = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deletedCompanies, setDeletedCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    company: Company | null;
  }>({ open: false, company: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    company: Company | null;
  }>({ open: false, company: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [detailView, setDetailView] = useState<{
    open: boolean;
    company: Company | null;
  }>({ open: false, company: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [permanentDeleteLoading, setPermanentDeleteLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [activeOnly, setActiveOnly] = useState(false);
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

  // Load companies
  const loadCompanies = async (includeDeleted = false) => {
    if (includeDeleted) {
      setDeletedLoading(true);
    } else {
      setLoading(true);
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get active companies (exclude deleted ones)
      const activeCompanies = dummyData.data.companies.filter(company => 
        !deletedCompanies.some(deleted => deleted._id === company._id)
      );
      
      // Filter data based on search and status
      let filteredData = includeDeleted
        ? deletedCompanies
        : activeCompanies;
      
      if (searchQuery) {
        filteredData = filteredData.filter(company =>
          company.orgn_user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.bio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.bio.industry.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredData = filteredData.filter(company => company.status === isActive);
      }
      
      if (industryFilter !== 'all') {
        filteredData = filteredData.filter(company => company.bio.industry === industryFilter);
      }

      if (includeDeleted) {
        setDeletedCompanies(filteredData);
      } else {
        setCompanies(filteredData);
        setTotalCount(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
      }
    } catch (error) {
      console.error(`Error loading ${includeDeleted ? 'deleted' : 'active'} companies:`, error);
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
      loadCompanies(false);
    } else if (activeTab === 'deleted') {
      loadCompanies(true);
    }
  }, [searchQuery, currentPage, rowsPerPage, activeTab]);

  if (loading && companies.length === 0) {
    return <TableSkeleton rows={8} columns={7} showFilters={true} />;
  }

  const handleEdit = (company: Company) => {
    setEditDialog({ open: true, company });
  };

  const handleDelete = (company: Company) => {
    setDeleteDialog({ open: true, company });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.company) return;
    
    setDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to deleted companies (soft delete)
      const deletedCompany = {
        ...deleteDialog.company,
        deleted_at: new Date().toISOString(),
        is_deleted: true,
      };

      setDeletedCompanies(prev => [deletedCompany, ...prev]);
      setCompanies(prev => 
        prev.filter(company => company._id !== deleteDialog.company!._id)
      );
      
      // Update total count
      setTotalCount(prev => prev - 1);
      setTotalPages(Math.ceil((totalCount - 1) / rowsPerPage));
      
      setDeleteDialog({ open: false, company: null });
    } catch (error) {
      console.error('Error deleting company:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async (company: Company) => {
    setRestoreLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Remove deleted_at and is_deleted properties
      const { deleted_at, is_deleted, ...restoredCompany } = company;

      // Move back to active companies
      setCompanies(prev => [restoredCompany, ...prev]);
      setDeletedCompanies(prev => prev.filter(c => c._id !== company._id));
    } catch (error) {
      console.error('Error restoring company:', error);
    } finally {
      setRestoreLoading(false);
    }
  };

  const handlePermanentDelete = async (company: Company) => {
    setPermanentDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Remove from deleted companies permanently
      setDeletedCompanies(prev => prev.filter(c => c._id !== company._id));
    } catch (error) {
      console.error('Error permanently deleting company:', error);
    } finally {
      setPermanentDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (updatedCompany: Company) => {
    setEditLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setCompanies(prev =>
        prev.map(company => company._id === updatedCompany._id ? updatedCompany : company)
      );
      
      setEditDialog({ open: false, company: null });
    } catch (error) {
      console.error('Error updating company:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (newCompany: Company) => {
    setCreateLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to local state
      setCompanies(prev => [newCompany, ...prev]);
      setTotalCount(prev => prev + 1);
      setTotalPages(Math.ceil((totalCount + 1) / rowsPerPage));
      
      setCreateDialog(false);
    } catch (error) {
      console.error('Error creating company:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRowClick = (company: Company) => {
    setDetailView({ open: true, company });
  };

  // Helper to count active filters
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (industryFilter !== 'all') count++;
    if (activeOnly) count++;
    return count;
  };

  const handleClearFilters = () => {
    // Reset all filters
    setStatusFilter('all');
    setIndustryFilter('all');
    setActiveOnly(false);
    
    // Get active companies (exclude deleted ones)
    const activeCompanies = dummyData.data.companies.filter(company => 
      !deletedCompanies.some(deleted => deleted._id === company._id)
    );
    setCompanies(activeCompanies);
    setTotalCount(activeCompanies.length);
    setTotalPages(Math.ceil(activeCompanies.length / rowsPerPage));
    setFilterDrawerOpen(false);
    setFilterLoading(false);
  };

  const handleApplyFilters = async () => {
    setFilterLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get active companies (exclude deleted ones)
      const activeCompanies = dummyData.data.companies.filter(company => 
        !deletedCompanies.some(deleted => deleted._id === company._id)
      );
      let filteredData = activeCompanies;

      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredData = filteredData.filter(company => company.status === isActive);
      }

      if (industryFilter !== 'all') {
        filteredData = filteredData.filter(company => company.bio.industry === industryFilter);
      }

      if (activeOnly) {
        filteredData = filteredData.filter(company => company.status);
      }

      // Apply search query if exists
      if (searchQuery) {
        filteredData = filteredData.filter(company =>
          company.orgn_user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.bio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.bio.industry.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setCompanies(filteredData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
      setFilterDrawerOpen(false);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setFilterLoading(false);
    }
  };

  // Helper functions for soft delete table
  const getItemName = (company: Company) => company.orgn_user.name;
  const getDeletedAt = (company: Company) => company.deleted_at || '';
  const getDaysUntilPermanentDelete = (company: Company) => {
    if (!company.deleted_at) return 30;
    
    const deletedDate = new Date(company.deleted_at);
    const permanentDeleteDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const now = new Date();
    const daysLeft = Math.ceil((permanentDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    return Math.max(0, daysLeft);
  };

  // Table helpers
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1); // reset to first page
  };

  // Pagination configuration
  const paginationConfig = {
    total_count: totalCount,
    rows_per_page: rowsPerPage,
    page: currentPage,
    handleChangePage,
    onRowsPerPageChange,
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

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        Inactive
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

  const renderCell = (company: Company, header: TableHeader) => {
    switch (header.key) {
      case 'company':
        return (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">
                {company.orgn_user.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {company.bio.description}
              </div>
              {company.social_links.website && (
                <a
                  href={company.social_links.website}
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

      case 'industry':
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {company.bio.industry}
            </span>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {company.contact.email}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {company.contact.phone}
              </span>
            </div>
          </div>
        );

      case 'status':
        return getStatusBadge(company.status);

      case 'total_events':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {company.total_events}
            </span>
          </div>
        );

      case 'total_payments':
        return (
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">
              ${company.total_payments.toLocaleString()}
            </span>
          </div>
        );

      case 'created_at':
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(company.created_at)}
          </span>
        );

      default:
        return <span>{company[header.key as keyof Company] as string}</span>;
    }
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Companies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and monitor all companies participating in events
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
            Add Company
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
                placeholder="Search companies..."
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

      {/* Companies Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Companies ({companies.length})
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:text-red-500" value="deleted">
            Deleted Companies ({deletedCompanies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <CustomTable
            data={companies}
            TABLE_HEAD={TABLE_HEAD}
            MENU_OPTIONS={MENU_OPTIONS}
            custom_pagination={paginationConfig}
            totalPages={totalPages}
            renderCell={renderCell}
            onRowClick={handleRowClick}
            loading={loading}
            emptyMessage="No companies found"
          />
        </TabsContent>

        <TabsContent value="deleted" className="space-y-6">
          <SoftDeleteTable
            data={deletedCompanies}
            loading={deletedLoading}
            emptyMessage="No deleted companies found"
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
            getItemName={getItemName}
            getDeletedAt={getDeletedAt}
            getDaysUntilPermanentDelete={getDaysUntilPermanentDelete}
            restoreLoading={restoreLoading}
            deleteLoading={permanentDeleteLoading}
            pagination={paginationConfig}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, company: null })}
        title="Move to Deleted Companies"
        content={`Are you sure you want to move "${deleteDialog.company?.orgn_user.name}" to deleted companies? You can restore it within 30 days before it's permanently deleted.`}
        confirmButtonText="Move to Deleted"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Company Dialog */}
      <CompanyEditDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, company: null })}
        company={editDialog.company}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Company Dialog */}
      <CompanyCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleCreate}
        loading={createLoading}
      />

      {/* Company Detail View */}
      {detailView.open && detailView.company && (
        <CompanyDetailView
          company={detailView.company}
          onClose={() => setDetailView({ open: false, company: null })}
        />
      )}

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="companies"
        title="Companies"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Companies"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
      >
        <CompanyFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
          activeOnly={activeOnly}
          setActiveOnly={setActiveOnly}
        />
      </CustomDrawer>
    </div>
  );
};

export default CompaniesPageClient;