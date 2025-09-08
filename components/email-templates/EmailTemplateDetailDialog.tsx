"use client";

import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { Button } from "@/components/ui/button";
import { X, Mail, Eye, Edit, Calendar, Tag, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface EmailTemplateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
  onEdit?: (template: EmailTemplate) => void;
}

const EmailTemplateDetailDialog: React.FC<EmailTemplateDetailDialogProps> = ({
  open,
  onOpenChange,
  template,
  onEdit,
}) => {
  const { darkMode } = useAppContext();

  if (!template) return null;

  const getSampleValue = (variable: string) => {
    const sampleValues: { [key: string]: string } = {
      platform_name: "ExiBy Platform",
      user_name: "John Doe",
      event_name: "Tech Conference 2024",
      event_date: "March 15, 2024",
      event_time: "10:00 AM",
      event_location: "Convention Center",
      event_details: "A comprehensive tech conference featuring industry leaders",
      login_url: "https://platform.com/login",
      reset_url: "https://platform.com/reset-password",
      payment_amount: "$299.00",
      transaction_id: "TXN123456789",
      payment_date: "January 20, 2024",
    };
    return sampleValues[variable] || `[${variable}]`;
  };

  const renderPreview = () => {
    let previewContent = template.content;
    template.variables.forEach((variable) => {
      const sampleValue = getSampleValue(variable);
      previewContent = previewContent.replace(
        new RegExp(`{{${variable}}}`, "g"),
        sampleValue
      );
    });
    return previewContent;
  };

  const renderSubjectPreview = () => {
    let previewSubject = template.subject;
    template.variables.forEach((variable) => {
      const sampleValue = getSampleValue(variable);
      previewSubject = previewSubject.replace(
        new RegExp(`{{${variable}}}`, "g"),
        sampleValue
      );
    });
    return previewSubject;
  };

  const getTypeColor = (type: string) => {
    const typeColors = {
      user_registration: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      event_registration: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      password_reset: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      event_reminder: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      payment_confirmation: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    };
    return (
      typeColors[type as keyof typeof typeColors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          borderRadius: "12px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        <div
          className="flex items-center justify-between"
          style={{ color: darkMode ? "#ffffff" : "#000000" }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {template.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email Template Details
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button
                onClick={() => onEdit(template)}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-600"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <IconButton onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5 text-foreground" />
            </IconButton>
          </div>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 4 }}
        dividers
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          borderColor: darkMode ? "#374151" : "#e5e7eb",
        }}
      >
        <div className="space-y-6">
          {/* Template Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-[#0077ED]" />
                Template Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template Name
                  </label>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {template.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template Type
                  </label>
                  <Badge className={getTypeColor(template.template_type)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {template.template_type
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject Line
                </label>
                <div className="text-gray-900 dark:text-white">
                  {renderSubjectPreview()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <Badge
                  className={
                    template.is_active
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }
                >
                  {template.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created Date
                </label>
                <div className="text-gray-900 dark:text-white">
                  {formatDate(template.created_at)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Tag className="w-5 h-5 mr-2 text-[#0077ED]" />
                Variables ({template.variables.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm font-mono"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Eye className="w-5 h-5 mr-2 text-[#0077ED]" />
                Email Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: renderPreview() }}
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => onOpenChange(false)}
          style={{
            backgroundColor: darkMode ? "#374151" : "#f9fafb",
            color: darkMode ? "#f3f4f6" : "#374151",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailTemplateDetailDialog;