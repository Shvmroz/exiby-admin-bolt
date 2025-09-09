"use client";

import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  notification_type: string;
  read: boolean;
  created_at: string;
}

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to EventManager",
      message:
        "Your account has been successfully created. Start by creating your first event!",
      notification_type: "success",
      read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "New Event Registration",
      message:
        'Shamroz Khan has registered for your "Tech Conference 2024" event.',
      notification_type: "event",
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      title: "Payment Received",
      message: "Payment of $299 received for event registration.",
      notification_type: "payment",
      read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  // Initialize authentication state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Initialize dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // =====================================================
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials
      if (email !== "admin@exiby.com" || password !== "admin123") {
        throw new Error("Invalid email or password");
      }

      const mockUser: User = {
        id: "1",
        name: "Shamroz Khan",
        email: email,
        role: "Admin",
      };

      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("userData", JSON.stringify(mockUser));

      setIsAuthenticated(true);
      setUser(mockUser);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
      enqueueSnackbar("Login successful", { variant: "success" });

    }
    
  };
  // =====================================================

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
    enqueueSnackbar("Logout successful", { variant: "success" });
  };
  // =====================================================

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };
  // =====================================================

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  // =====================================================

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };
  // =====================================================

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  ////////////////////////////////////////////////////////////////////////////
  /////////////////////// PASS CONTEXT VALUE TO CHILDREN /////////////////////
  ////////////////////////////////////////////////////////////////////////////

  const value: AppContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    darkMode,
    toggleDarkMode,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
