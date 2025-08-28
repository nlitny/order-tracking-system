import React from "react";
import {
  Box,
  Typography,
  Fade,
  Slide,
  Divider,
  Stack,
  alpha,
  Grid,
} from "@mui/material";
import {
  Email,
  Login as LoginIcon,
  PersonAdd,
  TrendingUp,
  Shield,
  SupportAgent,
} from "@mui/icons-material";
import { brandColors } from "@/theme/theme";
import { AuthStep } from "../utils/types";

interface BrandPanelProps {
  currentStep: AuthStep;
}

const BrandPanel: React.FC<BrandPanelProps> = ({ currentStep }) => {
  const stepConfig = {
    email: {
      title: "Welcome to Order Tracker",
      subtitle: "Enter your email address to get started",
      icon: <Email sx={{ fontSize: { xs: 48, md: 56 }, color: "#FFFFFF" }} />,
    },
    login: {
      title: "Welcome Back!",
      subtitle: "Enter your password to access your account",
      icon: (
        <LoginIcon sx={{ fontSize: { xs: 48, md: 56 }, color: "#FFFFFF" }} />
      ),
    },
    register: {
      title: "Create Your Account",
      subtitle: "Fill in your details to create your account",
      icon: (
        <PersonAdd sx={{ fontSize: { xs: 48, md: 56 }, color: "#FFFFFF" }} />
      ),
    },
  };

  const features = [
    {
      icon: <Shield sx={{ fontSize: 24, color: "white" }} />,
      text: "Enterprise-grade Security",
      description: "Bank-level encryption & protection",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 24, color: "white" }} />,
      text: "Real-time Order Tracking",
      description: "Live updates & instant notifications",
    },
    {
      icon: <SupportAgent sx={{ fontSize: 24, color: "white" }} />,
      text: "24/7 Premium Support",
      description: "Expert assistance whenever you need",
    },
  ];

  const config = stepConfig[currentStep] || stepConfig.email;

  return (
    <Grid
      size={{ xs: 12, md: 6 }}
      sx={{
        background: `linear-gradient(135deg, ${brandColors.navy} 0%, ${brandColors.teal} 100%)`,
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: { xs: 4, sm: 6, md: 8 },
        position: "relative",
        order: { xs: 1, md: 0 },
        minHeight: { xs: "300px", md: "auto" },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 70%, ${alpha(
            "#ffffff",
            0.1
          )} 0%, transparent 60%)`,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 70% 30%, ${alpha(
            brandColors.lightTeal,
            0.2
          )} 0%, transparent 50%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2, maxWidth: 420 }}>
        {/* Icon */}
        <Fade in timeout={1000}>
          <Box
            sx={{
              mb: { xs: 3, md: 4 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: `linear-gradient(135deg, ${alpha(
                "#ffffff",
                0.15
              )} 0%, ${alpha("#ffffff", 0.05)} 100%)`,
              borderRadius: "50%",
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              margin: "0 auto",
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha("#ffffff", 0.2)}`,
            }}
          >
            {config.icon}
          </Box>
        </Fade>

        {/* Title */}
        <Slide direction="right" in timeout={1200}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2.1rem", md: "2.4rem" },
              mb: 2,
              lineHeight: 1.2,
              color: "#FFFFFF",
              textShadow: `0 2px 10px ${alpha(brandColors.navy, 0.3)}`,
            }}
          >
            {config.title}
          </Typography>
        </Slide>

        {/* Subtitle */}
        <Slide direction="right" in timeout={1400}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              lineHeight: 1.6,
              mb: { xs: 4, md: 6 },
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: alpha("#FFFFFF", 0.95),
              textShadow: `0 1px 5px ${alpha(brandColors.navy, 0.2)}`,
            }}
          >
            {config.subtitle}
          </Typography>
        </Slide>

        {/* Divider */}
        <Divider
          sx={{
            borderColor: alpha("#FFFFFF", 0.3),
            mb: 5,
            "&::before, &::after": {
              borderColor: alpha("#FFFFFF", 0.3),
            },
          }}
        />

        {/* Features */}
        <Slide direction="up" in timeout={1600}>
          <Stack spacing={4}>
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 3,
                  textAlign: "left",
                  p: 2,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(
                    "#ffffff",
                    0.08
                  )} 0%, ${alpha("#ffffff", 0.03)} 100%)`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha("#ffffff", 0.1)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${alpha(
                      "#ffffff",
                      0.12
                    )} 0%, ${alpha("#ffffff", 0.06)} 100%)`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${alpha(brandColors.navy, 0.2)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(
                      "#ffffff",
                      0.15
                    )} 0%, ${alpha("#ffffff", 0.08)} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    height: 48,
                    border: `1px solid ${alpha("#ffffff", 0.15)}`,
                  }}
                >
                  {feature.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      mb: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {feature.text}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: alpha("#FFFFFF", 0.8),
                      lineHeight: 1.5,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Slide>
      </Box>
    </Grid>
  );
};

export default BrandPanel;
