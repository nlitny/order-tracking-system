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
  Skeleton,
  Alert,
  Button,
  useMediaQuery,
  useTheme,
  Fade,
  Avatar,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Refresh,
  Assignment,
  Person,
  CalendarToday,
  Clear,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/orderService";
import {
  OrderItem,
  OrdersResponse,
  OrderFilters,
  OrderStatus,
} from "@/types/order";
import { useToast } from "@/lib/toast/toast";
import { format } from "date-fns";

const ORDER_STATUS_COLORS = {
  PENDING: { color: "#ff9800", bg: "#fff3e0", label: "Pending" },
  IN_PROGRESS: { color: "#2196f3", bg: "#e3f2fd", label: "In Progress" },
  COMPLETED: { color: "#4caf50", bg: "#e8f5e9", label: "Completed" },
  CANCELLED: { color: "#f44336", bg: "#ffebee", label: "Cancelled" },
  ON_HOLD: { color: "#9c27b0", bg: "#f3e5f5", label: "On Hold" },
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
  const sortOrdersByStatus = useCallback((orders: OrderItem[]) => {
    return [...orders].sort((a, b) => {
      const priorityA = STATUS_PRIORITY[a.status] || 999;
      const priorityB = STATUS_PRIORITY[b.status] || 999;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If same priority, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrders(filters);

      // Sort the orders by status priority
      const sortedOrders = sortOrdersByStatus(response.data.orders);

      setOrders(sortedOrders);
      setPagination(response.data.pagination);
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

  const renderOrderCard = (order: OrderItem) => {
    const statusConfig = ORDER_STATUS_COLORS[order.status];

    return (
      <Card
        key={order.id}
        elevation={0}
        sx={{
          borderRadius: 1,
          border: "1px solid",
          borderColor: "grey.200",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: theme.shadows[4],
            transform: "translateY(-2px)",
          },
        }}
        onClick={() => handleOrderClick(order.id)}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {order.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                {order.orderNumber}
              </Typography>
            </Box>
            <Chip
              label={statusConfig.label}
              size="small"
              sx={{
                backgroundColor: statusConfig.bg,
                color: statusConfig.color,
                fontWeight: 600,
                fontSize: { xs: "0.75rem", md: "0.75rem" },
                height: { xs: 24, md: 28 },
                ml: 1,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Avatar
              sx={{ width: 20, height: 20, fontSize: "0.75rem" }}
              src={order.customer?.profilePicture || ""}
            >
              {order.customer.firstName.charAt(0)}
            </Avatar>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
            >
              {order.customer.firstName} {order.customer.lastName}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarToday
              sx={{ fontSize: { xs: 14, md: 16 }, color: "text.secondary" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
            >
              Created {format(new Date(order.createdAt), "MMM dd, yyyy")}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderSkeletonCard = () => (
    <Card
      elevation={0}
      sx={{ borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
          <Skeleton
            variant="rectangular"
            width={80}
            height={28}
            sx={{ borderRadius: 1 }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="30%" height={20} />
        </Box>
        <Skeleton variant="text" width="50%" height={16} />
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          background: "linear-gradient(135deg, #1a2f42 0%, #497D74 100%)",
          color: "white",
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.125rem",
                  color: "#EFE9D5",
                },
              }}
            >
              My Orders
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.875rem", md: "1rem", color: "#EFE9D5" },
              }}
            >
              Manage and track all your orders in one place
            </Typography>
          </Box>
          <Button
            startIcon={<Add />}
            onClick={() => router.push("/dashboard/orders/new")}
            sx={{
              bgcolor: theme.palette.secondary.contrastText,
              color: theme.palette.tertiary.main,
              border: "1px solid rgba(255,255,255,0.3)",
              "&:hover": {
                bgcolor: theme.palette.primary.contrastText,
              },
              minWidth: { xs: "100%", sm: "auto" },
            }}
          >
            New Order
          </Button>
        </Box>
      </Paper>

      {/* Filters */}
      <Card elevation={0} sx={{ mb: 3, borderRadius: 1 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
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

            {/* Status Filter */}
            <Grid size={{ xs: 12, md: 2.5 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filters.status}
                  label="Status Filter"
                  onChange={(e) =>
                    handleStatusChange(e.target.value as OrderStatus)
                  }
                  sx={{
                    borderRadius: 1,
                  }}
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

            {/* Items per page */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Items per page</InputLabel>
                <Select
                  value={filters.limit}
                  label="Items per page"
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  sx={{
                    borderRadius: 1,
                  }}
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option} items
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12, md: 2.5 }}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" , alignItems: "center" }}>
                <Button
                  variant="outlined"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{ borderRadius: 1 }}
                >
                  Search
                </Button>
                <IconButton
                  onClick={handleRefresh}
                  color="primary"
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
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
                mt: 2,
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
                <FilterList color="action" sx={{ fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary">
                  Active Filters:
                </Typography>
                {filters.status && (
                  <Chip
                    label={`Status: ${
                      ORDER_STATUS_COLORS[filters.status].label
                    }`}
                    size="small"
                    onDelete={() => handleStatusChange("")}
                    sx={{ fontSize: "0.75rem" }}
                  />
                )}
                {filters.search && (
                  <Chip
                    label={`Search: "${filters.search}"`}
                    size="small"
                    onDelete={handleClearSearch}
                    sx={{ fontSize: "0.75rem" }}
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
              {renderSkeletonCard()}
            </Grid>
          ))}
        </Grid>
      ) : orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 1,
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <Assignment sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            {totalActiveFilters > 0
              ? "No orders match your filters"
              : "No orders found"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {totalActiveFilters > 0
              ? "Try adjusting your search criteria or filters"
              : "Create your first order to get started"}
          </Typography>
          {totalActiveFilters === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/orders/new")}
              size="large"
              sx={{ borderRadius: 1 }}
            >
              Create First Order
            </Button>
          )}
        </Paper>
      ) : (
        <Fade in timeout={300}>
          <Box>
            {/* Status Priority Info */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 1,
                bgcolor: "info.50",
                border: "1px solid",
                borderColor: "info.200",
              }}
            >
              <Typography
                variant="body2"
                color="info.main"
                sx={{ fontWeight: 500 }}
              >
                📋 Orders are automatically sorted by priority: In Progress → On
                Hold → Pending → Completed → Cancelled
              </Typography>
            </Paper>

            <Grid container spacing={3}>
              {orders.map((order) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={order.id}>
                  {renderOrderCard(order)}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
              showFirstButton
              showLastButton
            />
          </Paper>
        </Box>
      )}

      {/* Orders Summary */}
      {orders.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 3,
            borderRadius: 1,
            bgcolor: "grey.50",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
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
