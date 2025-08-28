import React from "react";
import { Stepper, Step, StepLabel, alpha, useTheme } from "@mui/material";
import { brandColors } from "@/theme/theme";
import { AuthStep } from "../utils/types";

interface ProgressStepperProps {
  currentStep: AuthStep;
  isSmall: boolean;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  isSmall,
}) => {
  const theme = useTheme();
  const steps = ["Email", "Authentication", "Complete"];
  const activeStep =
    currentStep === "email" ? 0 : currentStep === "login" ? 1 : 2;

  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel={isSmall}
      sx={{
        "& .MuiStepConnector-line": {
          borderColor: alpha(brandColors.teal, 0.2),
        },
      }}
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel
            sx={{
              "& .MuiStepLabel-label": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: theme.palette.text.secondary,
                "&.Mui-active": {
                  color: brandColors.teal,
                  fontWeight: 600,
                },
                "&.Mui-completed": {
                  color: brandColors.lightTeal,
                },
              },
              "& .MuiStepIcon-root": {
                color: alpha(theme.palette.grey[400], 0.5),
                "&.Mui-active": {
                  color: brandColors.teal,
                },
                "&.Mui-completed": {
                  color: brandColors.lightTeal,
                },
              },
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ProgressStepper;
