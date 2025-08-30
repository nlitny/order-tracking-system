// app/dashboard/notifications/page.tsx
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Pagination,
  Paper,
  Skeleton,
  Alert,
  Button,
  useMediaQuery,
  useTheme,
  Fade,
  Avatar,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  Refresh,
  MarkEmailRead as ReadIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Build as ProcessingIcon,
  Cancel as CancelledIcon,
  Pause as OnHoldIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notificationService";
import { Notification, NotificationFilters } from "@/types/notification";
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

const ITEMS_PER_PAGE = 20;

export default function NotificationsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showSuccessToast, showErrorToast } = useToast();
  const { markAsRead } = useNotifications();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<NotificationFilters>({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

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

  // Event Handlers
  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      setFilters((prev) => ({ ...prev, page }));
    },
    []
  );

  const handleMarkAsRead = useCallback(
    async (e: React.MouseEvent, notificationId: string) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        showSuccessToast("Notification marked as read");
      } catch (error) {
        showErrorToast("Failed to mark notification as read");
      }
    },
    [markAsRead, showSuccessToast, showErrorToast]
  );

  const handleViewOrder = useCallback(
    async (e: React.MouseEvent, notification: Notification) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        // اگر خوانده نشده است، ابتدا آن را خوانده شده علامت‌گذاری کن
        if (!notification.isRead) {
          await markAsRead(notification.id);
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
      } catch (error) {
        showErrorToast("Failed to mark notification as read");
        // بازهم به صفحه سفارش برو حتی اگر mark as read ناموفق بود
        if (notification.orderId) {
          router.push(`/dashboard/orders/${notification.orderId}`);
        }
      }
    },
    [markAsRead, router, showErrorToast]
  );

  const handleRefresh = useCallback(() => {
    fetchNotifications();
    showSuccessToast("Notifications refreshed");
  }, [fetchNotifications, showSuccessToast]);

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
    if (!config) return <ProcessingIcon sx={{ fontSize: 18 }} />;
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
          transition: "all 0.2s ease",
          backgroundColor: notification.isRead
            ? "transparent"
            : alpha(theme.palette.primary.main, 0.04),
          position: "relative",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: theme.shadows[4],
            transform: "translateY(-2px)",
          },
        }}
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
                border: `2px solid ${alpha(statusConfig.color, 0.2)}`,
              }}
            >
              {getOrderStatusIcon(notification.order.status)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* عنوان و وضعیت */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: notification.isRead ? 500 : 700,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    flex: 1,
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                  }}
                >
                  {notification.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
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
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>

              {/* متن پیام */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {notification.message}
              </Typography>

              {/* جزئیات سفارش */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.background.paper, 0.6),
                  border: `1px solid ${theme.palette.divider}`,
                  mb: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    display: "block",
                    mb: 1,
                  }}
                >
                  Order Details
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Order Number:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                    }}
                  >
                    {notification.order.orderNumber}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Order Title:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      wordBreak: "break-word",
                      maxWidth: "60%",
                      textAlign: "right",
                    }}
                  >
                    {notification.order.title}
                  </Typography>
                </Box>
              </Box>

              {/* زمان و دکمه‌های عملیات */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ScheduleIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {formatNotificationTime(notification.sentAt)}
                  </Typography>
                </Box>

                {/* دکمه‌های عملیات */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  {!notification.isRead && (
                    <Tooltip title="Mark as read">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => handleMarkAsRead(e, notification.id)}
                        startIcon={<ReadIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          minWidth: "auto",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "0.75rem",
                          borderRadius: 1,
                          borderColor: theme.palette.success.main,
                          color: theme.palette.success.main,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.success.main,
                              0.08
                            ),
                            borderColor: theme.palette.success.dark,
                          },
                        }}
                      >
                        {isMobile ? "" : "Read"}
                      </Button>
                    </Tooltip>
                  )}

                  <Tooltip title="View order details">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={(e) => handleViewOrder(e, notification)}
                      startIcon={<OpenIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        minWidth: "auto",
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.75rem",
                        borderRadius: 1,
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      {isMobile ? "View" : "View Order"}
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderSkeletonCard = (index: number) => (
    <Card
      key={index}
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
            <Box sx={{ mt: 2, mb: 2 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={80}
                sx={{ borderRadius: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Skeleton variant="text" width="40%" height={16} />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={30}
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={30}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Try Again
        </Button>
      </Container>
    );
  }

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
                },
                color: "#EFE9D5",
              }}
            >
              All Notifications
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.875rem", md: "1rem" },
                color: "#EFE9D5",
              }}
            >
              Stay updated with all your order notifications •{" "}
              {pagination.totalItems} total
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </Typography>
          </Box>

          {/* Refresh Button */}
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<Refresh />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "white",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Notifications List */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) =>
              renderSkeletonCard(index)
            )}
          </Box>
        ) : notifications.length === 0 ? (
          <Fade in timeout={500}>
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
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                New notifications will appear here when they arrive
              </Typography>
            </Paper>
          </Fade>
        ) : (
          <Fade in timeout={300}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {notifications.map((notification) =>
                renderNotificationCard(notification)
              )}
            </Box>
          </Fade>
        )}
      </Box>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 1,
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
}
