'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  X, 
  Calendar, 
  Code, 
  Eye,
  CheckCircle,
  XCircle 
} from 'lucide-react';

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

interface EmailTemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
}

const EmailTemplatePreviewDialog: React.FC<EmailTemplatePreviewDialogProps> = ({
  open,
  onOpenChange,
  template,
}) => {
  if (!template) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTemplateType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Eye className="w-5 h-5 mr-2 text-[#0077ED]" />
            Preview Email Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="w-5 h-5 mr-2 text-[#0077ED]" />
                    Template Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Template Name
                      </label>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {template.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Template Type
                      </label>
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-900 dark:text-white">
                          {formatTemplateType(template.template_type)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject Line
                      </label>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {template.subject}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <div>
                        {getStatusBadge(template.is_active)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {template.variables.map((variable, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <Code className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          {`{{${variable}}}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Created: {formatDate(template.created_at)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Email Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Eye className="w-5 h-5 mr-2 text-[#0077ED]" />
                Email Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Subject:</span>
                    <span className="text-gray-900 dark:text-white">{template.subject}</span>
                  </div>
                </div>
                
                {/* Email Content */}
                <div className="p-6 bg-white dark:bg-gray-800">
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: template.content }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplatePreviewDialog;