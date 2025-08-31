import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Update } from "@mui/icons-material";
import { OrderStatus } from "@/types/order";
import { orderService } from "@/services/orderService";
import { useToast } from "@/lib/toast/toast";

interface OrderStatusManagerProps {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdate: () => void;
}

const STATUS_TRANSITIONS = {
  PENDING: ["ON_HOLD", "IN_PROGRESS", "CANCELLED"],
  ON_HOLD: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
} as const;

const STATUS_LABELS = {
  PENDING: "Pending",
  ON_HOLD: "On Hold",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function OrderStatusManager({
  orderId,
  currentStatus,
  onUpdate,
}: OrderStatusManagerProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  const availableStatuses = STATUS_TRANSITIONS[currentStatus];
  const hasChanged = selectedStatus !== currentStatus;
  
  const handleUpdateStatus = async () => {
    if (!hasChanged) return;

    setUpdating(true);
    try {
      console.log("SELECTED STATUS" , selectedStatus);
      
      await orderService.updateOrderStatus(orderId, { status: selectedStatus });
      showSuccessToast("Order status updated successfully");
      onUpdate();
    } catch (error: any) {
      showErrorToast(error.message);
      setSelectedStatus(currentStatus); // Reset on error
    } finally {
      setUpdating(false);
    }
  };

  if (availableStatuses.length === 0) {
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
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Status Management
          </Typography>
          <Alert severity="info">
            No status changes available for {STATUS_LABELS[currentStatus]}{" "}
            orders.
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
          Status Management
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Order Status"
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              disabled={updating}
            >
              <MenuItem value={currentStatus} disabled>
                {STATUS_LABELS[currentStatus]} (Current)
              </MenuItem>
              {availableStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {hasChanged && (
            <Alert severity="warning" sx={{ fontSize: "0.875rem" }}>
              Changing status will notify the customer and update the order
              timeline.
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            disabled={!hasChanged || updating}
            startIcon={updating ? <CircularProgress size={16} /> : <Update />}
            fullWidth
          >
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
