"use client";

import React, { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuillEditor from "@/components/ui/quillEditor/quillEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, Building2, Building } from "lucide-react";

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
  const { darkMode } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    category: "",
    subscription_status: "active",
    subscription_start: new Date().toISOString().split("T")[0],
    subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
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
      name: "",
      description: "",
      website: "",
      category: "",
      subscription_status: "active",
      subscription_start: new Date().toISOString().split("T")[0],
      subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle>
        <div
          className="flex items-center"
          style={{ color: darkMode ? "#ffffff" : "#000000" }}
        >
          <Building2 className="w-5 h-5 mr-2 text-[#0077ED]" />
          Create Organization
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          id="organization-create-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Organization Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter organization name"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#ffffff",
                  color: darkMode ? "#ffffff" : "#000000",
                  borderColor: darkMode ? "#4b5563" : "#d1d5db",
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                >
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
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Website
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://example.com"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#ffffff",
                  color: darkMode ? "#ffffff" : "#000000",
                  borderColor: darkMode ? "#4b5563" : "#d1d5db",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Subscription Status
              </label>
              <Select
                value={formData.subscription_status}
                onValueChange={(value) =>
                  setFormData({ ...formData, subscription_status: value })
                }
              >
                <SelectTrigger
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                >
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
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Subscription Start
              </label>
              <Input
                type="date"
                value={formData.subscription_start}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscription_start: e.target.value,
                  })
                }
                style={{
                  backgroundColor: darkMode ? "#374151" : "#ffffff",
                  color: darkMode ? "#ffffff" : "#000000",
                  borderColor: darkMode ? "#4b5563" : "#d1d5db",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Subscription End
              </label>
              <Input
                type="date"
                value={formData.subscription_end}
                onChange={(e) =>
                  setFormData({ ...formData, subscription_end: e.target.value })
                }
                style={{
                  backgroundColor: darkMode ? "#374151" : "#ffffff",
                  color: darkMode ? "#ffffff" : "#000000",
                  borderColor: darkMode ? "#4b5563" : "#d1d5db",
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Description
            </label>
            <QuillEditor
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              placeholder="Enter organization description"
              rows={4}
              style={{
                backgroundColor: darkMode ? "#374151" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
                borderColor: darkMode ? "#4b5563" : "#d1d5db",
              }}
              disabled={false}
            />
          </div>
        </form>
      </DialogContent>

      <DialogActions
        sx={{ borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}` }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
          style={{
            backgroundColor: darkMode ? "#374151" : "#f9fafb",
            color: darkMode ? "#f3f4f6" : "#374151",
            borderColor: darkMode ? "#4b5563" : "#d1d5db",
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          form="organization-create-form"
          type="submit"
          disabled={loading || !formData.name || !formData.category}
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
              Create Organization
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrganizationCreateDialog;