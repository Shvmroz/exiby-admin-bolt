"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Building2,
  Users,
  BarChart3,
  Settings,
  Home,
  Building,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: "permanent" | "temporary";
}

const menuItems = [
  {
    text: "Dashboard",
    icon: Home,
    path: "/dashboard",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    text: "Companies",
    icon: Building,
    path: "/companies",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    text: "Organizations",
    icon: Building2,
    path: "/organizations",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    text: "Analytics",
    icon: BarChart3,
    path: "/analytics",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    text: "Settings",
    icon: Settings,
    path: "/settings",
    color: "text-gray-400",
    bgColor: "bg-gray-50",
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  variant = "temporary",
}) => {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 ">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-[#0077ED] dark:text-white text-3xl font-extrabold ">
              ExiBy
            </h1>

            <p className="text-gray-500 text-sm">Event Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.text}
              href={item.path}
              onClick={variant === "temporary" ? onClose : undefined}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-102"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors duration-200",
                  isActive
                    ? `${item.bgColor} dark:bg-gray-700`
                    : `${item.bgColor} dark:bg-gray-700 group-hover:${item.bgColor}`
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    item.color
                  )}
                />
              </div>
              <span className="font-medium">{item.text}</span>
            </Link>
          );
        })}
      </div>

   
    </div>
  );

  if (variant === "permanent") {
    return <div className="w-80 flex-shrink-0">{sidebarContent}</div>;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-80 z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
