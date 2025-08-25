'use client';

import React from 'react';
import {
  Calendar,
  Users,
  Building2,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  ArrowUpRight,
  MoreVertical,
} from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
  bgColor: string;
}> = ({ title, value, icon, trend, color, bgColor }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <div className="flex items-center mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl ${bgColor}`}>
        <div className={color}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const EventCard: React.FC<{
  title: string;
  date: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'live' | 'completed';
}> = ({ title, date, location, attendees, status }) => {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    live: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
            {title}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{attendees} attendees</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Event Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your events, organizations, and attendees
          </p>
        </div>
        <button className="px-6 py-3 bg-[#0077ED] hover:bg-[#0066CC] text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl">
          Create Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value="124"
          icon={<Calendar className="w-6 h-6" />}
          trend="+12% this month"
          color="text-blue-600"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="Active Organizations"
          value="48"
          icon={<Building2 className="w-6 h-6" />}
          trend="+8% this month"
          color="text-green-600"
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          title="Total Attendees"
          value="2,847"
          icon={<Users className="w-6 h-6" />}
          trend="+23% this month"
          color="text-purple-600"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatCard
          title="Revenue"
          value="$45,210"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="+15% this month"
          color="text-orange-600"
          bgColor="bg-orange-50 dark:bg-orange-900/20"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Events
              </h2>
              <button className="text-[#0077ED] hover:text-[#0066CC] font-medium text-sm">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              <EventCard
                title="Tech Conference 2025"
                date="Jan 15, 2025 - 9:00 AM"
                location="San Francisco, CA"
                attendees={245}
                status="upcoming"
              />
              <EventCard
                title="Marketing Summit"
                date="Jan 12, 2025 - 2:00 PM"
                location="New York, NY"
                attendees={189}
                status="live"
              />
              <EventCard
                title="Design Workshop"
                date="Jan 10, 2025 - 10:00 AM"
                location="Los Angeles, CA"
                attendees={67}
                status="completed"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Top Organizations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Organizations
            </h3>
            <div className="space-y-4">
              {[
                { name: 'TechCorp Inc.', events: 12, rating: 4.9 },
                { name: 'Innovation Labs', events: 8, rating: 4.8 },
                { name: 'StartupHub', events: 6, rating: 4.7 },
              ].map((org, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {org.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {org.events} events
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{org.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#0077ED] to-[#4A9AFF] rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors">
                <div className="font-medium">Create New Event</div>
                <div className="text-sm opacity-80">Set up your next event</div>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors">
                <div className="font-medium">Invite Organization</div>
                <div className="text-sm opacity-80">Add new partners</div>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm opacity-80">Check performance</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;