// components/profile/PasswordChangeForm.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";

interface PasswordChangeFormProps {
  changing: boolean;
  onPasswordChange: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<boolean>;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  changing,
  onPasswordChange,
}) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validatePasswords = (): boolean => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwords.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.newPassword)) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwords.confirmPassword !== passwords.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async () => {
    if (!validatePasswords()) return;

    const success = await onPasswordChange({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });

    if (success) {
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const passwordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return "error";
    if (score <= 3) return "warning";
    return "success";
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return "Weak";
    if (score <= 3) return "Medium";
    return "Strong";
  };

  return (
    <Card sx={{ borderRadius: 1 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Change Password
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              value={passwords.currentPassword}
              onChange={(e) => {
                setPasswords({ ...passwords, currentPassword: e.target.value });
                if (errors.currentPassword)
                  setErrors({ ...errors, currentPassword: "" });
              }}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      edge="end"
                    >
                      {showPasswords.current ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) => {
                setPasswords({ ...passwords, newPassword: e.target.value });
                if (errors.newPassword)
                  setErrors({ ...errors, newPassword: "" });
              }}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {passwords.newPassword && (
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Typography variant="caption">Password strength:</Typography>
                <Typography
                  variant="caption"
                  color={`${getPasswordStrengthColor(
                    passwordStrength(passwords.newPassword)
                  )}.main`}
                  fontWeight={600}
                >
                  {getPasswordStrengthText(
                    passwordStrength(passwords.newPassword)
                  )}
                </Typography>
              </Stack>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={(e) => {
                setPasswords({ ...passwords, confirmPassword: e.target.value });
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: "" });
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      edge="end"
                    >
                      {showPasswords.confirm ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 2, borderRadius: 1 }}>
          <Typography variant="body2" fontWeight={600} mb={0.5}>
            Password Requirements:
          </Typography>
          <Typography variant="caption" display="block">
            - At least 8 characters long
          </Typography>
          <Typography variant="caption" display="block">
            - Contains uppercase and lowercase letters
          </Typography>
          <Typography variant="caption" display="block">
            - Contains at least one number
          </Typography>
        </Alert>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={
            changing ||
            !passwords.currentPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
          }
          startIcon={<Lock />}
          sx={{ mt: 3, borderRadius: 1 }}
        >
          {changing ? "Changing Password..." : "Change Password"}
        </Button>
      </CardContent>
    </Card>
  );
};
