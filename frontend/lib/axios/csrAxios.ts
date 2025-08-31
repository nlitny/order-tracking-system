import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
});

// باقی کد همانند قبل باقی می‌ماند
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
