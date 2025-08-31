import { useState, useEffect } from "react";
import {
  CustomerDashboardStats,
  CustomerDashboardResponse,
} from "@/types/customer";
import axiosInstance from "@/lib/axios/csrAxios";
import { useToast } from "@/lib/toast/toast";

interface UseCustomerDashboardOptions {
  enabled?: boolean;
}

export const useCustomerDashboard = ({ enabled = true }: UseCustomerDashboardOptions = {}) => {
  const [data, setData] = useState<CustomerDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    // اگر enabled false باشه، درخواست نفرست
    if (!enabled) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get<CustomerDashboardResponse>(
        "/users/dashboard"
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (error: any) {
      const errorMessage = "Failed to fetch dashboard data";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchDashboardData();
    }
  }, [enabled]);

  if (!enabled) {
    return {
      data: null,
      loading: false,
      error: null,
      refetch: () => {},
    };
  }

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};
