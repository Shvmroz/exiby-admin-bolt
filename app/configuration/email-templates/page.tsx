'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Code,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import CustomTable, { TableHeader, MenuOption } from '@/components/ui/custom-table';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import EmailTemplateEditDialog from '@/components/email-templates/EmailTemplateEditDialog';
import EmailTemplateCreateDialog from '@/components/email-templates/EmailTemplateCreateDialog';
import EmailTemplatePreviewDialog from '@/components/email-templates/EmailTemplatePreviewDialog';
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

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  template_type: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// Dummy data
const dummyData = {
  email_templates: [
    {
      _id: "template_123",
      name: "Welcome Email",
      subject: "Welcome to {{platform_name}}",
      template_type: "user_registration",
      content: "<h1>Welcome {{user_name}}</h1><p>Thank you for joining {{platform_name}}! We're excited to have you on board.</p><p>Get started by exploring our features and creating your first event.</p>",
      variables: ["platform_name", "user_name"],
      is_active: true,
      created_at: "2025-08-15T10:30:00.000Z"
    },
    {
      _id: "template_124",
      name: "Event Registration Confirmation",
      subject: "Registration Confirmed for {{event_name}}",
      template_type: "event_registration",
      content: "<h1>Thank you {{user_name}}</h1><p>Your registration for {{event_name}} is confirmed.</p><p>Event Date: {{event_date}}</p><p>We look forward to seeing you there!</p>",
      variables: ["user_name", "event_name", "event_date"],
      is_active: true,
      created_at: "2025-08-15T10:30:00.000Z"
    },
    {
      _id: "template_125",
      name: "Password Reset",
      subject: "Reset Your Password",
      template_type: "password_reset",
      content: "<h1>Password Reset Request</h1><p>Hi {{user_name}},</p><p>Click the link below to reset your password:</p><a href='{{reset_link}}'>Reset Password</a>",
      variables: ["user_name", "reset_link"],
      is_active: true,
      created_at: "2025-08-10T14:20:00.000Z"
    },
    {
      _id: "template_126",
      name: "Event Reminder",
      subject: "Reminder: {{event_name}} is tomorrow",
      template_type: "event_reminder",
      content: "<h1>Don't forget!</h1><p>Hi {{user_name}},</p><p>This is a friendly reminder that {{event_name}} is scheduled for tomorrow at {{event_time}}.</p>",
      variables: ["user_name", "event_name", "event_time"],
      is_active: false,
      created_at: "2025-08-05T09:15:00.000Z"
    },
    {
      _id: "template_127",
      name: "Payment Confirmation",
      subject: "Payment Received - {{amount}}",
      template_type: "payment_confirmation",
      content: "<h1>Payment Confirmed</h1><p>Hi {{user_name}},</p><p>We have received your payment of {{amount}} for {{event_name}}.</p><p>Transaction ID: {{transaction_id}}</p>",
      variables: ["user_name", "amount", "event_name", "transaction_id"],
      is_active: true,
      created_at: "2025-07-28T16:45:00.000Z"
    },
    {
      _id: "template_128",
      name: "Event Cancellation",
      subject: "Event Cancelled: {{event_name}}",
      template_type: "event_cancellation",
      content: "<h1>Event Cancelled</h1><p>Hi {{user_name}},</p><p>We regret to inform you that {{event_name}} has been cancelled.</p><p>You will receive a full refund within 3-5 business days.</p>",
      variables: ["user_name", "event_name"],
      is_active: true,
      created_at: "2025-07-20T11:30:00.000Z"
    }
  ],
  total: 8
};

const TABLE_HEAD: TableHeader[] = [
  { key: 'template', label: 'Template', type: 'custom' },
  { key: 'template_type', label: 'Type', type: 'custom' },
  { key: 'subject', label: 'Subject', type: 'custom' },
  { key: 'variables', label: 'Variables', type: 'custom' },
  { key: 'status', label: 'Status', type: 'custom' },
  { key: 'created_at', label: 'Created', type: 'custom' },
  { key: 'action', label: '', type: 'action', width: 'w-12' },
];

const EmailTemplatesPage: React.FC = () => {
  const router = useRouter();
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    template: EmailTemplate | null;
  }>({ open: false, template: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    template: EmailTemplate | null;
  }>({ open: false, template: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    template: EmailTemplate | null;
  }>({ open: false, template: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  // Load email templates
  const loadEmailTemplates = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter data based on search and status
      let filteredData = dummyData.email_templates;
      
      if (searchQuery) {
        filteredData = filteredData.filter(template =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.template_type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredData = filteredData.filter(template => template.is_active === isActive);
      }
      
      if (typeFilter !== 'all') {
        filteredData = filteredData.filter(template => template.template_type === typeFilter);
      }

      setEmailTemplates(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
    } catch (error) {
      console.error('Error loading email templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmailTemplates();
  }, [searchQuery, statusFilter, typeFilter, pagination.page, pagination.limit]);

  const handleChangePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handlePreview = (template: EmailTemplate) => {
    setPreviewDialog({ open: true, template });
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditDialog({ open: true, template });
  };

  const handleDelete = (template: EmailTemplate) => {
    setDeleteDialog({ open: true, template });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.template) return;
    
    setDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove from local state
      setEmailTemplates(prev => 
        prev.filter(template => template._id !== deleteDialog.template!._id)
      );
      
      // Update pagination total
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      
      setDeleteDialog({ open: false, template: null });
    } catch (error) {
      console.error('Error deleting email template:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (updatedTemplate: EmailTemplate) => {
    setEditLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setEmailTemplates(prev =>
        prev.map(template => template._id === updatedTemplate._id ? updatedTemplate : template)
      );
      
      setEditDialog({ open: false, template: null });
    } catch (error) {
      console.error('Error updating email template:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (newTemplate: EmailTemplate) => {
    setCreateLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to local state
      setEmailTemplates(prev => [newTemplate, ...prev]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
      
      setCreateDialog(false);
    } catch (error) {
      console.error('Error creating email template:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const MENU_OPTIONS: MenuOption[] = [
    {
      label: 'Preview',
      action: handlePreview,
      icon: <Eye className="w-4 h-4" />,
    },
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

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
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
    });
  };

  const formatTemplateType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderCell = (template: EmailTemplate, header: TableHeader) => {
    switch (header.key) {
      case 'template':
        return (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">
                {template.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {template.content.replace(/<[^>]*>/g, '').substring(0, 50)}...
              </div>
            </div>
          </div>
        );

      case 'template_type':
        return (
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {formatTemplateType(template.template_type)}
            </span>
          </div>
        );

      case 'subject':
        return (
          <div className="max-w-xs">
            <span className="text-gray-900 dark:text-white font-medium">
              {template.subject}
            </span>
          </div>
        );

      case 'variables':
        return (
          <div className="flex flex-wrap gap-1">
            {template.variables.slice(0, 3).map((variable, index) => (
              <Badge
                key={index}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs"
              >
                {variable}
              </Badge>
            ))}
            {template.variables.length > 3 && (
              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
                +{template.variables.length - 3}
              </Badge>
            )}
          </div>
        );

      case 'status':
        return getStatusBadge(template.is_active);

      case 'created_at':
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(template.created_at)}
          </span>
        );

      default:
        return <span>{template[header.key as keyof EmailTemplate] as string}</span>;
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Get unique template types for filter
  const templateTypes = Array.from(new Set(dummyData.email_templates.map(template => template.template_type)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and customize email templates for your platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Template
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
                placeholder="Search email templates..."
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {templateTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {formatTemplateType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates Table */}
      <CustomTable
        data={emailTemplates}
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
        emptyMessage="No email templates found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, template: null })}
        title="Delete Email Template"
        content={`Are you sure you want to delete "${deleteDialog.template?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete Template"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Email Template Dialog */}
      <EmailTemplateEditDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, template: null })}
        template={editDialog.template}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Email Template Dialog */}
      <EmailTemplateCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleCreate}
        loading={createLoading}
      />

      {/* Preview Email Template Dialog */}
      <EmailTemplatePreviewDialog
        open={previewDialog.open}
        onOpenChange={(open) => setPreviewDialog({ open, template: null })}
        template={previewDialog.template}
      />
    </div>
  );
};

export default EmailTemplatesPage;