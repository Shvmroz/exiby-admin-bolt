'use client';

import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Mail, Eye } from 'lucide-react';

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
  const { darkMode } = useAppContext();

  if (!template) return null;

  const getSampleValue = (variable: string) => {
    const sampleValues: { [key: string]: string } = {
      platform_name: 'ExiBy Platform',
      user_name: 'John Doe',
      event_name: 'Tech Conference 2024',
      event_date: 'March 15, 2024',
      event_time: '10:00 AM',
      event_location: 'Convention Center',
      event_details: 'A comprehensive tech conference featuring industry leaders and networking opportunities',
      login_url: 'https://platform.com/login',
      reset_url: 'https://platform.com/reset-password',
      payment_amount: '$299.00',
      transaction_id: 'TXN123456789',
      payment_date: 'January 20, 2024',
    };
    return sampleValues[variable] || `[${variable}]`;
  };

  const renderPreview = () => {
    let previewContent = template.content;
    template.variables.forEach(variable => {
      const sampleValue = getSampleValue(variable);
      previewContent = previewContent.replace(new RegExp(`{{${variable}}}`, 'g'), sampleValue);
    });
    return previewContent;
  };

  const renderSubjectPreview = () => {
    let previewSubject = template.subject;
    template.variables.forEach(variable => {
      const sampleValue = getSampleValue(variable);
      previewSubject = previewSubject.replace(new RegExp(`{{${variable}}}`, 'g'), sampleValue);
    });
    return previewSubject;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderColor: darkMode ? '#374151' : '#e5e7eb'
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-xl font-semibold flex items-center"
            style={{ color: darkMode ? '#ffffff' : '#000000' }}
          >
            <Eye className="w-5 h-5 mr-2 text-[#0077ED]" />
            Email Template Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Template Name:</span>
              <p className="text-gray-900 dark:text-white font-semibold">{template.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
              <p className="text-gray-900 dark:text-white font-semibold">
                {template.template_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>

          {/* Subject Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Subject Line Preview
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-gray-900 dark:text-white font-medium">
                {renderSubjectPreview()}
              </p>
            </div>
          </div>

          {/* Email Content Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Email Content Preview
            </h3>
            <div 
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: renderPreview() }}
            />
          </div>

          {/* Variables Used */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Variables Used ({template.variables.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm font-mono"
                >
                  {`{{${variable}}}`}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button
              onClick={() => onOpenChange(false)}
              style={{
                backgroundColor: darkMode ? '#374151' : '#f9fafb',
                color: darkMode ? '#f3f4f6' : '#374151',
                borderColor: darkMode ? '#4b5563' : '#d1d5db'
              }}
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