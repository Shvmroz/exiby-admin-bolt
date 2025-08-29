'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'event' | 'user' | 'organization' | 'payment' | 'alert' | 'success' | 'info';
  read: boolean;
  created_at: string;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  darkMode: boolean;
  notifications: Notification[];
  unreadNotificationsCount: number;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleDarkMode: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
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

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Event Registration',
      message: 'John Doe has registered for Tech Conference 2024',
      notification_type: 'event',
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'Payment of $299 received for Premium Plan subscription',
      notification_type: 'payment',
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: '3',
      title: 'Organization Updated',
      message: 'TechCorp organization profile has been updated',
      notification_type: 'organization',
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '4',
      title: 'New User Joined',
      message: 'Sarah Wilson has joined your organization',
      notification_type: 'user',
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
    {
      id: '5',
      title: 'System Alert',
      message: 'Scheduled maintenance will occur tonight at 2 AM EST',
      notification_type: 'alert',
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
  ]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user is logged in (simulate with localStorage)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
     // Simple authentication check - accept admin credentials or any valid email/password combo
     if ((email === 'admin@exiby.com' && password === 'admin123') || 
         (email.includes('@') && password.length >= 3)) {
       // Mock user data
       const mockUser: User = {
         id: '1',
         name: 'John Smith',
         email: email,
         role: 'Event Manager',
       };
       
       setUser(mockUser);
       setIsAuthenticated(true);
       localStorage.setItem('user', JSON.stringify(mockUser));
     } else {
       throw new Error('Invalid credentials');
     }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
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

  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const value: AppContextType = {
    user,
    isAuthenticated,
    loading,
    darkMode,
    notifications,
    unreadNotificationsCount,
    login,
    logout,
    toggleDarkMode,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};