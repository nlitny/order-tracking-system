"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  useTheme,
  alpha,
  Container,
  Paper,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  Schedule,
  CheckCircle,
  Cancel,
  Add,
  LocalShipping,
  Receipt,
  Timeline,
  People,
  SupervisorAccount,
  AdminPanelSettings,
  ArrowForward,
  Refresh,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

// Helper functions
const getStatusConfig = (status: string) => {
  const configs = {
    PENDING: {
      label: "Pending",
      color: "warning" as const,
      icon: <Schedule fontSize="small" />,
    },
    IN_PROGRESS: {
      label: "In Progress",
      color: "info" as const,
      icon: <LocalShipping fontSize="small" />,
    },
    COMPLETED: {
      label: "Completed",
      color: "success" as const,
      icon: <CheckCircle fontSize="small" />,
    },
    CANCELLED: {
      label: "Cancelled",
      color: "error" as const,
      icon: <Cancel fontSize="small" />,
    },
  };
  return configs[status as keyof typeof configs] || configs.PENDING;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CHART_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];

export default function AdminDashboard() {
  const theme = useTheme();
  const { data, loading, refetch } = useAdminDashboard();
  const { user } = useUser();
  const StatCard = ({
    title,
    value,
    icon,
    color,
    trend,
    loading = false,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
    loading?: boolean;
  }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(
          color,
          0.1
        )} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 40px ${alpha(color, 0.15)}`,
          border: `1px solid ${alpha(color, 0.3)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={80} height={40} />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: trend ? 0.5 : 0,
                }}
              >
                {value}
              </Typography>
            )}
            {trend && !loading && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.success.main,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <TrendingUp fontSize="inherit" />
                {trend}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.15),
              color: color,
              width: 56,
              height: 56,
              border: `2px solid ${alpha(color, 0.2)}`,
            }}
          >
            {loading ? <CircularProgress size={24} /> : icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // Prepare chart data
  const ordersChartData = data
    ? [
        {
          name: "Pending",
          value: data.orders.pending,
          color: theme.palette.warning.main,
        },
        {
          name: "In Progress",
          value: data.orders.inProgress,
          color: theme.palette.info.main,
        },
        {
          name: "Completed",
          value: data.orders.completed,
          color: theme.palette.success.main,
        },
      ]
    : [];

  const usersChartData = data
    ? [
        { name: "Admins", value: data.users.admins },
        { name: "Staff", value: data.users.staff },
        { name: "Customers", value: data.users.customers },
      ]
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {user?.role === "ADMIN" ? "Admin Dashboard" : "Staff Dashboard"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Overview of system statistics and recent activities
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              sx={{
                height: 48,
                fontSize: "1rem",
                fontWeight: 600,
              }}
              startIcon={<Refresh />}
              onClick={refetch}
              disabled={loading}
            >
              Refresh
            </Button>
            {user?.role === "ADMIN" ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                endIcon={<ArrowForward />}
                href="/dashboard/admin/register"
                sx={{
                  minWidth: 200,
                  height: 48,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Add Admin/Staff
              </Button>
            ) : null}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards - Orders */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Orders"
            value={data?.orders.total || 0}
            icon={<Receipt />}
            color={theme.palette.primary.main}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Orders"
            value={data?.orders.pending || 0}
            icon={<Schedule />}
            color={theme.palette.warning.main}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="In Progress"
            value={data?.orders.inProgress || 0}
            icon={<LocalShipping />}
            color={theme.palette.info.main}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Completed"
            value={data?.orders.completed || 0}
            icon={<CheckCircle />}
            color={theme.palette.success.main}
            loading={loading}
          />
        </Grid>

        {user?.role === "ADMIN" ? (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total Users"
                value={data?.users.total || 0}
                icon={<People />}
                color={theme.palette.secondary.main}
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Customers"
                value={data?.users.customers || 0}
                icon={<People />}
                color={theme.palette.info.main}
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Staff"
                value={data?.users.staff || 0}
                icon={<SupervisorAccount />}
                color={theme.palette.warning.main}
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Admins"
                value={data?.users.admins || 0}
                icon={<AdminPanelSettings />}
                color={theme.palette.error.main}
                loading={loading}
              />
            </Grid>
          </>
        ) : null}

        {/* Charts Section */}
        <Grid size={{ xs: 12, lg: user?.role === "ADMIN" ? 6 : 12 }}>
          <Card elevation={0} sx={{ height: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Orders Distribution
              </Typography>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={300}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ordersChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent || 0 * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ordersChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {user?.role === "ADMIN" ? (
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card elevation={0} sx={{ height: 400 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  User Types Overview
                </Typography>
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={300}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usersChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {/* Recent Orders Section */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card elevation={0} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Orders
                </Typography>
                <Button
                  endIcon={<ArrowForward />}
                  href="/dashboard/orders"
                  sx={{ fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rectangular" height={100} />
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {data?.recentOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <Paper
                        key={order.id}
                        elevation={0}
                        sx={{
                          p: 3,
                          border: `1px solid ${theme.palette.grey[200]}`,
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            transform: "translateX(4px)",
                            boxShadow: `0 4px 20px ${alpha(
                              theme.palette.primary.main,
                              0.1
                            )}`,
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={2}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              {order.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Order: {order.orderNumber}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Customer: {order.customer.firstName}{" "}
                              {order.customer.lastName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(order.createdAt)}
                            </Typography>
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Button size="small">View Details</Button>
                            </Link>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Chip
                              icon={statusConfig.icon}
                              label={statusConfig.label}
                              color={statusConfig.color}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* System Summary */}
            <Card elevation={0}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
                >
                  System Summary
                </Typography>

                {loading ? (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={30}
                      sx={{ mx: "auto", mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={50}
                      sx={{ mx: "auto" }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Total Active Users
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {data?.users.total || 0}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Orders Success Rate
                    </Typography>
                    {loading ? (
                      <Skeleton variant="text" width={60} />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.success.main,
                        }}
                      >
                        {data?.orders.total
                          ? Math.round(
                              (data.orders.completed / data.orders.total) * 100
                            )
                          : 0}
                        %
                      </Typography>
                    )}
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Pending Review
                    </Typography>
                    {loading ? (
                      <Skeleton variant="rectangular" width={40} height={20} />
                    ) : (
                      <Chip
                        size="small"
                        label={data?.orders.pending || 0}
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card elevation={0}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {user?.role === "ADMIN" ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<People />}
                      href="/dashboard/admin/users"
                      sx={{ justifyContent: "flex-start" }}
                    >
                      Manage Users
                    </Button>
                  ) : null}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Receipt />}
                    href="/dashboard/orders"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    View Orders
                  </Button>
                  {/* <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Timeline />}
                    href="/admin/analytics"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Analytics
                  </Button> */}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
