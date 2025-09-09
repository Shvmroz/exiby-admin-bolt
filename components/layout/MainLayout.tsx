"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAppContext } from "@/contexts/AppContext";
import PageSkeleton from "@/components/ui/skeleton/page-skeleton";
import Spinner from "../ui/spinner";

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  skeletonType?:
    | "dashboard"
    | "table"
    | "form"
    | "analytics"
    | "profile"
    | "settings";
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  requireAuth = false,
  skeletonType = "table",
}) => {
  const { isAuthenticated, loading } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || (requireAuth && !isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
        {/* <PageSkeleton type={skeletonType} */}
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Permanent Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar open={true} onClose={() => {}} variant="permanent" />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-80 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          variant="temporary"
        />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
