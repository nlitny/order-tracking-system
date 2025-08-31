import React from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import {
  HourglassEmpty,
  Pause,
  PlayArrow,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { OrderStatus } from "@/types/order";

interface OrderProgressTrackerProps {
  status: OrderStatus;
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Order Received",
    description: "Your order has been received and is awaiting review",
    icon: <HourglassEmpty />,
    color: "warning" as const,
    step: 0,
  },
  ON_HOLD: {
    label: "On Hold",
    description: "Your order is temporarily on hold",
    icon: <Pause />,
    color: "info" as const,
    step: 1,
  },
  IN_PROGRESS: {
    label: "In Progress",
    description: "We are currently working on your order",
    icon: <PlayArrow />,
    color: "primary" as const,
    step: 2,
  },
  COMPLETED: {
    label: "Completed",
    description: "Your order has been completed successfully",
    icon: <CheckCircle />,
    color: "success" as const,
    step: 3,
  },
  CANCELLED: {
    label: "Canceled",
    description: "Your order has been canceled",
    icon: <Cancel />,
    color: "error" as const,
    step: -1,
  },
};

const STEPS = [
  { key: "PENDING", label: "Order Received" },
  { key: "ON_HOLD", label: "On Hold" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
];

export default function OrderProgressTracker({
  status,
}: OrderProgressTrackerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentConfig = STATUS_CONFIG[status];
  const activeStep = currentConfig?.step;
  const isCanceled = status === "CANCELLED";

  if (isCanceled) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "error.light",
          borderRadius: 1,
          backgroundColor: "error.50",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: "50%",
              backgroundColor: "error.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentConfig.icon}
          </Box>
          <Box>
            <Typography
              variant="h6"
              color="error.main"
              sx={{ fontWeight: 600 }}
            >
              {currentConfig.label}
            </Typography>
            <Typography variant="body2" color="error.dark">
              {currentConfig.description}
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 1,
        backgroundColor: "grey.50",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Order Progress
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={currentConfig?.icon}
            label={currentConfig?.label}
            color={currentConfig?.color}
            variant="filled"
            size={isMobile ? "small" : "medium"}
          />
          <Typography variant="body2" color="text.secondary">
            {currentConfig?.description}
          </Typography>
        </Box>
      </Box>

      {isMobile ? (
        // Mobile: Horizontal progress bar
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {STEPS.map((step, index) => (
            <React.Fragment key={step.key}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    index <= activeStep
                      ? `${currentConfig.color}.main`
                      : "grey.300",
                  color: index <= activeStep ? "white" : "grey.600",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {index + 1}
              </Box>
              {index < STEPS.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    backgroundColor:
                      index < activeStep
                        ? `${currentConfig.color}.main`
                        : "grey.300",
                    borderRadius: 1,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      ) : (
        // Desktop: Vertical stepper
        <Stepper activeStep={activeStep} orientation="vertical">
          {STEPS.map((step, index) => (
            <Step key={step.key} completed={index < activeStep}>
              <StepLabel>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: index === activeStep ? 600 : 400,
                    color:
                      index <= activeStep ? "text.primary" : "text.secondary",
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
              {index === activeStep && (
                <StepContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 0 }}
                  >
                    {currentConfig.description}
                  </Typography>
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>
      )}
    </Paper>
  );
}
