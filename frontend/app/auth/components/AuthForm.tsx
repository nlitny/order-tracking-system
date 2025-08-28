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
import { axiosInstance } from "../utils/api";
import { brandColors } from "@/theme/theme";
import { useToast } from "@/lib/toast/toast";

interface AuthFormProps {
  formData: AuthFormData;
  updateFormData: (updates: Partial<AuthFormData>) => void;
  currentStep: AuthStep;
  goToStep: (step: AuthStep) => void;
  resetToEmail: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  formData,
  updateFormData,
  currentStep,
  goToStep,
  resetToEmail,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast, showSuccessToast, showErrorToast, showInfoToast } =
    useToast();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Step configuration
  const stepConfig = useMemo(() => {
    const configs = {
      email: { buttonText: "Continue" },
      login: { buttonText: "Sign In" },
      register: { buttonText: "Create Account" },
    };
    return configs[currentStep] || configs.email;
  }, [currentStep]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      const validationErrors = validateForm(formData, currentStep);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showErrorToast("Please fix the errors in the form");
        return;
      }

      setErrors({});

      let submitData: any = { email: formData.email };

      if (currentStep === "login") {
        submitData.password = formData.password;
      } else if (currentStep === "register") {
        submitData = {
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name?.trim(),
          last_name: formData.last_name?.trim(),
        };
      }

      const response = await axiosInstance.post("/auth", submitData);
      const { status, message, user } = response.data;
      if (status === "login") {
        goToStep("login");
        showInfoToast(message);
      } else if (status === "register") {
        goToStep("register");
        showInfoToast(message);
      } else if (status === "success") {
        showSuccessToast(message);
        console.log("User data:", user);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
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
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
    [updateFormData, errors]
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
        <ProgressStepper currentStep={currentStep} isSmall={isSmall} />
      </Box>
      {currentStep !== "email" && (
        <Slide direction="right" in={true} timeout={300}>
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={resetToEmail}
              disabled={loading}
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
                error={errors.email}
                disabled={currentStep !== "email"}
                step={currentStep}
                loading={loading}
              />
            </Box>
          </Slide>

          {/* Login Form */}
          {currentStep === "login" && (
            <Slide direction="up" in={true} timeout={500}>
              <Box>
                <LoginForm
                  password={formData.password || ""}
                  onPasswordChange={handleInputChange("password")}
                  passwordError={errors.password}
                  loading={loading}
                />
              </Box>
            </Slide>
          )}

          {/* Register Form */}
          {currentStep === "register" && (
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
                  errors={errors}
                  loading={loading}
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
              disabled={loading}
              endIcon={
                loading ? (
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
              {!loading && stepConfig.buttonText}
              {loading && (
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
