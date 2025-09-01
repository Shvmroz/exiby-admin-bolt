"use client";

import React from "react";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Users,
  Building,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  X,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useAppContext } from '@/contexts/AppContext';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface PaymentPlan {
  _id: string;
  plan_name: string;
  description: string;
  plan_type: string;
  billing_cycle: string;
  price: number;
  currency: string;
  max_events: number;
  max_attendees: number;
  max_companies: number;
  is_active: boolean;
  is_popular: boolean;
  trial_days: number;
  target_audience?: string;
  created_at: string;
}

interface PaymentPlanDetailViewProps {
  plan: PaymentPlan;
  onClose: () => void;
  onEdit?: (plan: PaymentPlan) => void;
  onDelete?: (plan: PaymentPlan) => void;
}

// Mock usage statistics
const mockUsageStats = {
  total_subscribers: 45,
  active_subscribers: 42,
  monthly_revenue: 4230,
  conversion_rate: 15.5,
  monthly_signups: [
    { month: "2025-01", signups: 8, revenue: 4230 },
    { month: "2024-12", signups: 12, revenue: 3890 },
    { month: "2024-11", signups: 6, revenue: 2340 },
    { month: "2024-10", signups: 9, revenue: 2890 },
    { month: "2024-09", signups: 10, revenue: 3120 },
  ],
  top_organizations: [
    { name: "TechCorp Events", subscription_date: "2024-12-15", status: "active" },
    { name: "Innovation Labs", subscription_date: "2024-11-20", status: "active" },
    { name: "StartupHub", subscription_date: "2024-10-05", status: "active" },
  ]
};

const PaymentPlanDetailView: React.FC<PaymentPlanDetailViewProps> = ({
  plan,
  onClose,
}) => {
  const { darkMode } = useAppContext();

  const getStatusBadge = (isActive: boolean, isPopular: boolean) => {
    return (
      <div className="flex items-center space-x-2">
        {isActive ? (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        )}
        {isPopular && (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
      }
    );
  };

  return (
    <Dialog 
      open 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
        }
      }}
    >
      <DialogTitle>
        <div className="flex items-center justify-between" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.plan_name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(plan.price, plan.currency)} per {plan.billing_cycle}
              </p>
            </div>
          </div>
          <IconButton onClick={onClose}>
            <X className="w-5 h-5" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 4 }}
        dividers
        className="flex flex-col h-[80vh]"
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderColor: darkMode ? '#374151' : '#e5e7eb'
        }}
      >
        <Tabs defaultValue="overview" className="flex flex-col flex-1">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto space-y-6 mt-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <TabsContent value="overview" className="space-y-6">
              <div className="lg:flex lg:gap-6">
                {/* Left side: Plan Details */}
                <div className="lg:flex-1">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Plan Details
                            </h3>
                            {getStatusBadge(plan.is_active, plan.is_popular)}
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-600 dark:text-gray-400">Description</label>
                              <div data-color-mode={darkMode ? 'dark' : 'light'} className="mt-1">
                                <MDEditor.Markdown 
                                  source={plan.description} 
                                  style={{ 
                                    backgroundColor: 'transparent',
                                    color: darkMode ? '#ffffff' : '#000000'
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400">Plan Type</label>
                                <p className="font-medium text-gray-900 dark:text-white capitalize">
                                  {plan.plan_type}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400">Billing Cycle</label>
                                <p className="font-medium text-gray-900 dark:text-white capitalize">
                                  {plan.billing_cycle}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400">Trial Period</label>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {plan.trial_days} days
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400">Target Audience</label>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {plan.target_audience || 'General'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Max Events */}
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {plan.max_events}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Max Events
                          </div>
                        </div>
                        {/* Max Attendees */}
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {plan.max_attendees.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Max Attendees
                          </div>
                        </div>
                        {/* Max Companies */}
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <Building className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {plan.max_companies}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Max Companies
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right side: Pricing Info */}
                <div className="lg:w-1/3">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-[#0077ED]" />
                        Pricing Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(plan.price, plan.currency)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          per {plan.billing_cycle}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Currency
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {plan.currency}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Trial Period
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {plan.trial_days} days
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Created
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatDate(plan.created_at)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              {/* Usage Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mockUsageStats.total_subscribers}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Subscribers
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {mockUsageStats.active_subscribers}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Active Subscribers
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(mockUsageStats.monthly_revenue, plan.currency)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly Revenue
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {mockUsageStats.conversion_rate}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Conversion Rate
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="w-5 h-5 mr-2 text-[#0077ED]" />
                    Monthly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUsageStats.monthly_signups.map((month, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Month
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {formatMonth(month.month)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            New Signups
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {month.signups}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Revenue
                          </div>
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(month.revenue, plan.currency)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscribers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-[#0077ED]" />
                    Top Subscribers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUsageStats.top_organizations.map((org, index) => (
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
                              {org.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Subscribed: {formatDate(org.subscription_date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {org.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose} 
          className="px-6"
          style={{ 
            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
            color: darkMode ? '#ffffff' : '#000000'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPlanDetailView;