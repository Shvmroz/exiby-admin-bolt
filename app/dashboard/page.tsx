"use client";

import React from "react";
import {
  Calendar,
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  Star,
  ChevronRight,
  Trophy,
  Building,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Dummy data matching your API response structure
const dashboardData = {
  data: {
    total_organizations: 150,
    total_companies: 300,
    total_revenue: 250000,
    monthly_revenue: 45000,
    total_users: 300,
    active_subscriptions: 145,
    top_organizations: [
      {
        _id: "org_456",
        name: "TechCorp Events",
        total_events: 25,
        total_revenue: 50000,
      },
      {
        _id: "org_789",
        name: "Innovation Labs",
        total_events: 18,
        total_revenue: 35000,
      },
      {
        _id: "org_123",
        name: "StartupHub",
        total_events: 15,
        total_revenue: 28000,
      },
      {
        _id: "org_321",
        name: "Digital Summit Co",
        total_events: 12,
        total_revenue: 22000,
      },
      {
        _id: "org_654",
        name: "Event Masters",
        total_events: 10,
        total_revenue: 18000,
      },
    ],
  },
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
  bgColor: string;
  onClick: () => void;
}> = ({ title, value, icon, trend, color, bgColor, onClick }) => (
  <div
    onClick={onClick}
    // className="dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
    className={`${bgColor} dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-4">
          <div className={color}>{icon}</div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {title}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">
                {trend}
              </span>
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0077ED] transition-colors" />
    </div>
  </div>
);

const OrganizationRow: React.FC<{
  organization: {
    _id: string;
    name: string;
    total_events: number;
    total_revenue: number;
  };
  rank: number;
  maxRevenue: number;
}> = ({ organization, rank, maxRevenue }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/organizations`);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const revenuePercentage = (organization.total_revenue / maxRevenue) * 100;

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-10 h-10 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
          {getRankIcon(rank)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-[#0077ED] transition-colors truncate">
            {organization.name}
          </h3>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {organization.total_events} events
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                ${organization.total_revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(revenuePercentage, 8)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {Math.round(revenuePercentage)}%
        </span>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{
  activity: {
    title: string;
    description: string;
    time: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
  };
}> = ({ activity }) => {
  const Icon = activity.icon;
  
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className={`p-3 rounded-xl ${activity.bgColor} flex-shrink-0 shadow-sm`}>
        <Icon className={`w-5 h-5 ${activity.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {activity.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {activity.description}
        </p>
        <div className="flex items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">
            {activity.time}
          </span>
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { data } = dashboardData;

  // Recent activities data
  const recentActivities = [
    {
      title: "New Organization Registered",
      description: "TechCorp Events joined the platform",
      time: "2 minutes ago",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Event Created",
      description: "Annual Tech Summit 2024 was created",
      time: "15 minutes ago",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Payment Received",
      description: "$299 payment for event registration",
      time: "1 hour ago",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "New User Registration",
      description: "John Doe registered for an event",
      time: "2 hours ago",
      icon: User,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Subscription Renewed",
      description: "Innovation Labs renewed their subscription",
      time: "3 hours ago",
      icon: CreditCard,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  ];

  const maxRevenue = Math.max(
    ...data.top_organizations.map((org) => org.total_revenue)
  );

  const metrics = [
    {
      title: "Total Organizations",
      value: data.total_organizations,
      icon: <Building2 className="w-5 h-5" />,
      trend: "+8% this month",
      color: "text-sky-600",
      bgColor: "bg-sky-50 dark:bg-sky-900/20", 
      path: "/organizations",
    },
    {
      title: "Total Companies",
      value: data.total_companies,
      icon: <Building className="w-5 h-5" />,
      trend: "+15% this month",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      path: "/companies",
    },
    {
      title: "Total Users",
      value: data.total_users,
      icon: <User className="w-5 h-5" />,
      trend: "+12% this month",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      path: "/analytics",
    },

    {
      title: "Active Subscriptions",
      value: data.active_subscriptions,
      icon: <CreditCard className="w-5 h-5" />,
      trend: "+5% this month",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      path: "/analytics",
    },
    {
      title: "Monthly Revenue",
      value: `$${data.monthly_revenue.toLocaleString()}`,
      icon: <TrendingUp className="w-5 h-5" />,
      trend: "+18% vs last month",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      path: "/analytics",
    },
    {
      title: "Total Revenue",
      value: `$${data.total_revenue.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      trend: "+15% this month",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      path: "/analytics",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor your platform performance and key metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/analytics")}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0077ED] hover:bg-[#0066CC] text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            color={metric.color}
            bgColor={metric.bgColor}
            onClick={() => router.push(metric.path)}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Organizations */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Top Organizations
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Organizations ranked by revenue and activity
                </p>
              </div>
              <button
                onClick={() => router.push("/organizations")}
                className="flex items-center space-x-1 text-[#0077ED] hover:text-[#0066CC] font-medium text-sm transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {data.top_organizations.map((org, index) => (
                <OrganizationRow
                  key={org._id}
                  organization={org}
                  rank={index + 1}
                  maxRevenue={maxRevenue}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Activities
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Latest platform activities and updates
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
              {/* Add more activities for demonstration of scroll */}
              {recentActivities.map((activity, index) => (
                <ActivityItem key={`extra-${index}`} activity={{
                  ...activity,
                  time: `${index + 6} hours ago`
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
