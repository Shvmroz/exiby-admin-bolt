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
  TrendingUp,
  Activity,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import OrganizationEditDialog from '@/components/organizations/OrganizationEditDialog';

interface PaymentPlan {
  plan_name: string;
}

interface CurrentSubscription {
  organization_name: string;
  payment_plan: PaymentPlan;
  billing_cycle: string;
  current_price: number;
  start_date: string;
  end_date: string;
  status: string;
  auto_renew: boolean;
  next_billing_date: string;
}

interface SubscriptionHistory {
  payment_plan: PaymentPlan;
  billing_cycle: string;
  price: number;
  start_date: string;
  end_date: string;
  status: string;
}

interface MonthlyBreakdown {
  month: string;
  events: number;
  revenue: number;
  attendees: number;
}

interface TopEvent {
  title: string;
  attendees: number;
  revenue: number;
}

interface OrganizationStats {
  total_events: number;
  active_events: number;
  completed_events: number;
  total_revenue: number;
  total_attendees: number;
  total_companies: number;
  monthly_breakdown: MonthlyBreakdown[];
  top_events: TopEvent[];
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
  current_subscription?: CurrentSubscription;
  subscription_history?: SubscriptionHistory[];
  organization_stats?: OrganizationStats;
}

interface OrganizationDetailViewProps {
  organization: Organization;
  onClose: () => void;
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

// Mock data for demonstration
const mockCurrentSubscription: CurrentSubscription = {
  organization_name: "TechCorp Events",
  payment_plan: { plan_name: "Professional Plan" },
  billing_cycle: "monthly",
  current_price: 299,
  start_date: "2025-01-01T00:00:00.000Z",
  end_date: "2025-02-01T00:00:00.000Z",
  status: "active",
  auto_renew: true,
  next_billing_date: "2025-02-01T00:00:00.000Z"
};

const mockSubscriptionHistory: SubscriptionHistory[] = [
  {
    payment_plan: { plan_name: "Professional Plan" },
    billing_cycle: "monthly",
    price: 299,
    start_date: "2025-01-01T00:00:00.000Z",
    end_date: "2025-02-01T00:00:00.000Z",
    status: "active"
  },
  {
    payment_plan: { plan_name: "Basic Plan" },
    billing_cycle: "monthly",
    price: 99,
    start_date: "2024-12-01T00:00:00.000Z",
    end_date: "2025-01-01T00:00:00.000Z",
    status: "completed"
  },
  {
    payment_plan: { plan_name: "Starter Plan" },
    billing_cycle: "monthly",
    price: 49,
    start_date: "2024-11-01T00:00:00.000Z",
    end_date: "2024-12-01T00:00:00.000Z",
    status: "completed"
  }
];

const mockOrganizationStats: OrganizationStats = {
  total_events: 25,
  active_events: 8,
  completed_events: 17,
  total_revenue: 125000,
  total_attendees: 5000,
  total_companies: 150,
  monthly_breakdown: [
    { month: "2025-01", events: 5, revenue: 25000, attendees: 1200 },
    { month: "2024-12", events: 8, revenue: 35000, attendees: 1800 },
    { month: "2024-11", events: 6, revenue: 28000, attendees: 1400 },
    { month: "2024-10", events: 4, revenue: 18000, attendees: 900 },
    { month: "2024-09", events: 2, revenue: 19000, attendees: 700 }
  ],
  top_events: [
    { title: "Annual Tech Summit 2024", attendees: 850, revenue: 42500 },
    { title: "Innovation Workshop Series", attendees: 650, revenue: 32500 },
    { title: "Digital Transformation Conference", attendees: 500, revenue: 25000 },
    { title: "Startup Pitch Competition", attendees: 400, revenue: 20000 },
    { title: "AI & Machine Learning Expo", attendees: 350, revenue: 17500 }
  ]
};

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

  // Use mock data for demonstration
  const currentSubscription = organization.current_subscription || mockCurrentSubscription;
  const subscriptionHistory = organization.subscription_history || mockSubscriptionHistory;
  const organizationStats = organization.organization_stats || mockOrganizationStats;

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
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
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
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
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
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialog(true)}
              size="sm"
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
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="events">Top Events</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Organization Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            {organizationStats.total_events}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {organizationStats.total_companies}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Companies</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(organizationStats.total_revenue)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {organizationStats.total_attendees.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Attendees</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Subscription Card */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-[#0077ED]" />
                        Current Subscription
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Plan</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {currentSubscription.payment_plan.plan_name}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Price</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(currentSubscription.current_price)}/{currentSubscription.billing_cycle}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(currentSubscription.status)}
                          {currentSubscription.auto_renew && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Auto-renew
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Next Billing</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatDate(currentSubscription.next_billing_date)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Event Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {organizationStats.active_events}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Events</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {organizationStats.completed_events}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completed Events</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.round((organizationStats.completed_events / organizationStats.total_events) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              {/* Current Subscription Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Plan Name
                      </label>
                      <div className="text-gray-900 dark:text-white font-semibold">
                        {currentSubscription.payment_plan.plan_name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Billing Cycle
                      </label>
                      <div className="text-gray-900 dark:text-white capitalize">
                        {currentSubscription.billing_cycle}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Price
                      </label>
                      <div className="text-gray-900 dark:text-white font-semibold">
                        {formatCurrency(currentSubscription.current_price)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {formatDate(currentSubscription.start_date)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {formatDate(currentSubscription.end_date)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Auto Renew
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {currentSubscription.auto_renew ? 'Enabled' : 'Disabled'}
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
                    {subscriptionHistory.map((subscription, index) => (
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
                          <div className="text-sm">
                            {getStatusBadge(subscription.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-[#0077ED]" />
                    Monthly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizationStats.monthly_breakdown.map((month, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Month</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {formatMonth(month.month)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {month.events}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(month.revenue)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Attendees</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {month.attendees.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organizationStats.total_events > 0 ? Math.round(organizationStats.total_attendees / organizationStats.total_events) : 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Attendees per Event</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organizationStats.total_events > 0 ? formatCurrency(organizationStats.total_revenue / organizationStats.total_events) : '$0'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Revenue per Event</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {organizationStats.total_events > 0 ? Math.round(organizationStats.total_companies / organizationStats.total_events) : 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Companies per Event</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-[#0077ED]" />
                    Top Performing Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizationStats.top_events.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {event.attendees} attendees
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(event.revenue)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(event.revenue / event.attendees)} per attendee
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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