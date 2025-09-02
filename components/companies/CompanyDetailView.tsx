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
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { useAppContext } from '@/contexts/AppContext';

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
}

interface CompanyDetailViewProps {
  company: Company;
  onClose: () => void;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({
  company,
  onClose,
}) => {
  const { darkMode } = useAppContext();

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {company.bio.industry}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(company.status)}
            <IconButton onClick={onClose}>
              <X className="w-5 h-5 text-foreground" />
            </IconButton>
          </div>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: 2, paddingBottom: 4 }}
        dividers
        style={{ 
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderColor: darkMode ? '#374151' : '#e5e7eb'
        }}
      >
        <div className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Building className="w-5 h-5 mr-2 text-[#0077ED]" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {company.orgn_user.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {company.bio.industry}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <div className="text-gray-900 dark:text-white">
                  {company.bio.description}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created Date
                </label>
                <div className="text-gray-900 dark:text-white">
                  {formatDate(company.created_at)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Mail className="w-5 h-5 mr-2 text-[#0077ED]" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {company.contact.email}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {company.contact.phone}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Globe className="w-5 h-5 mr-2 text-[#0077ED]" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.social_links.website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Website
                    </label>
                    <a
                      href={company.social_links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#0077ED] hover:text-[#0066CC] text-sm"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      {company.social_links.website}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                {company.social_links.linkedin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn
                    </label>
                    <a
                      href={company.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#0077ED] hover:text-[#0066CC] text-sm"
                    >
                      <Linkedin className="w-4 h-4 mr-1" />
                      LinkedIn Profile
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Activity className="w-5 h-5 mr-2 text-[#0077ED]" />
                Company Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {company.total_events}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Events
                  </div>
                </div>
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(company.total_payments)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Payments
                  </div>
                </div>
              </div>
              
              {company.total_events > 0 && (
                <div className="mt-6 text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(company.total_payments / company.total_events)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Payment per Event
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code Section (if available) */}
          {Object.keys(company.qr_code).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="w-5 h-5 mr-2 text-[#0077ED]" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    QR Code data available
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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