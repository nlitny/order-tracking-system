import { useState, useCallback, useEffect } from "react";
import {
  User,
  UsersFilters,
  UsersListResponse,
  UpdateUserResponse,
  PaginationState,
} from "@/types/admin";
import { useToast } from "@/lib/toast/toast";
import axiosInstance from "@/lib/axios/csrAxios";

export const useUsersManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [filters, setFilters] = useState<UsersFilters>({
    search: "",
    role: "ALL",
    isActive: "ALL",
    page: 1,
    limit: 10,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.role !== "ALL") {
        params.append("role", filters.role);
      }
      if (filters.isActive !== "ALL") {
        params.append(
          "isActive",
          filters.isActive === "ACTIVE" ? "true" : "false"
        );
      }

      const response = await axiosInstance.get<UsersListResponse>(
        `/admin/users?${params.toString()}`
      );

      if (response.data.success) {
        setUsers(response.data.data.users);

        setPagination({
          total: response.data.data.pagination.totalUsers,
          page: response.data.data.pagination.currentPage,
          totalPages: response.data.data.pagination.totalPages,
          hasNextPage: response.data.data.pagination.hasNextPage,
          hasPreviousPage: response.data.data.pagination.hasPreviousPage,
        });
      }
    } catch (error: any) {
      showToast("Failed to fetch users", "error");

      setUsers([]);
      setPagination({
        total: 0,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  const updateUser = useCallback(
    async (
      userId: string,
      updates: { role?: "ADMIN" | "STAFF" | "CUSTOMER"; isActive?: boolean }
    ) => {


      try {
        const response = await axiosInstance.patch<UpdateUserResponse>(
          "/users/role",
          { userId, ...updates }
        );

        

        if (response.data.success) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === userId
                ? { ...user, ...response.data.data.user }
                : user
            )
          );

          showToast(
            response.data.message || "User updated successfully",
            "success"
          );
          return true;
        }
        return false;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to update user";
        showToast(message, "error");
        return false;
      }
    },
    [showToast]
  );

  const updateFilters = useCallback((newFilters: Partial<UsersFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    pagination,
    filters,
    updateFilters,
    changePage,
    updateUser,
    refetch: fetchUsers,
  };
};
