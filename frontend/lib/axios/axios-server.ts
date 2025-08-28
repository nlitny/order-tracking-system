import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const axiosServer = axios.create({
  baseURL: "/api/v1",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosServer.interceptors.request.use(
  async (config) => {
    const session = await getServerSession(authOptions);
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosServer.interceptors.response.use(
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

export default axiosServer;
