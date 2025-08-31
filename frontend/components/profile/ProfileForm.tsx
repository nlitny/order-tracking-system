"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Stack,
  Chip,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Edit, Save, Cancel, Person, Email, Phone } from "@mui/icons-material";
import { useUserData } from "@/context/UserContext";

interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

interface ProfileFormProps {
  updating: boolean;
  onUpdate: (data: ProfileUpdateRequest) => Promise<boolean>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  updating,
  onUpdate,
}) => {
  const { user } = useUserData();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      const newFormData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      };

      setFormData(newFormData);
    }
  }, [user]);

  const validateForm = useCallback((): boolean => {
    const newErrors = {
      firstName: "",
      lastName: "",
      phone: "",
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName = "First name must not exceed 50 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName = "Last name must not exceed 50 characters";
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^\+?[\d\s\-()]{10,15}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
    }

    return !hasErrors;
  }, [formData]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setErrors({ firstName: "", lastName: "", phone: "" });
  }, []);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    const updateData: ProfileUpdateRequest = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
    };

    if (formData.phone.trim()) {
      updateData.phone = formData.phone.trim();
    }

    const success = await onUpdate(updateData);

    if (success) {
      setIsEditing(false);
      setErrors({ firstName: "", lastName: "", phone: "" });
    } else {
    }
  }, [formData, validateForm, onUpdate, user]);

  const handleCancel = useCallback(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
    setErrors({ firstName: "", lastName: "", phone: "" });
    setIsEditing(false);
  }, [user]);

  const handleFieldChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [errors]
  );

  if (!user) {
    return (
      <Card sx={{ borderRadius: 1 }}>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Loading profile...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 1, boxShadow: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h6" fontWeight={600} mb={0.5}>
              Profile Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your personal information
            </Typography>
          </Box>

          {!isEditing ? (
            <Button
              startIcon={<Edit />}
              onClick={handleEdit}
              variant="outlined"
              size="medium"
              sx={{ borderRadius: 1 }}
            >
              Edit Profile
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<Cancel />}
                onClick={handleCancel}
                variant="outlined"
                size="medium"
                disabled={updating}
                sx={{ borderRadius: 1 }}
              >
                Cancel
              </Button>
              <Button
                startIcon={updating ? <CircularProgress size={16} /> : <Save />}
                onClick={handleSave}
                variant="contained"
                size="medium"
                disabled={updating}
                sx={{ borderRadius: 1 }}
              >
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          )}
        </Stack>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.firstName}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                error={!!errors.firstName}
                disabled={!isEditing}
                variant="outlined"
                placeholder="Enter your first name"
                InputProps={{
                  startAdornment: (
                    <Person sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              {errors.firstName && (
                <FormHelperText>{errors.firstName}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.lastName}>
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                error={!!errors.lastName}
                disabled={!isEditing}
                variant="outlined"
                placeholder="Enter your last name"
                InputProps={{
                  startAdornment: (
                    <Person sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              {errors.lastName && (
                <FormHelperText>{errors.lastName}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email Address"
              value={user.email || ""}
              disabled
              variant="outlined"
              helperText="Email address cannot be changed"
              InputProps={{
                startAdornment: (
                  <Email sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                },
                "& .Mui-disabled": {
                  color: "text.secondary",
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.phone}>
              <TextField
                label="Phone Number (Optional)"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                error={!!errors.phone}
                disabled={!isEditing}
                variant="outlined"
                placeholder="+1 (555) 123-4567"
                InputProps={{
                  startAdornment: (
                    <Phone sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              {errors.phone && <FormHelperText>{errors.phone}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                mb={1}
                fontWeight={500}
              >
                Account Role
              </Typography>
              <Chip
                label={user.role || "Not assigned"}
                color="primary"
                variant="outlined"
                size="medium"
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              />
              <Typography
                variant="caption"
                display="block"
                mt={0.5}
                color="text.secondary"
              >
                Role is managed by administrators
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                mb={1}
                fontWeight={500}
              >
                Account Status
              </Typography>
              <Chip
                label={user.isActive ? "Active" : "Inactive"}
                color={user.isActive ? "success" : "error"}
                variant="filled"
                size="medium"
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="caption"
                display="block"
                mt={0.5}
                color="text.secondary"
              >
                {user.isActive
                  ? "Your account is active and verified"
                  : "Your account is currently inactive"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
