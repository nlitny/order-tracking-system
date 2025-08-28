// hooks/useProfile.ts - Hook اختصاصی برای مدیریت پروفایل
import { useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { UserData } from "@/context/UserContext";
import axiosInstance from "@/lib/axios/csrAxios";

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  // سایر فیلدهای قابل ویرایش
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
  };
}

export const useProfile = () => {
  const { user, updateUser, fetchUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (data: UpdateProfileData) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.put<UpdateProfileResponse>(
          "/auth/profile",
          data
        );

        if (response.data.success) {
          updateUser(response.data.data.user);
          return response.data.data.user;
        } else {
          throw new Error(response.data.message || "Failed to update profile");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to update profile";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [user, updateUser]
  );

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await fetchUser();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to refresh profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
};
