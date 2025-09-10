'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, X, Shield } from 'lucide-react';

interface TeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  access: string[];
  status: boolean;
  created_at: string;
}

interface TeamMemberEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | any;
  onSave: (member: any) => void;
  loading?: boolean;
}

const TeamMemberEditDialog: React.FC<TeamMemberEditDialogProps> = ({
  open,
  onOpenChange,
  member,
  onSave,
  loading = false,
}) => {
  const { darkMode } = useAppContext();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    access: [] as string[],
    status: true,
  });

  const availableModules = [
    'dashboard',
    'organizations', 
    'companies',
    'events',
    'payment_plans',
    'email_templates',
    'analytics',
    'team',
    'configuration',
    'settings'
  ];

  const moduleLabels = {
    dashboard: 'Dashboard',
    organizations: 'Organizations',
    companies: 'Companies',
    events: 'Events',
    payment_plans: 'Payment Plans',
    email_templates: 'Email Templates',
    analytics: 'Analytics',
    team: 'Team Management',
    configuration: 'Configuration',
    settings: 'Settings',
  };

  useEffect(() => {
    if (member) {
      setFormData({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        access: member.access,
        status: member.status,
      });
    }
  }, [member]);

  const handleAccessChange = (module: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        access: [...prev.access, module]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        access: prev.access.filter(m => m !== module)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      const reqData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        access: formData.access,
        status: formData.status,
      };
      onSave(reqData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderRadius: '12px',
          overflow:"hidden",
        }
      }}
    >
      <DialogTitle style={{ color: darkMode ? '#ffffff' : '#000000' }}>
        Edit Team Member
      </DialogTitle>

      <DialogContent 
        sx={{ paddingTop: 2, paddingBottom: 2, overflow: 'auto' }}
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" id="team-member-edit-form">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Enter first name"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    borderColor: darkMode ? '#4b5563' : '#d1d5db'
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Enter last name"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    borderColor: darkMode ? '#4b5563' : '#d1d5db'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@exiby.com"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
                autoComplete="off"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit_status"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="edit_status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active User
              </label>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Module Access Permissions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableModules.map((module) => (
                <div key={module} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {moduleLabels[module as keyof typeof moduleLabels]}
                    </span>
                  </div>
                  <Switch
                    checked={formData.access.includes(module)}
                    onCheckedChange={(checked) => handleAccessChange(module, checked)}
                    className="data-[state=checked]:bg-[#0077ED]"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}` }}>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
          style={{
            backgroundColor: darkMode ? '#374151' : '#f9fafb',
            color: darkMode ? '#f3f4f6' : '#374151',
            borderColor: darkMode ? '#4b5563' : '#d1d5db'
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          form="team-member-edit-form"
          type="submit"
          disabled={loading}
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white dark:text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMemberEditDialog;