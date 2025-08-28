// AuthForm.tsx (بخش های مهم که باید تغییر کند)
"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Grid,
  Box,
  Button,
  Stack,
  Typography,
  Slide,
  CircularProgress,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ProgressStepper from "./ProgressStepper";
import EmailField from "./EmailField";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { AuthFormData, AuthStep, ValidationErrors } from "../utils/types";
import { validateForm } from "../utils/validation";
import { brandColors } from "@/theme/theme";
import { useToast } from "@/lib/toast/toast";
import { useAuth } from "@/hooks/useAuth"; // اضافه شد
import axiosInstance from "@/lib/axios/csrAxios";


const AuthForm: React.FC = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast, showSuccessToast, showErrorToast, showInfoToast } =
    useToast();

  // استفاده از custom hook
  const {
    authState,
    formData,
    updateFormData,
    setErrors,
    goToStep,
    resetToEmail,
    setLoading,
    completeAuthWithNextAuth,
  } = useAuth();

  // Step configuration
  const stepConfig = useMemo(() => {
    const configs = {
      email: { buttonText: "Continue" },
      login: { buttonText: "Sign In" },
      register: { buttonText: "Create Account" },
    };
    return configs[authState.step] || configs.email;
  }, [authState.step]);

  // Form submission handler - تغییر یافته
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      const validationErrors = validateForm(formData, authState.step);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showErrorToast("Please fix the errors in the form");
        return;
      }

      setErrors({});

      if (authState.step === "email") {
        // مرحله اول - ارسال ایمیل
        const submitData = { email: formData.email };
        const response = await axiosInstance.post(
          "/auth/authlogin",
          submitData
        );
        const { status, message } = response.data.data;

        if (status === "login") {
          goToStep("login");
          showInfoToast(message || "Please enter your password");
        } else if (status === "pending") {
          goToStep("register");
          showInfoToast(message || "Please complete your registration");
        }
      } else if (authState.step === "login" || authState.step === "register") {
        // مرحله نهایی - استفاده از NextAuth
        const authData: any = {
          email: formData.email,
          password: formData.password,
        };

        if (authState.step === "register") {
          authData.firstName = formData.first_name?.trim();
          authData.lastName = formData.last_name?.trim();
          authData.rePassword = formData.re_password;
        }

        const success = await completeAuthWithNextAuth(authData);

        if (success) {
          showSuccessToast("Authentication successful!");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "An error occurred. Please try again.";
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback(
    (field: keyof AuthFormData) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        updateFormData({ [field]: value });
        if (authState.errors[field]) {
          setErrors({ ...authState.errors, [field]: undefined });
        }
      },
    [updateFormData, authState.errors, setErrors]
  );

  return (
    <Grid
      size={{ xs: 12, md: 6 }}
      sx={{
        p: { xs: 4, sm: 6, md: 8 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        order: { xs: 0, md: 1 },
        background: `linear-gradient(135deg, ${alpha(
          "#ffffff",
          0.95
        )} 0%, ${alpha("#ffffff", 0.98)} 100%)`,
        backdropFilter: "blur(10px)",
      }}
    >
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <ProgressStepper currentStep={authState.step} isSmall={isSmall} />
      </Box>

      {authState.step !== "email" && (
        <Slide direction="right" in={true} timeout={300}>
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={resetToEmail}
              disabled={authState.loading}
              sx={{
                color: theme.palette.text.secondary,
                textTransform: "none",
                fontWeight: 500,
                p: 1,
                borderRadius: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(brandColors.teal, 0.08),
                  color: brandColors.teal,
                  transform: "translateX(-2px)",
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              Back to Email
            </Button>
          </Box>
        </Slide>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <Slide direction="up" in={true} timeout={400}>
            <Box>
              <EmailField
                value={formData.email}
                onChange={handleInputChange("email")}
                error={authState.errors.email}
                disabled={authState.step !== "email"}
                step={authState.step}
                loading={authState.loading}
              />
            </Box>
          </Slide>

          {/* Login Form */}
          {authState.step === "login" && (
            <Slide direction="up" in={true} timeout={500}>
              <Box>
                <LoginForm
                  password={formData.password || ""}
                  onPasswordChange={handleInputChange("password")}
                  passwordError={authState.errors.password}
                  loading={authState.loading}
                />
              </Box>
            </Slide>
          )}

          {/* Register Form */}
          {authState.step === "register" && (
            <Slide direction="up" in={true} timeout={500}>
              <Box>
                <RegisterForm
                  firstName={formData.first_name || ""}
                  lastName={formData.last_name || ""}
                  password={formData.password || ""}
                  rePassword={formData.re_password || ""}
                  onFirstNameChange={handleInputChange("first_name")}
                  onLastNameChange={handleInputChange("last_name")}
                  onPasswordChange={handleInputChange("password")}
                  onRePasswordChange={handleInputChange("re_password")}
                  errors={authState.errors}
                  loading={authState.loading}
                />
              </Box>
            </Slide>
          )}

          {/* Submit Button */}
          <Slide direction="up" in={true} timeout={600}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={authState.loading}
              endIcon={
                authState.loading ? (
                  <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
                ) : null
              }
              sx={{
                py: 1.75,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.5,
                background: `linear-gradient(135deg, ${brandColors.teal} 0%, ${brandColors.lightTeal} 100%)`,
                boxShadow: `0 6px 20px ${alpha(brandColors.teal, 0.3)}`,
                position: "relative",
                overflow: "hidden",

                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${alpha(
                    "#ffffff",
                    0.2
                  )}, transparent)`,
                  transition: "left 0.5s",
                },

                "&:hover": {
                  background: `linear-gradient(135deg, ${brandColors.navy} 0%, ${brandColors.teal} 100%)`,
                  boxShadow: `0 8px 25px ${alpha(brandColors.teal, 0.4)}`,
                  transform: "translateY(-2px)",

                  "&::before": {
                    left: "100%",
                  },
                },

                "&:active": {
                  transform: "translateY(0px)",
                  boxShadow: `0 4px 15px ${alpha(brandColors.teal, 0.3)}`,
                },

                "&:disabled": {
                  background: alpha(theme.palette.grey[400], 0.6),
                  boxShadow: "none",
                  transform: "none",

                  "&::before": {
                    display: "none",
                  },
                },

                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {!authState.loading && stepConfig.buttonText}
              {authState.loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Processing...
                </Box>
              )}
            </Button>
          </Slide>
        </Stack>
      </Box>

      {/* Footer */}
      <Slide direction="up" in={true} timeout={800}>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              fontSize: "0.875rem",
              opacity: 0.8,
            }}
          >
            By continuing, you agree to our{" "}
            <Box
              component="span"
              sx={{
                color: brandColors.teal,
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                  color: brandColors.navy,
                },
              }}
            >
              Terms of Service
            </Box>{" "}
            and{" "}
            <Box
              component="span"
              sx={{
                color: brandColors.teal,
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                  color: brandColors.navy,
                },
              }}
            >
              Privacy Policy
            </Box>
          </Typography>
        </Box>
      </Slide>
    </Grid>
  );
};

export default AuthForm;
