'use client';

import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Users,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Check,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
  id: string;
  notification_type: 'event' | 'user' | 'organization' | 'payment' | 'alert' | 'success' | 'info';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'event':
      return <Calendar className="w-5 h-5" />;
    case 'user':
      return <Users className="w-5 h-5" />;
    case 'organization':
      return <Building2 className="w-5 h-5" />;
    case 'payment':
      return <DollarSign className="w-5 h-5" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5" />;
    case 'success':
      return <CheckCircle className="w-5 h-5" />;
    case 'info':
    default:
      return <Info className="w-5 h-5" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'event':
      return 'text-purple-600';
    case 'user':
      return 'text-green-600';
    case 'organization':
      return 'text-blue-600';
    case 'payment':
      return 'text-emerald-600';
    case 'alert':
      return 'text-red-600';
    case 'success':
      return 'text-green-600';
    case 'info':
    default:
      return 'text-gray-600';
  }
};

const getNotificationBgColor = (type: string) => {
  switch (type) {
    case 'event':
      return 'bg-purple-50 dark:bg-purple-900/20';
    case 'user':
      return 'bg-green-50 dark:bg-green-900/20';
    case 'organization':
      return 'bg-blue-50 dark:bg-blue-900/20';
    case 'payment':
      return 'bg-emerald-50 dark:bg-emerald-900/20';
    case 'alert':
      return 'bg-red-50 dark:bg-red-900/20';
    case 'success':
      return 'bg-green-50 dark:bg-green-900/20';
    case 'info':
    default:
      return 'bg-gray-50 dark:bg-gray-900/20';
  }
};

// Dummy notifications data
const initialNotifications: Notification[] = [
  {
    id: '1',
    notification_type: 'event',
    title: 'New Event Created',
    message: 'TechCorp Events created "Annual Tech Conference 2024"',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '2',
    notification_type: 'payment',
    title: 'Payment Received',
    message: 'Payment of $2,500 received from Innovation Labs',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    notification_type: 'user',
    title: 'New User Registration',
    message: '15 new users registered for "Digital Marketing Summit"',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
  },
  {
    id: '4',
    notification_type: 'organization',
    title: 'Organization Updated',
    message: 'StartupHub updated their organization profile',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
  },
  {
    id: '5',
    notification_type: 'alert',
    title: 'Event Capacity Warning',
    message: 'Event "AI Workshop" is 90% full - only 10 spots remaining',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
  {
    id: '6',
    notification_type: 'success',
    title: 'Event Completed',
    message: 'Event "Web Development Bootcamp" completed successfully with 150 attendees',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: '7',
    notification_type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '8',
    notification_type: 'payment',
    title: 'Subscription Renewed',
    message: 'Event Masters renewed their premium subscription',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
  },
];

interface NotificationsListProps {
  onClose?: () => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-[#0077ED]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-[#0077ED] hover:text-[#0066CC] font-medium"
            >
              Mark all read
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${getNotificationBgColor(notification.notification_type)} flex-shrink-0`}>
                    <div className={getNotificationColor(notification.notification_type)}>
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          !notification.read 
                            ? 'text-gray-600 dark:text-gray-400' 
                            : 'text-gray-500 dark:text-gray-500'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Read/Unread Status */}
                      <div className="flex items-center space-x-2 ml-2">
                        {!notification.read ? (
                          <>
                            <div className="w-2 h-2 bg-[#0077ED] rounded-full"></div>
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-gray-400 hover:text-[#0077ED]" />
                            </button>
                          </>
                        ) : (
                          <div className="w-4 h-4 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-center text-sm text-[#0077ED] hover:text-[#0066CC] font-medium py-2">
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;