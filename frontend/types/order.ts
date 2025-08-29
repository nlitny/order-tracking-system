// types/order.ts - اضافه کردن types جدید
export interface OrderFormData {
  title: string;
  description: string;
  estimatedCompletion?: string;
  special_instructions?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface FormErrors {
  title?: string;
  description?: string;
  estimatedCompletion?: string;
  special_instructions?: string;
  attachments?: string;
}

// New types for order listing and details
export interface OrderItem {
  id: string;
  orderNumber: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
  };
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: OrderItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
      limit: number;
    };
  };
}

export interface OrderDetails {
  id: string;
  orderNumber: string;
  customerId: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
  estimatedCompletion?: string;
  special_instructions?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface OrderDetailsResponse {
  success: boolean;
  message: string;
  data: OrderDetails;
}

export interface MediaFile {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileType: "IMAGE" | "VIDEO" | "DOCUMENT";
  path: string;
  createdAt: string;
}

export interface MediaResponse {
  status: string;
  data: {
    mediaFiles: MediaFile[];
    count: number;
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    orderNumber: string;
    customerId: string;
    title: string;
    description: string;
    status: string;
    estimatedCompletion?: string;
    special_instructions?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
    customer: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface MediaUploadResponse {
  status: string;
  message: string;
  data: {
    uploadedFiles: number;
    mediaFiles: Array<{
      id: string;
      fileName: string;
      originalName: string;
      mimeType?: string;
      size: number;
      fileType: string;
      path?: string;
      createdAt: string;
    }>;
  };
}

export interface UpdateOrderData {
  title?: string;
  description?: string;
  estimatedCompletion?: string;
  special_instructions?: string;
}

export type OrderStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "ON_HOLD"
  | "";

export interface OrderFilters {
  page: number;
  limit: number;
  status: OrderStatus;
  search: string;
}
