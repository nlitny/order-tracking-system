// hooks/useProfile.ts
"use client";
import { useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { AxiosError } from "axios";
import axiosInstance from "@/lib/axios/csrAxios";
import { useToast } from "@/lib/toast/toast";

interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

// Interface برای changePassword - دقیقاً همان که در PasswordChangeForm استفاده می‌شود
interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export const useProfile = () => {
  const { user, updateUser, loading: userLoading } = useUser();
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showErrorToast, showSuccessToast, showInfoToast, showWarningToast } =
    useToast();
  const updateProfile = useCallback(
    async (data: ProfileUpdateRequest): Promise<boolean> => {
      if (!user) {
        return false;
      }

      setUpdating(true);

      try {
        const response = await axiosInstance.patch("/auth/profile", {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });

        const updatedUserData = response.data;
        showSuccessToast("Profile updated successfully");
        updateUser({
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });

        return true;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to update profile";
        showErrorToast(errorMessage);
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [user, updateUser]
  );

  const changePassword = useCallback(
    async (data: PasswordChangeRequest): Promise<boolean> => {
      if (!user) {
        showWarningToast("No user data available for password change");
        return false;
      }

      setChangingPassword(true);

      try {
        await axiosInstance.put("/auth/change-password", {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
        showSuccessToast("Password changed successfully");
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to change password";
        showErrorToast(errorMessage);
        return false;
      } finally {
        setChangingPassword(false);
      }
    },
    [user]
  );

  const uploadProfileImage = useCallback(
    async (file: File): Promise<boolean> => {
      if (!user) {
        showErrorToast("No user data available for image upload");
        return false;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (file.size > maxSize) {
        showErrorToast("File size exceeds 5MB limit");
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        showErrorToast("Unsupported file type");
        return false;
      }

      setUploadingImage(true);
      showInfoToast("Uploading image, please wait...");

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosInstance.put(
          "/auth/profile-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const result = response.data;
        showSuccessToast("Profile image updated successfully");

        updateUser({
          ...user,
          profileImage: result.profileImage,
        });

        return true;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to upload image";
        showErrorToast(errorMessage);
        return false;
      } finally {
        setUploadingImage(false);
      }
    },
    [user, updateUser]
  );

  return {
    user,
    loading: userLoading,
    updating,
    changingPassword,
    uploadingImage,
    updateProfile,
    changePassword,
    uploadProfileImage,
  };
};
