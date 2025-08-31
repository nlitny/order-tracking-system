export interface CustomerDashboardStats {
  orders: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  recentOrders: CustomerRecentOrder[];
}

export interface CustomerRecentOrder {
  id: string;
  orderNumber: string;
  title: string;
  status: string;
  createdAt: string;
}

export interface CustomerDashboardResponse {
  success: boolean;
  message: string;
  data: CustomerDashboardStats;
}
