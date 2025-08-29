// services/orderService.ts - اضافه کردن functions جدید
import axiosInstance from "@/lib/axios/csrAxios";
import {
  OrderFormData,
  OrderResponse,
  MediaUploadResponse,
  OrdersResponse,
  OrderDetailsResponse,
  MediaResponse,
  UpdateOrderData,
  OrderFilters,
} from "@/types/order";

export const orderService = {
  // Existing methods
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

  // New methods for order management
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

      console.log("Order details:", response.data);

      return response.data;
    } catch (error: any) {
      console.log("Error fetching order details:", error);

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
      console.log("Media files:", response.data);

      return response.data;
    } catch (error: any) {
      console.log("Error fetching media files:", error);

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
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.patch<{
        success: boolean;
        message: string;
      }>(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  },

  async deleteMedia(
    mediaId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete<{
        success: boolean;
        message: string;
      }>(`/orders/customermedia/${mediaId}`);
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
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add media");
    }
  },
};
