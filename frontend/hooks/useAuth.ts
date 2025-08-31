import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthFormData, AuthStep, ValidationErrors } from "@/types/types";

interface AuthState {
  step: AuthStep;
  loading: boolean;
  errors: ValidationErrors;
  isRedirecting: boolean;
}

export const useAuth = () => {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    step: "email",
    loading: false,
    errors: {},
    isRedirecting: false,
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
      isRedirecting: false,
    });
    setFormData({
      email: formData.email,
      password: "",
      first_name: "",
      last_name: "",
      re_password: "",
    });
  }, [formData.email]);

  const setLoading = useCallback((loading: boolean) => {
    setAuthState((prev) => ({ ...prev, loading }));
  }, []);

  const setRedirecting = useCallback((isRedirecting: boolean) => {
    setAuthState((prev) => ({ ...prev, isRedirecting }));
  }, []);

  const completeAuthWithNextAuth = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      rePassword?: string;
    }): Promise<boolean> => {
      try {
        const result = await signIn("auth-completion", {
          email: data.email,
          password: data.password,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          rePassword: data.rePassword || "",
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.ok) {
          setRedirecting(true);

          await new Promise((resolve) => setTimeout(resolve, 500));

          router.push("/dashboard");

          await new Promise((resolve) => setTimeout(resolve, 1000));

          return true;
        }

        throw new Error("Authentication failed - unknown error");
      } catch (error: any) {
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
    setRedirecting,
    completeAuthWithNextAuth,
  };
};
