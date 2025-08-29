// services/notificationService.ts
import axiosInstance from "@/lib/axios/csrAxios";
import {
  NotificationsResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  NotificationFilters,
} from "@/types/notification";

export const notificationService = {
  async getNotifications(
    filters: NotificationFilters
  ): Promise<NotificationsResponse> {
    try {
      const params = new URLSearchParams();
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      if (filters.isRead !== undefined) {
        params.append("isRead", filters.isRead.toString());
      }

      if (filters.type) {
        params.append("type", filters.type);
      }

      const response = await axiosInstance.get<NotificationsResponse>(
        `/notifications?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    try {
      const response = await axiosInstance.get<UnreadCountResponse>(
        "/notifications/unread-count"
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  },

  async markAsRead(notificationId: string): Promise<MarkAsReadResponse> {
    try {
      const response = await axiosInstance.patch<MarkAsReadResponse>(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  },

  async markAllAsRead(): Promise<MarkAsReadResponse> {
    try {
      const response = await axiosInstance.patch<MarkAsReadResponse>(
        "/notifications/mark-all-read"
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  },
};
