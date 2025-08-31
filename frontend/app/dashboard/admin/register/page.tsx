// app/admin/register/page.tsx
"use client";
import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Grid,
  useTheme,
  alpha,
  Fade,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  AdminPanelSettings,
  SupervisorAccount,
  ArrowBack,
  SecurityOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { AdminRegisterData, AdminRegisterResponse } from "@/types/admin";
import { useToast } from "@/lib/toast/toast";
import axiosInstance from "@/lib/axios/csrAxios";

const AdminRegisterPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<AdminRegisterData>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    rePassword: "",
    role: "ADMIN",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AdminRegisterData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AdminRegisterData> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Name validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Password validations
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.rePassword) {
      newErrors.rePassword = "Please confirm password";
    } else if (formData.password !== formData.rePassword) {
      newErrors.rePassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post<AdminRegisterResponse>(
        "/admin/register",
        formData
      );

      if (response.data.success) {
        showToast(response.data.message, "success");
        router.push("/dashboard/admin/users");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AdminRegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getRoleConfig = (role: "ADMIN" | "STAFF") => {
    return role === "ADMIN"
      ? {
          color: theme.palette.primary.main,
          bgColor: alpha(theme.palette.primary.main, 0.1),
          icon: <AdminPanelSettings />,
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
        }
      : {
          color: theme.palette.secondary.main,
          bgColor: alpha(theme.palette.secondary.main, 0.1),
          icon: <SupervisorAccount />,
          gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
        };
  };

  const roleConfig = getRoleConfig(formData.role);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <IconButton
                  onClick={() => router.back()}
                  sx={{
                    mr: 3,
                    width: 48,
                    height: 48,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.grey[200]}`,
                    boxShadow: "0 2px 8px rgba(39, 68, 93, 0.08)",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(39, 68, 93, 0.15)",
                    },
                  }}
                >
                  <ArrowBack sx={{ color: theme.palette.text.primary }} />
                </IconButton>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: roleConfig.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <SecurityOutlined
                      sx={{
                        fontSize: "2rem",
                        background: roleConfig.gradient,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    />
                    Create New{" "}
                    {formData.role.charAt(0) +
                      formData.role.slice(1).toLowerCase()}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "1.1rem",
                    }}
                  >
                    Register a new admin or staff member to access the system
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Main Form Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 1,
                border: `1px solid ${theme.palette.grey[200]}`,
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${
                  theme.palette.background.paper
                } 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 40px rgba(39, 68, 93, 0.08)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: roleConfig.gradient,
                  borderRadius: "24px 24px 0 0",
                },
              }}
            >
              {loading && (
                <LinearProgress
                  sx={{
                    position: "absolute",
                    top: 6,
                    left: 0,
                    right: 0,
                    height: 3,
                    borderRadius: 1,
                  }}
                />
              )}

              <CardContent sx={{ p: 6 }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={4}>
                    {/* Role Selection Card */}
                    <Grid size={{ xs: 12 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 1,
                          border: `2px solid ${alpha(roleConfig.color, 0.2)}`,
                          background: `linear-gradient(135deg, ${alpha(
                            roleConfig.color,
                            0.03
                          )} 0%, ${alpha(roleConfig.color, 0.08)} 100%)`,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            sx={{
                              color: roleConfig.color,
                              fontWeight: 600,
                              "&.Mui-focused": {
                                color: roleConfig.color,
                              },
                            }}
                          >
                            Select Role
                          </InputLabel>
                          <Select
                            value={formData.role}
                            label="Select Role"
                            onChange={(e) =>
                              handleInputChange(
                                "role",
                                e.target.value as "ADMIN" | "STAFF"
                              )
                            }
                            sx={{
                              borderRadius: 1,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: alpha(roleConfig.color, 0.3),
                                borderWidth: 2,
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: roleConfig.color,
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: roleConfig.color,
                                },
                              "& .MuiSelect-select": {
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                py: 2,
                              },
                            }}
                          >
                            <MenuItem value="ADMIN">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  py: 1,
                                }}
                              >
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                  }}
                                >
                                  <AdminPanelSettings
                                    sx={{
                                      color: theme.palette.primary.main,
                                      fontSize: 24,
                                    }}
                                  />
                                </Paper>
                                <Box>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 700,
                                      color: theme.palette.text.primary,
                                    }}
                                  >
                                    Administrator
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      display: "block",
                                    }}
                                  >
                                    Full system access and management
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                            <MenuItem value="STAFF">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  py: 1,
                                }}
                              >
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: alpha(
                                      theme.palette.secondary.main,
                                      0.1
                                    ),
                                  }}
                                >
                                  <SupervisorAccount
                                    sx={{
                                      color: theme.palette.secondary.main,
                                      fontSize: 24,
                                    }}
                                  />
                                </Paper>
                                <Box>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 700,
                                      color: theme.palette.text.primary,
                                    }}
                                  >
                                    Staff Member
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      display: "block",
                                    }}
                                  >
                                    Limited access and permissions
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Paper>
                    </Grid>

                    {/* Name Fields */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                            "&:hover fieldset": {
                              borderColor: roleConfig.color,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: roleConfig.color,
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: roleConfig.color,
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                            "&:hover fieldset": {
                              borderColor: roleConfig.color,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: roleConfig.color,
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: roleConfig.color,
                          },
                        }}
                      />
                    </Grid>

                    {/* Email */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                            "&:hover fieldset": {
                              borderColor: roleConfig.color,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: roleConfig.color,
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: roleConfig.color,
                          },
                        }}
                      />
                    </Grid>

                    {/* Password Fields */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  "&:hover": {
                                    color: roleConfig.color,
                                    backgroundColor: alpha(
                                      roleConfig.color,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                            "&:hover fieldset": {
                              borderColor: roleConfig.color,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: roleConfig.color,
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: roleConfig.color,
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type={showRePassword ? "text" : "password"}
                        label="Confirm Password"
                        value={formData.rePassword}
                        onChange={(e) =>
                          handleInputChange("rePassword", e.target.value)
                        }
                        error={!!errors.rePassword}
                        helperText={errors.rePassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowRePassword(!showRePassword)
                                }
                                edge="end"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  "&:hover": {
                                    color: roleConfig.color,
                                    backgroundColor: alpha(
                                      roleConfig.color,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                {showRePassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                            "&:hover fieldset": {
                              borderColor: roleConfig.color,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: roleConfig.color,
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: roleConfig.color,
                          },
                        }}
                      />
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ pt: 3 }}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          startIcon={<PersonAdd />}
                          sx={{
                            py: 2,
                            borderRadius: 1,
                            background: roleConfig.gradient,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: `0 8px 32px ${alpha(
                              roleConfig.color,
                              0.3
                            )}`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: `0 12px 40px ${alpha(
                                roleConfig.color,
                                0.4
                              )}`,
                            },
                            "&:disabled": {
                              background: alpha(theme.palette.grey[400], 0.5),
                              boxShadow: "none",
                              transform: "none",
                            },
                          }}
                        >
                          {loading
                            ? "Creating Account..."
                            : `Create ${
                                formData.role.charAt(0) +
                                formData.role.slice(1).toLowerCase()
                              } Account`}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AdminRegisterPage;
