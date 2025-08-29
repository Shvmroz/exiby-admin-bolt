'use client';

import React from 'react';
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
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dummy data matching your API response structure
const dashboardData = {
  data: {
    total_organizations: 150,
    total_events: 450,
    total_users: 12500,
    total_revenue: 250000,
    monthly_revenue: 45000,
    active_subscriptions: 145,
    top_organizations: [
      {
        _id: "org_456",
        name: "TechCorp Events",
        total_events: 25,
        total_revenue: 50000
      },
      {
        _id: "org_789",
        name: "Innovation Labs",
        total_events: 18,
        total_revenue: 35000
      },
      {
        _id: "org_123",
        name: "StartupHub",
        total_events: 15,
        total_revenue: 28000
      },
      {
        _id: "org_321",
        name: "Digital Summit Co",
        total_events: 12,
        total_revenue: 22000
      },
      {
        _id: "org_654",
        name: "Event Masters",
        total_events: 10,
        total_revenue: 18000
      }
    ]
  }
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
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-lg ${bgColor} group-hover:scale-110 transition-transform duration-200`}>
            <div className={color}>
              {icon}
            </div>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {title}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
      </div>
      
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0077ED] transition-colors" />
    </div>
  </div>
);

const OrganizationCard: React.FC<{
  organization: {
    _id: string;
    name: string;
    total_events: number;
    total_revenue: number;
  };
  rank: number;
}> = ({ organization, rank }) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/organizations`);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-500';
      case 2: return 'from-gray-400 to-gray-500';
      case 3: return 'from-orange-400 to-orange-500';
      default: return 'from-[#0077ED] to-[#4A9AFF]';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Star className="w-4 h-4 text-white" />;
    }
    return <span className="text-white font-bold text-sm">{rank}</span>;
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200 cursor-pointer group border border-gray-100 dark:border-gray-600"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 bg-gradient-to-r ${getRankColor(rank)} rounded-full flex items-center justify-center shadow-sm`}>
          {getRankIcon(rank)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#0077ED] transition-colors">
            {organization.name}
          </h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{organization.total_events} events</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span>${organization.total_revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0077ED] transition-colors" />
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { data } = dashboardData;

  const metrics = [
    {
      title: 'Total Organizations',
      value: data.total_organizations,
      icon: <Building2 className="w-5 h-5" />,
      trend: '+8% this month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      path: '/organizations'
    },
    {
      title: 'Total Events',
      value: data.total_events,
      icon: <Calendar className="w-5 h-5" />,
      trend: '+12% this month',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      path: '/events'
    },
    {
      title: 'Total Users',
      value: data.total_users,
      icon: <Users className="w-5 h-5" />,
      trend: '+23% this month',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      path: '/attendees'
    },
    {
      title: 'Total Revenue',
      value: `$${data.total_revenue.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      trend: '+15% this month',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      path: '/analytics'
    },
    {
      title: 'Monthly Revenue',
      value: `$${data.monthly_revenue.toLocaleString()}`,
      icon: <TrendingUp className="w-5 h-5" />,
      trend: '+18% vs last month',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      path: '/analytics'
    },
    {
      title: 'Active Subscriptions',
      value: data.active_subscriptions,
      icon: <CreditCard className="w-5 h-5" />,
      trend: '+5% this month',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      path: '/analytics'
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
            onClick={() => router.push('/analytics')}
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
                onClick={() => router.push('/organizations')}
                className="flex items-center space-x-1 text-[#0077ED] hover:text-[#0066CC] font-medium text-sm transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {data.top_organizations.map((org, index) => (
                <OrganizationCard
                  key={org._id}
                  organization={org}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;