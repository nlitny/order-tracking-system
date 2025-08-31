// app/orders/page.tsx
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Alert,
  Button,
  useMediaQuery,
  useTheme,
  Fade,
  Stack,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Refresh,
  Assignment,
  Clear,
  TrendingUp,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/orderService";
import { OrderItem, OrderFilters, OrderStatus } from "@/types/customer-order";
import { useToast } from "@/lib/toast/toast";
import OrderCard from "@/components/orders/OrderCard";
import OrderCardSkeleton from "@/components/orders/OrderCardSkeleton";
import { useUser } from "@/context/UserContext";

const ORDER_STATUS_COLORS = {
  PENDING: { color: "#ff9800", bg: "#fff3e0", label: "Pending" },
  IN_PROGRESS: { color: "#2196f3", bg: "#e3f2fd", label: "In Progress" },
  COMPLETED: { color: "#4caf50", bg: "#e8f5e9", label: "Completed" },
  CANCELLED: { color: "#f44336", bg: "#ffebee", label: "Cancelled" },
  ON_HOLD: { color: "#ff5722", bg: "#fff3e0", label: "On Hold" },
};

// Priority order for sorting
const STATUS_PRIORITY = {
  IN_PROGRESS: 1,
  ON_HOLD: 2,
  PENDING: 3,
  COMPLETED: 4,
  CANCELLED: 5,
};

// Items per page options
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

export default function OrdersPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showSuccessToast, showErrorToast } = useToast();
  const { user } = useUser();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 30,
    status: "",
    search: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
    limit: 30,
  });

  const [searchInput, setSearchInput] = useState("");

  // Sort orders by status priority
  const sortOrdersByStatus = useCallback((orders: any[]) => {
    return [...orders].sort((a, b) => {
      const priorityA = (STATUS_PRIORITY as any)[a.status] || 999;
      const priorityB = (STATUS_PRIORITY as any)[b.status] || 999;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrders(filters);
      const sortedOrders = sortOrdersByStatus(response.data.orders);

      setOrders(sortedOrders);
      setPagination(
        (response.data as any).pagination || {
          totalCount: (response.data as any).totalCount,
          currentPage: (response.data as any).currentPage,
          totalPages: (response.data as any).totalPages,
          hasNextPage: (response.data as any).hasNextPage,
          hasPrevPage: (response.data as any).hasPrevPage,
        }
      );
    } catch (err: any) {
      setError(err.message);
      showErrorToast("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [filters, showErrorToast, sortOrdersByStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: searchInput.trim(),
    }));
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: "",
    }));
  }, []);

  const handleStatusChange = useCallback((status: OrderStatus) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      status,
    }));
  }, []);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      setFilters((prev) => ({ ...prev, page }));
    },
    []
  );

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      limit,
    }));
  }, []);

  const handleOrderClick = useCallback(
    (orderId: string) => {
      router.push(`/dashboard/orders/${orderId}`);
    },
    [router]
  );

  const handleRefresh = useCallback(() => {
    fetchOrders();
    showSuccessToast("Orders refreshed");
  }, [fetchOrders, showSuccessToast]);

  const totalActiveFilters = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  // Status statistics
  const statusStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      inProgress: orders.filter((o) => o.status === "IN_PROGRESS").length,
      completed: orders.filter((o) => o.status === "COMPLETED").length,
      onHold: orders.filter((o) => o.status === "ON_HOLD").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Enhanced Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          background: "linear-gradient(135deg, #1a2f42 0%, #497D74 100%)",
          color: "white",
          borderRadius: 1,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: {
                  xs: "1.75rem",
                  sm: "2.25rem",
                  md: "2.5rem",
                },
                color: "#EFE9D5",
                letterSpacing: "-0.02em",
              }}
            >
              {user?.role === "CUSTOMER" ? "My Orders" : "Orders List"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                color: "#EFE9D5",
                mb: 3,
                fontWeight: 400,
              }}
            >
              Manage and track all your orders in one place
            </Typography>

            {/* Quick Stats */}
            <Stack direction="row" spacing={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#EFE9D5" }}
                >
                  {statusStats.total}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#EFE9D5", opacity: 0.8 }}
                >
                  Total Orders
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#4FC3F7" }}
                >
                  {statusStats.inProgress}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#EFE9D5", opacity: 0.8 }}
                >
                  In Progress
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#81C784" }}
                >
                  {statusStats.completed}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#EFE9D5", opacity: 0.8 }}
                >
                  Completed
                </Typography>
              </Box>
            </Stack>
          </Box>

          {user?.role === "CUSTOMER" ? (
            <Button
              startIcon={<Add />}
              onClick={() => router.push("/dashboard/orders/new")}
              sx={{
                bgcolor: theme.palette.secondary.contrastText,
                color: theme.palette.tertiary.main,
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: 1,
                px: 3,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: theme.palette.primary.contrastText,
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                minWidth: { xs: "100%", sm: "auto" },
              }}
            >
              New Order
            </Button>
          ) : null}
        </Box>
      </Paper>

      {/* Filters Section */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                placeholder="Search orders by title, order number..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                fullWidth
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2.5 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filters.status}
                  label="Status Filter"
                  onChange={(e) =>
                    handleStatusChange(e.target.value as OrderStatus)
                  }
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">All Orders</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="ON_HOLD">On Hold</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Items per page</InputLabel>
                <Select
                  value={filters.limit}
                  label="Items per page"
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  sx={{ borderRadius: 1 }}
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option} items
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{ borderRadius: 1, px: 3 }}
                >
                  Search
                </Button>
                <IconButton
                  onClick={handleRefresh}
                  color="primary"
                  sx={{
                    border: "2px solid",
                    borderColor: "primary.main",
                    borderRadius: 1,
                    "&:hover": {
                      transform: "rotate(180deg)",
                      bgcolor: "primary.50",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Refresh />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {/* Active Filters */}
          {totalActiveFilters > 0 && (
            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <FilterList color="action" sx={{ fontSize: 18 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Active Filters:
                </Typography>
                {filters.status && (
                  <Chip
                    label={`Status: ${
                      ORDER_STATUS_COLORS[filters.status].label
                    }`}
                    size="medium"
                    onDelete={() => handleStatusChange("")}
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      bgcolor: ORDER_STATUS_COLORS[filters.status].bg,
                      color: ORDER_STATUS_COLORS[filters.status].color,
                    }}
                  />
                )}
                {filters.search && (
                  <Chip
                    label={`Search: "${filters.search}"`}
                    size="medium"
                    onDelete={handleClearSearch}
                    sx={{ fontSize: "0.8rem", fontWeight: 600 }}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Orders List */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
              <OrderCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: "center",
            borderRadius: 1,
            border: "2px dashed",
            borderColor: "grey.300",
            bgcolor: "grey.50",
          }}
        >
          <Assignment sx={{ fontSize: 80, color: "grey.400", mb: 3 }} />
          <Typography
            variant="h4"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            {totalActiveFilters > 0
              ? "No orders match your filters"
              : "No orders found"}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
          >
            {totalActiveFilters > 0
              ? "Try adjusting your search criteria or filters to find what you're looking for"
              : "Create your first order to get started with managing your business"}
          </Typography>
          {totalActiveFilters === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/orders/new")}
              size="large"
              sx={{ borderRadius: 1, px: 4, py: 1.5, fontSize: "1.1rem" }}
            >
              Create First Order
            </Button>
          )}
        </Paper>
      ) : (
        <Fade in timeout={500}>
          <Box>
            {/* Status Priority Info */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 1,
                bgcolor: "info.50",
                border: "2px solid",
                borderColor: "info.200",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TrendingUp sx={{ color: "info.main", fontSize: 24 }} />
                <Typography
                  variant="body1"
                  color="info.main"
                  sx={{ fontWeight: 600 }}
                >
                  📋 Orders are automatically sorted by priority: In Progress →
                  On Hold → Pending → Completed → Cancelled
                </Typography>
              </Box>
            </Paper>

            <Grid container spacing={3}>
              {orders.map((order, index) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={order.id}>
                  <OrderCard
                    order={order}
                    onClick={handleOrderClick}
                    index={index}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 1, bgcolor: "grey.50" }}
          >
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "medium" : "large"}
              showFirstButton
              showLastButton
            />
          </Paper>
        </Box>
      )}

      {/* Summary */}
      {orders.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 1,
            bgcolor: "grey.50",
            textAlign: "center",
          }}
        >
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalItems
            )}{" "}
            of {pagination.totalItems} orders • {filters.limit} items per page
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
