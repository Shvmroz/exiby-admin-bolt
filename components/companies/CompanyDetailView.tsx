"use client";

import React from "react";
import {
  Building,
  Globe,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ExternalLink,
  CheckCircle,
  XCircle,
  Linkedin,
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

interface MonthlyBreakdown {
  month: string;
  events: number;
  payments: number;
}

interface TopEvent {
  title: string;
  attendees: number;
  revenue: number;
}

interface CompanyStats {
  total_events: number;
  active_events: number;
  completed_events: number;
  total_payments: number;
  monthly_breakdown: MonthlyBreakdown[];
  top_events: TopEvent[];
}

interface Company {
  _id: string;
  orgn_user: {
    _id: string;
    name: string;
  };
  bio: {
    description: string;
    industry: string;
  };
  social_links: {
    website: string;
    linkedin: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  qr_code: {};
  status: boolean;
  total_events: number;
  total_payments: number;
  created_at: string;
  company_stats?: CompanyStats;
}

interface CompanyDetailViewProps {
  company: Company;
  onClose: () => void;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

// Mock data for demonstration
const mockCompanyStats: CompanyStats = {
  total_events: 15,
  active_events: 5,
  completed_events: 10,
  total_payments: 45000,
  monthly_breakdown: [
    { month: "2025-01", events: 3, payments: 12000 },
    { month: "2024-12", events: 4, payments: 15000 },
    { month: "2024-11", events: 2, payments: 8000 },
    { month: "2024-10", events: 3, payments: 10000 },
    { month: "2024-09", events: 3, payments: 0 },
  ],
  top_events: [
    { title: "Microsoft Build Conference", attendees: 500, revenue: 25000 },
    { title: "Azure Summit 2024", attendees: 350, revenue: 17500 },
    { title: "Developer Workshop Series", attendees: 200, revenue: 10000 },
    { title: "Cloud Innovation Day", attendees: 150, revenue: 7500 },
    { title: "AI & ML Bootcamp", attendees: 100, revenue: 5000 },
  ],
};

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({
  company,
  onClose,
}) => {
  const { darkMode } = useAppContext();

  // Use mock data for demonstration
  const companyStats = company.company_stats || mockCompanyStats;

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {company.orgn_user.name}
              </h1>
            </div>
          </div>
          <IconButton onClick={onClose}>
            <X className="w-5 h-5 text-foreground" />
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
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="events">Top Events</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto space-y-6 mt-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <TabsContent value="overview" className="space-y-6">
              <div className="lg:flex lg:gap-6">
                {/* Left side: Company Info */}
                <div className="lg:flex-1">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 font-bold mt-2">
                              {company.orgn_user.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              {company.bio.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {company.social_links.website && (
                                <a
                                  href={company.social_links.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[#0077ED] hover:text-[#0066CC] text-sm"
                                >
                                  <Globe className="w-4 h-4 mr-1" />
                                  Website
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              )}
                              {company.social_links.linkedin && (
                                <a
                                  href={company.social_links.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[#0077ED] hover:text-[#0066CC] text-sm"
                                >
                                  <Linkedin className="w-4 h-4 mr-1" />
                                  LinkedIn
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getStatusBadge(company.status)}
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            {company.bio.industry}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
                        {/* Total Events */}
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {companyStats.total_events}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Events
                          </div>
                        </div>
                        {/* Active Events */}
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {companyStats.active_events}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Active Events
                          </div>
                        </div>
                        {/* Completed Events */}
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {companyStats.completed_events}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Completed Events
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right side: Contact Info */}
                <div className="lg:w-1/3">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-[#0077ED]" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Email
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {company.contact.email}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Phone
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {company.contact.phone}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Industry
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {company.bio.industry}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Payments
                        </div>
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(company.total_payments)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
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
                    {companyStats.monthly_breakdown.map((month, index) => (
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
                            Events
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {month.events}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Payments
                          </div>
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(month.payments)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {companyStats.total_events > 0
                          ? formatCurrency(
                              companyStats.total_payments / companyStats.total_events
                            )
                          : "$0"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Avg. Payment per Event
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {Math.round((companyStats.completed_events / companyStats.total_events) * 100) || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Event Completion Rate
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-[#0077ED]" />
                    Top Performing Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companyStats.top_events.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
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

export default CompanyDetailView;