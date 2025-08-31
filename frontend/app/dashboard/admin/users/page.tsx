// app/admin/users/page.tsx
"use client";
import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  IconButton,
  Switch,
  useTheme,
  alpha,
  Fade,
  CircularProgress,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Grid,
  Paper,
  Badge,
  useMediaQuery,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import {
  Search,
  PersonAdd,
  AdminPanelSettings,
  SupervisorAccount,
  Person,
  Edit,
  Refresh,
  FilterList,
  PeopleOutline,
  CheckCircle,
  Cancel,
  ExpandMore,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import { User } from "@/types/admin";

const RoleBadge: React.FC<{ role: User["role"] }> = ({ role }) => {
  const theme = useTheme();

  const getRoleConfig = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return {
          color: theme.palette.primary.main,
          bg: alpha(theme.palette.primary.main, 0.1),
          borderColor: alpha(theme.palette.primary.main, 0.3),
          icon: <AdminPanelSettings sx={{ fontSize: 16 }} />,
          label: "Admin",
        };
      case "STAFF":
        return {
          color: theme.palette.secondary.main,
          bg: alpha(theme.palette.secondary.main, 0.1),
          borderColor: alpha(theme.palette.secondary.main, 0.3),
          icon: <SupervisorAccount sx={{ fontSize: 16 }} />,
          label: "Staff",
        };
      default:
        return {
          color: theme.palette.tertiary.main,
          bg: alpha(theme.palette.tertiary.main, 0.1),
          borderColor: alpha(theme.palette.tertiary.main, 0.3),
          icon: <Person sx={{ fontSize: 16 }} />,
          label: "Customer",
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        fontWeight: 600,
        borderRadius: 1,
        height: 28,
        "& .MuiChip-icon": {
          color: config.color,
        },
        "& .MuiChip-label": {
          fontSize: "0.75rem",
          px: 0.5,
        },
      }}
    />
  );
};

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const theme = useTheme();

  return (
    <Chip
      icon={
        isActive ? (
          <CheckCircle sx={{ fontSize: 14 }} />
        ) : (
          <Cancel sx={{ fontSize: 14 }} />
        )
      }
      label={isActive ? "Active" : "Inactive"}
      size="small"
      sx={{
        backgroundColor: isActive
          ? alpha(theme.palette.success.main, 0.1)
          : alpha(theme.palette.error.main, 0.1),
        color: isActive ? theme.palette.success.main : theme.palette.error.main,
        border: `1px solid ${
          isActive
            ? alpha(theme.palette.success.main, 0.3)
            : alpha(theme.palette.error.main, 0.3)
        }`,
        fontWeight: 600,
        borderRadius: 1,
        height: 28,
        "& .MuiChip-icon": {
          color: isActive
            ? theme.palette.success.main
            : theme.palette.error.main,
        },
        "& .MuiChip-label": {
          fontSize: "0.75rem",
          px: 0.5,
        },
      }}
    />
  );
};

const RoleMenu: React.FC<{
  user: User;
  onUpdateRole: (userId: string, role: "ADMIN" | "STAFF") => void;
}> = ({ user, onUpdateRole }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (role: "ADMIN" | "STAFF") => {
    onUpdateRole(user.id, role);
    handleClose();
  };

  if (user.role === "CUSTOMER") return null;

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },
        }}
      >
        <Edit sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            borderRadius: 1,
            border: `1px solid ${theme.palette.grey[200]}`,
            boxShadow: "0 8px 32px rgba(39, 68, 93, 0.15)",
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => handleRoleChange("ADMIN")}
          disabled={user.role === "ADMIN"}
          sx={{
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <AdminPanelSettings
              sx={{ fontSize: 18, color: theme.palette.primary.main }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Make Admin"
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => handleRoleChange("STAFF")}
          disabled={user.role === "STAFF"}
          sx={{
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <SupervisorAccount
              sx={{ fontSize: 18, color: theme.palette.secondary.main }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Make Staff"
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

const TableSkeleton: React.FC = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={160} height={16} />
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Skeleton
            variant="rectangular"
            width={70}
            height={28}
            sx={{ borderRadius: 1 }}
          />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={100} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton
            variant="rectangular"
            width={70}
            height={28}
            sx={{ borderRadius: 1 }}
          />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width={44} height={24} />
        </TableCell>
        <TableCell>
          <Skeleton variant="circular" width={32} height={32} />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const MobileUserCard: React.FC<{
  user: User;
  onUpdateRole: (userId: string, role: "ADMIN" | "STAFF") => void;
  onActiveToggle: (
    userId: string,
    role: "ADMIN" | "STAFF" | "CUSTOMER",
    isActive: boolean
  ) => void;
}> = ({ user, onUpdateRole, onActiveToggle }) => {
  const theme = useTheme();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return {
          bg: alpha(theme.palette.primary.main, 0.15),
          color: theme.palette.primary.main,
        };
      case "STAFF":
        return {
          bg: alpha(theme.palette.secondary.main, 0.15),
          color: theme.palette.secondary.main,
        };
      default:
        return {
          bg: alpha(theme.palette.tertiary.main, 0.15),
          color: theme.palette.tertiary.main,
        };
    }
  };

  const avatarConfig = getAvatarColor(user.role);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: `1px solid ${theme.palette.grey[200]}`,
        mb: 2,
        background: theme.palette.background.paper,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
          <Badge
            badgeContent={
              user.role !== "CUSTOMER"
                ? user.role === "ADMIN"
                  ? "A"
                  : "S"
                : null
            }
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: avatarConfig.color,
                color: theme.palette.background.paper,
                fontWeight: 700,
                fontSize: "0.7rem",
                minWidth: 16,
                height: 16,
              },
            }}
          >
            <Avatar
              src={user.profilePicture}
              sx={{
                width: 48,
                height: 48,
                fontSize: "0.9rem",
                fontWeight: 700,
                backgroundColor: avatarConfig.bg,
                color: avatarConfig.color,
                border: `2px solid ${alpha(avatarConfig.color, 0.2)}`,
              }}
            >
              {getInitials(user.firstName, user.lastName)}
            </Avatar>
          </Badge>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.85rem",
                mb: 2,
              }}
            >
              {user.email}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <RoleBadge role={user.role} />
              <StatusBadge isActive={user.isActive} />
            </Stack>

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: "block",
                mb: 2,
              }}
            >
              Registered:{" "}
              {format(new Date(user.createdAt), "MMM dd, yyyy 'at' HH:mm")}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Status:
                </Typography>
                <Switch
                  size="small"
                  checked={user.isActive}
                  onChange={(e) =>
                    onActiveToggle(user.id, user.role, e.target.checked)
                  }
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: theme.palette.success.main,
                      "& + .MuiSwitch-track": {
                        backgroundColor: alpha(theme.palette.success.main, 0.3),
                      },
                    },
                    "& .MuiSwitch-switchBase": {
                      "&:not(.Mui-checked)": {
                        color: theme.palette.error.main,
                        "& + .MuiSwitch-track": {
                          backgroundColor: alpha(theme.palette.error.main, 0.3),
                        },
                      },
                    },
                  }}
                />
              </Box>
              <RoleMenu user={user} onUpdateRole={onUpdateRole} />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const UsersManagementPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    users,
    loading,
    pagination,
    filters,
    updateFilters,
    changePage,
    updateUser,
    refetch,
  } = useUsersManagement();

  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();

  const handleSearchChange = (value: string) => {
    if (searchDebounce) clearTimeout(searchDebounce);

    const timeout = setTimeout(() => {
      updateFilters({ search: value });
    }, 500);

    setSearchDebounce(timeout);
  };

  const handleRoleUpdate = async (userId: string, role: "ADMIN" | "STAFF") => {
    await updateUser(userId, { role });
  };

  const handleActiveToggle = async (
    userId: string,
    role: "ADMIN" | "STAFF" | "CUSTOMER",
    isActive: boolean
  ) => {
    await updateUser(userId, { role, isActive: isActive });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return {
          bg: alpha(theme.palette.primary.main, 0.15),
          color: theme.palette.primary.main,
        };
      case "STAFF":
        return {
          bg: alpha(theme.palette.secondary.main, 0.15),
          color: theme.palette.secondary.main,
        };
      default:
        return {
          bg: alpha(theme.palette.tertiary.main, 0.15),
          color: theme.palette.tertiary.main,
        };
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.03
        )} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Fade in timeout={800}>
          <Box>
            {/* Header - Responsive */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "flex-end" },
                gap: { xs: 3, sm: 0 },
                mb: { xs: 4, sm: 6 },
              }}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  <PeopleOutline
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem" },
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                  Users Management
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  Manage all system users and their permissions
                </Typography>
              </Box>

              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                startIcon={<PersonAdd />}
                onClick={() => router.push("/admin/register")}
                fullWidth={isMobile}
                sx={{
                  borderRadius: 1,
                  py: { xs: 1.25, sm: 1.5 },
                  px: { xs: 3, sm: 4 },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: `0 8px 32px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 40px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                  },
                }}
              >
                Add New Admin
              </Button>
            </Box>

            {/* Stats Cards - Responsive */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.grey[200]}`,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.05
                    )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  }}
                >
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{
                      fontWeight: 800,
                      color: theme.palette.primary.main,
                      mb: 1,
                    }}
                  >
                    {pagination.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users {users.length}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Filters Card - Responsive */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 1,
                border: `1px solid ${theme.palette.grey[200]}`,
                mb: 4,
                background: theme.palette.background.paper,
                boxShadow: "0 4px 20px rgba(39, 68, 93, 0.05)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <FilterList sx={{ color: theme.palette.primary.main }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    Search & Filter
                  </Typography>
                </Box>

                <Grid container spacing={3} alignItems="center">
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      placeholder="Search by name, email..."
                      defaultValue={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          backgroundColor: alpha(theme.palette.grey[50], 0.5),
                          "&:hover fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={filters.role}
                        label="Role"
                        onChange={(e) =>
                          updateFilters({ role: e.target.value as any })
                        }
                        sx={{
                          borderRadius: 1,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <MenuItem value="ALL">All Roles</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="STAFF">Staff</MenuItem>
                        <MenuItem value="CUSTOMER">Customer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filters.isActive}
                        label="Status"
                        onChange={(e) =>
                          updateFilters({ isActive: e.target.value as any })
                        }
                        sx={{
                          borderRadius: 1,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <MenuItem value="ALL">All Status</MenuItem>
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 1 }}>
                    <IconButton
                      onClick={refetch}
                      disabled={loading}
                      sx={{
                        width: { xs: "100%", md: 48 },
                        height: 48,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          ),
                          transform: "rotate(180deg)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Refresh />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Users Table/Cards - Responsive */}
            {isMobile ? (
              // Mobile View - Cards
              <Box>
                {loading ? (
                  <Box>
                    {[...Array(3)].map((_, index) => (
                      <Card
                        key={index}
                        elevation={0}
                        sx={{
                          borderRadius: 1,
                          border: `1px solid ${theme.palette.grey[200]}`,
                          mb: 2,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Skeleton
                              variant="circular"
                              width={48}
                              height={48}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton
                                variant="text"
                                width="60%"
                                height={24}
                              />
                              <Skeleton
                                variant="text"
                                width="80%"
                                height={20}
                              />
                              <Skeleton
                                variant="text"
                                width="40%"
                                height={16}
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : users.length === 0 ? (
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.grey[200]}`,
                      background: theme.palette.background.paper,
                      textAlign: "center",
                      py: 8,
                    }}
                  >
                    <PeopleOutline
                      sx={{
                        fontSize: 64,
                        color: alpha(theme.palette.text.secondary, 0.3),
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      No users found
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      Try adjusting your search criteria
                    </Typography>
                  </Card>
                ) : (
                  <Box>
                    {users.map((user) => (
                      <MobileUserCard
                        key={user.id}
                        user={user}
                        onUpdateRole={handleRoleUpdate}
                        onActiveToggle={handleActiveToggle}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              // Desktop/Tablet View - Table
              <Card
                elevation={0}
                sx={{
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  overflow: "hidden",
                  background: theme.palette.background.paper,
                  boxShadow: "0 4px 20px rgba(39, 68, 93, 0.05)",
                }}
              >
                <TableContainer
                  sx={{
                    maxWidth: "100%",
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                      height: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: alpha(theme.palette.grey[300], 0.3),
                      borderRadius: 1,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.3),
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.5),
                      },
                    },
                  }}
                >
                  <Table stickyHeader sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.05
                          ),
                          borderBottom: `2px solid ${theme.palette.grey[200]}`,
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: theme.palette.text.primary,
                            py: 2,
                            minWidth: 250,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          }}
                        >
                          User Information
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: theme.palette.text.primary,
                            minWidth: 120,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          }}
                        >
                          Role
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: theme.palette.text.primary,
                            minWidth: 150,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          }}
                        >
                          Registration Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: theme.palette.text.primary,
                            minWidth: 120,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: theme.palette.text.primary,
                            minWidth: 100,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          }}
                        >
                          Active
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: theme.palette.text.primary,
                            minWidth: 80,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableSkeleton />
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            sx={{
                              textAlign: "center",
                              py: 8,
                              backgroundColor: alpha(
                                theme.palette.grey[50],
                                0.5
                              ),
                            }}
                          >
                            <Box>
                              <PeopleOutline
                                sx={{
                                  fontSize: 64,
                                  color: alpha(
                                    theme.palette.text.secondary,
                                    0.3
                                  ),
                                  mb: 2,
                                }}
                              />
                              <Typography
                                variant="h6"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontWeight: 600,
                                }}
                              >
                                No users found
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  mt: 1,
                                }}
                              >
                                Try adjusting your search criteria
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => {
                          const avatarConfig = getAvatarColor(user.role);

                          return (
                            <TableRow
                              key={user.id}
                              sx={{
                                borderBottom: `1px solid ${alpha(
                                  theme.palette.grey[200],
                                  0.5
                                )}`,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.02
                                  ),
                                },
                              }}
                            >
                              <TableCell sx={{ py: 2 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Badge
                                    badgeContent={
                                      user.role !== "CUSTOMER"
                                        ? user.role === "ADMIN"
                                          ? "A"
                                          : "S"
                                        : null
                                    }
                                    sx={{
                                      "& .MuiBadge-badge": {
                                        backgroundColor: avatarConfig.color,
                                        color: theme.palette.background.paper,
                                        fontWeight: 700,
                                        fontSize: "0.7rem",
                                        minWidth: 16,
                                        height: 16,
                                      },
                                    }}
                                  >
                                    <Avatar
                                      src={user.profilePicture}
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        fontSize: "0.9rem",
                                        fontWeight: 700,
                                        backgroundColor: avatarConfig.bg,
                                        color: avatarConfig.color,
                                        border: `2px solid ${alpha(
                                          avatarConfig.color,
                                          0.2
                                        )}`,
                                      }}
                                    >
                                      {getInitials(
                                        user.firstName,
                                        user.lastName
                                      )}
                                    </Avatar>
                                  </Badge>
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        mb: 0.5,
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {user.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>

                              <TableCell>
                                <RoleBadge role={user.role} />
                              </TableCell>

                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  {format(
                                    new Date(user.createdAt),
                                    "MMM dd, yyyy"
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    display: "block",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {format(new Date(user.createdAt), "HH:mm")}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <StatusBadge isActive={user.isActive} />
                              </TableCell>

                              <TableCell>
                                <Switch
                                  size="small"
                                  checked={user.isActive}
                                  onChange={(e) =>
                                    handleActiveToggle(
                                      user.id,
                                      user.role,
                                      e.target.checked
                                    )
                                  }
                                  sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                      color: theme.palette.success.main,
                                      "& + .MuiSwitch-track": {
                                        backgroundColor: alpha(
                                          theme.palette.success.main,
                                          0.3
                                        ),
                                      },
                                    },
                                    "& .MuiSwitch-switchBase": {
                                      "&:not(.Mui-checked)": {
                                        color: theme.palette.error.main,
                                        "& + .MuiSwitch-track": {
                                          backgroundColor: alpha(
                                            theme.palette.error.main,
                                            0.3
                                          ),
                                        },
                                      },
                                    },
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <RoleMenu
                                  user={user}
                                  onUpdateRole={handleRoleUpdate}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {!loading && users.length > 0 && (
                  <TablePagination
                    component="div"
                    count={pagination.total}
                    page={pagination.page - 1}
                    onPageChange={(_, page) => changePage(page + 1)}
                    rowsPerPage={filters.limit}
                    onRowsPerPageChange={(e) =>
                      updateFilters({ limit: parseInt(e.target.value) })
                    }
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
                    sx={{
                      borderTop: `1px solid ${theme.palette.grey[200]}`,
                      backgroundColor: alpha(theme.palette.grey[50], 0.3),
                      "& .MuiTablePagination-toolbar": {
                        paddingLeft: { xs: 2, sm: 4 },
                        paddingRight: { xs: 2, sm: 4 },
                        minHeight: { xs: 52, sm: 64 },
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: { xs: 2, sm: 0 },
                      },
                      "& .MuiTablePagination-spacer": {
                        display: { xs: "none", sm: "flex" },
                      },
                      "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                        {
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        },
                      "& .MuiTablePagination-actions": {
                        marginLeft: { xs: 0, sm: "auto" },
                      },
                    }}
                  />
                )}
              </Card>
            )}

            {/* Mobile Pagination */}
            {isMobile && !loading && users.length > 0 && (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  mt: 3,
                  background: theme.palette.background.paper,
                }}
              >
                <TablePagination
                  component="div"
                  count={pagination.total}
                  page={pagination.page - 1}
                  onPageChange={(_, page) => changePage(page + 1)}
                  rowsPerPage={filters.limit}
                  onRowsPerPageChange={(e) =>
                    updateFilters({ limit: parseInt(e.target.value) })
                  }
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Rows:"
                  sx={{
                    "& .MuiTablePagination-toolbar": {
                      paddingLeft: 3,
                      paddingRight: 3,
                      minHeight: 56,
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: 2,
                    },
                    "& .MuiTablePagination-spacer": {
                      display: "none",
                    },
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                      {
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: "0.8rem",
                        textAlign: "center",
                      },
                    "& .MuiTablePagination-actions": {
                      marginLeft: "auto",
                      marginRight: "auto",
                    },
                  }}
                />
              </Card>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default UsersManagementPage;
