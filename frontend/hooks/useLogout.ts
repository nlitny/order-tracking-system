// hooks/useLogout.ts
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
        console.log("Backend logout successful");
      } catch (error) {
        console.warn(
          "Backend logout failed, but continuing with NextAuth signout:",
          error
        );
      }

      clearUser();

      await signOut({
        callbackUrl: "/auth",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      try {
        clearUser();
        await signOut({
          callbackUrl: "/auth",
          redirect: true,
        });
      } catch (signOutError) {
        console.error("SignOut error:", signOutError);
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
