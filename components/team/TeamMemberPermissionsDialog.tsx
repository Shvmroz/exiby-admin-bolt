'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X, Shield, Eye, Edit, Plus, Trash2 } from 'lucide-react';

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
}

interface TeamMemberPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onSave: (member: any) => void;
  loading?: boolean;
}

const TeamMemberPermissionsDialog: React.FC<TeamMemberPermissionsDialogProps> = ({
  open,
  onOpenChange,
  member,
  onSave,
  loading = false,
}) => {
  const { darkMode } = useAppContext();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const moduleLabels = {
    dashboard: 'Dashboard',
    organizations: 'Organizations',
    companies: 'Companies',
    payment_plans: 'Payment Plans',
    email_templates: 'Email Templates',
    analytics: 'Analytics',
    team: 'Team Management',
    configuration: 'Configuration',
    settings: 'Settings',
  };

  const moduleIcons = {
    dashboard: '📊',
    organizations: '🏢',
    companies: '🏬',
    payment_plans: '💳',
    email_templates: '📧',
    analytics: '📈',
    team: '👥',
    configuration: '⚙️',
    settings: '🔧',
  };

  useEffect(() => {
    if (member) {
      setPermissions([...member.permissions]);
    }
  }, [member]);

  const handlePermissionChange = (moduleIndex: number, permissionType: keyof Omit<Permission, 'module'>, value: boolean) => {
    setPermissions(prev => 
      prev.map((permission, index) => 
        index === moduleIndex 
          ? { ...permission, [permissionType]: value }
          : permission
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      const updatedMember: TeamMember = {
        ...member,
        permissions,
      };
      onSave(updatedMember);
    }
  };

  const getPermissionIcon = (type: string) => {
    switch (type) {
      case 'can_view': return <Eye className="w-4 h-4" />;
      case 'can_create': return <Plus className="w-4 h-4" />;
      case 'can_edit': return <Edit className="w-4 h-4" />;
      case 'can_delete': return <Trash2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const getPermissionLabel = (type: string) => {
    switch (type) {
      case 'can_view': return 'View';
      case 'can_create': return 'Create';
      case 'can_edit': return 'Edit';
      case 'can_delete': return 'Delete';
      default: return type;
    }
  };

  const getPermissionColor = (type: string) => {
    switch (type) {
      case 'can_view': return 'text-blue-600';
      case 'can_create': return 'text-green-600';
      case 'can_edit': return 'text-yellow-600';
      case 'can_delete': return 'text-red-600';
      default: return 'text-gray-600';
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
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>
        <div className="flex items-center" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
          <Shield className="w-5 h-5 mr-2 text-[#0077ED]" />
          Manage Permissions - {member?.name}
        </div>
      </DialogTitle>

      <DialogContent 
        sx={{ paddingTop: 2, paddingBottom: 2, overflow: 'visible' }}
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6" id="permissions-form">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {permissions.map((permission, index) => (
              <Card key={permission.module}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <span className="mr-2 text-lg">
                      {moduleIcons[permission.module as keyof typeof moduleIcons]}
                    </span>
                    {moduleLabels[permission.module as keyof typeof moduleLabels]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['can_view', 'can_create', 'can_edit', 'can_delete'] as const).map((permType) => (
                      <div key={permType} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={getPermissionColor(permType)}>
                            {getPermissionIcon(permType)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getPermissionLabel(permType)}
                          </span>
                        </div>
                        <Switch
                          checked={permission[permType]}
                          onCheckedChange={(value) => handlePermissionChange(index, permType, value)}
                          className="data-[state=checked]:bg-[#0077ED]"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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
          form="permissions-form"
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
              Save Permissions
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMemberPermissionsDialog;