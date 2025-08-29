// contexts/NotificationContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { notificationService } from "@/services/notificationService";
import { Notification } from "@/types/notification";
import { useToast } from "@/lib/toast/toast";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  lastFetchTime: number;
}

type NotificationAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "UPDATE_LAST_FETCH_TIME"; payload: number };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetchTime: 0,
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        loading: false,
        error: null,
      };

    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.isRead
          ? state.unreadCount
          : state.unreadCount + 1,
      };

    case "UPDATE_LAST_FETCH_TIME":
      return { ...state, lastFetchTime: action.payload };

    default:
      return state;
  }
}

interface NotificationContextType extends NotificationState {
  fetchNotifications: (limit?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  getRecentNotifications: (limit?: number) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { showErrorToast } = useToast();

  const fetchNotifications = useCallback(
    async (limit: number = 20) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await notificationService.getNotifications({
          page: 1,
          limit,
        });

        dispatch({
          type: "SET_NOTIFICATIONS",
          payload: response.data.notifications,
        });
        dispatch({ type: "UPDATE_LAST_FETCH_TIME", payload: Date.now() });
      } catch (error: any) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        showErrorToast("Failed to fetch notifications");
      }
    },
    [showErrorToast]
  );

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      dispatch({
        type: "SET_UNREAD_COUNT",
        payload: response.data.unreadCount,
      });
    } catch (error: any) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.markAsRead(notificationId);
        dispatch({ type: "MARK_AS_READ", payload: notificationId });

        // Update unread count
        fetchUnreadCount();
      } catch (error: any) {
        showErrorToast("Failed to mark notification as read");
      }
    },
    [fetchUnreadCount, showErrorToast]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      dispatch({ type: "MARK_ALL_AS_READ" });
      dispatch({ type: "SET_UNREAD_COUNT", payload: 0 });
    } catch (error: any) {
      showErrorToast("Failed to mark all notifications as read");
    }
  }, [showErrorToast]);

  const refreshNotifications = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  const getRecentNotifications = useCallback(
    (limit: number = 8) => {
      return state.notifications
        .sort((a, b) => {
          // مرتب‌سازی بر اساس خوانده نشده، سپس زمان
          if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
          return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
        })
        .slice(0, limit);
    },
    [state.notifications]
  );

  // Auto-refresh every 3-4 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshNotifications();
    }, 3.5 * 60 * 1000); // 3.5 minutes

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  // Initial fetch
  useEffect(() => {
    refreshNotifications();
  }, []);

  const contextValue: NotificationContextType = {
    ...state,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    getRecentNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
