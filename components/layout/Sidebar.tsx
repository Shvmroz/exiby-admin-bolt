"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import {
  Calendar,
  Building2,
  Users,
  BarChart3,
  Settings,
  Home,
  Building,
  Cog,
  CreditCard,
  Mail,
  Receipt,
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
    color: "text-indigo-800",
    bgColor: "bg-indigo-50",
  },
  {
    text: "Analytics",
    icon: BarChart3,
    path: "/analytics",
    color: "text-orange-800",
    bgColor: "bg-orange-50",
  },

  {
    text: "Configuration",
    icon: Cog,
    path: "/configuration",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    subItems: [
      {
        text: "General",
        icon: Settings,
        path: "/configuration",
        color: "text-orange-500",
        bgColor: "bg-orange-50",
      },
      {
        text: "Stripe",
        icon: CreditCard,
        path: "/configuration/stripe",
        color: "text-green-500",
        bgColor: "bg-green-50",
      },
      {
        text: "Email",
        icon: Mail,
        path: "/configuration/email",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      },
    ],
  },

];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  variant = "temporary",
}) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // Auto-expand configuration menu if on a config page
  React.useEffect(() => {
    if (pathname.startsWith("/configuration")) {
      setExpandedItems((prev) =>
        prev.includes("Configuration") ? prev : [...prev, "Configuration"]
      );
    }
  }, [pathname]);

  const toggleExpanded = (itemText: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemText)
        ? prev.filter((item) => item !== itemText)
        : [...prev, itemText]
    );
  };


  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex items-center ">
        <div>
          <h1 className="text-blue-500 dark:text-white text-3xl font-extrabold leading-tight">
            ExiBy
          </h1>
          <p className="text-gray-500 text-xs">Event Management</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const isActive = item.subItems
            ? item.subItems.some((subItem) => pathname === subItem.path)
            : pathname === item.path;
          const isExpanded = expandedItems.includes(item.text);
          const Icon = item.icon;

          if (item.subItems) {
            return (
              <div key={item.text}>
                <button
                  onClick={() => toggleExpanded(item.text)}
                  className={cn(
                    "w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-102"
                  )}
                >
                  <div className="flex items-center space-x-3">
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
                  </div>
                  <div
                    className={cn(
                      "transition-transform duration-200",
                      isExpanded ? "rotate-90" : ""
                    )}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Sub-items */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200 ease-in-out",
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.path;
                      const SubIcon = subItem.icon;

                      return (
                        <Link
                          key={subItem.text}
                          href={subItem.path}
                          onClick={
                            variant === "temporary" ? onClose : undefined
                          }
                          className={cn(
                            "flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 group",
                            isSubActive
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                          )}
                        >
                          <div
                            className={cn(
                              "p-1.5 rounded-md transition-colors duration-200",
                              isSubActive
                                ? `${subItem.bgColor} dark:bg-gray-700`
                                : `${subItem.bgColor} dark:bg-gray-700 group-hover:${subItem.bgColor}`
                            )}
                          >
                            <SubIcon
                              className={cn(
                                "w-4 h-4 transition-colors duration-200",
                                subItem.color
                              )}
                            />
                          </div>
                          <span className="font-medium text-sm">
                            {subItem.text}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

     

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
