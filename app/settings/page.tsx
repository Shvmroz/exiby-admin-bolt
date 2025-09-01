"use client";

import React from "react";
import { User, Lock, Settings as SettingsIcon, ArrowRight } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";

const SettingsPage: React.FC = () => {
  const { user } = useAppContext();
  const router = useRouter();

  const navigationItems = [
    {
      title: "Profile Settings",
      description: "Update your personal information and profile details",
      icon: <User className="w-5 h-5" />,
      path: "/profile",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Change Password",
      description: "Update your account password for better security",
      icon: <Lock className="w-5 h-5" />,
      path: "/change-password",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ];

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
        {/* Navigation Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[#0077ED]/10 rounded-lg">
                <SettingsIcon className="w-5 h-5 text-[#0077ED]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Account Management
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access different settings sections
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="space-y-4">
                {navigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(item.path)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <div className={item.color}>{item.icon}</div>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Account Overview Sidebar */}
        <div className="space-y-6">
          <div className="bg-sky-100 dark:bg-sky-900 rounded-2xl p-6 text-sky-900 dark:text-sky-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Account Overview</h3>
              {/* Status Chip */}
              <span
  className={`px-3 py-1 text-sm font-medium rounded-full border ${
    true
      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-700 dark:text-emerald-100 dark:border-emerald-500"
      : "bg-red-100 text-red-800 border-red-300 dark:bg-red-700 dark:text-red-100 dark:border-red-500"
  }`}
>
  Active
</span>

            </div>
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
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
