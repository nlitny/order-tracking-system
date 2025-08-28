// components/layout/NotificationDrawer.tsx
"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Button,
  Badge,
  useTheme,
  alpha,
  Tooltip,
  Collapse,
  useMediaQuery,
  Skeleton,
  Zoom,
} from "@mui/material";
import {
  Close as CloseIcon,
  NotificationsOff as NotificationsOffIcon,
  Schedule as ScheduleIcon,
  MarkEmailRead as ReadIcon,
  Delete as DeleteIcon,
  ShoppingCart as OrderIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Build as ProcessingIcon,
  Cancel as CancelledIcon,
  ViewList as ViewAllIcon,
} from "@mui/icons-material";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  appBarHeight: number;
}

interface OrderNotification {
  id: string;
  title: string;
  message: string;
  orderStatus: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  timestamp: Date;
  read: boolean;
  orderId?: string;
  customerName?: string;
  amount?: number;
  priority: "low" | "medium" | "high" | "critical";
  metadata?: {
    orderId?: string;
    customerName?: string;
    amount?: number;
    trackingNumber?: string;
    estimatedDelivery?: string;
    [key: string]: any;
  };
}

// نمونه اعلان‌های سفارش
const mockOrderNotifications: OrderNotification[] = [
  {
    id: "1",
    title: "New Order Placed",
    message: "Order #ORD-2024-001 has been placed by Sarah Johnson",
    orderStatus: "pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    priority: "high",
    metadata: {
      orderId: "ORD-2024-001",
      customerName: "Sarah Johnson",
      amount: 1299.99,
    },
  },
  {
    id: "2",
    title: "Order Ready for Processing",
    message: "Payment confirmed for order #ORD-2024-002. Ready to process.",
    orderStatus: "processing",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    priority: "medium",
    metadata: {
      orderId: "ORD-2024-002",
      customerName: "Mike Chen",
      amount: 899.5,
    },
  },
  {
    id: "3",
    title: "Order Shipped",
    message:
      "Order #ORD-2024-003 has been shipped and is on the way to the customer",
    orderStatus: "shipped",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
    priority: "medium",
    metadata: {
      orderId: "ORD-2024-003",
      customerName: "Emma Davis",
      amount: 2199.99,
      trackingNumber: "1Z999AA1234567890",
      estimatedDelivery: "Tomorrow by 6:00 PM",
    },
  },
  {
    id: "4",
    title: "Order Cancelled",
    message: "Order #ORD-2024-004 has been cancelled by the customer",
    orderStatus: "cancelled",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    priority: "low",
    metadata: {
      orderId: "ORD-2024-004",
      customerName: "John Smith",
      amount: 599.99,
      reason: "Customer requested cancellation",
    },
  },
  {
    id: "5",
    title: "Order Completed",
    message:
      "Order #ORD-2024-005 has been successfully delivered and completed",
    orderStatus: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    read: true,
    priority: "low",
    metadata: {
      orderId: "ORD-2024-005",
      customerName: "Lisa Anderson",
      amount: 1599.99,
      deliveryDate: "Today at 2:30 PM",
    },
  },
  {
    id: "6",
    title: "High Value Order Alert",
    message: "Large order #ORD-2024-006 requires manager approval",
    orderStatus: "pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    priority: "critical",
    metadata: {
      orderId: "ORD-2024-006",
      customerName: "Corporate Client Ltd",
      amount: 15999.99,
      requiresApproval: true,
    },
  },
  {
    id: "7",
    title: "Processing Delayed",
    message:
      "Order #ORD-2024-007 processing is delayed due to inventory shortage",
    orderStatus: "processing",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: false,
    priority: "high",
    metadata: {
      orderId: "ORD-2024-007",
      customerName: "Alex Thompson",
      amount: 799.5,
      delayReason: "Inventory shortage",
    },
  },
  {
    id: "8",
    title: "Bulk Order Update",
    message: "Bulk order #ORD-2024-008 is being processed in batches",
    orderStatus: "processing",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    read: true,
    priority: "medium",
    metadata: {
      orderId: "ORD-2024-008",
      customerName: "Retail Partner Inc",
      amount: 5499.99,
      batchStatus: "2/4 batches completed",
    },
  },
];

// تنظیمات وضعیت سفارش
const orderStatusConfig = {
  pending: {
    icon: PendingIcon,
    label: "Pending",
    color: "#D4A574", // warning color from your theme
    bgColor: alpha("#D4A574", 0.1),
  },
  processing: {
    icon: ProcessingIcon,
    label: "Processing",
    color: "#497D74", // info color from your theme
    bgColor: alpha("#497D74", 0.1),
  },
  shipped: {
    icon: ShippingIcon,
    label: "Shipped",
    color: "#71BBB2", // secondary color from your theme
    bgColor: alpha("#71BBB2", 0.1),
  },
  completed: {
    icon: CompletedIcon,
    label: "Completed",
    color: "#71BBB2", // success color from your theme
    bgColor: alpha("#71BBB2", 0.1),
  },
  cancelled: {
    icon: CancelledIcon,
    label: "Cancelled",
    color: "#B85450", // error color from your theme
    bgColor: alpha("#B85450", 0.1),
  },
};

const priorityConfig = {
  low: { color: "#8B9B96", label: "Low", weight: 1 }, // disabled color from theme
  medium: { color: "#497D74", label: "Medium", weight: 2 }, // tertiary color
  high: { color: "#D4A574", label: "High", weight: 3 }, // warning color
  critical: { color: "#B85450", label: "Critical", weight: 4 }, // error color
};

export default function NotificationDrawer({
  open,
  onClose,
  appBarHeight,
}: NotificationDrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [notifications, setNotifications] = useState<OrderNotification[]>(
    mockOrderNotifications
  );
  const [loading, setLoading] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState<
    string | null
  >(null);

  // نمایش تعداد محدود اعلان‌ها
  const displayNotifications = useMemo(() => {
    return notifications
      .sort((a, b) => {
        // مرتب‌سازی بر اساس خوانده نشده، سپس اولویت، سپس زمان
        if (a.read !== b.read) return a.read ? 1 : -1;
        if (a.priority !== b.priority) {
          return (
            priorityConfig[b.priority].weight -
            priorityConfig[a.priority].weight
          );
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      })
      .slice(0, 8); // نمایش حداکثر 8 اعلان
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const criticalCount = useMemo(
    () =>
      notifications.filter((n) => n.priority === "critical" && !n.read).length,
    [notifications]
  );

  // توابع بهینه شده
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const deleteNotification = useCallback(
    (id: string, event?: React.MouseEvent) => {
      event?.stopPropagation();
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    },
    []
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const clearAllRead = useCallback(() => {
    setNotifications((prev) => prev.filter((notif) => !notif.read));
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedNotification((prev) => (prev === id ? null : id));
  }, []);

  const handleNotificationClick = useCallback(
    (notification: OrderNotification) => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
      toggleExpanded(notification.id);

      // هدایت به صفحه سفارش
      if (notification.metadata?.orderId) {
        console.log(`Navigating to order: ${notification.metadata.orderId}`);
        // router.push(`/orders/${notification.metadata.orderId}`);
      }
    },
    [markAsRead, toggleExpanded]
  );

  const handleViewAllClick = useCallback(() => {
    console.log("Navigate to all notifications page");
    // router.push('/notifications');
    onClose();
  }, [onClose]);

  const formatNotificationTime = useCallback((timestamp: Date) => {
    if (isToday(timestamp)) {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } else if (isYesterday(timestamp)) {
      return `Yesterday at ${format(timestamp, "HH:mm")}`;
    } else {
      return format(timestamp, "MMM dd, yyyy 'at' HH:mm");
    }
  }, []);

  const getOrderStatusIcon = useCallback(
    (status: OrderNotification["orderStatus"]) => {
      const IconComponent = orderStatusConfig[status].icon;
      return <IconComponent sx={{ fontSize: 18 }} />;
    },
    []
  );

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }, []);

  const renderNotificationSkeleton = () => (
    <List sx={{ p: 0 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <ListItem key={index} sx={{ px: 3, py: 2 }}>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant="text" width="80%" height={20} />}
            secondary={
              <Box>
                <Skeleton variant="text" width="100%" height={16} />
                <Skeleton variant="text" width="60%" height={16} />
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  const renderEmptyState = () => (
    <Zoom in timeout={500}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 4,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            mb: 3,
            "&::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: `linear-gradient(135deg, 
                ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              zIndex: -1,
            },
          }}
        >
          <NotificationsOffIcon
            sx={{
              fontSize: { xs: 56, sm: 64 },
              color: theme.palette.text.disabled,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
            }}
          />
        </Box>
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          All orders up to date!
        </Typography>
        <Typography
          variant="body2"
          color="text.disabled"
          sx={{
            maxWidth: 280,
            lineHeight: 1.6,
            fontSize: { xs: "0.85rem", sm: "0.875rem" },
          }}
        >
          New order notifications will appear here when they arrive.
        </Typography>
      </Box>
    </Zoom>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      elevation={16}
      sx={{
        "& .MuiDrawer-paper": {
          width: {
            xs: "100vw",
            sm: 400,
            md: 420,
            lg: 450,
          },
          maxWidth: "100vw",
          borderLeft: {
            xs: "none",
            sm: `1px solid ${theme.palette.divider}`,
          },
          mt: {
            xs: `${appBarHeight}px`,
            sm: `${appBarHeight}px`,
          },
          height: {
            xs: `calc(100vh - ${appBarHeight}px)`,
            sm: `calc(100vh - ${appBarHeight}px)`,
          },
          background: theme.palette.background.default,
          backdropFilter: "blur(20px)",
          borderRadius: {
            xs: 0,
            sm: "8px 0 0 8px",
          },
          boxShadow: theme.shadows[8],
          overflowX: "hidden", // منع scroll افقی
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // منع overflow
        }}
      >
        {/* هدر */}
        <Box
          sx={{
            position: "relative",
            p: { xs: 2, sm: 2.5, md: 3 },
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.02)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.01)} 50%,
              ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
            backdropFilter: "blur(10px)",
            minWidth: 0, // منع overflow
          }}
        >
          {/* ردیف اول هدر */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              minWidth: 0, // منع overflow
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2 },
                minWidth: 0,
                flex: 1,
                mr: 1,
              }}
            >
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  max={99}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      minWidth: 20,
                      height: 20,
                      backgroundColor: theme.palette.error.main,
                    },
                  }}
                >
                  <OrderIcon
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: { xs: 22, sm: 26 },
                    }}
                  />
                </Badge>
                {criticalCount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: theme.palette.error.main,
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": {
                          boxShadow: `0 0 0 0 ${alpha(
                            theme.palette.error.main,
                            0.7
                          )}`,
                        },
                        "70%": {
                          boxShadow: `0 0 0 6px ${alpha(
                            theme.palette.error.main,
                            0
                          )}`,
                        },
                        "100%": {
                          boxShadow: `0 0 0 0 ${alpha(
                            theme.palette.error.main,
                            0
                          )}`,
                        },
                      },
                    }}
                  />
                )}
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    color: theme.palette.text.primary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Order Notifications
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {unreadCount > 0
                    ? `${unreadCount} unread${
                        criticalCount > 0 ? ` • ${criticalCount} urgent` : ""
                      }`
                    : "All notifications read"}
                </Typography>
              </Box>
            </Box>

            <Tooltip title="Close notifications">
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  borderRadius: 1,
                  flexShrink: 0,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                    color: theme.palette.error.main,
                    transform: "scale(1.05)",
                  },
                  transition: theme.transitions.create([
                    "color",
                    "background-color",
                    "transform",
                  ]),
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* دکمه‌های عملیات */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              "& > *": {
                minWidth: 0,
              },
            }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              startIcon={<ReadIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 2,
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                whiteSpace: "nowrap",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: theme.shadows[2],
                  borderColor: theme.palette.primary.dark,
                },
                transition: theme.transitions.create([
                  "transform",
                  "box-shadow",
                ]),
              }}
            >
              Mark All Read
            </Button>
            <Button
              size="small"
              variant="text"
              color="error"
              onClick={clearAllRead}
              startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 2,
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
                whiteSpace: "nowrap",
                "&:hover": {
                  transform: "translateY(-1px)",
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
                transition: theme.transitions.create([
                  "transform",
                  "background-color",
                ]),
              }}
            >
              Clear Read
            </Button>
          </Box>
        </Box>

        {/* لیست اعلان‌ها */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            overflowX: "hidden", // منع scroll افقی
          }}
        >
          {loading ? (
            renderNotificationSkeleton()
          ) : displayNotifications.length === 0 ? (
            renderEmptyState()
          ) : (
            <List sx={{ p: 0 }}>
              {displayNotifications.map((notification, index) => {
                const isExpanded = expandedNotification === notification.id;
                const statusConfig =
                  orderStatusConfig[notification.orderStatus];

                return (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      alignItems="flex-start"
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        px: { xs: 2, sm: 2.5, md: 3 },
                        py: { xs: 1.5, sm: 2 },
                        cursor: "pointer",
                        position: "relative",
                        backgroundColor: !notification.read
                          ? alpha(theme.palette.primary.main, 0.02)
                          : "transparent",
                        borderLeft: !notification.read
                          ? `4px solid ${theme.palette.primary.main}`
                          : "4px solid transparent",
                        minWidth: 0, // منع overflow
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.grey[200], 0.4),
                          transform: "translateX(2px)",
                        },
                        "&:active": {
                          transform: "translateX(2px) scale(0.998)",
                        },
                        transition: theme.transitions.create(
                          ["background-color", "transform", "box-shadow"],
                          {
                            duration: 200,
                          }
                        ),
                      }}
                    >
                      <ListItemAvatar sx={{ mt: 0.5, mr: { xs: 1, sm: 2 } }}>
                        <Avatar
                          sx={{
                            bgcolor: statusConfig.bgColor,
                            color: statusConfig.color,
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            boxShadow: theme.shadows[2],
                            border: `2px solid ${alpha(
                              statusConfig.color,
                              0.2
                            )}`,
                          }}
                        >
                          {getOrderStatusIcon(notification.orderStatus)}
                        </Avatar>
                      </ListItemAvatar>

                      {/* استفاده از Box به جای ListItemText برای جلوگیری از خطای nested p */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Primary content */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            mb: 0.5,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            component="div" // استفاده از div به جای p
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.read ? 500 : 700,
                              flexGrow: 1,
                              fontSize: { xs: "0.85rem", sm: "0.9rem" },
                              color: theme.palette.text.primary,
                              lineHeight: 1.3,
                              minWidth: 0,
                              wordBreak: "break-word",
                            }}
                          >
                            {notification.title}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              flexShrink: 0,
                            }}
                          >
                            {/* نشانگر اولویت */}
                            {notification.priority === "critical" && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor:
                                    priorityConfig[notification.priority].color,
                                  animation: "pulse 1.5s infinite",
                                }}
                              />
                            )}

                            {/* چیپ وضعیت سفارش */}
                            <Chip
                              icon={getOrderStatusIcon(
                                notification.orderStatus
                              )}
                              label={statusConfig.label}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: { xs: 20, sm: 22 },
                                fontSize: { xs: "0.65rem", sm: "0.7rem" },
                                fontWeight: 500,
                                borderColor: alpha(statusConfig.color, 0.3),
                                color: statusConfig.color,
                                backgroundColor: alpha(
                                  statusConfig.color,
                                  0.05
                                ),
                                "& .MuiChip-icon": {
                                  ml: 0.5,
                                  fontSize: { xs: 14, sm: 16 },
                                },
                                "& .MuiChip-label": {
                                  px: { xs: 0.5, sm: 1 },
                                },
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Secondary content */}
                        <Box>
                          <Typography
                            component="div" // استفاده از div به جای p
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              mb: 1,
                              fontSize: { xs: "0.75rem", sm: "0.8rem" },
                              lineHeight: 1.4,
                              wordBreak: "break-word",
                            }}
                          >
                            {notification.message}
                          </Typography>

                          {/* محتوای گسترده شده */}
                          <Collapse in={isExpanded} timeout={300}>
                            {notification.metadata && (
                              <Box
                                sx={{
                                  mt: 1.5,
                                  p: 1.5,
                                  borderRadius: 2,
                                  backgroundColor: alpha(
                                    theme.palette.background.paper,
                                    0.6
                                  ),
                                  border: `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                <Typography
                                  component="div"
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.secondary,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                    mb: 1,
                                    display: "block",
                                  }}
                                >
                                  Order Details
                                </Typography>

                                {notification.metadata.orderId && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 0.5,
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ flexShrink: 0 }}
                                    >
                                      Order ID:
                                    </Typography>
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        fontWeight: 600,
                                        fontFamily: "monospace",
                                        wordBreak: "break-all",
                                      }}
                                    >
                                      {notification.metadata.orderId}
                                    </Typography>
                                  </Box>
                                )}

                                {notification.metadata.customerName && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 0.5,
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ flexShrink: 0 }}
                                    >
                                      Customer:
                                    </Typography>
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        fontWeight: 500,
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {notification.metadata.customerName}
                                    </Typography>
                                  </Box>
                                )}

                                {notification.metadata.amount && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 0.5,
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ flexShrink: 0 }}
                                    >
                                      Amount:
                                    </Typography>
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        fontWeight: 600,
                                        color: theme.palette.success.main,
                                      }}
                                    >
                                      {formatCurrency(
                                        notification.metadata.amount
                                      )}
                                    </Typography>
                                  </Box>
                                )}

                                {notification.metadata.trackingNumber && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 0.5,
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ flexShrink: 0 }}
                                    >
                                      Tracking:
                                    </Typography>
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        fontWeight: 500,
                                        fontFamily: "monospace",
                                        wordBreak: "break-all",
                                      }}
                                    >
                                      {notification.metadata.trackingNumber}
                                    </Typography>
                                  </Box>
                                )}

                                {/* سایر فیلدها */}
                                {Object.entries(notification.metadata)
                                  .filter(
                                    ([key]) =>
                                      ![
                                        "orderId",
                                        "customerName",
                                        "amount",
                                        "trackingNumber",
                                      ].includes(key)
                                  )
                                  .map(([key, value]) => (
                                    <Box
                                      key={key}
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 0.5,
                                        gap: 1,
                                      }}
                                    >
                                      <Typography
                                        component="span"
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ flexShrink: 0 }}
                                      >
                                        {key.charAt(0).toUpperCase() +
                                          key.slice(1)}
                                        :
                                      </Typography>
                                      <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{
                                          fontWeight: 500,
                                          wordBreak: "break-word",
                                        }}
                                      >
                                        {String(value)}
                                      </Typography>
                                    </Box>
                                  ))}
                              </Box>
                            )}
                          </Collapse>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 1,
                              gap: 1,
                              minWidth: 0,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              <ScheduleIcon
                                sx={{
                                  fontSize: 12,
                                  color: theme.palette.text.disabled,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  color: theme.palette.text.disabled,
                                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {formatNotificationTime(notification.timestamp)}
                              </Typography>
                            </Box>

                            <Box
                              sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}
                            >
                              {!notification.read && (
                                <Tooltip title="Mark as read">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    sx={{
                                      color: theme.palette.success.main,
                                      "&:hover": {
                                        backgroundColor: alpha(
                                          theme.palette.success.main,
                                          0.08
                                        ),
                                        transform: "scale(1.1)",
                                      },
                                      transition: theme.transitions.create([
                                        "background-color",
                                        "transform",
                                      ]),
                                    }}
                                  >
                                    <ReadIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <Tooltip title="Delete notification">
                                <IconButton
                                  size="small"
                                  onClick={(e) =>
                                    deleteNotification(notification.id, e)
                                  }
                                  sx={{
                                    color: theme.palette.error.main,
                                    "&:hover": {
                                      backgroundColor: alpha(
                                        theme.palette.error.main,
                                        0.08
                                      ),
                                      transform: "scale(1.1)",
                                    },
                                    transition: theme.transitions.create([
                                      "background-color",
                                      "transform",
                                    ]),
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>

                        {/* نشانگر خوانده نشده */}
                        {!notification.read && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: { xs: 12, sm: 16 },
                              right: { xs: 12, sm: 16 },
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: theme.palette.primary.main,
                              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                            }}
                          />
                        )}
                      </Box>
                    </ListItem>

                    {index < displayNotifications.length - 1 && (
                      <Divider
                        variant="inset"
                        component="li"
                        sx={{
                          ml: { xs: 7, sm: 8 },
                          borderColor: theme.palette.divider,
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>

        {/* فوتر - دکمه مشاهده همه */}
        {notifications.length > 8 && (
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderTop: `1px solid ${theme.palette.divider}`,
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(10px)",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              size="medium"
              onClick={handleViewAllClick}
              startIcon={<ViewAllIcon />}
              sx={{
                borderRadius: 2,
                py: 1,
                fontWeight: 600,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: theme.palette.primary.dark,
                  transform: "translateY(-1px)",
                  boxShadow: theme.shadows[4],
                },
                transition: theme.transitions.create([
                  "transform",
                  "box-shadow",
                  "background-color",
                ]),
              }}
            >
              View All Notifications ({notifications.length})
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
