import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Slide } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";

interface LoginFormProps {
  password: string;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  passwordError?: string;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  password,
  onPasswordChange,
  passwordError,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Slide direction="up" in mountOnEnter>
      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        type={showPassword ? "text" : "password"}
        value={password}
        placeholder="Enter your password"
        onChange={onPasswordChange}
        disabled={loading}
        error={!!passwordError}
        helperText={passwordError}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color={passwordError ? "error" : "action"} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                tabIndex={-1}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: "1rem",
          },
        }}
      />
    </Slide>
  );
};

export default LoginForm;
