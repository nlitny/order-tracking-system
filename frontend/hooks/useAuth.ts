// hooks/useAuth.ts
import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthFormData, AuthStep, ValidationErrors } from "@/types/types";

interface AuthState {
  step: AuthStep;
  loading: boolean;
  errors: ValidationErrors;
  isRedirecting: boolean; // 🔴 اضافه شد
}

export const useAuth = () => {
  const router = useRouter(); // 🔴 اضافه شد

  const [authState, setAuthState] = useState<AuthState>({
    step: "email",
    loading: false,
    errors: {},
    isRedirecting: false, // 🔴 اضافه شد
  });

  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    re_password: "",
  });

  const updateFormData = useCallback((updates: Partial<AuthFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const setErrors = useCallback((errors: ValidationErrors) => {
    setAuthState((prev) => ({ ...prev, errors }));
  }, []);

  const goToStep = useCallback((step: AuthStep) => {
    setAuthState((prev) => ({ ...prev, step, errors: {} }));
  }, []);

  const resetToEmail = useCallback(() => {
    setAuthState({
      step: "email",
      loading: false,
      errors: {},
      isRedirecting: false, // 🔴 اضافه شد
    });
    setFormData({
      email: formData.email, // حفظ ایمیل
      password: "",
      first_name: "",
      last_name: "",
      re_password: "",
    });
  }, [formData.email]);

  const setLoading = useCallback((loading: boolean) => {
    setAuthState((prev) => ({ ...prev, loading }));
  }, []);

  // 🔴 تابع جدید برای مدیریت وضعیت redirect
  const setRedirecting = useCallback((isRedirecting: boolean) => {
    setAuthState((prev) => ({ ...prev, isRedirecting }));
  }, []);

  // 🔴 اصلاح شده - مدیریت کامل loading و redirect
  const completeAuthWithNextAuth = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      rePassword?: string;
    }): Promise<boolean> => {
      try {
        console.log("🚀 Starting NextAuth authentication...");

        const result = await signIn("auth-completion", {
          email: data.email,
          password: data.password,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          rePassword: data.rePassword || "",
          redirect: false, // مهم: redirect را خودمان مدیریت می‌کنیم
          callbackUrl: "/dashboard",
        });

        console.log("NextAuth result:", result);

        if (result?.error) {
          console.error("❌ NextAuth error:", result.error);
          throw new Error(result.error);
        }

        if (result?.ok) {
          console.log("✅ Authentication successful, preparing redirect...");

          // 🔴 تنظیم وضعیت redirect
          setRedirecting(true);

          // کمی صبر کنیم تا session به‌روزرسانی شود
          await new Promise((resolve) => setTimeout(resolve, 500));

          // استفاده از Next.js router برای redirect بهتر
          router.push("/dashboard");

          // صبر اضافی برای اطمینان از redirect
          await new Promise((resolve) => setTimeout(resolve, 1000));

          return true;
        }

        throw new Error("Authentication failed - unknown error");
      } catch (error: any) {
        console.error("❌ Authentication error:", error);

        // 🔴 reset کردن وضعیت‌ها در صورت خطا
        setLoading(false);
        setRedirecting(false);

        const errorMessage =
          error instanceof Error ? error.message : "Authentication failed";
        throw new Error(errorMessage);
      }
    },
    [setLoading, setRedirecting, router]
  );

  return {
    authState,
    formData,
    updateFormData,
    setErrors,
    goToStep,
    resetToEmail,
    setLoading,
    setRedirecting, // 🔴 اضافه شد
    completeAuthWithNextAuth,
  };
};
