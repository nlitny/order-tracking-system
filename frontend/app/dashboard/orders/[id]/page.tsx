"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
  Skeleton,
  Badge,
} from "@mui/material";
import { ArrowBack, Edit, Cancel } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { orderService } from "@/services/orderService";
import {
  OrderDetails,
  MediaFile,
  UpdateOrderData,
  AdminMediaFile,
} from "@/types/order";
import { useToast } from "@/lib/toast/toast";
import OrderProgressTracker from "@/components/orders/OrderProgressTracker";
import OrderInformation from "@/components/orders/OrderInformation";
import OrderStatusManager from "@/components/orders/OrderStatusManager";
import CustomerMediaTab from "@/components/orders/CustomerMediaTab";
import AdminMediaTab from "@/components/orders/AdminMediaTab";
import { useUser } from "@/context/UserContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showSuccessToast, showErrorToast } = useToast();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [adminMediaFiles, setAdminMediaFiles] = useState<AdminMediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [adminMediaLoading, setAdminMediaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateOrderData>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const { user } = useUser();
  const canEdit = order && ["PENDING", "ON_HOLD"].includes(order.status);
  const canCancel = order && ["PENDING", "ON_HOLD"].includes(order.status);
  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";
  const canViewAdminMedia = isAdmin || order?.status === "COMPLETED";

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrderDetails(orderId);
      setOrder(response.data);
      setEditForm({
        title: response.data.title,
        description: response.data.description,
        estimatedCompletion: response.data.estimatedCompletion,
        special_instructions: response.data.special_instructions,
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const fetchMediaFiles = useCallback(async () => {
    setMediaLoading(true);
    try {
      const response = await orderService.getOrderMedia(orderId);
      setMediaFiles(response.data.mediaFiles);
    } catch (error: any) {
      console.error("Error fetching customer media:", error);
      setMediaFiles([]);
    } finally {
      setMediaLoading(false);
    }
  }, [orderId]);

  const fetchAdminMediaFiles = useCallback(async () => {
    if (!canViewAdminMedia) {
      setAdminMediaLoading(false);
      return;
    }

    setAdminMediaLoading(true);
    try {
      const response = await orderService.getAdminMediaFiles(orderId);
      setAdminMediaFiles(response.data.mediaFiles);
    } catch (error: any) {
      console.error("Error fetching admin media:", error);
      setAdminMediaFiles([]);
    } finally {
      setAdminMediaLoading(false);
    }
  }, [orderId, canViewAdminMedia]);

  useEffect(() => {
    fetchOrderDetails();
    fetchMediaFiles();
    fetchAdminMediaFiles();
  }, [fetchOrderDetails, fetchMediaFiles, fetchAdminMediaFiles]);

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};
    const MAX_TITLE_LENGTH = 100;
    const MAX_DESCRIPTION_LENGTH = 1000;

    if (!editForm.title?.trim()) {
      errors.title = "Title is required";
    } else if (editForm.title.length > MAX_TITLE_LENGTH) {
      errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`;
    }

    if (!editForm.description?.trim()) {
      errors.description = "Description is required";
    } else if (editForm.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }

    if (editForm.estimatedCompletion) {
      const estimatedDate = new Date(editForm.estimatedCompletion);
      if (estimatedDate <= new Date()) {
        errors.estimatedCompletion =
          "Estimated completion must be in the future";
      }
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleUpdateOrder = async () => {
    if (!validateEditForm()) return;

    setUpdating(true);
    try {
      await orderService.updateOrder(orderId, editForm);
      showSuccessToast("Order updated successfully");
      setEditDialogOpen(false);
      fetchOrderDetails();
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    setCanceling(true);
    try {
      await orderService.cancelOrder(orderId);
      showSuccessToast("Order cancelled successfully");
      setCancelDialogOpen(false);
      fetchOrderDetails();
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setCanceling(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={24} sx={{ mt: 1 }} />
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Skeleton
              variant="rectangular"
              height={600}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Order not found"}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => router.back()}
            sx={{ color: "text.secondary" }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Order #{order.orderNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {order.title}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Progress Tracker */}
            <Box sx={{ mb: 3 }}>
              <OrderProgressTracker status={order.status} />
            </Box>

            {/* Tabs with Badges */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 1,
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant={isMobile ? "scrollable" : "standard"}
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                    },
                  }}
                >
                  <Tab label="Order Details" />
                  <Tab
                    label={
                      <Badge
                        badgeContent={mediaFiles.length}
                        color="primary"
                        invisible={mediaFiles.length === 0}
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "0.75rem",
                            minWidth: 18,
                            height: 18,
                          },
                        }}
                      >
                        <Box>Customer Media</Box>
                      </Badge>
                    }
                  />
                  {(isAdmin || canViewAdminMedia) && (
                    <Tab
                      label={
                        <Badge
                          badgeContent={adminMediaFiles.length}
                          color="success"
                          invisible={adminMediaFiles.length === 0}
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "0.75rem",
                              minWidth: 18,
                              height: 18,
                            },
                          }}
                        >
                          <Box>Deliverables</Box>
                        </Badge>
                      }
                    />
                  )}
                </Tabs>
              </Box>

              {/* Order Details Tab */}
              <TabPanel value={tabValue} index={0}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    {order.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                    {order.description}
                  </Typography>

                  {order.special_instructions && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Special Instructions
                      </Typography>
                      <Alert
                        severity="info"
                        sx={{
                          borderRadius: 1,
                          "& .MuiAlert-message": {
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                          },
                        }}
                      >
                        {order.special_instructions}
                      </Alert>
                    </Box>
                  )}

                  {order.estimatedCompletion && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Estimated Completion
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(order.estimatedCompletion).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </TabPanel>

              {/* Customer Media Tab */}
              <TabPanel value={tabValue} index={1}>
                <CustomerMediaTab
                  orderId={orderId}
                  mediaFiles={mediaFiles}
                  loading={mediaLoading}
                  canEdit={!!canEdit}
                  onUpdate={fetchMediaFiles}
                />
              </TabPanel>

              {/* Admin Media Tab */}
              {(isAdmin || canViewAdminMedia) && (
                <TabPanel value={tabValue} index={2}>
                  <AdminMediaTab
                    orderId={orderId}
                    canViewAdminMedia={canViewAdminMedia}
                    onUpdate={() => {
                      fetchOrderDetails();
                      fetchAdminMediaFiles();
                    }}
                  />
                </TabPanel>
              )}
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Order Information */}
              <OrderInformation order={order} />

              {/* Status Management (Admin/Staff Only) */}
              {isAdmin && (
                <OrderStatusManager
                  orderId={orderId}
                  currentStatus={order.status}
                  onUpdate={fetchOrderDetails}
                />
              )}

              {/* Quick Actions */}
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 1,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Quick Actions
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {canEdit && (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setEditDialogOpen(true)}
                        fullWidth
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 1,
                        }}
                      >
                        Edit Order
                      </Button>
                    )}

                    {canCancel && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => setCancelDialogOpen(true)}
                        fullWidth
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 1,
                        }}
                      >
                        Cancel Order
                      </Button>
                    )}

                    {!canEdit && !canCancel && (
                      <Alert
                        severity="info"
                        sx={{ fontSize: "0.875rem", borderRadius: 1 }}
                      >
                        No actions available for this order.
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 1 },
          }}
        >
          <DialogTitle>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Edit Order
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Order Title"
                fullWidth
                value={editForm.title || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                error={!!editErrors.title}
                helperText={
                  editErrors.title ||
                  `${editForm.title?.length || 0}/100 characters`
                }
                inputProps={{ maxLength: 100 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                error={!!editErrors.description}
                helperText={
                  editErrors.description ||
                  `${editForm.description?.length || 0}/1000 characters`
                }
                inputProps={{ maxLength: 1000 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />

              <DateTimePicker
                label="Estimated Completion Date & Time"
                value={
                  editForm.estimatedCompletion
                    ? new Date(editForm.estimatedCompletion)
                    : null
                }
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    estimatedCompletion: value?.toISOString(),
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!editErrors.estimatedCompletion,
                    helperText: editErrors.estimatedCompletion,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                    },
                  },
                }}
              />

              <TextField
                label="Special Instructions"
                fullWidth
                multiline
                rows={3}
                value={editForm.special_instructions || ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    special_instructions: e.target.value,
                  })
                }
                placeholder="Any special requirements or notes..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              disabled={updating}
              sx={{ textTransform: "none", borderRadius: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateOrder}
              variant="contained"
              disabled={updating}
              startIcon={updating ? <CircularProgress size={16} /> : undefined}
              sx={{
                textTransform: "none",
                borderRadius: 1,
                fontWeight: 600,
                px: 3,
              }}
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 1 },
          }}
        >
          <DialogTitle sx={{ color: "error.main" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Cancel Order
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 1 }}>
              This action cannot be undone.
            </Alert>
            <Typography variant="body1">
              Are you sure you want to cancel this order? The customer will be
              notified of the cancellation.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setCancelDialogOpen(false)}
              disabled={canceling}
              sx={{ textTransform: "none", borderRadius: 1 }}
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancelOrder}
              variant="contained"
              color="error"
              disabled={canceling}
              startIcon={
                canceling ? <CircularProgress size={16} /> : <Cancel />
              }
              sx={{
                textTransform: "none",
                borderRadius: 1,
                fontWeight: 600,
              }}
            >
              {canceling ? "Canceling..." : "Cancel Order"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
}
