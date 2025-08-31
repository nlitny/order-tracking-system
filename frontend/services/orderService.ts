import axiosInstance from "@/lib/axios/csrAxios";
import {
  OrderFormData,
  OrderResponse,
  MediaUploadResponse,
  OrdersResponse,
  OrderDetailsResponse,
  MediaResponse,
  UpdateOrderData,
  UpdateOrderStatusData,
  UpdateMediaDescriptionData,
  AdminMediaUploadResponse,
  AdminMediaResponse,
  OrderFilters,
  AdminMediaFile,
} from "@/types/order";

export const orderService = {
  async createOrder(data: OrderFormData): Promise<OrderResponse> {
    try {
      const response = await axiosInstance.post<OrderResponse>("/orders", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create order"
      );
    }
  },

  async uploadMedia(
    orderId: string,
    files: File[]
  ): Promise<MediaUploadResponse | string> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosInstance.post<MediaUploadResponse>(
        `/orders/${orderId}/customermedia`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to upload media"
      );
    }
  },

  async getOrders(filters: OrderFilters): Promise<OrdersResponse> {
    try {
      const params = new URLSearchParams();
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      if (filters.status) {
        params.append("status", filters.status);
      }

      if (filters.search.trim()) {
        params.append("search", filters.search.trim());
      }

      const response = await axiosInstance.get<OrdersResponse>(
        `/orders?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  },

  async getOrderDetails(orderId: string): Promise<OrderDetailsResponse> {
    try {
      const response = await axiosInstance.get<OrderDetailsResponse>(
        `/orders/${orderId}`
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  },

  async getOrderMedia(orderId: string): Promise<MediaResponse> {
    try {
      const response = await axiosInstance.get<MediaResponse>(
        `/orders/${orderId}/customermedia`
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch media files"
      );
    }
  },

  async updateOrder(
    orderId: string,
    data: UpdateOrderData
  ): Promise<OrderDetailsResponse> {
    try {
      const response = await axiosInstance.patch<OrderDetailsResponse>(
        `/orders/${orderId}`,
        data
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update order"
      );
    }
  },

  async cancelOrder(
    orderId: string
  ): Promise<{ status: string; message: string }> {
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}/cancel`);

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  },

  async deleteMedia(
    mediaId: string
  ): Promise<{ status: string; message: string }> {
    try {
      const response = await axiosInstance.delete(
        `/orders/customermedia/${mediaId}`
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete media"
      );
    }
  },

  async addMedia(orderId: string, files: File[]): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosInstance.post<MediaUploadResponse>(
        `/orders/${orderId}/customermedia`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 600000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to upload media"
      );
    }
  },

  // New methods for admin/staff functionality
  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusData
  ): Promise<OrderDetailsResponse> {
    try {
      const response = await axiosInstance.patch<OrderDetailsResponse>(
        `/orders/${orderId}/status`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  },

  // Admin media management methods
  async getAdminMediaFiles(orderId: string): Promise<AdminMediaResponse> {
    try {
      const response = await axiosInstance.get<AdminMediaResponse>(
        `/orders/${orderId}/mediafiles`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch admin media files"
      );
    }
  },

  async uploadAdminMedia(
    orderId: string,
    files: File[]
  ): Promise<AdminMediaUploadResponse> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosInstance.post<AdminMediaUploadResponse>(
        `/orders/${orderId}/mediafiles`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 600000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to upload admin media"
      );
    }
  },

  async deleteAdminMedia(
    mediaId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(
        `/orders/mediafiles/${mediaId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete admin media"
      );
    }
  },

  async updateMediaDescription(
    mediaId: string,
    data: UpdateMediaDescriptionData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.put(
        `/orders/mediafiles/${mediaId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update media description"
      );
    }
  },
};
