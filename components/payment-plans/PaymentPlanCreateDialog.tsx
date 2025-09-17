'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QuillEditor from '@/components/ui/quill-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X, CreditCard } from 'lucide-react';

interface PaymentPlanCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plan: any) => void;
  loading?: boolean;
}

const PaymentPlanCreateDialog: React.FC<PaymentPlanCreateDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
}) => {
  const { darkMode } = useAppContext();
  const [formData, setFormData] = useState({
    plan_name: '',
    description: '',
    plan_type: 'recurring',
    billing_cycle: 'monthly',
    price: 0,
    currency: 'USD',
    max_events: 0,
    max_attendees: 0,
    max_companies: 0,
    is_active: true,
    is_popular: false,
    trial_days: 14,
  });

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const billingCycles = ['monthly', 'yearly', 'quarterly'];
  const planTypes = ['recurring', 'one-time'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlan = {
      _id: `plan_${Date.now()}`,
      ...formData,
      created_at: new Date().toISOString(),
    };

    onSave(newPlan);
    
    // Reset form
    setFormData({
      plan_name: '',
      description: '',
      plan_type: 'recurring',
      billing_cycle: 'monthly',
      price: 0,
      currency: 'USD',
      max_events: 0,
      max_attendees: 0,
      max_companies: 0,
      is_active: true,
      is_popular: false,
      trial_days: 14,
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
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderRadius: '12px',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>
        <div className="flex items-center" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
          <CreditCard className="w-5 h-5 mr-2 text-[#0077ED]" />
          Create Payment Plan
        </div>
      </DialogTitle>

      <DialogContent 
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6" id="payment-plan-create-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Plan Name *
              </label>
              <Input
                value={formData.plan_name}
                onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                placeholder="Enter plan name"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Price *
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Currency *
              </label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
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
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Plan Type *
              </label>
              <Select
                value={formData.plan_type}
                onValueChange={(value) => setFormData({ ...formData, plan_type: value })}
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
                  {planTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Billing Cycle *
              </label>
              <Select
                value={formData.billing_cycle}
                onValueChange={(value) => setFormData({ ...formData, billing_cycle: value })}
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
                  {billingCycles.map(cycle => (
                    <SelectItem key={cycle} value={cycle}>
                      {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Events */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Max Events *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.max_events}
                onChange={(e) => setFormData({ ...formData, max_events: parseInt(e.target.value) || 0 })}
                placeholder="0"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
              />
            </div>

            {/* Max Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Max Attendees *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) || 0 })}
                placeholder="0"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
              />
            </div>

            {/* Max Companies */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Max Companies *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.max_companies}
                onChange={(e) => setFormData({ ...formData, max_companies: parseInt(e.target.value) || 0 })}
                placeholder="0"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
                required
              />
            </div>

            {/* Trial Days */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Trial Days
              </label>
              <Input
                type="number"
                min="0"
                value={formData.trial_days}
                onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) || 0 })}
                placeholder="14"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderColor: darkMode ? '#4b5563' : '#d1d5db'
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Description
            </label>
            <QuillEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Enter plan description"
              rows={3}
              style={{
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                borderColor: darkMode ? '#4b5563' : '#d1d5db'
              }}
              disabled={false}
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Active Plan
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_popular"
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                className="w-4 h-4 text-[#0077ED] bg-gray-100 border-gray-300 rounded focus:ring-[#0077ED] dark:focus:ring-[#0077ED] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="is_popular" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Popular Plan
              </label>
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
          form="payment-plan-create-form"
          type="submit"
          disabled={loading || !formData.plan_name || formData.price <= 0}
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
              Create Plan
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPlanCreateDialog;