'use client';

import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Calendar,
  Users,
  DollarSign,
  CreditCard,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import OrganizationEditDialog from '@/components/organizations/OrganizationEditDialog';

interface SubscriptionHistory {
  payment_plan: {
    plan_name: string;
  };
  billing_cycle: string;
  price: number;
  start_date: string;
  end_date: string;
  status: string;
}

interface Organization {
  _id: string;
  orgn_user: {
    _id: string;
    name: string;
  };
  bio: {
    description: string;
    website: string;
  };
  category: string;
  subscription_status: string;
  subscription_start: string;
  subscription_end: string;
  status: boolean;
  total_events: number;
  total_companies: number;
  total_revenue: number;
  total_attendees: number;
  created_at: string;
  subscription_history?: SubscriptionHistory[];
}

interface OrganizationDetailViewProps {
  organization: Organization;
  onClose: () => void;
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

const OrganizationDetailView: React.FC<OrganizationDetailViewProps> = ({
  organization,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onDelete(organization);
      onClose();
    } catch (error) {
      console.error('Error deleting organization:', error);
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  const handleSaveEdit = async (updatedOrganization: Organization) => {
    setEditLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onEdit(updatedOrganization);
      setEditDialog(false);
    } catch (error) {
      console.error('Error updating organization:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      inactive: { label: 'Inactive', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      expired: { label: 'Expired', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getSubscriptionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {organization.orgn_user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Organization Details
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setEditDialog(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-xl flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{organization.orgn_user.name}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          {organization.bio.description}
                        </p>
                        {organization.bio.website && (
                          <a
                            href={organization.bio.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[#0077ED] hover:text-[#0066CC] mt-2"
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            Visit Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(organization.subscription_status)}
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {organization.category === 'organization' ? (
                          <Building2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Building className="w-3 h-3 mr-1" />
                        )}
                        {organization.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organization.total_events}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organization.total_companies}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Companies</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(organization.total_revenue)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organization.total_attendees.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Attendees</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Current Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#0077ED]" />
                    Current Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                    <div className="font-medium">{getStatusBadge(organization.subscription_status)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Period</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(organization.subscription_start)} - {formatDate(organization.subscription_end)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(organization.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg. Event Size</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {organization.total_events > 0 ? Math.round(organization.total_attendees / organization.total_events) : 0} attendees
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Revenue per Event</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {organization.total_events > 0 ? formatCurrency(organization.total_revenue / organization.total_events) : '$0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Companies per Event</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {organization.total_events > 0 ? Math.round(organization.total_companies / organization.total_events) : 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="subscription" className="space-y-6">
              <TabsList>
                <TabsTrigger value="subscription">Subscription History</TabsTrigger>
                <TabsTrigger value="details">Organization Details</TabsTrigger>
              </TabsList>

              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {organization.subscription_history && organization.subscription_history.length > 0 ? (
                        organization.subscription_history.map((subscription, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              {getSubscriptionStatusIcon(subscription.status)}
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {subscription.payment_plan.plan_name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(subscription.price)}/{subscription.billing_cycle}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                {subscription.status}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-400">No subscription history available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Organization ID
                        </label>
                        <div className="text-gray-900 dark:text-white font-mono text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          {organization._id}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          User ID
                        </label>
                        <div className="text-gray-900 dark:text-white font-mono text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          {organization.orgn_user._id}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <div className="text-gray-900 dark:text-white capitalize">
                          {organization.category}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Account Status
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {organization.status ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {organization.bio.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDeleteDialog
          open={deleteDialog}
          onOpenChange={setDeleteDialog}
          title="Delete Organization"
          content={`Are you sure you want to delete "${organization.orgn_user.name}"? This action cannot be undone and will remove all associated data including events, attendees, and subscription history.`}
          confirmButtonText="Delete Organization"
          onConfirm={handleDelete}
          loading={deleteLoading}
        />

        {/* Edit Organization Dialog */}
        <OrganizationEditDialog
          open={editDialog}
          onOpenChange={setEditDialog}
          organization={organization}
          onSave={handleSaveEdit}
          loading={editLoading}
        />
      </div>
    </div>
  );
};

export default OrganizationDetailView;