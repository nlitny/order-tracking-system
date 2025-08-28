"use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  Fade,
  Grid,
  alpha,
  useTheme,
} from "@mui/material";
import { brandColors } from "@/theme/theme";
import BrandPanel from "./components/BrandPanel";
import AuthForm from "./components/AuthForm";
import { AuthFormData, AuthStep } from "./utils/types";

const AuthPage: React.FC = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    re_password: "",
  });

  const [step, setStep] = useState<AuthStep>("email");

  const updateFormData = useCallback((updates: Partial<AuthFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((newStep: AuthStep) => {
    setStep(newStep);
  }, []);

  const resetToEmail = useCallback(() => {
    setStep("email");
    setFormData((prev) => ({
      email: prev.email,
      password: "",
      first_name: "",
      last_name: "",
      re_password: "",
    }));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          brandColors.navy,
          0.03
        )} 0%, ${alpha(brandColors.teal, 0.02)} 50%, ${alpha(
          brandColors.lightTeal,
          0.03
        )} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 2 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${alpha(
            brandColors.teal,
            0.01
          )} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${alpha(
            brandColors.navy,
            0.01
          )} 0%, transparent 50%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
                boxShadow: `0 20px 60px ${alpha(brandColors.navy, 0.08)}`,
                borderRadius: 2,
              }}
            >
              <Grid container sx={{ minHeight: { xs: "auto", md: "700px" } }}>
                <BrandPanel currentStep={step} />
                <AuthForm
                  formData={formData}
                  updateFormData={updateFormData}
                  currentStep={step}
                  goToStep={goToStep}
                  resetToEmail={resetToEmail}
                />
              </Grid>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AuthPage;
