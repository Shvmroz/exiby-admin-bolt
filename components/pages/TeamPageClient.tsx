'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Mail,
  Shield,
  Key,
  CheckCircle,
  XCircle,
  User,
  Calendar,
} from 'lucide-react';
import CustomTable, { TableHeader, MenuOption } from '@/components/ui/custom-table';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import TeamMemberEditDialog from '@/components/team/TeamMemberEditDialog';
import TeamMemberCreateDialog from '@/components/team/TeamMemberCreateDialog';
import TeamMemberPermissionsDialog from '@/components/team/TeamMemberPermissionsDialog';
import ChangePasswordDialog from '@/components/team/ChangePasswordDialog';
import CustomDrawer from '@/components/ui/custom-drawer';
import TeamFilters from '@/components/team/TeamFilters';
import SoftDeleteTable from '@/components/ui/soft-delete-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CsvExportDialog from '@/components/ui/csv-export-dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TableSkeleton from '@/components/ui/skeleton/table-skeleton';

interface Permission {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  permissions: Permission[];
  last_login: string;
  created_at: string;
  deleted_at?: string;
  is_deleted?: boolean;
}

// Dummy data
const dummyData = {
  data: {
    team_members: [
      {
        _id: "user_123",
        name: "Shamroz Khan",
        email: "shamroz@exiby.com",
        role: "Admin",
        status: true,
        permissions: [
          { module: "dashboard", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "organizations", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "companies", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "payment_plans", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "email_templates", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "analytics", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "team", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "configuration", can_view: true, can_create: false, can_edit: true, can_delete: false },
          { module: "settings", can_view: true, can_create: false, can_edit: true, can_delete: false },
        ],
        last_login: "2025-01-20T10:30:00.000Z",
        created_at: "2025-01-15T10:30:00.000Z"
      },
      {
        _id: "user_124",
        name: "Sarah Johnson",
        email: "sarah@exiby.com",
        role: "Manager",
        status: true,
        permissions: [
          { module: "dashboard", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "organizations", can_view: true, can_create: true, can_edit: true, can_delete: false },
          { module: "companies", can_view: true, can_create: true, can_edit: true, can_delete: false },
          { module: "payment_plans", can_view: true, can_create: false, can_edit: true, can_delete: false },
          { module: "email_templates", can_view: true, can_create: true, can_edit: true, can_delete: false },
          { module: "analytics", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "team", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "configuration", can_view: false, can_create: false, can_edit: false, can_delete: false },
          { module: "settings", can_view: false, can_create: false, can_edit: false, can_delete: false },
        ],
        last_login: "2025-01-19T14:20:00.000Z",
        created_at: "2025-01-10T14:20:00.000Z"
      },
      {
        _id: "user_125",
        name: "Mike Chen",
        email: "mike@exiby.com",
        role: "Editor",
        status: true,
        permissions: [
          { module: "dashboard", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "organizations", can_view: true, can_create: false, can_edit: true, can_delete: false },
          { module: "companies", can_view: true, can_create: false, can_edit: true, can_delete: false },
          { module: "payment_plans", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "email_templates", can_view: true, can_create: true, can_edit: true, can_delete: false },
          { module: "analytics", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "team", can_view: false, can_create: false, can_edit: false, can_delete: false },
          { module: "configuration", can_view: false, can_create: false, can_edit: false, can_delete: false },
          { module: "settings", can_view: false, can_create: false, can_edit: false, can_delete: false },
        ],
        last_login: "2025-01-18T09:15:00.000Z",
        created_at: "2025-01-08T09:15:00.000Z"
      },
      {
        _id: "user_126",
        name: "Emma Wilson",
        email: "emma@exiby.com",
        role: "Viewer",
        status: false,
        permissions: [
          { module: "dashboard", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "organizations", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "companies", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "payment_plans", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "email_templates", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "analytics", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "team", can_view: false, can_create: false, can_edit: false, can_delete: false },
          { module: "configuration", can_view: false, can_create: false, can_edit: false, can_delete: false },
          { module: "settings", can_view: false, can_create: false, can_edit: false, can_delete: false },
        ],
        last_login: "2025-01-17T16:45:00.000Z",
        created_at: "2025-01-05T16:45:00.000Z"
      },
      {
        _id: "user_127",
        name: "David Rodriguez",
        email: "david@exiby.com",
        role: "Manager",
        status: true,
        permissions: [
          { module: "dashboard", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "organizations", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "companies", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "payment_plans", can_view: true, can_create: false, can_edit: true, can_delete: false },
          { module: "email_templates", can_view: true, can_create: true, can_edit: true, can_delete: true },
          { module: "analytics", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "team", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "configuration", can_view: true, can_create: false, can_edit: false, can_delete: false },
          { module: "settings", can_view: false, can_create: false, can_edit: false, can_delete: false },
        ],
        last_login: "2025-01-16T11:30:00.000Z",
        created_at: "2025-01-03T11:30:00.000Z"
      }
    ],
    total: 5
  }
};

const TABLE_HEAD: TableHeader[] = [
  { key: 'user', label: 'User', type: 'custom' },
  { key: 'role', label: 'Role', type: 'custom' },
  { key: 'permissions', label: 'Approved Permissions', type: 'custom' },
  { key: 'status', label: 'Status', type: 'custom' },
  { key: 'last_login', label: 'Last Login', type: 'custom' },
  { key: 'created_at', label: 'Created', type: 'custom' },
  { key: 'action', label: '', type: 'action', width: 'w-12' },
];

const TeamPageClient: React.FC = () => {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [deletedMembers, setDeletedMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [permissionsDialog, setPermissionsDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  const [changePasswordDialog, setChangePasswordDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [permanentDeleteLoading, setPermanentDeleteLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Filter states
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeOnly, setActiveOnly] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  // Load team members
  const loadTeamMembers = async (includeDeleted = false) => {
    if (includeDeleted) {
      setDeletedLoading(true);
    } else {
      setLoading(true);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get active team members (exclude deleted ones)
      const activeMembers = dummyData.data.team_members.filter(member => 
        !deletedMembers.some(deleted => deleted._id === member._id)
      );
      
      let filteredData = includeDeleted
        ? deletedMembers
        : activeMembers;
      
      if (searchQuery) {
        filteredData = filteredData.filter(member =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (roleFilter !== 'all') {
        filteredData = filteredData.filter(member => member.role === roleFilter);
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredData = filteredData.filter(member => member.status === isActive);
      }

      if (includeDeleted) {
        setDeletedMembers(filteredData);
      } else {
        setTeamMembers(filteredData);
        setPagination(prev => ({ ...prev, total: filteredData.length }));
      }
    } catch (error) {
      console.error(`Error loading ${includeDeleted ? 'deleted' : 'active'} team members:`, error);
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
      loadTeamMembers(false);
    } else if (activeTab === 'deleted') {
      loadTeamMembers(true);
    }
  }, [searchQuery, pagination.page, pagination.limit, activeTab]);

  if (loading && teamMembers.length === 0) {
    return <TableSkeleton rows={8} columns={6} showFilters={true} />;
  }

  const handleChangePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleEdit = (member: TeamMember) => {
    setEditDialog({ open: true, member });
  };

  const handleDelete = (member: TeamMember) => {
    setDeleteDialog({ open: true, member });
  };

  const handlePermissions = (member: TeamMember) => {
    setPermissionsDialog({ open: true, member });
  };

  const handleChangePassword = (member: TeamMember) => {
    setChangePasswordDialog({ open: true, member });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.member) return;
    
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const deletedMember = {
        ...deleteDialog.member,
        deleted_at: new Date().toISOString(),
        is_deleted: true,
      };

      setDeletedMembers(prev => [deletedMember, ...prev]);
      setTeamMembers(prev => 
        prev.filter(member => member._id !== deleteDialog.member!._id)
      );
      
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      setDeleteDialog({ open: false, member: null });
    } catch (error) {
      console.error('Error deleting team member:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async (member: TeamMember) => {
    setRestoreLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { deleted_at, is_deleted, ...restoredMember } = member;
      setTeamMembers(prev => [restoredMember, ...prev]);
      setDeletedMembers(prev => prev.filter(m => m._id !== member._id));
    } catch (error) {
      console.error('Error restoring team member:', error);
    } finally {
      setRestoreLoading(false);
    }
  };

  const handlePermanentDelete = async (member: TeamMember) => {
    setPermanentDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDeletedMembers(prev => prev.filter(m => m._id !== member._id));
    } catch (error) {
      console.error('Error permanently deleting team member:', error);
    } finally {
      setPermanentDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (updatedMember: TeamMember) => {
    setEditLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTeamMembers(prev =>
        prev.map(member => member._id === updatedMember._id ? updatedMember : member)
      );
      
      setEditDialog({ open: false, member: null });
    } catch (error) {
      console.error('Error updating team member:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (newMember: TeamMember) => {
    setCreateLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTeamMembers(prev => [newMember, ...prev]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
      setCreateDialog(false);
    } catch (error) {
      console.error('Error creating team member:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSavePermissions = async (updatedMember: TeamMember) => {
    setPermissionsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTeamMembers(prev =>
        prev.map(member => member._id === updatedMember._id ? updatedMember : member)
      );
      
      setPermissionsDialog({ open: false, member: null });
    } catch (error) {
      console.error('Error updating permissions:', error);
    } finally {
      setPermissionsLoading(false);
    }
  };

  const handlePasswordChange = async (memberId: string, newPassword: string) => {
    setPasswordLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setChangePasswordDialog({ open: false, member: null });
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Helper functions
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (roleFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (activeOnly) count++;
    return count;
  };

  const handleClearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
    setActiveOnly(false);
    
    // Get active team members (exclude deleted ones)
    const activeMembers = dummyData.data.team_members.filter(member => 
      !deletedMembers.some(deleted => deleted._id === member._id)
    );
    setTeamMembers(activeMembers);
    setPagination(prev => ({
      ...prev,
      total: activeMembers.length,
    }));
    setFilterDrawerOpen(false);
    setFilterLoading(false);
  };

  const handleApplyFilters = async () => {
    setFilterLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get active team members (exclude deleted ones)
      const activeMembers = dummyData.data.team_members.filter(member => 
        !deletedMembers.some(deleted => deleted._id === member._id)
      );
      let filteredData = activeMembers;

      if (roleFilter !== 'all') {
        filteredData = filteredData.filter(member => member.role === roleFilter);
      }

      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredData = filteredData.filter(member => member.status === isActive);
      }

      if (activeOnly) {
        filteredData = filteredData.filter(member => member.status);
      }

      if (searchQuery) {
        filteredData = filteredData.filter(member =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setTeamMembers(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
      setFilterDrawerOpen(false);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setFilterLoading(false);
    }
  };

  // Helper functions for soft delete table
  const getItemName = (member: TeamMember) => member.name;
  const getDeletedAt = (member: TeamMember) => member.deleted_at || '';
  const getDaysUntilPermanentDelete = (member: TeamMember) => {
    if (!member.deleted_at) return 30;
    
    const deletedDate = new Date(member.deleted_at);
    const permanentDeleteDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((permanentDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    return Math.max(0, daysLeft);
  };

  const deletedPagination = {
    total_count: deletedMembers.length,
    rows_per_page: pagination.limit,
    page: pagination.page,
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
      label: 'Permissions',
      action: handlePermissions,
      icon: <Shield className="w-4 h-4" />,
    },
    {
      label: 'Change Password',
      action: handleChangePassword,
      icon: <Key className="w-4 h-4" />,
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
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      Admin: { className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
      Manager: { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      Editor: { className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      Viewer: { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.Viewer;
    
    return (
      <Badge className={config.className}>
        {role}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getApprovedPermissions = (permissions: Permission[]) => {
    const approvedCount = permissions.filter(p => 
      p.can_view || p.can_create || p.can_edit || p.can_delete
    ).length;
    
    return (
      <div className="flex items-center space-x-2">
        <Shield className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {approvedCount}/{permissions.length} modules
        </span>
      </div>
    );
  };

  const renderCell = (member: TeamMember, header: TableHeader) => {
    switch (header.key) {
      case 'user':
        return (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">
                {member.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {member.email}
              </div>
            </div>
          </div>
        );

      case 'role':
        return getRoleBadge(member.role);

      case 'permissions':
        return getApprovedPermissions(member.permissions);

      case 'status':
        return getStatusBadge(member.status);

      case 'last_login':
        return (
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {formatDate(member.last_login)}
          </span>
        );

      case 'created_at':
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(member.created_at)}
          </span>
        );

      default:
        return <span>{member[header.key as keyof TeamMember] as string}</span>;
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage team members and their role-based permissions
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
            Add Team Member
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
                placeholder="Search team members..."
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

      {/* Team Members Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Members ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:text-red-500" value="deleted">
            Deleted Members ({deletedMembers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <CustomTable
            data={teamMembers}
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
            emptyMessage="No team members found"
          />
        </TabsContent>

        <TabsContent value="deleted" className="space-y-6">
          <SoftDeleteTable
            data={deletedMembers}
            TABLE_HEAD={TABLE_HEAD}
            loading={deletedLoading}
            emptyMessage="No deleted team members found"
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
        onOpenChange={(open) => setDeleteDialog({ open, member: null })}
        title="Move to Deleted Members"
        content={`Are you sure you want to move "${deleteDialog.member?.name}" to deleted members? You can restore them within 30 days before permanent deletion.`}
        confirmButtonText="Move to Deleted"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Team Member Dialog */}
      <TeamMemberEditDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, member: null })}
        member={editDialog.member}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Team Member Dialog */}
      <TeamMemberCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleCreate}
        loading={createLoading}
      />

      {/* Permissions Dialog */}
      <TeamMemberPermissionsDialog
        open={permissionsDialog.open}
        onOpenChange={(open) => setPermissionsDialog({ open, member: null })}
        member={permissionsDialog.member}
        onSave={handleSavePermissions}
        loading={permissionsLoading}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordDialog.open}
        onOpenChange={(open) => setChangePasswordDialog({ open, member: null })}
        member={changePasswordDialog.member}
        onSave={handlePasswordChange}
        loading={passwordLoading}
      />

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="team_members"
        title="Team Members"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Team Members"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
      >
        <TeamFilters
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          activeOnly={activeOnly}
          setActiveOnly={setActiveOnly}
        />
      </CustomDrawer>
    </div>
  );
};

export default TeamPageClient;