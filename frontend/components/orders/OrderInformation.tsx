import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Person,
  Email,
  CalendarToday,
  Update,
  CheckCircle,
} from "@mui/icons-material";
import { OrderDetails } from "@/types/order";
import { format } from "date-fns";
import { ORDER_STATUS_COLORS } from "@/lib/constants";

interface OrderInformationProps {
  order: OrderDetails;
}

export default function OrderInformation({ order }: OrderInformationProps) {
  const statusColor = ORDER_STATUS_COLORS[order.status];

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 1,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Order Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Status */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={order.status.replace("_", " ")}
              color={statusColor}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <Divider />

          {/* Customer Info */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Customer
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {order.customer.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Email sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {order.customer.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Dates */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
              </Box>
              <Typography variant="body2">
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </Typography>
            </Box>

            {order.updatedAt !== order.createdAt && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Update sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Updated
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {format(new Date(order.updatedAt), "MMM dd, yyyy")}
                </Typography>
              </Box>
            )}

            {order.estimatedCompletion && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, color: "warning.main" }} />
                  <Typography variant="body2" color="text.secondary">
                    Est. Completion
                  </Typography>
                </Box>
                <Typography variant="body2" color="warning.main">
                  {format(new Date(order.estimatedCompletion), "MMM dd, yyyy")}
                </Typography>
              </Box>
            )}

            {order.completedAt && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
                <Typography variant="body2" color="success.main">
                  {format(new Date(order.completedAt), "MMM dd, yyyy")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
