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
import { useSnackbar } from 'notistack';
import {
  _get_team_members_api,
  _create_team_member_api,
  _update_team_member_api,
  _delete_team_member_api,
  _restore_team_member_api,
  _permanent_delete_team_member_api,
  _change_team_member_password_api,
} from '@/DAL/teamAPI';

interface TeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  access: string[];
  status: boolean;
  last_login: string;
  created_at: string;
  deleted_at?: string;
  is_deleted?: boolean;
}

const TABLE_HEAD: TableHeader[] = [
  { key: 'user', label: 'User', type: 'custom' },
  { key: 'access', label: 'Module Access', type: 'custom' },
  { key: 'status', label: 'Status', type: 'custom' },
  { key: 'last_login', label: 'Last Login', type: 'custom' },
  { key: 'created_at', label: 'Created', type: 'custom' },
  { key: 'action', label: '', type: 'action', width: 'w-12' },
];

const TeamPageClient: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
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
  const [changePasswordDialog, setChangePasswordDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [permanentDeleteLoading, setPermanentDeleteLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeOnly, setActiveOnly] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Pagination state (following reference structure)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  // Pagination handlers (following reference structure)
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };

  const handleChangePages = (event: any, newPage: number) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setPageCount(1);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setPage(0);
    setPageCount(1);
  };

  // Load team members
  const loadTeamMembers = async (includeDeleted = false) => {
    if (includeDeleted) {
      setDeletedLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const req_data = {
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        active_only: activeOnly,
        include_deleted: includeDeleted,
      };
      
      const result = await _get_team_members_api(req_data);
      
      if (result?.code === 200) {
        const members = result.team_members || [];
        
        if (includeDeleted) {
          setDeletedMembers(members.filter((m: TeamMember) => m.is_deleted));
        } else {
          setTeamMembers(members.filter((m: TeamMember) => !m.is_deleted));
          setTotalCount(result.total_count || members.length);
          setTotalPages(result.total_pages || Math.ceil(members.length / rowsPerPage));
        }
      } else {
        enqueueSnackbar(result?.message || 'Failed to load team members', { variant: 'error' });
      }
    } catch (error) {
      console.error(`Error loading ${includeDeleted ? 'deleted' : 'active'} team members:`, error);
      enqueueSnackbar('Failed to load team members', { variant: 'error' });
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
  }, [searchQuery, page, rowsPerPage, activeTab]);

  if (loading && teamMembers.length === 0) {
    return <TableSkeleton rows={8} columns={5} showFilters={true} />;
  }

  const handleEdit = (member: TeamMember) => {
    setEditDialog({ open: true, member });
  };

  const handleDelete = (member: TeamMember) => {
    setDeleteDialog({ open: true, member });
  };

  const handleChangePassword = (member: TeamMember) => {
    setChangePasswordDialog({ open: true, member });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.member) return;
    
    setDeleteLoading(true);
    try {
      const result = await _delete_team_member_api(deleteDialog.member._id);
      
      if (result?.code === 200) {
        enqueueSnackbar('Team member moved to deleted successfully', { variant: 'success' });
        
        // Move to deleted members (soft delete)
        const deletedMember = {
          ...deleteDialog.member,
          deleted_at: new Date().toISOString(),
          is_deleted: true,
        };

        setDeletedMembers(prev => [deletedMember, ...prev]);
        setTeamMembers(prev => 
          prev.filter(member => member._id !== deleteDialog.member!._id)
        );
        
        setTotalCount(prev => prev - 1);
        setDeleteDialog({ open: false, member: null });
      } else {
        enqueueSnackbar(result?.message || 'Failed to delete team member', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      enqueueSnackbar('Failed to delete team member', { variant: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async (member: TeamMember) => {
    setRestoreLoading(true);
    try {
      const result = await _restore_team_member_api(member._id);
      
      if (result?.code === 200) {
        enqueueSnackbar('Team member restored successfully', { variant: 'success' });
        
        const { deleted_at, is_deleted, ...restoredMember } = member;
        setTeamMembers(prev => [restoredMember, ...prev]);
        setDeletedMembers(prev => prev.filter(m => m._id !== member._id));
      } else {
        enqueueSnackbar(result?.message || 'Failed to restore team member', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error restoring team member:', error);
      enqueueSnackbar('Failed to restore team member', { variant: 'error' });
    } finally {
      setRestoreLoading(false);
    }
  };

  const handlePermanentDelete = async (member: TeamMember) => {
    setPermanentDeleteLoading(true);
    try {
      const result = await _permanent_delete_team_member_api(member._id);
      
      if (result?.code === 200) {
        enqueueSnackbar('Team member permanently deleted', { variant: 'success' });
        setDeletedMembers(prev => prev.filter(m => m._id !== member._id));
      } else {
        enqueueSnackbar(result?.message || 'Failed to permanently delete team member', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error permanently deleting team member:', error);
      enqueueSnackbar('Failed to permanently delete team member', { variant: 'error' });
    } finally {
      setPermanentDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (reqData: any) => {
    setEditLoading(true);
    try {
      const result = await _update_team_member_api(editDialog.member?._id, reqData);
      
      if (result?.code === 200) {
        enqueueSnackbar('Team member updated successfully', { variant: 'success' });
        
        // Update local state with the updated member data
        if (editDialog.member) {
          const updatedMember = {
            ...editDialog.member,
            ...reqData,
          };
          
          setTeamMembers(prev =>
            prev.map(member => member._id === editDialog.member!._id ? updatedMember : member)
          );
        }
        
        setEditDialog({ open: false, member: null });
      } else {
        enqueueSnackbar(result?.message || 'Failed to update team member', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      enqueueSnackbar('Failed to update team member', { variant: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (reqData: any) => {
    setCreateLoading(true);
    try {
      const result = await _create_team_member_api(reqData);
      
      if (result?.code === 200) {
        enqueueSnackbar('Team member created successfully', { variant: 'success' });
        
        // Add new member to local state
        const newMember = result.team_member || {
          _id: `user_${Date.now()}`,
          first_name: reqData.first_name,
          last_name: reqData.last_name,
          email: reqData.email,
          access: reqData.access,
          status: reqData.status,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        
        setTeamMembers(prev => [newMember, ...prev]);
        setTotalCount(prev => prev + 1);
        setCreateDialog(false);
      } else {
        enqueueSnackbar(result?.message || 'Failed to create team member', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error creating team member:', error);
      enqueueSnackbar('Failed to create team member', { variant: 'error' });
    } finally {
      setCreateLoading(false);
    }
  };

  const handlePasswordChange = async (memberId: string, newPassword: string) => {
    setPasswordLoading(true);
    try {
      const result = await _change_team_member_password_api(memberId, { password: newPassword });
      
      if (result?.code === 200) {
        enqueueSnackbar('Password changed successfully', { variant: 'success' });
        setChangePasswordDialog({ open: false, member: null });
      } else {
        enqueueSnackbar(result?.message || 'Failed to change password', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      enqueueSnackbar('Failed to change password', { variant: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Helper functions
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (activeOnly) count++;
    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setActiveOnly(false);
    setFilterDrawerOpen(false);
    setFilterLoading(false);
    // Reload data without filters
    loadTeamMembers(false);
  };

  const handleApplyFilters = async () => {
    setFilterLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      loadTeamMembers(activeTab === 'deleted');
      setFilterDrawerOpen(false);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setFilterLoading(false);
    }
  };

  // Helper functions for soft delete table
  const getItemName = (member: TeamMember) => `${member.first_name} ${member.last_name}`;
  const getDeletedAt = (member: TeamMember) => member.deleted_at || '';
  const getDaysUntilPermanentDelete = (member: TeamMember) => {
    if (!member.deleted_at) return 30;
    
    const deletedDate = new Date(member.deleted_at);
    const permanentDeleteDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((permanentDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    return Math.max(0, daysLeft);
  };

  // Pagination configuration (following reference structure)
  const customPagination = {
    total_count: totalCount,
    rows_per_page: rowsPerPage,
    page: page,
    handleChangePage: handleChangePage,
    onRowsPerPageChange: onRowsPerPageChange,
  };

  const deletedPagination = {
    total_count: deletedMembers.length,
    rows_per_page: rowsPerPage,
    page: page,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getModuleAccess = (access: string[]) => {
    const moduleLabels = {
      dashboard: 'Dashboard',
      organizations: 'Organizations',
      companies: 'Companies',
      events: 'Events',
      payment_plans: 'Payment Plans',
      email_templates: 'Email Templates',
      analytics: 'Analytics',
      team: 'Team',
      configuration: 'Configuration',
      settings: 'Settings',
    };

    return (
      <div className="flex flex-wrap gap-1">
        {access.slice(0, 3).map((module, index) => (
          <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
            {moduleLabels[module as keyof typeof moduleLabels] || module}
          </Badge>
        ))}
        {access.length > 3 && (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
            +{access.length - 3} more
          </Badge>
        )}
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
                {member.first_name} {member.last_name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {member.email}
              </div>
            </div>
          </div>
        );

      case 'access':
        return getModuleAccess(member.access);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage team members and their module access permissions
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
            custom_pagination={customPagination}
            pageCount={pageCount}
            totalPages={totalPages}
            handleChangePages={handleChangePages}
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
        content={`Are you sure you want to move "${deleteDialog.member ? getItemName(deleteDialog.member) : ''}" to deleted members? You can restore them within 30 days before permanent deletion.`}
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