'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Notification {
  id: string;
  notification_type: 'event' | 'user' | 'organization' | 'payment' | 'alert' | 'success' | 'info';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

// Initial notifications data
const initialNotifications: Notification[] = [
  {
    id: '1',
    notification_type: 'event',
    title: 'New Event Created',
    message: 'TechCorp Events created "Annual Tech Conference 2024"',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    notification_type: 'payment',
    title: 'Payment Received',
    message: 'Payment of $2,500 received from Innovation Labs',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    notification_type: 'user',
    title: 'New User Registration',
    message: '15 new users registered for "Digital Marketing Summit"',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: '4',
    notification_type: 'organization',
    title: 'Organization Updated',
    message: 'StartupHub updated their organization profile',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: '5',
    notification_type: 'alert',
    title: 'Event Capacity Warning',
    message: 'Event "AI Workshop" is 90% full - only 10 spots remaining',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '6',
    notification_type: 'success',
    title: 'Event Completed',
    message: 'Event "Web Development Bootcamp" completed successfully with 150 attendees',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '7',
    notification_type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '8',
    notification_type: 'payment',
    title: 'Subscription Renewed',
    message: 'Event Masters renewed their premium subscription',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
];
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth token and theme preference
    const storedUser = localStorage.getItem('exiby_user');
    const storedTheme = localStorage.getItem('exiby_theme');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('exiby_user');
      }
    }
    
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dummy authentication logic
    if (email === 'admin@exiby.com' && password === 'admin123') {
      const userData: User = {
        id: '1',
        email: 'admin@exiby.com',
        name: 'Admin User',
        role: 'Administrator'
      };
      
      setUser(userData);
      localStorage.setItem('exiby_user', JSON.stringify(userData));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('exiby_user');
    router.push('/login');
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('exiby_theme', newMode ? 'dark' : 'light');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const value: AppContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    darkMode,
    toggleDarkMode,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};