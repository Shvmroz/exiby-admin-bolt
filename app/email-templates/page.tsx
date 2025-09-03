'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
  Tag,
} from 'lucide-react';
import CustomTable, { TableHeader, MenuOption } from '@/components/ui/custom-table';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import EmailTemplateEditDialog from '@/components/email-templates/EmailTemplateEditDialog';
import EmailTemplateCreateDialog from '@/components/email-templates/EmailTemplateCreateDialog';
import EmailTemplatePreviewDialog from '@/components/email-templates/EmailTemplatePreviewDialog';
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

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  template_type: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
}

// Dummy data
const dummyData = {
  data: {
    email_templates: [
      {
        _id: "template_123",
        name: "Welcome Email",
        subject: "Welcome to {{platform_name}}",
        template_type: "user_registration",
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #0077ED; text-align: center; margin-bottom: 20px;">Welcome to {{platform_name}}!</h1>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello {{user_name}},</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                We're excited to have you join our platform! Your account has been successfully created and you can now start exploring all the amazing features we have to offer.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{login_url}}" style="background-color: #0077ED; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
              </div>
              <p style="color: #666; font-size: 14px;">
                If you have any questions, feel free to contact our support team.
              </p>
            </div>
          </div>
        `,
        variables: ["platform_name", "user_name", "login_url"],
        is_active: true,
        created_at: "2025-08-15T10:30:00.000Z"
      },
      {
        _id: "template_124",
        name: "Event Registration Confirmed",
        subject: "✅ Registration Confirmed for {{event_name}}",
        template_type: "event_registration",
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8ff;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border-left: 5px solid #28a745;">
              <h1 style="color: #28a745; text-align: center; margin-bottom: 20px;">Registration Confirmed!</h1>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello {{user_name}},</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Your registration for <strong>{{event_name}}</strong> on {{event_date}} has been confirmed.
              </p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0077ED; margin-bottom: 10px;">Event Details:</h3>
                <div style="color: #333;">{{event_details}}</div>
              </div>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                We look forward to seeing you at the event!
              </p>
            </div>
          </div>
        `,
        variables: ["user_name", "event_name", "event_date", "event_details"],
        is_active: true,
        created_at: "2025-08-12T14:20:00.000Z"
      },
      {
        _id: "template_125",
        name: "Password Reset",
        subject: "🔐 Reset Your Password",
        template_type: "password_reset",
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff5f5;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border-left: 5px solid #dc3545;">
              <h1 style="color: #dc3545; text-align: center; margin-bottom: 20px;">Password Reset Request</h1>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello {{user_name}},</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{reset_url}}" style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px;">
                This link will expire in 24 hours. If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>
        `,
        variables: ["user_name", "reset_url"],
        is_active: true,
        created_at: "2025-08-10T09:15:00.000Z"
      },
      {
        _id: "template_126",
        name: "Event Reminder",
        subject: "⏰ Reminder: {{event_name}} is Tomorrow",
        template_type: "event_reminder",
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff8e1;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border-left: 5px solid #ffc107;">
              <h1 style="color: #ffc107; text-align: center; margin-bottom: 20px;">Event Reminder</h1>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello {{user_name}},</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                This is a friendly reminder that <strong>{{event_name}}</strong> is scheduled for tomorrow at {{event_time}}.
              </p>
              <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
                <h3 style="color: #856404; margin-bottom: 10px;">Event Information:</h3>
                <p style="color: #856404; margin: 5px 0;"><strong>Date:</strong> {{event_date}}</p>
                <p style="color: #856404; margin: 5px 0;"><strong>Time:</strong> {{event_time}}</p>
                <p style="color: #856404; margin: 5px 0;"><strong>Location:</strong> {{event_location}}</p>
              </div>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Don't forget to bring your ticket and arrive 15 minutes early!
              </p>
            </div>
          </div>
        `,
        variables: ["user_name", "event_name", "event_time", "event_date", "event_location"],
        is_active: true,
        created_at: "2025-08-08T16:45:00.000Z"
      },
      {
        _id: "template_127",
        name: "Payment Receipt",
        subject: "💳 Payment Receipt for {{event_name}}",
        template_type: "payment_confirmation",
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8ff;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border-left: 5px solid #17a2b8;">
              <h1 style="color: #17a2b8; text-align: center; margin-bottom: 20px;">Payment Received</h1>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello {{user_name}},</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for your payment! We have successfully received your payment for {{event_name}}.
              </p>
              <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0c5460; margin-bottom: 15px;">Payment Details:</h3>
                <table style="width: 100%; color: #0c5460;">
                  <tr><td><strong>Amount:</strong></td><td>{{payment_amount}}</td></tr>
                  <tr><td><strong>Transaction ID:</strong></td><td>{{transaction_id}}</td></tr>
                  <tr><td><strong>Payment Date:</strong></td><td>{{payment_date}}</td></tr>
                  <tr><td><strong>Event:</strong></td><td>{{event_name}}</td></tr>
                </table>
              </div>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Your ticket has been sent to your email. See you at the event!
              </p>
            </div>
          </div>
        `,
        variables: ["user_name", "event_name", "payment_amount", "transaction_id", "payment_date"],
        is_active: false,
        created_at: "2025-08-05T11:30:00.000Z"
      }
    ],
    total: 5
  }
};

const TABLE_HEAD: TableHeader[] = [
  { key: 'preview', label: 'Preview', type: 'custom', width: 'w-20' },
  { key: 'template', label: 'Template', type: 'custom' },
  { key: 'subject', label: 'Subject', type: 'custom' },
  { key: 'template_type', label: 'Type', type: 'custom' },
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

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

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
      let filteredData = dummyData.data.email_templates;
      
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

  const renderCell = (template: EmailTemplate, header: TableHeader) => {
    switch (header.key) {
      case 'preview':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handlePreview(template);
            }}
            className="h-8 px-3"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
        );

      case 'template':
        return (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">
                {template.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {template.variables.length} variables
              </div>
            </div>
          </div>
        );

      case 'subject':
        return (
          <div className="max-w-xs">
            <div className="font-medium text-gray-900 dark:text-white truncate">
              {template.subject}
            </div>
          </div>
        );

      case 'template_type':
        return (
          <Badge className={template.template_type}>
            {template.template_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
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
  const templateTypes = Array.from(new Set(dummyData.data.email_templates.map(template => template.template_type)));

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
          <Button
            onClick={() => setExportDialog(true)}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
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
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="email_templates"
        title="Email Templates"
      />
    </div>
  );
};

export default EmailTemplatesPage;