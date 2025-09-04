'use client';

import React, { useState } from 'react';
import {
  Shield,
  Save,
  Edit,
  FileText,
  Scale,
  Calendar,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuillEditor from '@/components/ui/quill-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LegalSettings {
  privacy_policy: string;
  terms_conditions: string;
  updated_at: string;
}

const LegalSettingsPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('privacy');
  const [showPreview, setShowPreview] = useState(false);
  
  const [originalData] = useState<LegalSettings>({
    privacy_policy: `
      <h2>Privacy Policy</h2>
      <p><strong>Last updated:</strong> August 20, 2025</p>
      
      <h3>1. Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you create an account, register for events, or contact us for support.</p>
      
      <h3>2. How We Use Your Information</h3>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send you technical notices and support messages</li>
        <li>Communicate with you about events, offers, and promotions</li>
      </ul>
      
      <h3>3. Information Sharing</h3>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
      
      <h3>4. Data Security</h3>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      
      <h3>5. Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@platform.com</p>
    `,
    terms_conditions: `
      <h2>Terms and Conditions</h2>
      <p><strong>Last updated:</strong> August 20, 2025</p>
      
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h3>2. Use License</h3>
      <p>Permission is granted to temporarily use this platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
      <ul>
        <li>Modify or copy the materials</li>
        <li>Use the materials for any commercial purpose or for any public display</li>
        <li>Attempt to reverse engineer any software contained on the platform</li>
        <li>Remove any copyright or other proprietary notations from the materials</li>
      </ul>
      
      <h3>3. Event Registration</h3>
      <p>When you register for events through our platform:</p>
      <ul>
        <li>You agree to provide accurate and complete information</li>
        <li>You are responsible for all fees associated with your registration</li>
        <li>Cancellation policies vary by event and are set by event organizers</li>
      </ul>
      
      <h3>4. Payment Terms</h3>
      <p>All payments are processed securely through our payment partners. Refund policies are determined by individual event organizers.</p>
      
      <h3>5. Limitation of Liability</h3>
      <p>In no event shall the platform or its suppliers be liable for any damages arising out of the use or inability to use the platform.</p>
      
      <h3>6. Contact Information</h3>
      <p>For questions regarding these terms, please contact us at legal@platform.com</p>
    `,
    updated_at: "2025-08-20T09:45:12.000Z"
  });

  const [formData, setFormData] = useState<LegalSettings>(originalData);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setShowPreview(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the updated_at timestamp
      const updatedData = {
        ...formData,
        updated_at: new Date().toISOString()
      };
      
      setFormData(updatedData);
      setIsEditing(false);
      setShowPreview(false);
    } catch (error) {
      console.error('Error saving legal settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getCurrentContent = () => {
    return activeTab === 'privacy' ? formData.privacy_policy : formData.terms_conditions;
  };

  const updateCurrentContent = (content: string) => {
    if (activeTab === 'privacy') {
      setFormData({ ...formData, privacy_policy: content });
    } else {
      setFormData({ ...formData, terms_conditions: content });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Legal Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your privacy policy and terms & conditions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Configuration
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Legal Documents Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Shield className="w-5 h-5 mr-2 text-[#0077ED]" />
            Legal Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid ${showPreview && isEditing ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {/* Editor Section */}
            <div className="space-y-6">
              {/* Privacy Policy */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-[#0077ED]" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Privacy Policy
                  </h3>
                </div>
                <QuillEditor
                  value={formData.privacy_policy}
                  onChange={(value) => setFormData({ ...formData, privacy_policy: value })}
                  placeholder="Enter your privacy policy content..."
                  disabled={!isEditing}
                  rows={12}
                />
              </div>

              {/* Terms & Conditions */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Scale className="w-5 h-5 text-[#0077ED]" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Terms & Conditions
                  </h3>
                </div>
                <QuillEditor
                  value={formData.terms_conditions}
                  onChange={(value) => setFormData({ ...formData, terms_conditions: value })}
                  placeholder="Enter your terms & conditions content..."
                  disabled={!isEditing}
                  rows={12}
                />
              </div>
            </div>

            {/* Preview Section */}
            {showPreview && isEditing && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-[#0077ED]" />
                  Live Preview
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Privacy Policy</h4>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-48 overflow-y-auto prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: formData.privacy_policy }} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Terms & Conditions</h4>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-48 overflow-y-auto prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: formData.terms_conditions }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Last Updated Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {formatDate(formData.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="w-5 h-5 mr-2 text-[#0077ED]" />
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your privacy policy explains how you collect, use, and protect user data. 
                This is legally required in many jurisdictions.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Word count: {formData.privacy_policy.replace(/<[^>]*>/g, '').split(' ').length} words
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Scale className="w-5 h-5 mr-2 text-[#0077ED]" />
              Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your terms and conditions outline the rules and guidelines for using your platform. 
                These are binding agreements with your users.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Word count: {formData.terms_conditions.replace(/<[^>]*>/g, '').split(' ').length} words
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legal Notice */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Legal Compliance Notice
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Ensure your privacy policy and terms & conditions comply with applicable laws in your jurisdiction. 
                Consider consulting with legal professionals for comprehensive coverage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalSettingsPage;