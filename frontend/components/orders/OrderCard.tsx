// components/orders/OrderCard.tsx
"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  useTheme,
  Fade,
  alpha,
} from "@mui/material";
import {
  Schedule,
  CheckCircle,
  Cancel,
  Pause,
  AutorenewOutlined,
  MoreVert,
  CalendarToday,
  Person,
  ArrowForward,
} from "@mui/icons-material";
import { format, formatDistanceToNow } from "date-fns";
import { OrderItem, OrderStatus } from "@/types/customer-order";

// تایپ برای پیکربندی وضعیت
interface StatusConfig {
  color: string;
  gradient: string;
  bg: string;
  label: string;
  icon: React.ReactElement;
  progress: number;
  description: string;
}

// پیکربندی وضعیت سفارشات
const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)",
    bg: "#FFFBEB",
    label: "Pending",
    icon: <Schedule sx={{ fontSize: 16 }} />,
    progress: 15,
    description: "Awaiting processing",
  },
  IN_PROGRESS: {
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)",
    bg: "#EFF6FF",
    label: "In Progress",
    icon: <AutorenewOutlined sx={{ fontSize: 16 }} />,
    progress: 60,
    description: "Currently processing",
  },
  COMPLETED: {
    color: "#10B981",
    gradient: "linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)",
    bg: "#ECFDF5",
    label: "Completed",
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
    progress: 100,
    description: "Successfully completed",
  },
  CANCELLED: {
    color: "#EF4444",
    gradient: "linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%)",
    bg: "#FEF2F2",
    label: "Cancelled",
    icon: <Cancel sx={{ fontSize: 16 }} />,
    progress: 0,
    description: "Order cancelled",
  },
  ON_HOLD: {
    color: "#F97316",
    gradient: "linear-gradient(135deg, #FFEDD5 0%, #FDBA74 100%)",
    bg: "#FFF7ED",
    label: "On Hold",
    icon: <Pause sx={{ fontSize: 16 }} />,
    progress: 35,
    description: "Temporarily paused",
  },
};

// کامپوننت Progress Bar مینیمال
const StatusProgressBar = ({
  status,
  animated = true,
}: {
  status: OrderStatus;
  animated?: boolean;
}) => {
  const config = ORDER_STATUS_CONFIG[status];
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setProgress(config.progress), 200);
      return () => clearTimeout(timer);
    } else {
      setProgress(config.progress);
    }
  }, [config.progress, animated]);

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              color: config.color,
              display: "flex",
              alignItems: "center",
            }}
          >
            {config.icon}
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "0.875rem",
            }}
          >
            {config.label}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: config.color,
            fontSize: "0.875rem",
          }}
        >
          {config.progress}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 1,
          backgroundColor: alpha(config.color, 0.1),
          "& .MuiLinearProgress-bar": {
            borderRadius: 1,
            backgroundColor: config.color,
            transition: "transform 1s ease-in-out",
          },
        }}
      />
    </Box>
  );
};

// کامپوننت اصلی OrderCard
interface OrderCardProps {
  order: OrderItem;
  onClick: (orderId: string) => void;
  index?: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick, index = 0 }) => {
  const theme = useTheme();
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const [isHovered, setIsHovered] = useState(false);

  const createdAgo = formatDistanceToNow(new Date(order.createdAt), {
    addSuffix: true,
  });

  const getCustomerInitials = () => {
    const firstName = order.customer?.firstName || "";
    const lastName = order.customer?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Fade in timeout={300} style={{ transitionDelay: `${index * 80}ms` }}>
      <Card
        elevation={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          borderRadius: 1,
          border: "1px solid",
          borderColor: isHovered
            ? statusConfig.color
            : alpha(theme.palette.grey[300], 0.5),
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          background: "white",
          "&:hover": {
            borderColor: statusConfig.color,
            boxShadow: `0 20px 40px -4px ${alpha(statusConfig.color, 0.25)}`,
            transform: "translateY(-4px)",
          },
          // گرادیانت بالا
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: statusConfig.gradient,
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          },
        }}
        onClick={() => onClick(order.id)}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header Section */}
          <Box sx={{ p: 3, pb: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: "text.primary",
                    lineHeight: 1.4,
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {order.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  #{order.orderNumber}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  size="medium"
                  sx={{
                    backgroundColor: statusConfig.bg,
                    color: statusConfig.color,
                    border: `1px solid ${alpha(statusConfig.color, 0.2)}`,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: 32,
                    "& .MuiChip-icon": {
                      color: statusConfig.color,
                    },
                  }}
                />

                <IconButton
                  size="small"
                  sx={{
                    opacity: isHovered ? 1 : 0,
                    transition: "all 0.2s ease",
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: alpha(statusConfig.color, 0.1),
                      color: statusConfig.color,
                    },
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVert sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Progress Bar */}
            <StatusProgressBar status={order.status} />
          </Box>

          {/* Customer Info Section */}
          <Box
            sx={{
              px: 3,
              py: 2,
              backgroundColor: alpha(theme.palette.grey[50], 0.5),
              borderTop: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  backgroundColor: alpha(statusConfig.color, 0.1),
                  color: statusConfig.color,
                  border: `2px solid ${alpha(statusConfig.color, 0.2)}`,
                }}
                src={order.customer?.profilePicture || ""}
              >
                {getCustomerInitials()}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                  }}
                >
                  {order.customer?.firstName} {order.customer?.lastName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Person sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    Customer
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    display: "block",
                  }}
                >
                  {format(new Date(order.createdAt), "MMM dd")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.7rem",
                  }}
                >
                  {createdAgo}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Hover Action Button */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateX(0)" : "translateX(8px)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                backgroundColor: statusConfig.color,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${alpha(statusConfig.color, 0.4)}`,
              }}
            >
              <ArrowForward sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default OrderCard;
