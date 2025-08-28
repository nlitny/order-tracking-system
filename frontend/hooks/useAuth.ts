// hooks/useAuth.ts
import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { AuthFormData, AuthStep, ValidationErrors } from "@/types/types";

interface AuthState {
  step: AuthStep;
  loading: boolean;
  errors: ValidationErrors;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    step: "email",
    loading: false,
    errors: {},
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
    setAuthState({ step: "email", loading: false, errors: {} });
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

  // تابع برای استفاده از NextAuth در مرحله نهایی
  const completeAuthWithNextAuth = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      rePassword?: string;
    }) => {
      try {
        const result = await signIn("auth-completion", {
          email: data.email,
          password: data.password,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          rePassword: data.rePassword || "",
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.ok) {
          // موفقیت - ریدایرکت یا اقدام مطلوب
          window.location.href = "/dashboard";
          return true;
        }

        return false;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Authentication failed";
        throw new Error(errorMessage);
      }
    },
    []
  );

  return {
    authState,
    formData,
    updateFormData,
    setErrors,
    goToStep,
    resetToEmail,
    setLoading,
    completeAuthWithNextAuth,
  };
};
