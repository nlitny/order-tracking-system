export interface OrderFormData {
  title: string;
  description: string;
  estimatedCompletion?: string;
  special_instructions?: string;
}

export interface AttachedFile {
  file: File;
  preview?: string;
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  estimatedCompletion?: string;
  special_instructions?: string;
  attachments?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  description: string;
  status: OrderStatus;
  estimatedCompletion?: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
}

export interface OrdersResponse {
  status: string;
  data: {
    orders: OrderItem[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface OrderDetails {
  id: string;
  title: string;
  description: string;
  status: OrderStatus;
  orderNumber: string;
  estimatedCompletion?: string;
  completedAt?: string;
  special_instructions?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OrderDetailsResponse {
  status: string;
  data: OrderDetails;
}

export interface MediaFile {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileType: "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
  path: string;
  isPublic: boolean;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediaResponse {
  status: string;
  data: {
    mediaFiles: MediaFile[];
    count: number;
  };
}

export interface AdminMediaFile {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileType: "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
  path: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMediaResponse {
  success: boolean;
  message: string;
  data: {
    mediaFiles: AdminMediaFile[];
    count: number;
  };
}

export interface AdminMediaUploadResponse {
  success: boolean;
  message: string;
  data: {
    uploadedFiles: number;
    mediaFiles: AdminMediaFile[];
  };
}

export interface OrderResponse {
  status: string;
  message: string;
  data: {
    orderId: string;
  };
}

export interface MediaUploadResponse {
  status: string;
  message: string;
  data: {
    uploadedFiles: number;
  };
}

export interface UpdateOrderData {
  title?: string;
  description?: string;
  estimatedCompletion?: string;
  special_instructions?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
}

export interface UpdateMediaDescriptionData {
  description: string;
}

export type OrderStatus =
  | "PENDING"
  | "ON_HOLD"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderFilters {
  page: number;
  limit: number;
  status?: string;
  search: string;
}

export interface UserRole {
  role: "CUSTOMER" | "ADMIN" | "STAFF";
}
