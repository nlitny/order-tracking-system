// hooks/useNotifications.ts
import { useNotificationContext } from "@/context/NotificationContext";
import { useCallback } from "react";

export const useNotifications = () => {
  const context = useNotificationContext();

  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    getRecentNotifications,
  } = context;

  // Additional helper functions
  const hasUnreadNotifications = useCallback(() => {
    return unreadCount > 0;
  }, [unreadCount]);

  const getNotificationsByType = useCallback(
    (type: string) => {
      return notifications.filter((notification) => notification.type === type);
    },
    [notifications]
  );

  const getCriticalNotifications = useCallback(() => {
    return notifications.filter(
      (notification) =>
        !notification.isRead &&
        (notification.type === "ORDER_CANCELLED" ||
          notification.type === "ORDER_APPROVED")
    );
  }, [notifications]);

  const getLatestNotification = useCallback(() => {
    return notifications.length > 0 ? notifications[0] : null;
  }, [notifications]);

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,

    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,

    // Helpers
    getRecentNotifications,
    hasUnreadNotifications,
    getNotificationsByType,
    getCriticalNotifications,
    getLatestNotification,
  };
};
