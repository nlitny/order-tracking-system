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
  LinearProgress,
} from "@mui/material";
import {
  ShoppingCart,
  Schedule,
  CheckCircle,
  Cancel,
  Add,
  LocalShipping,
  Receipt,
  Timeline,
  History,
  TrendingUp,
  Assessment,
  Refresh,
  ArrowForward,
  ShoppingBag,
  AccountCircle,
  Notifications,
  Support,
  FactCheck,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCustomerDashboard } from "@/hooks/useCustomerDashboard";

// Helper functions
const getStatusConfig = (status: string) => {
  const configs = {
    PENDING: {
      label: "Pending",
      color: "warning" as const,
      icon: <Schedule fontSize="small" />,
      bgColor: "#fff3cd",
      borderColor: "#ffecb5",
    },
    IN_PROGRESS: {
      label: "In Progress",
      color: "info" as const,
      icon: <LocalShipping fontSize="small" />,
      bgColor: "#d1ecf1",
      borderColor: "#bee5eb",
    },
    COMPLETED: {
      label: "Completed",
      color: "success" as const,
      icon: <CheckCircle fontSize="small" />,
      bgColor: "#d4edda",
      borderColor: "#c3e6cb",
    },
    CANCELLED: {
      label: "Cancelled",
      color: "error" as const,
      icon: <Cancel fontSize="small" />,
      bgColor: "#f8d7da",
      borderColor: "#f5c6cb",
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

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function CustomerDashboard() {
  const theme = useTheme();
  const { data, loading, refetch } = useCustomerDashboard();

  const StatCard = ({
    title,
    value,
    icon,
    color,
    trend,
    loading = false,
    description,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
    loading?: boolean;
    description?: string;
  }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(
          color,
          0.12
        )} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 1,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 12px 40px ${alpha(color, 0.2)}`,
          border: `1px solid ${alpha(color, 0.4)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.15),
              color: color,
              width: 60,
              height: 60,
              border: `3px solid ${alpha(color, 0.2)}`,
            }}
          >
            {loading ? <CircularProgress size={24} /> : icon}
          </Avatar>
          {trend && !loading && (
            <Chip
              icon={<TrendingUp fontSize="small" />}
              label={trend}
              size="small"
              sx={{
                bgcolor: theme.palette.success.main,
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          )}
        </Box>

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
          <Skeleton variant="text" width={80} height={45} />
        ) : (
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
        )}

        {description && !loading && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  // Prepare chart data
  const ordersChartData = data
    ? [
        {
          name: "Completed",
          value: data.orders.completed,
          color: theme.palette.success.main,
          percentage: data.orders.total
            ? Math.round((data.orders.completed / data.orders.total) * 100)
            : 0,
        },
        {
          name: "In Progress",
          value: data.orders.inProgress,
          color: theme.palette.info.main,
          percentage: data.orders.total
            ? Math.round((data.orders.inProgress / data.orders.total) * 100)
            : 0,
        },
        {
          name: "Pending",
          value: data.orders.pending,
          color: theme.palette.warning.main,
          percentage: data.orders.total
            ? Math.round((data.orders.pending / data.orders.total) * 100)
            : 0,
        },
      ]
    : [];

  const completionRate = data?.orders.total
    ? Math.round((data.orders.completed / data.orders.total) * 100)
    : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={3}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              My Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Track your orders and explore our services
            </Typography>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={refetch}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              endIcon={<ArrowForward />}
              href="/orders/create"
              sx={{
                minWidth: 180,
                height: 48,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 1,
              }}
            >
              New Order
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Orders"
            value={data?.orders.total || 0}
            icon={<Receipt />}
            color={theme.palette.primary.main}
            loading={loading}
            description="All your orders"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Orders"
            value={data?.orders.pending || 0}
            icon={<Schedule />}
            color={theme.palette.warning.main}
            loading={loading}
            description="Awaiting review"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="In Progress"
            value={data?.orders.inProgress || 0}
            icon={<LocalShipping />}
            color={theme.palette.info.main}
            loading={loading}
            description="Being processed"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Completed"
            value={data?.orders.completed || 0}
            icon={<CheckCircle />}
            color={theme.palette.success.main}
            trend={`${completionRate}%`}
            loading={loading}
            description="Successfully delivered"
          />
        </Grid>

        {/* Orders Overview Chart */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            elevation={0}
            sx={{
              height: 450,
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <CardContent sx={{ p: 4, height: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Orders Overview
              </Typography>

              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={300}
                >
                  <CircularProgress size={60} />
                </Box>
              ) : (
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="70%">
                    <PieChart>
                      <Pie
                        data={ordersChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ordersChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} orders`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <Box sx={{ mt: 2 }}>
                    {ordersChartData.map((item, index) => (
                      <Box
                        key={index}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: item.color,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.value} ({item.percentage}%)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            elevation={0}
            sx={{
              height: 450,
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <CardContent sx={{ p: 4, height: "100%" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Recent Orders
                </Typography>
                <Button
                  endIcon={<ArrowForward />}
                  href="/orders"
                  sx={{ fontWeight: 600 }}
                >
                  View All Orders
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[1, 2, 3, 4].map((item) => (
                    <Skeleton
                      key={item}
                      variant="rectangular"
                      height={80}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
              ) : data?.recentOrders.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: 300 }}
                >
                  <ShoppingBag
                    sx={{ fontSize: 80, color: theme.palette.grey[300], mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No orders yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, textAlign: "center" }}
                  >
                    Start by creating your first order
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    href="/orders/create"
                    sx={{ borderRadius: 1 }}
                  >
                    Create Order
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    maxHeight: 340,
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  {data?.recentOrders.map((order, index) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <Paper
                        key={order.id}
                        elevation={0}
                        sx={{
                          p: 3,
                          border: `1px solid ${theme.palette.grey[200]}`,
                          borderRadius: 1,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            transform: "translateX(8px)",
                            boxShadow: `0 8px 30px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box sx={{ flex: 1 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={2}
                              mb={1}
                            >
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, fontSize: "1rem" }}
                              >
                                {order.title}
                              </Typography>
                              <Chip
                                icon={statusConfig.icon}
                                label={statusConfig.label}
                                color={statusConfig.color}
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              Order: {order.orderNumber}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(order.createdAt)}
                            </Typography>
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

        {/* Progress Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Order Statistics
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[1, 2, 3].map((item) => (
                    <Box key={item}>
                      <Skeleton variant="text" width="60%" height={30} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={8}
                        sx={{ borderRadius: 1, mt: 1 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Completion Rate
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.success.main,
                        }}
                      >
                        {completionRate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={completionRate}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 1,
                          bgcolor: theme.palette.success.main,
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        In Progress
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: theme.palette.info.main }}
                      >
                        {data?.orders.total
                          ? Math.round(
                              (data.orders.inProgress / data.orders.total) * 100
                            )
                          : 0}
                        %
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        data?.orders.total
                          ? (data.orders.inProgress / data.orders.total) * 100
                          : 0
                      }
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 1,
                          bgcolor: theme.palette.info.main,
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Pending Review
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.warning.main,
                        }}
                      >
                        {data?.orders.total
                          ? Math.round(
                              (data.orders.pending / data.orders.total) * 100
                            )
                          : 0}
                        %
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        data?.orders.total
                          ? (data.orders.pending / data.orders.total) * 100
                          : 0
                      }
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 1,
                          bgcolor: theme.palette.warning.main,
                        },
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {data?.orders.total || 0}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Quick Actions
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<FactCheck />}
                  endIcon={<ArrowForward />}
                  href="/dashboard/orders/new"
                  sx={{
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 1,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    {/* <ShoppingCart /> */}
                    Create New Order
                  </Box>
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<History />}
                  endIcon={<ArrowForward />}
                  href="/dashboard/orders"
                  sx={{
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 1,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <History />
                    View Order History
                  </Box>
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<AccountCircle />}
                  endIcon={<ArrowForward />}
                  href="/dashboard/profile"
                  sx={{
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 1,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <AccountCircle />
                    Edit Profile
                  </Box>
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Support />}
                  endIcon={<ArrowForward />}
                  href="/"
                  sx={{
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 1,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Support />
                    Get Support
                  </Box>
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Need help getting started?
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  href="/"
                  sx={{ borderRadius: 1 }}
                >
                  View Guide
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
