'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X, Building2, Building } from 'lucide-react';

interface OrganizationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (organization: any) => void;
  loading?: boolean;
}

const OrganizationCreateDialog: React.FC<OrganizationCreateDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    category: '',
    subscription_status: 'active',
    subscription_start: new Date().toISOString().split('T')[0],
    subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrganization = {
      _id: `org_${Date.now()}`,
      orgn_user: {
        _id: `orguser_${Date.now()}`,
        name: formData.name,
      },
      bio: {
        description: formData.description,
        website: formData.website,
      },
      category: formData.category,
      subscription_status: formData.subscription_status,
      subscription_start: new Date(formData.subscription_start).toISOString(),
      subscription_end: new Date(formData.subscription_end).toISOString(),
      status: true,
      total_events: 0,
      total_companies: 0,
      total_revenue: 0,
      total_attendees: 0,
      created_at: new Date().toISOString(),
    };

    onSave(newOrganization);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      website: '',
      category: '',
      subscription_status: 'active',
      subscription_start: new Date().toISOString().split('T')[0],
      subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-[#0077ED]" />
            Create Organization
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter organization name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organization">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Organization
                    </div>
                  </SelectItem>
                  <SelectItem value="company">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Company
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription Status
              </label>
              <Select
                value={formData.subscription_status}
                onValueChange={(value) => setFormData({ ...formData, subscription_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription Start
              </label>
              <Input
                type="date"
                value={formData.subscription_start}
                onChange={(e) => setFormData({ ...formData, subscription_start: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription End
              </label>
              <Input
                type="date"
                value={formData.subscription_end}
                onChange={(e) => setFormData({ ...formData, subscription_end: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter organization description"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.category}
              className="bg-[#0077ED] hover:bg-[#0066CC]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Organization
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationCreateDialog;