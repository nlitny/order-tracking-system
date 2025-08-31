import { useCallback, useState } from "react";
import { signOut } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import axiosInstance from "@/lib/axios/csrAxios";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { clearUser } = useUser();

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      try {
        await axiosInstance.post<LogoutResponse>("/auth/logout");
      } catch (error) {}

      clearUser();

      await signOut({
        callbackUrl: "/auth",
        redirect: true,
      });
    } catch (error) {
      try {
        clearUser();
        await signOut({
          callbackUrl: "/auth",
          redirect: true,
        });
      } catch (signOutError) {
        window.location.href = "/auth";
      }
    } finally {
      setLoading(false);
    }
  }, [clearUser]);

  return {
    logout,
    loading,
  };
};
