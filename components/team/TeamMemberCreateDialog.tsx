'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X, Users, Eye, EyeOff } from 'lucide-react';

interface Permission {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

interface TeamMemberCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (member: any) => void;
  loading?: boolean;
}

const TeamMemberCreateDialog: React.FC<TeamMemberCreateDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
}) => {
  const { darkMode } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Viewer',
    status: true,
  });

  const roles = ['Admin', 'Manager', 'Editor', 'Viewer'];

  const getDefaultPermissions = (role: string): Permission[] => {
    const modules = [
      'dashboard', 'organizations', 'companies', 'payment_plans', 
      'email_templates', 'analytics', 'team', 'configuration', 'settings'
    ];

    return modules.map(module => {
      switch (role) {
        case 'Admin':
          return { module, can_view: true, can_create: true, can_edit: true, can_delete: true };
        case 'Manager':
          return { 
            module, 
            can_view: true, 
            can_create: !['analytics', 'team', 'configuration', 'settings'].includes(module),
            can_edit: !['analytics', 'team', 'settings'].includes(module),
            can_delete: !['analytics', 'team', 'configuration', 'settings', 'payment_plans'].includes(module)
          };
        case 'Editor':
          return { 
            module, 
            can_view: !['team', 'configuration', 'settings'].includes(module),
            can_create: ['email_templates'].includes(module),
            can_edit: ['organizations', 'companies', 'email_templates'].includes(module),
            can_delete: false
          };
        case 'Viewer':
        default:
          return { 
            module, 
            can_view: !['team', 'configuration', 'settings'].includes(module),
            can_create: false,
            can_edit: false,
            can_delete: false
          };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMember = {
      _id: `user_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      permissions: getDefaultPermissions(formData.role),
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    onSave(newMember);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Viewer',
      status: true,
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle>
        <div className="flex items-center" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
          <Users className="w-5 h-5 mr-2 text-[#0077ED]" />
          Add Team Member
        </div>
      </DialogTitle>

      <DialogContent 
        sx={{ paddingTop: 2, paddingBottom: 3 }}
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6" id="team-member-create-form">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                className="pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role *
            </label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              required
            >
              <SelectTrigger
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
              >
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="status"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active User
            </label>
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
          form="team-member-create-form"
          type="submit"
          disabled={loading || !formData.name || !formData.email || !formData.password}
          className="bg-[#0077ED] hover:bg-[#0066CC] text-white dark:text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              Creating...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Member
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMemberCreateDialog;