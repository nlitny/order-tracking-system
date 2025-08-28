"use client";
import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Container,
  useTheme,
  alpha,
  FormControl,
  FormHelperText,
  Backdrop,
  CircularProgress,
  Alert,
  Collapse,
  Tooltip,
  Fade,
  Stack,
  Badge,
  useMediaQuery,
  Snackbar,
  Paper,
  Divider,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Person,
  Email,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Lock,
  Visibility,
  VisibilityOff,
  Security,
  AccountCircle,
  Badge as BadgeIcon,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  CloudUpload,
  Delete,
  Verified,
  Shield,
  Key,
  Settings,
  Notifications,
  History,
  Phone,
  LocationOn,
  Business,
  Language,
  Palette,
  DarkMode,
  LightMode,
  AutoAwesome,
  PrivacyTip,
} from "@mui/icons-material";

// Types
interface UserProfile {
  role: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  last_login: Date;
  phone?: string;
  location?: string;
  company?: string;
  bio?: string;
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface ProfileErrors {
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  company?: string;
  bio?: string;
  profile_image?: string;
}

interface PasswordErrors {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}

// Validation rules
const profileValidationRules = [
  {
    field: "first_name" as keyof UserProfile,
    validator: (value: string) => {
      if (!value?.trim()) return "First name is required";
      if (value.trim().length < 2)
        return "First name must be at least 2 characters";
      if (value.trim().length > 50)
        return "First name must not exceed 50 characters";
      return null;
    },
  },
  {
    field: "last_name" as keyof UserProfile,
    validator: (value: string) => {
      if (!value?.trim()) return "Last name is required";
      if (value.trim().length < 2)
        return "Last name must be at least 2 characters";
      if (value.trim().length > 50)
        return "Last name must not exceed 50 characters";
      return null;
    },
  },
  {
    field: "phone" as keyof UserProfile,
    validator: (value: string) => {
      if (value && !/^\+?[\d\s\-()]{10,15}$/.test(value)) {
        return "Please enter a valid phone number";
      }
      return null;
    },
  },
  {
    field: "bio" as keyof UserProfile,
    validator: (value: string) => {
      if (value && value.length > 500)
        return "Bio must not exceed 500 characters";
      return null;
    },
  },
];

const passwordValidationRules = [
  {
    field: "current_password" as keyof PasswordChangeData,
    validator: (value: string) => {
      if (!value) return "Current password is required";
      return null;
    },
  },
  {
    field: "new_password" as keyof PasswordChangeData,
    validator: (value: string) => {
      if (!value) return "New password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return "Password must contain uppercase, lowercase, and number";
      }
      return null;
    },
  },
  {
    field: "confirm_password" as keyof PasswordChangeData,
    validator: (value: string, data: PasswordChangeData) => {
      if (!value) return "Please confirm your password";
      if (value !== data.new_password) return "Passwords do not match";
      return null;
    },
  },
];

// Role configurations
const roleConfig = {
  admin: {
    color: "#d32f2f",
    label: "Administrator",
    icon: <Shield />,
    description: "Full system access with administrative privileges",
  },
  manager: {
    color: "#1976d2",
    label: "Manager",
    icon: <BadgeIcon />,
    description: "Team management and operational oversight",
  },
  customer: {
    color: "#2e7d32",
    label: "Customer",
    icon: <Person />,
    description: "Standard customer account with order access",
  },
  guest: {
    color: "#757575",
    label: "Guest",
    icon: <AccountCircle />,
    description: "Limited access guest account",
  },
};

export default function UserProfile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user data - replace with actual API data
  const [profile, setProfile] = useState<UserProfile>({
    role: "customer",
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    profile_image: undefined,
    last_login: new Date("2025-08-27T14:30:00"),
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    company: "Tech Solutions Inc.",
    bio: "Experienced professional with expertise in digital solutions and customer service.",
    preferences: {
      theme: "light",
      language: "en",
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    },
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<UserProfile>(profile);
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    let completed = 0;
    let total = 8;

    if (profile.first_name.trim()) completed++;
    if (profile.last_name.trim()) completed++;
    if (profile.email) completed++;
    if (profile.phone) completed++;
    if (profile.location) completed++;
    if (profile.company) completed++;
    if (profile.bio) completed++;
    if (profile.profile_image) completed++;

    return Math.round((completed / total) * 100);
  }, [profile]);

  // Handle profile field changes
  const handleProfileChange = useCallback(
    (field: keyof UserProfile, value: any) => {
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field
      if (profileErrors[field as keyof ProfileErrors]) {
        setProfileErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [profileErrors]
  );

  // Handle password field changes
  const handlePasswordChange = useCallback(
    (field: keyof PasswordChangeData, value: string) => {
      setPasswordData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field
      if (passwordErrors[field]) {
        setPasswordErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [passwordErrors]
  );

  // Handle preferences changes
  const handlePreferenceChange = useCallback((path: string, value: any) => {
    setProfile((prev) => {
      const newProfile = { ...prev };
      if (path === "theme") {
        newProfile.preferences.theme = value;
      } else if (path === "language") {
        newProfile.preferences.language = value;
      } else if (path.startsWith("notifications.")) {
        const notificationKey = path.split(
          "."
        )[1] as keyof typeof prev.preferences.notifications;
        newProfile.preferences.notifications[notificationKey] = value;
      }
      return newProfile;
    });
  }, []);

  // Profile image upload
  const handleImageUpload = useCallback((file: File) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: "Image size must be less than 5MB",
        severity: "error",
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "Only JPEG, PNG, GIF, and WebP images are allowed",
        severity: "error",
      });
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      profile_image: imageUrl,
    }));

    setSnackbar({
      open: true,
      message: "Profile image updated successfully",
      severity: "success",
    });

    setImageDialogOpen(false);
  }, []);

  // Validate profile
  const validateProfile = useCallback((): boolean => {
    const newErrors: ProfileErrors = {};

    profileValidationRules.forEach((rule) => {
      const error = rule.validator(profile[rule.field] as string);
      if (error) {
        newErrors[rule.field as keyof ProfileErrors] = error;
      }
    });

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile]);

  // Validate password
  const validatePassword = useCallback((): boolean => {
    const newErrors: PasswordErrors = {};

    passwordValidationRules.forEach((rule) => {
      const error = rule.validator(passwordData[rule.field], passwordData);
      if (error) {
        newErrors[rule.field] = error;
      }
    });

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [passwordData]);

  // Start editing
  const handleEditStart = useCallback(() => {
    setOriginalProfile({ ...profile });
    setIsEditing(true);
  }, [profile]);

  // Cancel editing
  const handleEditCancel = useCallback(() => {
    setProfile(originalProfile);
    setProfileErrors({});
    setIsEditing(false);
  }, [originalProfile]);

  // Save profile
  const handleProfileSave = useCallback(async () => {
    if (!validateProfile()) {
      setSnackbar({
        open: true,
        message: "Please fix validation errors",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateProfile]);

  // Change password
  const handlePasswordSave = useCallback(async () => {
    if (!validatePassword()) {
      setSnackbar({
        open: true,
        message: "Please fix password validation errors",
        severity: "error",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Password changed successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to change password. Please try again.",
        severity: "error",
      });
    } finally {
      setIsChangingPassword(false);
    }
  }, [validatePassword]);

  // Format last login
  const formatLastLogin = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const roleInfo =
    roleConfig[profile.role as keyof typeof roleConfig] || roleConfig.guest;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Box flex={1}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              User Profile
              <AutoAwesome
                sx={{ ml: 1, color: theme.palette.secondary.main }}
              />
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Manage your account information and preferences
            </Typography>

            {/* Profile Completion Progress */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={profileCompletion}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.grey[300], 0.3),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, minWidth: 60 }}
              >
                {profileCompletion}% Complete
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditStart}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleEditCancel}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    isSubmitting ? <CircularProgress size={16} /> : <Save />
                  }
                  onClick={handleProfileSave}
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            {/* Basic Information Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[8],
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Person color="primary" />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Basic Information
                  </Typography>
                  {isEditing && (
                    <Chip
                      size="small"
                      label="Editing Mode"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Stack>

                <Grid container spacing={3}>
                  {/* Profile Image */}
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          isEditing ? (
                            <Tooltip title="Change Profile Image">
                              <IconButton
                                size="small"
                                onClick={() => setImageDialogOpen(true)}
                                sx={{
                                  bgcolor: theme.palette.primary.main,
                                  color: "white",
                                  width: 32,
                                  height: 32,
                                  "&:hover": {
                                    bgcolor: theme.palette.primary.dark,
                                  },
                                }}
                              >
                                <PhotoCamera fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null
                        }
                      >
                        <Avatar
                          src={profile.profile_image}
                          sx={{
                            width: 120,
                            height: 120,
                            bgcolor: theme.palette.primary.main,
                            fontSize: "2.5rem",
                            fontWeight: 700,
                            boxShadow: theme.shadows[8],
                          }}
                        >
                          {profile.first_name[0]}
                          {profile.last_name[0]}
                        </Avatar>
                      </Badge>

                      <Box>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 700, mb: 1 }}
                        >
                          {profile.first_name} {profile.last_name}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          mb={1}
                        >
                          <Chip
                            icon={roleInfo.icon}
                            label={roleInfo.label}
                            sx={{
                              bgcolor: alpha(roleInfo.color, 0.1),
                              color: roleInfo.color,
                              fontWeight: 600,
                            }}
                          />
                          <Verified
                            sx={{ color: theme.palette.success.main }}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {roleInfo.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* First Name */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!profileErrors.first_name}>
                      <TextField
                        label="First Name"
                        value={profile.first_name}
                        onChange={(e) =>
                          handleProfileChange("first_name", e.target.value)
                        }
                        disabled={!isEditing}
                        error={!!profileErrors.first_name}
                        helperText={profileErrors.first_name}
                        InputProps={{
                          startAdornment: (
                            <Person sx={{ color: "action.active", mr: 1 }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Last Name */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!profileErrors.last_name}>
                      <TextField
                        label="Last Name"
                        value={profile.last_name}
                        onChange={(e) =>
                          handleProfileChange("last_name", e.target.value)
                        }
                        disabled={!isEditing}
                        error={!!profileErrors.last_name}
                        helperText={profileErrors.last_name}
                        InputProps={{
                          startAdornment: (
                            <Person sx={{ color: "action.active", mr: 1 }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Email (Read-only) */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Email Address"
                      value={profile.email}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <Email sx={{ color: "action.active", mr: 1 }} />
                        ),
                        endAdornment: (
                          <Tooltip title="Email cannot be changed">
                            <Lock sx={{ color: "action.disabled" }} />
                          </Tooltip>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.grey[100], 0.5),
                        },
                      }}
                    />
                  </Grid>

                  {/* Role (Read-only) */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Role"
                      value={roleInfo.label}
                      disabled
                      InputProps={{
                        startAdornment: roleInfo.icon,
                        endAdornment: (
                          <Tooltip title="Role is managed by administrators">
                            <Lock sx={{ color: "action.disabled" }} />
                          </Tooltip>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.grey[100], 0.5),
                        },
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!profileErrors.phone}>
                      <TextField
                        label="Phone Number (Optional)"
                        value={profile.phone || ""}
                        onChange={(e) =>
                          handleProfileChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        error={!!profileErrors.phone}
                        helperText={profileErrors.phone}
                        InputProps={{
                          startAdornment: (
                            <Phone sx={{ color: "action.active", mr: 1 }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Location */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Location (Optional)"
                      value={profile.location || ""}
                      onChange={(e) =>
                        handleProfileChange("location", e.target.value)
                      }
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <LocationOn sx={{ color: "action.active", mr: 1 }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: theme.palette.secondary.main,
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Company */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Company (Optional)"
                      value={profile.company || ""}
                      onChange={(e) =>
                        handleProfileChange("company", e.target.value)
                      }
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Business sx={{ color: "action.active", mr: 1 }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: theme.palette.secondary.main,
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Bio */}
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth error={!!profileErrors.bio}>
                      <TextField
                        label="Bio (Optional)"
                        multiline
                        rows={4}
                        value={profile.bio || ""}
                        onChange={(e) =>
                          handleProfileChange("bio", e.target.value)
                        }
                        disabled={!isEditing}
                        error={!!profileErrors.bio}
                        helperText={
                          profileErrors.bio ||
                          `${(profile.bio || "").length}/500 characters`
                        }
                        inputProps={{ maxLength: 500 }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[6],
                  borderColor: alpha(theme.palette.secondary.main, 0.2),
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Settings color="secondary" />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Preferences
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  {/* Theme Preference */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      label="Theme Preference"
                      value={profile.preferences.theme}
                      onChange={(e) =>
                        handlePreferenceChange("theme", e.target.value)
                      }
                      disabled={!isEditing}
                      SelectProps={{ native: true }}
                      InputProps={{
                        startAdornment: (
                          <Palette sx={{ color: "action.active", mr: 1 }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="auto">Auto (System)</option>
                    </TextField>
                  </Grid>

                  {/* Language */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      label="Language"
                      value={profile.preferences.language}
                      onChange={(e) =>
                        handlePreferenceChange("language", e.target.value)
                      }
                      disabled={!isEditing}
                      SelectProps={{ native: true }}
                      InputProps={{
                        startAdornment: (
                          <Language sx={{ color: "action.active", mr: 1 }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </TextField>
                  </Grid>

                  {/* Notifications */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Notification Preferences
                    </Typography>
                    <Stack spacing={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.preferences.notifications.email}
                            onChange={(e) =>
                              handlePreferenceChange(
                                "notifications.email",
                                e.target.checked
                              )
                            }
                            disabled={!isEditing}
                          />
                        }
                        label="Email Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.preferences.notifications.sms}
                            onChange={(e) =>
                              handlePreferenceChange(
                                "notifications.sms",
                                e.target.checked
                              )
                            }
                            disabled={!isEditing}
                          />
                        }
                        label="SMS Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.preferences.notifications.push}
                            onChange={(e) =>
                              handlePreferenceChange(
                                "notifications.push",
                                e.target.checked
                              )
                            }
                            disabled={!isEditing}
                          />
                        }
                        label="Push Notifications"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Account Status Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                bgcolor: alpha(theme.palette.success.main, 0.02),
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Security color="success" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Account Status
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      border: `1px solid ${alpha(
                        theme.palette.grey[300],
                        0.3
                      )}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CheckCircle fontSize="small" color="success" />
                      <Typography variant="body2">Account Status</Typography>
                    </Stack>
                    <Chip
                      size="small"
                      label="Active"
                      color="success"
                      variant="outlined"
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      border: `1px solid ${alpha(
                        theme.palette.grey[300],
                        0.3
                      )}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2">Last Login</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatLastLogin(profile.last_login)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      border: `1px solid ${alpha(
                        theme.palette.grey[300],
                        0.3
                      )}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Verified fontSize="small" color="primary" />
                      <Typography variant="body2">Email Verified</Typography>
                    </Stack>
                    <CheckCircle fontSize="small" color="success" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Security Actions Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                bgcolor: alpha(theme.palette.warning.main, 0.02),
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Key color="warning" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Security
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Lock />}
                    onClick={() => setPasswordDialogOpen(true)}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      justifyContent: "flex-start",
                    }}
                  >
                    Change Password
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<History />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      justifyContent: "flex-start",
                    }}
                  >
                    Login History
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PrivacyTip />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      justifyContent: "flex-start",
                    }}
                  >
                    Privacy Settings
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                bgcolor: alpha(theme.palette.info.main, 0.02),
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Profile Statistics
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {profileCompletion}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Profile Complete
                    </Typography>
                  </Box>

                  <Divider />

                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Member Since</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Jan 2024
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Total Orders</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        24
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => !isChangingPassword && setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Key color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Change Password
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Choose a strong password to keep your account secure
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            {/* Current Password */}
            <FormControl fullWidth error={!!passwordErrors.current_password}>
              <TextField
                type={showCurrentPassword ? "text" : "password"}
                label="Current Password"
                value={passwordData.current_password}
                onChange={(e) =>
                  handlePasswordChange("current_password", e.target.value)
                }
                error={!!passwordErrors.current_password}
                helperText={passwordErrors.current_password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        edge="end"
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* New Password */}
            <FormControl fullWidth error={!!passwordErrors.new_password}>
              <TextField
                type={showNewPassword ? "text" : "password"}
                label="New Password"
                value={passwordData.new_password}
                onChange={(e) =>
                  handlePasswordChange("new_password", e.target.value)
                }
                error={!!passwordErrors.new_password}
                helperText={
                  passwordErrors.new_password ||
                  "Must be at least 8 characters with uppercase, lowercase, and number"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Confirm Password */}
            <FormControl fullWidth error={!!passwordErrors.confirm_password}>
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm New Password"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  handlePasswordChange("confirm_password", e.target.value)
                }
                error={!!passwordErrors.confirm_password}
                helperText={passwordErrors.confirm_password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Security Tips */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Password Security Tips:
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText
                    primary="Use at least 8 characters"
                    primaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText
                    primary="Include uppercase and lowercase letters"
                    primaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText
                    primary="Add numbers and special characters"
                    primaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              </List>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setPasswordDialogOpen(false)}
            disabled={isChangingPassword}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordSave}
            disabled={isChangingPassword}
            startIcon={
              isChangingPassword ? <CircularProgress size={16} /> : <Save />
            }
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            {isChangingPassword ? "Changing..." : "Change Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <PhotoCamera color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Update Profile Image
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ textAlign: "center", p: 3 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />

            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: `2px dashed ${theme.palette.primary.main}`,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload
                sx={{
                  fontSize: 48,
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Choose Profile Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JPEG, PNG, GIF, WebP • Max 5MB
              </Typography>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setImageDialogOpen(false)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
          backdropFilter: "blur(8px)",
        }}
        open={isSubmitting}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Updating Profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
