export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  profilePicture?: string;
}

export interface AdminRegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  rePassword: string;
  role: "ADMIN" | "STAFF";
}

export interface AdminRegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "ADMIN" | "STAFF";
      createdAt: string;
    };
  };
}

export interface PaginationData {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  totalUsers: number;
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: PaginationData;
  };
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UsersFilters {
  search: string;
  role: "ALL" | "ADMIN" | "STAFF" | "CUSTOMER";
  isActive: "ALL" | "ACTIVE" | "INACTIVE";
  page: number;
  limit: number;
}

export interface PaginationState {
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AdminDashboardStats {
  orders: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  users: {
    admins: number;
    staff: number;
    customers: number;
    total: number;
  };
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
  createdAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboardStats;
}
