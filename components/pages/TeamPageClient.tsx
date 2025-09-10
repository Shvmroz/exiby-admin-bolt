"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Mail,
  Key,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import CustomTable, {
  TableHeader,
  MenuOption,
} from "@/components/ui/custom-table";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import TeamMemberEditDialog from "@/components/team/TeamMemberEditDialog";
import TeamMemberCreateDialog from "@/components/team/TeamMemberCreateDialog";
import ChangePasswordDialog from "@/components/team/ChangePasswordDialog";
import CustomDrawer from "@/components/ui/custom-drawer";
import TeamFilters from "@/components/team/TeamFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CsvExportDialog from "@/components/ui/csv-export-dialog";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { _admin_team_list_api } from "@/DAL/adminTeamAPI";
import { useSnackbar } from "notistack";

interface TeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  access: string[];
  status: boolean;
  createdAt: string;
}

const TABLE_HEAD: TableHeader[] = [
  { key: "user", label: "User", type: "custom" },
  { key: "access", label: "Module Access", type: "custom" },
  { key: "status", label: "Status", type: "custom" },
  { key: "createdAt", label: "Created", type: "custom" },
  { key: "action", label: "", type: "action", width: "w-12" },
];

const TeamPageClient: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);

  // Pagination & API meta
  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 20,
    total_count: 0,
    total_pages: 1,
  });

  const [filtersApplied, setFiltersApplied] = useState({
    search: "",
    sort_by: "createdAt",
    sort_order: "desc",
    page: 1,
    limit: 20,
  });

  // API Call
  const getAllTeamList = async () => {
    setLoading(true);

    try {
      const result = await _admin_team_list_api({
        page: pagination.current_page,
        limit: pagination.limit,
        req_data: {}, 
      });

      if (result?.code === 200) {
        setTeamMembers(result.data.admins || []);
        setPagination({
          current_page: result.data.current_page || 1,
          limit: result.data.limit || 20,
          total_count: result.data.total_count || 0,
          total_pages: result.data.total_pages || 1,
        });
        setFiltersApplied(result.data.filters_applied || filtersApplied);
      } else {
        enqueueSnackbar(result?.message || "Failed to load team members", {
          variant: "error",
        });
        setTeamMembers([]);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Something went wrong", { variant: "error" });
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTeamList();
  }, [pagination.current_page, pagination.limit]);

  if (loading && teamMembers.length === 0) {
    return <TableSkeleton rows={8} columns={5} showFilters={true} />;
  }

  // Table helpers
  const handleChangePage = (newPage: number) =>
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  const onRowsPerPageChange = (newLimit: number) =>
    setPagination((prev) => ({ ...prev, limit: newLimit, current_page: 1 }));

  const handleEdit = (member: TeamMember) =>
    setEditDialog({ open: true, member });
  const handleDelete = (member: TeamMember) =>
    setDeleteDialog({ open: true, member });
  const handleChangePassword = (member: TeamMember) =>
    setChangePasswordDialog({ open: true, member });

  const handleSaveEdit = async (reqData: any) => {
    setEditLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (editDialog.member) {
        const updatedMember = { ...editDialog.member, ...reqData };
        setTeamMembers((prev) =>
          prev.map((m) =>
            m._id === editDialog.member!._id ? updatedMember : m
          )
        );
      }
      setEditDialog({ open: false, member: null });
    } finally {
      setEditLoading(false);
    }
  };

  const handlePasswordChange = async (
    memberId: string,
    newPassword: string
  ) => {
    setPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      setChangePasswordDialog({ open: false, member: null });
      setPasswordLoading(false);
    }
  };

  const getAppliedFiltersCount = () =>
    (statusFilter !== "all" ? 1 : 0) + (activeOnly ? 1 : 0);
  const handleClearFilters = () => {
    setStatusFilter("all");
    setActiveOnly(false);
    getAllTeamList();
    setFilterDrawerOpen(false);
  };
  const handleApplyFilters = async () => {
    setFilterLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setFilterDrawerOpen(false);
    setFilterLoading(false);
  };

  const MENU_OPTIONS: MenuOption[] = [
    { label: "Edit", action: handleEdit, icon: <Edit className="w-4 h-4" /> },
    {
      label: "Change Password",
      action: handleChangePassword,
      icon: <Key className="w-4 h-4" />,
    },
    {
      label: "Delete",
      action: handleDelete,
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
    },
  ];

  const getStatusBadge = (status: boolean) =>
    status ? (
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getModuleAccess = (access: string[]) => {
    const moduleLabels: Record<string, string> = {
      dashboard: "Dashboard",
      organizations: "Organizations",
      companies: "Companies",
      events: "Events",
      payment_plans: "Payment Plans",
      email_templates: "Email Templates",
      analytics: "Analytics",
      team: "Team",
      configuration: "Configuration",
      settings: "Settings",
    };
    return (
      <div className="flex flex-wrap gap-1">
        {access.slice(0, 3).map((module, i) => (
          <Badge
            key={i}
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs"
          >
            {moduleLabels[module] || module}
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
      case "user":
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
      case "access":
        return getModuleAccess(member.access);
      case "status":
        return getStatusBadge(member.status);
      case "createdAt":
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(member.createdAt)}
          </span>
        );
      default:
        return <span>{member[header.key as keyof TeamMember] as string}</span>;
    }
  };

  const totalPages = pagination.total_pages;

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
      <CustomTable
        data={teamMembers}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={MENU_OPTIONS}
        custom_pagination={{
          total_count: pagination.total_count,
          rows_per_page: pagination.limit,
          page: pagination.current_page,
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, member: null })}
        title="Delete Team Member"
        content={`Are you sure you want to delete "${
          deleteDialog.member
            ? `${deleteDialog.member.first_name} ${deleteDialog.member.last_name}`
            : ""
        }"?`}
        confirmButtonText="Delete"
        onConfirm={() => {}}
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
