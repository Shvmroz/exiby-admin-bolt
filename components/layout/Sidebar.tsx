"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  Building2,
  BarChart3,
  Settings,
  Home,
  Building,
  Cog,
  CreditCard,
  Mail,
  Receipt,
  Wrench,
  Calendar,
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
    text: "Payment Plans",
    icon: Receipt,
    path: "/payment-plans",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    text: "Organizations",
    icon: Building2,
    path: "/organizations",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    text: "Companies",
    icon: Building,
    path: "/companies",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    text: "Email Templates",
    icon: Mail,
    path: "/email-templates",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    text: "Analytics",
    icon: BarChart3,
    path: "/analytics",
    color: "text-orange-800",
    bgColor: "bg-orange-50",
  },
  // Configuration items now as top-level
  {
    text: "General Configuration",
    icon: Settings,
    path: "/configuration",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    text: "Stripe Configuration",
    icon: CreditCard,
    path: "/configuration/stripe",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    text: "Email Configuration",
    icon: Mail,
    path: "/configuration/email",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    text: "Settings",
    icon: Wrench,
    path: "/settings",
    color: "text-gray-500",
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
      <Link href="/dashboard">
        <div className="cursor-pointer h-16 pl-8 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-blue-500 dark:text-white text-3xl font-extrabold leading-tight">
             EXIBY
            </h1>
           
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex-1 py-4 px-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.text}
              href={item.path}
              onClick={variant === "temporary" ? onClose : undefined}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-blue-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-102"
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
          "fixed inset-y-0 left-0 w-80 z-50 lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
