// app/dashboard/notifications/page.tsx
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Search,
  FilterList,
  Refresh,
  Assignment,
  Clear,
  MarkEmailRead as ReadIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Build as ProcessingIcon,
  Cancel as CancelledIcon,
  Pause as OnHoldIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notificationService";
import {
  Notification,
  NotificationsResponse,
  NotificationFilters,
} from "@/types/notification";
import { useToast } from "@/lib/toast/toast";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { useNotifications } from "@/hooks/useNotifications";

const ORDER_STATUS_CONFIG = {
  PENDING: {
    icon: PendingIcon,
    label: "Pending",
    color: "#ff9800",
    bgColor: "#fff3e0",
  },
  IN_PROGRESS: {
    icon: ProcessingIcon,
    label: "In Progress",
    color: "#2196f3",
    bgColor: "#e3f2fd",
  },
  COMPLETED: {
    icon: CompletedIcon,
    label: "Completed",
    color: "#4caf50",
    bgColor: "#e8f5e9",
  },
  CANCELLED: {
    icon: CancelledIcon,
    label: "Cancelled",
    color: "#f44336",
    bgColor: "#ffebee",
  },
  ON_HOLD: {
    icon: OnHoldIcon,
    label: "On Hold",
    color: "#9c27b0",
    bgColor: "#f3e5f5",
  },
};

const NOTIFICATION_TYPES = [
  { value: "", label: "All Types" },
  { value: "ORDER_UPDATE", label: "Order Updates" },
  { value: "ORDER_CREATED", label: "New Orders" },
  { value: "ORDER_CANCELLED", label: "Cancelled Orders" },
  { value: "ORDER_COMPLETED", label: "Completed Orders" },
  { value: "ORDER_APPROVED", label: "Approved Orders" },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50];

export default function NotificationsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showSuccessToast, showErrorToast } = useToast();
  const { markAsRead, markAllAsRead } = useNotifications();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<NotificationFilters>({
    page: 1,
    limit: 20,
    isRead: undefined,
    type: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchInput, setSearchInput] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications(filters);
      setNotifications(response.data.notifications);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message);
      showErrorToast("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [filters, showErrorToast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSearch = useCallback(() => {
    // اینجا می‌توانید search logic اضافه کنید
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  }, []);

  const handleTypeChange = useCallback((type: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      type,
    }));
  }, []);

  const handleReadStatusChange = useCallback((isRead: boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      isRead,
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

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (!notification.isRead) {
        await markAsRead(notification.id);
        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      }

      // هدایت به صفحه سفارش
      if (notification.orderId) {
        router.push(`/dashboard/orders/${notification.orderId}`);
      }
    },
    [markAsRead, router]
  );

  const handleRefresh = useCallback(() => {
    fetchNotifications();
    showSuccessToast("Notifications refreshed");
  }, [fetchNotifications, showSuccessToast]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showSuccessToast("All notifications marked as read");
    } catch (error) {
      showErrorToast("Failed to mark all as read");
    }
  }, [markAllAsRead, showSuccessToast, showErrorToast]);

  const totalActiveFilters = useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.isRead !== undefined) count++;
    return count;
  }, [filters]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const formatNotificationTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "HH:mm")}`;
    } else {
      return format(date, "MMM dd, yyyy 'at' HH:mm");
    }
  }, []);

  const getOrderStatusIcon = useCallback((status: string) => {
    const config =
      ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];
    if (!config) return <Assignment sx={{ fontSize: 18 }} />;

    const IconComponent = config.icon;
    return <IconComponent sx={{ fontSize: 18 }} />;
  }, []);

  const getOrderStatusConfig = useCallback((status: string) => {
    return (
      ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG] ||
      ORDER_STATUS_CONFIG.PENDING
    );
  }, []);

  const renderNotificationCard = (notification: Notification) => {
    const statusConfig = getOrderStatusConfig(notification.order.status);

    return (
      <Card
        key={notification.id}
        elevation={0}
        sx={{
          borderRadius: 1,
          border: "1px solid",
          borderColor: notification.isRead ? "grey.200" : "primary.main",
          cursor: "pointer",
          transition: "all 0.2s ease",
          backgroundColor: notification.isRead
            ? "transparent"
            : theme.palette.primary.main + "08",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: theme.shadows[4],
            transform: "translateY(-2px)",
          },
        }}
        onClick={() => handleNotificationClick(notification)}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: statusConfig.bgColor,
                color: statusConfig.color,
                width: 48,
                height: 48,
                flexShrink: 0,
              }}
            >
              {getOrderStatusIcon(notification.order.status)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: notification.isRead ? 500 : 700,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    flex: 1,
                    mr: 2,
                  }}
                >
                  {notification.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {!notification.isRead && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                      }}
                    />
                  )}
                  <Chip
                    icon={getOrderStatusIcon(notification.order.status)}
                    label={statusConfig.label}
                    size="small"
                    sx={{
                      bgcolor: statusConfig.bgColor,
                      color: statusConfig.color,
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.5 }}
              >
                {notification.message}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontFamily: "monospace",
                    }}
                  >
                    {notification.order.orderNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    •
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {notification.order.title}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ScheduleIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {formatNotificationTime(notification.sentAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
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
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Skeleton variant="text" width="70%" height={28} />
              <Skeleton
                variant="rectangular"
                width={80}
                height={24}
                sx={{ borderRadius: 1 }}
              />
            </Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton variant="text" width="30%" height={16} />
            </Box>
          </Box>
        </Box>
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
              All Notifications
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.875rem", md: "1rem", color: "#EFE9D5" },
              }}
            >
              Stay updated with all your order notifications
            </Typography>
          </Box>
          <Button
            startIcon={<ReadIcon />}
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
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
            Mark All Read ({unreadCount})
          </Button>
        </Box>
      </Paper>

      {/* Filters */}
      <Card elevation={0} sx={{ mb: 3, borderRadius: 1 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                placeholder="Search notifications..."
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Grid>

            {/* Type Filter */}
            <Grid size={{ xs: 12, md: 2.5 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => handleTypeChange(e.target.value as string)}
                  sx={{ borderRadius: 1 }}
                >
                  {NOTIFICATION_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Read Status Filter */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Status</InputLabel>
                <Select
                  value={
                    filters.isRead === undefined
                      ? "all"
                      : filters.isRead
                      ? "read"
                      : "unread"
                  }
                  label="Status"
                  onChange={(e) => {
                    const value = e.target.value;
                    handleReadStatusChange(
                      value === "all" ? undefined : value === "read"
                    );
                  }}
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="unread">Unread</MenuItem>
                  <MenuItem value="read">Read</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Items per page */}
            <Grid size={{ xs: 12, md: 1.5 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Per page</InputLabel>
                <Select
                  value={filters.limit}
                  label="Per page"
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  sx={{ borderRadius: 1 }}
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
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
                    borderRadius: 1,
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
                {filters.type && (
                  <Chip
                    label={`Type: ${
                      NOTIFICATION_TYPES.find((t) => t.value === filters.type)
                        ?.label
                    }`}
                    size="small"
                    onDelete={() => handleTypeChange("")}
                    sx={{ fontSize: "0.75rem" }}
                  />
                )}
                {filters.isRead !== undefined && (
                  <Chip
                    label={`Status: ${filters.isRead ? "Read" : "Unread"}`}
                    size="small"
                    onDelete={() => handleReadStatusChange(undefined)}
                    sx={{ fontSize: "0.75rem" }}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Notifications List */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid size={{ xs: 12 }} key={index}>
              {renderSkeletonCard()}
            </Grid>
          ))}
        </Grid>
      ) : notifications.length === 0 ? (
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
              ? "No notifications match your filters"
              : "No notifications found"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {totalActiveFilters > 0
              ? "Try adjusting your search criteria or filters"
              : "New notifications will appear here when they arrive"}
          </Typography>
        </Paper>
      ) : (
        <Fade in timeout={300}>
          <Box>
            <Grid container spacing={3}>
              {notifications.map((notification) => (
                <Grid size={{ xs: 12 }} key={notification.id}>
                  {renderNotificationCard(notification)}
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

      {/* Summary */}
      {notifications.length > 0 && (
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
            Showing {(pagination.currentPage - 1) * filters.limit + 1} to{" "}
            {Math.min(
              pagination.currentPage * filters.limit,
              pagination.totalItems
            )}{" "}
            of {pagination.totalItems} notifications • {filters.limit} per page
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
