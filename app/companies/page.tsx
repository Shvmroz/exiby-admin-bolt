'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  Globe,
  Linkedin,
} from 'lucide-react';
import CustomTable, { TableHeader, MenuOption } from '@/components/ui/custom-table';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import CompanyEditDialog from '@/components/companies/CompanyEditDialog';
import CompanyCreateDialog from '@/components/companies/CompanyCreateDialog';
import CompanyDetailView from '@/components/companies/CompanyDetailView';
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
}

// Dummy data
const dummyData = {
  data: {
    companies: [
      {
        _id: "comp_789",
        orgn_user: { _id: "orguser_456", name: "Microsoft Corp" },
        bio: { description: "Technology solutions provider", industry: "Technology" },
        social_links: { website: "https://microsoft.com", linkedin: "https://linkedin.com/company/microsoft" },
        contact: { email: "events@microsoft.com", phone: "+1-555-0123" },
        qr_code: {},
        status: true,
        total_events: 15,
        total_payments: 45000,
        created_at: "2025-07-10T14:20:00.000Z"
      },
      {
        _id: "comp_790",
        orgn_user: { _id: "orguser_457", name: "Google LLC" },
        bio: { description: "Search and cloud computing services", industry: "Technology" },
        social_links: { website: "https://google.com", linkedin: "https://linkedin.com/company/google" },
        contact: { email: "partnerships@google.com", phone: "+1-555-0124" },
        qr_code: {},
        status: true,
        total_events: 22,
        total_payments: 67000,
        created_at: "2025-07-05T09:15:00.000Z"
      },
      {
        _id: "comp_791",
        orgn_user: { _id: "orguser_458", name: "Apple Inc" },
        bio: { description: "Consumer electronics and software", industry: "Technology" },
        social_links: { website: "https://apple.com", linkedin: "https://linkedin.com/company/apple" },
        contact: { email: "events@apple.com", phone: "+1-555-0125" },
        qr_code: {},
        status: false,
        total_events: 8,
        total_payments: 32000,
        created_at: "2025-06-20T16:45:00.000Z"
      },
      {
        _id: "comp_792",
        orgn_user: { _id: "orguser_459", name: "Amazon Web Services" },
        bio: { description: "Cloud computing platform", industry: "Technology" },
        social_links: { website: "https://aws.amazon.com", linkedin: "https://linkedin.com/company/amazon-web-services" },
        contact: { email: "events@aws.amazon.com", phone: "+1-555-0126" },
        qr_code: {},
        status: true,
        total_events: 18,
        total_payments: 54000,
        created_at: "2025-07-01T11:30:00.000Z"
      },
      {
        _id: "comp_793",
        orgn_user: { _id: "orguser_460", name: "Tesla Motors" },
        bio: { description: "Electric vehicles and clean energy", industry: "Automotive" },
        social_links: { website: "https://tesla.com", linkedin: "https://linkedin.com/company/tesla-motors" },
        contact: { email: "corporate@tesla.com", phone: "+1-555-0127" },
        qr_code: {},
        status: true,
        total_events: 12,
        total_payments: 38000,
        created_at: "2025-06-15T13:20:00.000Z"
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
  { key: 'social_links', label: 'Links', type: 'custom' },
  { key: 'status', label: 'Status', type: 'custom' },
  { key: 'total_events', label: 'Events', type: 'custom' },
  { key: 'total_payments', label: 'Payments', type: 'custom' },
  { key: 'action', label: '', type: 'action', width: 'w-12' },
];

const CompaniesPage: React.FC = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
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

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  // Load companies
  const loadCompanies = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter data based on search and status
      let filteredData = dummyData.data.companies;
      
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

      setCompanies(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [searchQuery, statusFilter, industryFilter, pagination.page, pagination.limit]);

  const handleChangePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

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
      
      // Remove from local state
      setCompanies(prev => 
        prev.filter(company => company._id !== deleteDialog.company!._id)
      );
      
      // Update pagination total
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      
      setDeleteDialog({ open: false, company: null });
    } catch (error) {
      console.error('Error deleting company:', error);
    } finally {
      setDeleteLoading(false);
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
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
      
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

  const handleDetailEdit = (updatedCompany: Company) => {
    // Update local state
    setCompanies(prev =>
      prev.map(company => company._id === updatedCompany._id ? updatedCompany : company)
    );
  };

  const handleDetailDelete = (deletedCompany: Company) => {
    // Remove from local state
    setCompanies(prev => 
      prev.filter(company => company._id !== deletedCompany._id)
    );
    
    // Update pagination total
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
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
            </div>
          </div>
        );

      case 'industry':
        return (
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-500" />
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

      case 'social_links':
        return (
          <div className="flex items-center space-x-2">
            {company.social_links.website && (
              <a
                href={company.social_links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-blue-500 hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {company.social_links.linkedin && (
              <a
                href={company.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-blue-600 hover:text-blue-700"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
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

      default:
        return <span>{company[header.key as keyof Company] as string}</span>;
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Companies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and monitor all companies on your platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
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
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <CustomTable
        data={companies}
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
        emptyMessage="No companies found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, company: null })}
        title="Delete Company"
        content={`Are you sure you want to delete "${deleteDialog.company?.orgn_user.name}"? This action cannot be undone and will remove all associated data.`}
        confirmButtonText="Delete Company"
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
          onEdit={handleDetailEdit}
          onDelete={handleDetailDelete}
        />
      )}
    </div>
  );
};

export default CompaniesPage;