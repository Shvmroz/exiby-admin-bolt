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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TableSkeleton from '@/components/ui/skeleton/table-skeleton';
import { useSnackbar } from 'notistack';

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

const CompaniesPageClient: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deletedCompanies, setDeletedCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [rowData, setRowData] = useState<Company | null>(null);
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
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [permanentDeleteLoading, setPermanentDeleteLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [activeOnly, setActiveOnly] = useState(false);
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Local pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersApplied, setFiltersApplied] = useState({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
    limit: 50,
  });

  // Table helpers
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  };

  const TABLE_HEAD: TableHeader[] = [
    {
      key: "index",
      label: "#",
      renderData: (row, rowIndex) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {rowIndex !== undefined ? rowIndex + 1 : "-"}.
        </span>
      ),
    },
    {
      key: "company",
      label: "Company",
      renderData: (company: Company) => (
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
      ),
    },
    {
      key: "industry",
      label: "Industry",
      renderData: (company: Company) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {company.bio.industry}
          </span>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      renderData: (company: Company) => (
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
      ),
    },
    {
      key: "status",
      label: "Status",
      renderData: (company: Company) => getStatusBadge(company.status),
    },
    {
      key: "total_events",
      label: "Events",
      renderData: (company: Company) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {company.total_events}
          </span>
        </div>
      ),
    },
    {
      key: "total_payments",
      label: "Payments",
      renderData: (company: Company) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="font-medium text-green-600 dark:text-green-400">
            ${company.total_payments.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      renderData: (company: Company) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(company.created_at)}
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

  // Load companies
  const getListCompanies = async (searchQuery = '', filters = {}, includeDeleted = false) => {
    if (includeDeleted) {
      setDeletedLoading(true);
    } else {
      setLoading(true);
    }

    try {
      // TODO: Replace with actual API call
      // const result = await _companies_list_api(currentPage, rowsPerPage, searchQuery, filters);
      
      // Simulate API response structure
      const result = {
        code: 200,
        data: {
          companies: [],
          total_count: 0,
          total_pages: 1,
          filters_applied: filters,
        }
      };

      if (result?.code === 200) {
        if (includeDeleted) {
          setDeletedCompanies(result.data.companies || []);
        } else {
          setCompanies(result.data.companies || []);
          setTotalCount(result.data.total_count || 0);
          setTotalPages(result.data.total_pages || 1);
          setFiltersApplied(result.data.filters_applied || {});
        }
      } else {
        enqueueSnackbar(result?.message || 'Failed to load companies', {
          variant: 'error',
        });
        if (includeDeleted) {
          setDeletedCompanies([]);
        } else {
          setCompanies([]);
        }
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      if (includeDeleted) {
        setDeletedCompanies([]);
      } else {
        setCompanies([]);
      }
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
      getListCompanies();
    } else if (activeTab === 'deleted') {
      getListCompanies('', {}, true);
    }
  }, [currentPage, rowsPerPage, activeTab]);

  if (loading && companies.length === 0) {
    return <TableSkeleton rows={8} columns={7} showFilters={true} />;
  }

  const handleEdit = (company: Company) => {
    setEditDialog({ open: true, company });
    setRowData(company);
  };

  const handleDelete = (company: Company) => {
    setDeleteDialog({ open: true, company });
    setRowData(company);
  };

  const handleConfirmDelete = async () => {
    if (!rowData?._id) return;

    setDeleteLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _delete_company_api(rowData._id);
      
      // Simulate API response
      const result = { code: 200, message: 'Company moved to deleted successfully' };

      if (result?.code === 200) {
        const deletedCompany = {
          ...rowData,
          deleted_at: new Date().toISOString(),
          is_deleted: true,
        };

        setDeletedCompanies(prev => [deletedCompany, ...prev]);
        setCompanies(prev => 
          prev.filter(company => company._id !== rowData._id)
        );
        
        setDeleteDialog({ open: false, company: null });
        setRowData(null);
        enqueueSnackbar('Company moved to deleted successfully', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(result?.message || 'Failed to delete company', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (data: Partial<Company>) => {
    if (!rowData?._id) return;
    
    setEditLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _edit_company_api(rowData._id, data);
      
      // Simulate API response
      const result = { 
        code: 200, 
        message: 'Company updated successfully',
        data: { ...rowData, ...data }
      };

      if (result?.code === 200) {
        setEditDialog({ open: false, company: null });
        setRowData(null);
        setCompanies(prev =>
          prev.map(company => company._id === rowData._id ? { ...company, ...data } : company)
        );
        enqueueSnackbar('Company updated successfully', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(result?.message || 'Failed to update company', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating company:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddNewCompany = async (data: Partial<Company>) => {
    setAddLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _add_company_api(data);
      
      // Simulate API response
      const result = {
        code: 200,
        message: 'Company created successfully',
        data: { _id: `comp_${Date.now()}`, ...data }
      };

      if (result?.code === 200) {
        setCompanies(prev => [result.data, ...prev]);
        setCreateDialog(false);
        enqueueSnackbar('Company created successfully', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(result?.message || 'Failed to create company', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating company:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setAddLoading(false);
    }
  };

  const handleRestore = async (company: Company) => {
    setRestoreLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _restore_company_api(company._id);
      
      // Simulate API response
      const result = { code: 200, message: 'Company restored successfully' };

      if (result?.code === 200) {
        const { deleted_at, is_deleted, ...restoredCompany } = company;
        setCompanies(prev => [restoredCompany, ...prev]);
        setDeletedCompanies(prev => prev.filter(c => c._id !== company._id));
        enqueueSnackbar('Company restored successfully', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(result?.message || 'Failed to restore company', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error restoring company:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setRestoreLoading(false);
    }
  };

  const handlePermanentDelete = async (company: Company) => {
    setPermanentDeleteLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _permanent_delete_company_api(company._id);
      
      // Simulate API response
      const result = { code: 200, message: 'Company permanently deleted' };

      if (result?.code === 200) {
        setDeletedCompanies(prev => prev.filter(c => c._id !== company._id));
        enqueueSnackbar('Company permanently deleted', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(result?.message || 'Failed to permanently delete company', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error permanently deleting company:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setPermanentDeleteLoading(false);
    }
  };

  const handleRowClick = (company: Company) => {
    setDetailView({ open: true, company });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getListCompanies(searchQuery);
  };

  // Filter functions
  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (industryFilter !== 'all') count++;
    if (activeOnly) count++;
    if (createdFrom) count++;
    if (createdTo) count++;
    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setIndustryFilter('all');
    setActiveOnly(false);
    setCreatedFrom('');
    setCreatedTo('');
    setFilterDrawerOpen(false);
    getListCompanies();
  };

  const handleApplyFilters = () => {
    const filters: { [key: string]: string } = {};

    if (statusFilter === 'active') filters.status = 'true';
    else if (statusFilter === 'inactive') filters.status = 'false';

    if (industryFilter !== 'all') filters.industry = industryFilter;
    if (activeOnly) filters.active_only = 'true';
    if (createdFrom) filters.created_from = createdFrom;
    if (createdTo) filters.created_to = createdTo;

    getListCompanies(searchQuery, filters);
    setFilterDrawerOpen(false);
  };

  // Helper functions for soft delete table
  const getItemName = (company: Company) => company.orgn_user.name;
  const getDeletedAt = (company: Company) => company.deleted_at || '';
  const getDaysUntilPermanentDelete = (company: Company) => {
    if (!company.deleted_at) return 30;
    
    const deletedDate = new Date(company.deleted_at);
    const permanentDeleteDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((permanentDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    return Math.max(0, daysLeft);
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
            <div className="relative w-full flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-24"
                />
              </div>
              {filtersApplied?.search && filtersApplied.search !== '' ? (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    getListCompanies('');
                  }}
                  variant="outline"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Clear
                </Button>
              ) : (
                <Button
                  onClick={handleSearch}
                  disabled={searchQuery === ''}
                  variant="outline"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Search
                </Button>
              )}
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
        onOpenChange={(open) => setDeleteDialog({ open, company: null })}
        title="Move to Deleted Companies"
        content={`Are you sure you want to move "${deleteDialog.company?.orgn_user.name}" to deleted companies? You can restore it within 30 days before it's permanently deleted.`}
        confirmButtonText="Move to Deleted"
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Company Dialog */}
      <CompanyEditDialog
        open={editDialog.open}
        onOpenChange={(open) => {
          setEditDialog({ open, company: null });
          if (!open) setRowData(null);
        }}
        company={rowData}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Company Dialog */}
      <CompanyCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleAddNewCompany}
        loading={addLoading}
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
        applyButtonDisabled={isDateRangeInvalid}
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