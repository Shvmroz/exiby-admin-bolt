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
  maxRevenue: number; // Make sure maxRevenue is received as a prop
}> = ({ organization, rank, maxRevenue }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/organizations`);
  };

  const getRankBarColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[#0077ED]"; // Darkest blue
      case 2:
        return "bg-[#2B8AFF]"; // Medium-dark blue
      case 3:
        return "bg-[#4A9AFF]"; // Medium blue
      case 4:
        return "bg-[#6BADFF]"; // Medium-light blue
      default:
        return "bg-[#8CC0FF]"; // Lightest blue
    }
  };

  const rankBadgeColorHash: { [key: number]: string } = {
    1: "bg-gradient-to-r from-yellow-600 to-yellow-500 text-yellow-900",
    2: "bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-900",
    3: "bg-gradient-to-r from-yellow-300 to-yellow-200 text-yellow-900",
    4: "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800",
    5: "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700",
  };

  const getRankBadgeColor = (rank: number) => {
    return (
      rankBadgeColorHash[rank] ??
      "bg-gradient-to-r from-yellow-50 to-yellow-50 text-yellow-700" // Fallback = softest yellow
    );
  };

  // Correctly calculate the revenue percentage using the maxRevenue prop
  const revenuePercentage = (organization.total_revenue / maxRevenue) * 100;

  return (
    <tr
      onClick={handleClick}
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
    >
      {/* Rank */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(
              rank
            )}`}
          >
            {rank <= 3 && rank === 1 && <span>{rank}</span>}
            {rank <= 3 && rank !== 1 && <span>{rank}</span>}
            {rank > 3 && <span>{rank}</span>}
          </div>
        </div>
      </td>

      {/* Organization Name */}
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-[#0077ED] transition-colors">
          {organization.name}
        </div>
      </td>

      {/* Events */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>{organization.total_events}</span>
        </div>
      </td>

      {/* Revenue */}
      <td className="px-6 py-4">
        <div className="text-green-500 dark:text-green-500 font-medium">
          ${organization.total_revenue.toLocaleString()}
        </div>
      </td>

      {/* Performance Bar */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${getRankBarColor(
                rank
              )} transition-all duration-500`}
              style={{ width: `${Math.max(revenuePercentage, 5)}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
            {Math.round(revenuePercentage)}%
          </span>
        </div>
      </td>
    </tr>
  );
};

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { data } = dashboardData;
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
      <div className="grid grid-cols-1 gap-8">
        {/* Top Organizations - Takes up more space */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Top Organizations
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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

            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.top_organizations.map((org, index) => (
                    <OrganizationRow
                      key={org._id}
                      organization={org}
                      rank={index + 1}
                      maxRevenue={maxRevenue}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
