export interface NotificationOrder {
  id: string;
  orderNumber: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
}

export interface Notification {
  id: string;
  userId: string;
  orderId: string;
  type:
    | "ORDER_UPDATE"
    | "ORDER_CREATED"
    | "ORDER_CANCELLED"
    | "ORDER_COMPLETED"
    | "ORDER_APPROVED";
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string;
  createdAt: string;
  order: NotificationOrder;
}

export interface NotificationFilters {
  page: number;
  limit: number;
  isRead?: boolean;
  type?: string;
}

export interface NotificationPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: NotificationPagination;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}
