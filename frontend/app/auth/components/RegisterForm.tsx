import React, { useState, useMemo } from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Slide,
} from "@mui/material";
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from "@mui/icons-material";
import PasswordStrength from "./PasswordStrength";
import { calculatePasswordStrength } from "../utils/validation";
import { ValidationErrors } from "../utils/types";

interface RegisterFormProps {
  firstName: string;
  lastName: string;
  password: string;
  rePassword: string;
  onFirstNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationErrors;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  firstName,
  lastName,
  password,
  rePassword,
  onFirstNameChange,
  onLastNameChange,
  onPasswordChange,
  onRePasswordChange,
  errors,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const passwordStrength = useMemo(() => {
    if (password) {
      return calculatePasswordStrength(password);
    }
    return { score: 0, label: "", color: "", suggestions: [] };
  }, [password]);

  const togglePasswordVisibility = (field: "password" | "rePassword") => () => {
    if (field === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowRePassword((prev) => !prev);
    }
  };

  return (
    <Slide direction="up" in mountOnEnter>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChange={onFirstNameChange}
            disabled={loading}
            error={!!errors.first_name}
            helperText={errors.first_name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color={errors.first_name ? "error" : "action"} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChange={onLastNameChange}
            disabled={loading}
            error={!!errors.last_name}
            helperText={errors.last_name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color={errors.last_name ? "error" : "action"} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <TextField
          fullWidth
          label="Create Password"
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="Create a password"
          onChange={onPasswordChange}
          disabled={loading}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color={errors.password ? "error" : "action"} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility("password")}
                  edge="end"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <PasswordStrength strength={passwordStrength} />

        <TextField
          fullWidth
          label="Confirm Password"
          type={showRePassword ? "text" : "password"}
          value={rePassword}
          placeholder="Re-enter your password"
          onChange={onRePasswordChange}
          disabled={loading}
          error={!!errors.re_password}
          helperText={errors.re_password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color={errors.re_password ? "error" : "action"} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row" spacing={1} alignItems="center">
                  {rePassword && password === rePassword && (
                    <CheckCircle color="success" sx={{ fontSize: 20 }} />
                  )}
                  <IconButton
                    onClick={togglePasswordVisibility("rePassword")}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showRePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Stack>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Slide>
  );
};

export default RegisterForm;
