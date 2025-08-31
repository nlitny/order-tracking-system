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
  useMediaQuery,
  Skeleton,
  Zoom,
} from "@mui/material";
import {
  Close as CloseIcon,
  NotificationsOff as NotificationsOffIcon,
  Schedule as ScheduleIcon,
  MarkEmailRead as ReadIcon,
  ViewList as ViewAllIcon,
  Assignment as OrderIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Build as ProcessingIcon,
  Cancel as CancelledIcon,
  Pause as OnHoldIcon,
  OpenInNew as OpenIcon,
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
    markAsRead,
    getRecentNotifications,
    getCriticalNotifications,
    refreshNotifications,
  } = useNotifications();

  const displayNotifications = useMemo(() => {
    return getRecentNotifications(8);
  }, [getRecentNotifications]);

  const criticalNotifications = useMemo(() => {
    return getCriticalNotifications();
  }, [getCriticalNotifications]);

  const handleMarkAsRead = useCallback(
    async (e: React.MouseEvent, notificationId: string) => {
      e.preventDefault();
      e.stopPropagation();
      await markAsRead(notificationId);
    },
    [markAsRead]
  );

  const handleViewOrder = useCallback(
    async (e: React.MouseEvent, notification: Notification) => {
      e.preventDefault();
      e.stopPropagation();

      if (!notification.isRead) {
        await markAsRead(notification.id);
      }

      router.push(`/dashboard/orders/${notification.orderId}`);
      onClose();
    },
    [markAsRead, router, onClose]
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
            sm: 1,
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

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              size="small"
              variant="text"
              onClick={handleRefresh}
              sx={{
                borderRadius: 1,
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
                whiteSpace: "nowrap",
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

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
                const statusConfig = getOrderStatusConfig(
                  notification.order.status
                );

                return (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        px: { xs: 2, sm: 2.5, md: 3 },
                        py: { xs: 1.5, sm: 2 },
                        position: "relative",
                        backgroundColor: !notification.isRead
                          ? alpha(theme.palette.primary.main, 0.02)
                          : "transparent",
                        borderLeft: !notification.isRead
                          ? `4px solid ${theme.palette.primary.main}`
                          : "4px solid transparent",
                        minWidth: 0,
                        cursor: "default",
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

                          <Chip
                            icon={getOrderStatusIcon(notification.order.status)}
                            label={statusConfig.label}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: { xs: 20, sm: 22 },
                              fontSize: { xs: "0.65rem", sm: "0.7rem" },
                              fontWeight: 500,
                              borderColor: alpha(statusConfig.color, 0.3),
                              color: statusConfig.color,
                              backgroundColor: alpha(statusConfig.color, 0.05),
                              flexShrink: 0,
                            }}
                          />
                        </Box>

                        <Typography
                          component="div"
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            mb: 1.5,
                            fontSize: { xs: "0.75rem", sm: "0.8rem" },
                            lineHeight: 1.4,
                            wordBreak: "break-word",
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            backgroundColor: alpha(
                              theme.palette.background.paper,
                              0.6
                            ),
                            border: `1px solid ${theme.palette.divider}`,
                            mb: 1.5,
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
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Order Number:
                            </Typography>
                            <Typography
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
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Order Title:
                            </Typography>
                            <Typography
                              variant="caption"
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
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                                  onClick={(e) =>
                                    handleMarkAsRead(e, notification.id)
                                  }
                                  sx={{
                                    color: theme.palette.success.main,
                                    "&:hover": {
                                      backgroundColor: alpha(
                                        theme.palette.success.main,
                                        0.08
                                      ),
                                      transform: "scale(1.1)",
                                    },
                                  }}
                                >
                                  <ReadIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip title="View order details">
                              <IconButton
                                size="small"
                                onClick={(e) =>
                                  handleViewOrder(e, notification)
                                }
                                sx={{
                                  color: theme.palette.primary.main,
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.08
                                    ),
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                <OpenIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
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
              borderRadius: 1,
              py: 1,
              fontWeight: 600,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: theme.shadows[4],
              },
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
