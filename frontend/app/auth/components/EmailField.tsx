import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Email, CheckCircle } from "@mui/icons-material";
import { brandColors } from "@/theme/theme";
import { AuthStep } from "../utils/types";

interface EmailFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  step: AuthStep;
  loading?: boolean;
}

const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  error,
  disabled,
  step,
  loading = false,
}) => {
  return (
    <TextField
      fullWidth
      label="Email Address"
      type="email"
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      error={!!error}
      helperText={
        error || (step === "email" ? "We'll use this to send you updates" : "")
      }
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email
              color={error ? "error" : step !== "email" ? "success" : "action"}
            />
          </InputAdornment>
        ),
        endAdornment: step !== "email" && (
          <InputAdornment position="end">
            <CheckCircle color="success" />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          fontSize: "1rem",
          "& fieldset": {
            borderWidth: 1.5,
          },
          "&:hover fieldset": {
            borderColor: step === "email" ? brandColors.lightTeal : "inherit",
          },
          "&.Mui-focused fieldset": {
            borderColor: brandColors.teal,
            borderWidth: 2,
          },
        },
      }}
    />
  );
};

export default EmailField;
