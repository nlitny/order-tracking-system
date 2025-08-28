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
  LinearProgress,
  Divider,
  IconButton,
  useTheme,
  alpha,
  Container,
  Paper,
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
  Notifications,
  ArrowForward,
} from "@mui/icons-material";

// Mock data - Replace with API calls in production
const mockOrderStats = {
  total: 47,
  pending: 8,
  inProgress: 12,
  completed: 23,
  cancelled: 4,
  totalSpent: 284750000, // Amount in cents or lowest currency unit
};

const mockRecentOrders = [
  {
    id: "ORD-2024-001",
    title: "Home Appliances Order",
    status: "inProgress",
    amount: 12450000,
    date: "Aug 28, 2025",
    progress: 65,
  },
  {
    id: "ORD-2024-002",
    title: "Electronics Order",
    status: "pending",
    amount: 8320000,
    date: "Aug 27, 2025",
    progress: 0,
  },
  {
    id: "ORD-2024-003",
    title: "Clothing Order",
    status: "completed",
    amount: 5670000,
    date: "Aug 26, 2025",
    progress: 100,
  },
];

// Helper functions
const formatCurrency = (amount: number) => {
  return "$" + new Intl.NumberFormat("en-US").format(amount / 100);
};

const getStatusConfig = (status: string) => {
  const configs = {
    pending: {
      label: "Pending Approval",
      color: "warning" as const,
      icon: <Schedule fontSize="small" />,
    },
    inProgress: {
      label: "In Progress",
      color: "info" as const,
      icon: <LocalShipping fontSize="small" />,
    },
    completed: {
      label: "Completed",
      color: "success" as const,
      icon: <CheckCircle fontSize="small" />,
    },
    cancelled: {
      label: "Cancelled",
      color: "error" as const,
      icon: <Cancel fontSize="small" />,
    },
  };
  return configs[status as keyof typeof configs] || configs.pending;
};

export default function CustomerDashboard() {
  const theme = useTheme();

  const StatCard = ({
    title,
    value,
    icon,
    color,
    trend,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
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
            {trend && (
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
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

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
              Customer Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Overview of your activities and orders
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            endIcon={<ArrowForward />}
            href="/dashboard/orders/new"
            sx={{
              minWidth: 200,
              height: 48,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            New Order
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Orders"
            value={mockOrderStats.total}
            icon={<Receipt />}
            color={theme.palette.primary.main}
            trend="+12% this month"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Approval"
            value={mockOrderStats.pending}
            icon={<Schedule />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="In Progress"
            value={mockOrderStats.inProgress}
            icon={<LocalShipping />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Completed"
            value={mockOrderStats.completed}
            icon={<CheckCircle />}
            color={theme.palette.success.main}
          />
        </Grid>

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
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
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

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {mockRecentOrders.map((order, index) => {
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
                          borderColor: theme.palette.secondary.main,
                          transform: "translateX(4px)",
                          boxShadow: `0 4px 20px ${alpha(
                            theme.palette.secondary.main,
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
                            Order ID: {order.id} • {order.date}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 700,
                            }}
                          >
                            {formatCurrency(order.amount)}
                          </Typography>
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

                      {order.status === "inProgress" && (
                        <Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Order Progress
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {order.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={order.progress}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary & Quick Actions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Financial Summary */}
            <Card elevation={0}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
                >
                  Financial Summary
                </Typography>

                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Total Amount Spent
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
                    {formatCurrency(mockOrderStats.totalSpent)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Cancelled Orders
                    </Typography>
                    <Chip
                      size="small"
                      label={mockOrderStats.cancelled}
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.success.main,
                      }}
                    >
                      {Math.round(
                        ((mockOrderStats.total - mockOrderStats.cancelled) /
                          mockOrderStats.total) *
                          100
                      )}
                      %
                    </Typography>
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
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Timeline />}
                    href="/dashboard/orders/tracking"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Track Order
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Receipt />}
                    href="/dashboard/orders/history"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Order History
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Notifications />}
                    href="/dashboard/notifications"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Notifications
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
