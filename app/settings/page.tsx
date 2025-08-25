'use client';

import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  Building,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const SettingsSection: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-[#0077ED]/10 rounded-lg">
        <div className="text-[#0077ED]">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
      {children}
    </div>
  </div>
);

const SettingsPage: React.FC = () => {
  const { user, darkMode, toggleDarkMode } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    company: 'ExiBy Events',
    role: 'Event Manager',
    bio: 'Passionate about creating memorable events and connecting people.',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    weeklyReports: false,
    marketingEmails: false,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    dataExport: false,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account preferences and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Settings */}
          <SettingsSection
            title="Profile Information"
            description="Update your personal information and profile details"
            icon={<User className="w-5 h-5" />}
          >
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <button className="px-4 py-2 bg-[#0077ED] hover:bg-[#0066CC] text-white rounded-lg font-medium transition-colors">
                    Change Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077ED] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077ED] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077ED] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077ED] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077ED] focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button className="flex items-center space-x-2 px-6 py-3 bg-[#0077ED] hover:bg-[#0066CC] text-white rounded-lg font-medium transition-colors">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </SettingsSection>

          {/* Notification Settings */}
          <SettingsSection
            title="Notifications"
            description="Configure how you receive notifications and updates"
            icon={<Bell className="w-5 h-5" />}
          >
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get push notifications in your browser' },
                { key: 'eventReminders', label: 'Event Reminders', desc: 'Reminders about upcoming events' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly summary of your events' },
                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotional content and updates' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        [item.key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0077ED]/20 dark:peer-focus:ring-[#0077ED]/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0077ED]"></div>
                  </label>
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Security Settings */}
          <SettingsSection
            title="Security & Privacy"
            description="Manage your account security and privacy settings"
            icon={<Shield className="w-5 h-5" />}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                  { key: 'loginAlerts', label: 'Login Alerts', desc: 'Get notified of new login attempts' },
                  { key: 'dataExport', label: 'Data Export', desc: 'Allow data export requests' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.desc}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security[item.key as keyof typeof security]}
                        onChange={(e) => setSecurity({
                          ...security,
                          [item.key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0077ED]/20 dark:peer-focus:ring-[#0077ED]/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0077ED]"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Change Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="w-full pr-12 pl-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077ED] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </SettingsSection>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Appearance */}
          <SettingsSection
            title="Appearance"
            description="Customize your interface"
            icon={<Palette className="w-5 h-5" />}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle dark theme
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0077ED]/20 dark:peer-focus:ring-[#0077ED]/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0077ED]"></div>
                </label>
              </div>
            </div>
          </SettingsSection>

          {/* Account Overview */}
          <div className="bg-gradient-to-br from-[#0077ED] to-[#4A9AFF] rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="opacity-80">Account Type</span>
                <span className="font-medium">Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Events Created</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Total Attendees</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Member Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
              Danger Zone
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                Delete Account
              </button>
              <p className="text-sm text-red-600 dark:text-red-400">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;