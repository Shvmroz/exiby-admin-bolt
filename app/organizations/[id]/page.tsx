'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Mail,
  Edit,
  Trash2,
  CreditCard,
  BarChart3,
  ExternalLink,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import OrganizationEditDialog from '@/components/organizations/OrganizationEditDialog';

interface Organization {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio: {
    description: string;
    website: string;
    industry: string;
  };
  subscription_status: string;
  subscription_start: string;
  subscription_end: string;
  status: boolean;
  total_events: number;
  total_companies: number;
  total_revenue: number;
  total_attendees: number;
  created_at: string;
}

interface Analytics {
  total_events: number;
  active_events: number;
  completed_events: number;
  total_revenue: number;
  total_attendees: number;
  total_companies: number;
  monthly_breakdown: Array<{
    month: string;
    events: number;
    revenue: number;
    attendees: number;
  }>;
  top_events: Array<{
    _id: string;
    title: string;
    attendees: number;
    revenue: number;
  }>;
}

interface Subscription {
  current_subscription: {
    plan_name: string;
    billing_cycle: string;
    current_price: number;
    status: string;
  };
  subscription_history: Array<{
    plan_name: string;
    billing_cycle: string;
    price: number;
    status: string;
  }>;
}

// Dummy data
const dummyOrganization: Organization = {
  _id: "org_123",
  name: "TechCorp Events",
  email: "contact@techcorp.com",
  role: "organization",
  bio: {
    description: "Leading technology event organizer",
    website: "https://techcorp.com",
    industry: "Technology"
  },
  subscription_status: "active",
  subscription_start: "2025-08-01T00:00:00.000Z",
  subscription_end: "2025-09-01T00:00:00.000Z",
  status: true,
  total_events: 25,
  total_companies: 150,
  total_revenue: 125000,
  total_attendees: 5000,
  created_at: "2025-07-15T10:30:00.000Z"
};

const dummyAnalytics: Analytics = {
  total_events: 25,
  active_events: 5,
  completed_events: 20,
  total_revenue: 125000,
  total_attendees: 5000,
  total_companies: 150,
  monthly_breakdown: [
    {
      month: "2025-08",
      events: 5,
      revenue: 25000,
      attendees: 1000
    },
    {
      month: "2025-07",
      events: 8,
      revenue: 40000,
      attendees: 1600
    }
  ],
  top_events: [
    {
      _id: "event_456",
      title: "Tech Innovation Summit 2025",
      attendees: 2000,
      revenue: 50000
    }
  ]
};

const dummySubscription: Subscription = {
  current_subscription: {
    plan_name: "Professional Plan",
    billing_cycle: "monthly",
    current_price: 99,
    status: "active"
  },
  subscription_history: [
    {
      plan_name: "Starter Plan",
      billing_cycle: "monthly",
      price: 29,
      status: "completed"
    }
  ]
};

const OrganizationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const loadOrganizationData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setOrganization(dummyOrganization);
        setAnalytics(dummyAnalytics);
        setSubscription(dummySubscription);
      } catch (error) {
        console.error('Error loading organization data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizationData();
  }, [params.id]);

  const handleEdit = () => {
    setEditDialog(true);
  };

  const handleDelete = () => {
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/organizations');
    } catch (error) {
      console.error('Error deleting organization:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (updatedOrganization: any) => {
    setEditLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setOrganization(prev => prev ? {
        ...prev,
        name: updatedOrganization.orgn_user.name,
        bio: updatedOrganization.bio,
        subscription_status: updatedOrganization.subscription_status,
        subscription_start: updatedOrganization.subscription_start,
        subscription_end: updatedOrganization.subscription_end,
        status: updatedOrganization.status,
      } : null);
      
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077ED]"></div>
      </div>
    );
  }

  if (!organization || !analytics || !subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Organization Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The organization you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/organizations')}>
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {organization.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {organization.bio.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Organization Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#0077ED]" />
            <span>Organization Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">{organization.email}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Industry
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">{organization.bio.industry}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Website
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Globe className="w-4 h-4 text-gray-400" />
                <a
                  href={organization.bio.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077ED] hover:text-[#0066CC] flex items-center space-x-1"
                >
                  <span>{organization.bio.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </label>
              <div className="mt-1">
                {getStatusBadge(organization.subscription_status)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Member Since
              </label>
              <p className="text-gray-900 dark:text-white mt-1">
                {formatDate(organization.created_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Role
              </label>
              <p className="text-gray-900 dark:text-white mt-1 capitalize">
                {organization.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Analytics and Subscriptions */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Subscriptions</span>
          </TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Events
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics.total_events}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Events
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics.active_events}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(analytics.total_revenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Attendees
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics.total_attendees.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Breakdown and Top Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.monthly_breakdown.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(month.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {month.events} events • {month.attendees.toLocaleString()} attendees
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(month.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Events */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.top_events.map((event, index) => (
                    <div key={event._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.attendees.toLocaleString()} attendees
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(event.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#0077ED]" />
                <span>Current Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">
                    {subscription.current_subscription.plan_name}
                  </h3>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {subscription.current_subscription.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/80 text-sm">Billing Cycle</p>
                    <p className="font-semibold capitalize">
                      {subscription.current_subscription.billing_cycle}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Current Price</p>
                    <p className="font-semibold">
                      {formatCurrency(subscription.current_subscription.current_price)}
                      <span className="text-sm font-normal">/{subscription.current_subscription.billing_cycle}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription History */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscription.subscription_history.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {sub.plan_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {sub.billing_cycle} billing
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(sub.price)}
                      </p>
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                        {sub.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete Organization"
        content={`Are you sure you want to delete "${organization.name}"? This action cannot be undone and will remove all associated data including events, attendees, and analytics.`}
        confirmButtonText="Delete Organization"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Organization Dialog */}
      <OrganizationEditDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        organization={{
          _id: organization._id,
          orgn_user: { _id: organization._id, name: organization.name },
          bio: organization.bio,
          subscription_status: organization.subscription_status,
          subscription_start: organization.subscription_start,
          subscription_end: organization.subscription_end,
          status: organization.status,
        }}
        onSave={handleSaveEdit}
        loading={editLoading}
      />
    </div>
  );
};

export default OrganizationDetailPage;