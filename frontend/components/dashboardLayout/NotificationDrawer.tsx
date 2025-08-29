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
  ViewList as ViewAllIcon,
  Assignment as OrderIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Build as ProcessingIcon,
  Cancel as CancelledIcon,
  Pause as OnHoldIcon,
} from "@mui/icons-material";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/types/notification";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  appBarHeight: number;
}

// تنظیمات وضعیت سفارش بر اساس API
const ORDER_STATUS_CONFIG = {
  PENDING: {
    icon: PendingIcon,
    label: "Pending",
    color: "#ff9800",
    bgColor: alpha("#ff9800", 0.1),
  },
  IN_PROGRESS: {
    icon: ProcessingIcon,
    label: "In Progress",
    color: "#2196f3",
    bgColor: alpha("#2196f3", 0.1),
  },
  COMPLETED: {
    icon: CompletedIcon,
    label: "Completed",
    color: "#4caf50",
    bgColor: alpha("#4caf50", 0.1),
  },
  CANCELLED: {
    icon: CancelledIcon,
    label: "Cancelled",
    color: "#f44336",
    bgColor: alpha("#f44336", 0.1),
  },
  ON_HOLD: {
    icon: OnHoldIcon,
    label: "On Hold",
    color: "#9c27b0",
    bgColor: alpha("#9c27b0", 0.1),
  },
};

const NOTIFICATION_TYPE_CONFIG = {
  ORDER_UPDATE: { label: "Order Updated", priority: "medium" },
  ORDER_CREATED: { label: "New Order", priority: "high" },
  ORDER_CANCELLED: { label: "Order Cancelled", priority: "high" },
  ORDER_COMPLETED: { label: "Order Completed", priority: "low" },
  ORDER_APPROVED: { label: "Order Approved", priority: "medium" },
};

export default function NotificationDrawer({
  open,
  onClose,
  appBarHeight,
}: NotificationDrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const {
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    getRecentNotifications,
    getCriticalNotifications,
    refreshNotifications,
  } = useNotifications();

  const [expandedNotification, setExpandedNotification] = useState<
    string | null
  >(null);

  // نمایش تعداد محدود اعلان‌ها
  const displayNotifications = useMemo(() => {
    return getRecentNotifications(8);
  }, [getRecentNotifications]);

  const criticalNotifications = useMemo(() => {
    return getCriticalNotifications();
  }, [getCriticalNotifications]);

  // توابع بهینه شده
  const toggleExpanded = useCallback((id: string) => {
    setExpandedNotification((prev) => (prev === id ? null : id));
  }, []);

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }
      toggleExpanded(notification.id);

      // هدایت به صفحه سفارش
      if (notification.orderId) {
        router.push(`/dashboard/orders/${notification.orderId}`);
        onClose();
      }
    },
    [markAsRead, toggleExpanded, router, onClose]
  );

  const handleViewAllClick = useCallback(() => {
    router.push("/dashboard/notifications");
    onClose();
  }, [router, onClose]);

  const handleRefresh = useCallback(async () => {
    await refreshNotifications();
  }, [refreshNotifications]);

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
    if (!config) return <OrderIcon sx={{ fontSize: 18 }} />;

    const IconComponent = config.icon;
    return <IconComponent sx={{ fontSize: 18 }} />;
  }, []);

  const getOrderStatusConfig = useCallback((status: string) => {
    return (
      ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG] ||
      ORDER_STATUS_CONFIG.PENDING
    );
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
          All caught up!
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
          New notifications will appear here when they arrive.
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
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
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
            minWidth: 0,
          }}
        >
          {/* ردیف اول هدر */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              minWidth: 0,
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
                {criticalNotifications.length > 0 && (
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
                  Notifications
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
                        criticalNotifications.length > 0
                          ? ` • ${criticalNotifications.length} urgent`
                          : ""
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
              onClick={handleRefresh}
              sx={{
                borderRadius: 2,
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
                whiteSpace: "nowrap",
                "&:hover": {
                  transform: "translateY(-1px)",
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                transition: theme.transitions.create([
                  "transform",
                  "background-color",
                ]),
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* لیست اعلان‌ها */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            overflowX: "hidden",
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
                const statusConfig = getOrderStatusConfig(
                  notification.order.status
                );

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
                        backgroundColor: !notification.isRead
                          ? alpha(theme.palette.primary.main, 0.02)
                          : "transparent",
                        borderLeft: !notification.isRead
                          ? `4px solid ${theme.palette.primary.main}`
                          : "4px solid transparent",
                        minWidth: 0,
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
                          {getOrderStatusIcon(notification.order.status)}
                        </Avatar>
                      </ListItemAvatar>

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
                            component="div"
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.isRead ? 500 : 700,
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
                            <Chip
                              icon={getOrderStatusIcon(
                                notification.order.status
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
                            component="div"
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
                                  Order Number:
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
                                  {notification.order.orderNumber}
                                </Typography>
                              </Box>

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
                                  Order Title:
                                </Typography>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    fontWeight: 500,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {notification.order.title}
                                </Typography>
                              </Box>
                            </Box>
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
                                {formatNotificationTime(notification.sentAt)}
                              </Typography>
                            </Box>

                            <Box
                              sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}
                            >
                              {!notification.isRead && (
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
                            </Box>
                          </Box>
                        </Box>

                        {/* نشانگر خوانده نشده */}
                        {!notification.isRead && (
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
            View All Notifications
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
