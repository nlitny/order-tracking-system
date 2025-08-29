// app/orders/[id]/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Fade,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Cancel,
  Person,
  CalendarToday,
  Description,
  AttachFile,
  Delete,
  Add,
  Download,
  Image as ImageIcon,
  VideoFile,
  PictureAsPdf,
  InsertDriveFile,
  Save,
  Close,
} from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { orderService } from "@/services/orderService";
import { OrderDetails, MediaFile, UpdateOrderData } from "@/types/order";
import { useToast } from "@/lib/toast/toast";
import { format } from "date-fns";

const ORDER_STATUS_COLORS = {
  PENDING: { color: "#ff9800", bg: "#fff3e0", label: "Pending" },
  IN_PROGRESS: { color: "#2196f3", bg: "#e3f2fd", label: "In Progress" },
  COMPLETED: { color: "#4caf50", bg: "#e8f5e9", label: "Completed" },
  CANCELLED: { color: "#f44336", bg: "#ffebee", label: "Cancelled" },
  ON_HOLD: { color: "#9c27b0", bg: "#f3e5f5", label: "On Hold" },
};

const FILE_TYPE_ICONS = {
  IMAGE: <ImageIcon />,
  VIDEO: <VideoFile />,
  DOCUMENT: <PictureAsPdf />,
};

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
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteMediaDialogOpen, setDeleteMediaDialogOpen] = useState(false);
  const [addMediaDialogOpen, setAddMediaDialogOpen] = useState(false);

  // Edit form state
  const [editFormData, setEditFormData] = useState<UpdateOrderData>({});
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>(
    {}
  );
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  // Media management
  const [selectedMediaId, setSelectedMediaId] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Loading states
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState(false);
  const [addingMedia, setAddingMedia] = useState(false);

  const canEdit = order?.status === "PENDING" || order?.status === "ON_HOLD";
  const canCancel = order?.status === "PENDING" || order?.status === "ON_HOLD";

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderDetails(orderId);
      setOrder(response.data);

      // Set edit form initial data
      setEditFormData({
        title: response.data.title,
        description: response.data.description,
        estimatedCompletion: response.data.estimatedCompletion,
        special_instructions: response.data.special_instructions,
      });

      if (response.data.estimatedCompletion) {
        setSelectedDateTime(new Date(response.data.estimatedCompletion));
      }
    } catch (err: any) {
      setError(err.message);
      showErrorToast("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  }, [orderId, showErrorToast]);

  const fetchMediaFiles = useCallback(async () => {
    try {
      setMediaLoading(true);
      const response = await orderService.getOrderMedia(orderId);
      setMediaFiles(response.data.mediaFiles);
    } catch (err: any) {
      console.error("Failed to fetch media files:", err);
      setMediaFiles([]);
    } finally {
      setMediaLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
    fetchMediaFiles();
  }, [fetchOrderDetails, fetchMediaFiles]);

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editFormData.title?.trim()) {
      errors.title = "Title is required";
    } else if (editFormData.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!editFormData.description?.trim()) {
      errors.description = "Description is required";
    } else if (editFormData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (selectedDateTime) {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      if (selectedDateTime < oneHourFromNow) {
        errors.estimatedCompletion =
          "Estimated completion must be at least 1 hour from now";
      }
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateOrder = async () => {
    if (!validateEditForm()) return;

    setUpdating(true);
    try {
      const updateData: UpdateOrderData = {
        title: editFormData.title?.trim(),
        description: editFormData.description?.trim(),
        estimatedCompletion: selectedDateTime?.toISOString(),
        special_instructions:
          editFormData.special_instructions?.trim() || undefined,
      };

      await orderService.updateOrder(orderId, updateData);
      showSuccessToast("Order updated successfully");
      setEditDialogOpen(false);
      fetchOrderDetails();
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await orderService.cancelOrder(orderId);
      showSuccessToast("Order cancelled successfully");
      setCancelDialogOpen(false);
      fetchOrderDetails();
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const handleDeleteMedia = async () => {
    setDeletingMedia(true);
    try {
      await orderService.deleteMedia(selectedMediaId);
      showSuccessToast("Media file deleted successfully");
      setDeleteMediaDialogOpen(false);
      fetchMediaFiles();
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setDeletingMedia(false);
    }
  };

  const handleAddMedia = async () => {
    if (selectedFiles.length === 0) return;

    setAddingMedia(true);
    try {
      await orderService.addMedia(orderId, selectedFiles);
      showSuccessToast("Media files added successfully");
      setAddMediaDialogOpen(false);
      setSelectedFiles([]);
      fetchMediaFiles();
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setAddingMedia(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Validate files
    const validFiles = fileArray.filter((file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "application/pdf",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        showErrorToast(`${file.name}: Unsupported file type`);
        return false;
      }

      if (file.size > maxSize) {
        showErrorToast(`${file.name}: File size must be under 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 10) {
      showErrorToast("Maximum 10 files allowed per upload");
      return;
    }

    const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      showErrorToast("Total file size must be under 10MB");
      return;
    }

    setSelectedFiles(validFiles);
  };

  const handleDownloadFile = (file: MediaFile) => {
    window.open(file.path, "_blank");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Card elevation={0} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{ borderRadius: 1 }}
            />
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Alert severity="error" sx={{ borderRadius: 1 }}>
          {error || "Order not found"}
        </Alert>
      </Container>
    );
  }

  const statusConfig = ORDER_STATUS_COLORS[order.status];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            background: "linear-gradient(135deg, #1a2f42 0%, #497D74 100%)",
            color: "#EFE9D5",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => router.back()}
              sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)" }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: {
                    xs: "1.5rem",
                    sm: "2rem",
                    md: "2.125rem",
                    color: "#EFE9D5",
                  },
                }}
              >
                Order Details
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: "0.875rem", md: "1rem", color: "#EFE9D5" },
                }}
              >
                {order.orderNumber}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {canEdit && (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{
                    bgcolor: theme.palette.secondary.contrastText,
                    color: theme.palette.tertiary.main,
                    border: "1px solid rgba(255,255,255,0.3)",
                    "&:hover": {
                      bgcolor: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  {isMobile ? "" : "Edit"}
                </Button>
              )}
              {canCancel && (
                <Button
                  startIcon={<Cancel />}
                  onClick={() => setCancelDialogOpen(true)}
                  sx={{
                    bgcolor: theme.palette.secondary.contrastText,
                    color: theme.palette.tertiary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  {isMobile ? "" : "Cancel"}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Content */}
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={0} sx={{ borderRadius: 1, mb: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                  variant={isMobile ? "fullWidth" : "standard"}
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    px: { xs: 2, md: 3 },
                  }}
                >
                  <Tab label="Order Details" />
                  <Tab label={`Media Files (${mediaFiles.length})`} />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {/* Order Info */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                        {order.title}
                      </Typography>

                      <Paper
                        variant="outlined"
                        sx={{ p: 3, borderRadius: 1, mb: 3 }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                          sx={{
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          Description
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                        >
                          {order.description}
                        </Typography>
                      </Paper>

                      {order.special_instructions && (
                        <Paper
                          variant="outlined"
                          sx={{ p: 3, borderRadius: 1, mb: 3 }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                            sx={{
                              textTransform: "uppercase",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Special Instructions
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                          >
                            {order.special_instructions}
                          </Typography>
                        </Paper>
                      )}

                      {order.estimatedCompletion && (
                        <Paper
                          variant="outlined"
                          sx={{ p: 3, borderRadius: 1 }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                            sx={{
                              textTransform: "uppercase",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Estimated Completion
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {format(
                              new Date(order.estimatedCompletion),
                              "EEEE, MMMM dd, yyyy - hh:mm a"
                            )}
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {/* Add Media Button */}
                    {canEdit && (
                      <Box sx={{ mb: 3 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => setAddMediaDialogOpen(true)}
                          sx={{ borderRadius: 1 }}
                        >
                          Add Media Files
                        </Button>
                      </Box>
                    )}

                    {/* Media Files List */}
                    {mediaLoading ? (
                      <Box>
                        {Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton
                            key={index}
                            variant="rectangular"
                            height={80}
                            sx={{ mb: 1, borderRadius: 1 }}
                          />
                        ))}
                      </Box>
                    ) : mediaFiles.length === 0 ? (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          textAlign: "center",
                          border: "2px dashed",
                          borderColor: "grey.300",
                          borderRadius: 1,
                        }}
                      >
                        <AttachFile
                          sx={{ fontSize: 48, color: "grey.400", mb: 2 }}
                        />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                        >
                          No media files
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {canEdit
                            ? "Add media files to provide additional context for your order"
                            : "No media files have been uploaded for this order"}
                        </Typography>
                      </Paper>
                    ) : (
                      <>
                        {/* Grid Preview for Images */}
                        {mediaFiles.filter((file) => file.fileType === "IMAGE")
                          .length > 0 && (
                          <Box sx={{ mb: 4 }}>
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, fontWeight: 600 }}
                            >
                              Images (
                              {
                                mediaFiles.filter(
                                  (file) => file.fileType === "IMAGE"
                                ).length
                              }
                              )
                            </Typography>
                            <Grid container spacing={2}>
                              {mediaFiles
                                .filter((file) => file.fileType === "IMAGE")
                                .map((file) => (
                                  <Grid
                                    size={{ xs: 12, sm: 6, md: 4 }}
                                    key={file.id}
                                  >
                                    <Card
                                      elevation={0}
                                      sx={{
                                        border: "1px solid",
                                        borderColor: "grey.200",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                          borderColor: "primary.main",
                                          boxShadow: theme.shadows[4],
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          position: "relative",
                                          paddingTop: "56.25%", // 16:9 aspect ratio
                                          overflow: "hidden",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleDownloadFile(file)}
                                      >
                                        <Box
                                          component="img"
                                          src={file.path}
                                          alt={file.originalName}
                                          sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            transition: "transform 0.2s ease",
                                            "&:hover": {
                                              transform: "scale(1.05)",
                                            },
                                          }}
                                        />
                                        {/* Overlay with actions */}
                                        <Box
                                          sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            display: "flex",
                                            gap: 0.5,
                                            opacity: 0,
                                            transition: "opacity 0.2s ease",
                                            ".MuiCard-root:hover &": {
                                              opacity: 1,
                                            },
                                          }}
                                        >
                                          <IconButton
                                            size="small"
                                            sx={{
                                              bgcolor: "rgba(255,255,255,0.9)",
                                              "&:hover": {
                                                bgcolor: "rgba(255,255,255,1)",
                                              },
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDownloadFile(file);
                                            }}
                                          >
                                            <Download fontSize="small" />
                                          </IconButton>
                                          {canEdit && (
                                            <IconButton
                                              size="small"
                                              sx={{
                                                bgcolor: "rgba(244,67,54,0.9)",
                                                color: "white",
                                                "&:hover": {
                                                  bgcolor: "rgba(244,67,54,1)",
                                                },
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMediaId(file.id);
                                                setDeleteMediaDialogOpen(true);
                                              }}
                                            >
                                              <Delete fontSize="small" />
                                            </IconButton>
                                          )}
                                        </Box>
                                      </Box>
                                      <CardContent sx={{ p: 2 }}>
                                        <Typography
                                          variant="subtitle2"
                                          sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {file.originalName}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {formatFileSize(file.size)} • Added{" "}
                                          {format(
                                            new Date(file.createdAt),
                                            "MMM dd, yyyy"
                                          )}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                ))}
                            </Grid>
                          </Box>
                        )}

                        {/* List View for Videos and Documents */}
                        {mediaFiles.filter((file) => file.fileType !== "IMAGE")
                          .length > 0 && (
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, fontWeight: 600 }}
                            >
                              Other Files (
                              {
                                mediaFiles.filter(
                                  (file) => file.fileType !== "IMAGE"
                                ).length
                              }
                              )
                            </Typography>
                            <List>
                              {mediaFiles
                                .filter((file) => file.fileType !== "IMAGE")
                                .map((file, index, filteredFiles) => (
                                  <React.Fragment key={file.id}>
                                    <ListItem
                                      sx={{
                                        border: "1px solid",
                                        borderColor: "grey.200",
                                        borderRadius: 2,
                                        mb: 1,
                                        "&:hover": {
                                          bgcolor: "grey.50",
                                          borderColor: "primary.main",
                                        },
                                      }}
                                    >
                                      <ListItemAvatar>
                                        <Avatar
                                          sx={{
                                            bgcolor:
                                              file.fileType === "VIDEO"
                                                ? "#f44336"
                                                : "#ff9800",
                                            width: 48,
                                            height: 48,
                                          }}
                                        >
                                          {FILE_TYPE_ICONS[file.fileType] || (
                                            <InsertDriveFile />
                                          )}
                                        </Avatar>
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={
                                          <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 600 }}
                                          >
                                            {file.originalName}
                                          </Typography>
                                        }
                                        secondary={
                                          <Box>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              {file.fileType === "VIDEO"
                                                ? "Video File"
                                                : "Document"}{" "}
                                              • {file.mimeType}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              {formatFileSize(file.size)} •
                                              Added{" "}
                                              {format(
                                                new Date(file.createdAt),
                                                "MMM dd, yyyy"
                                              )}
                                            </Typography>
                                          </Box>
                                        }
                                      />
                                      <ListItemSecondaryAction>
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                          <Tooltip title="Download">
                                            <IconButton
                                              size="small"
                                              color="primary"
                                              onClick={() =>
                                                handleDownloadFile(file)
                                              }
                                              sx={{
                                                border: "1px solid",
                                                borderColor: "primary.main",
                                              }}
                                            >
                                              <Download />
                                            </IconButton>
                                          </Tooltip>
                                          {canEdit && (
                                            <Tooltip title="Delete">
                                              <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                  setSelectedMediaId(file.id);
                                                  setDeleteMediaDialogOpen(
                                                    true
                                                  );
                                                }}
                                                sx={{
                                                  border: "1px solid",
                                                  borderColor: "error.main",
                                                }}
                                              >
                                                <Delete />
                                              </IconButton>
                                            </Tooltip>
                                          )}
                                        </Box>
                                      </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < filteredFiles.length - 1 && (
                                      <Divider sx={{ my: 1 }} />
                                    )}
                                  </React.Fragment>
                                ))}
                            </List>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={0} sx={{ borderRadius: 1, mb: 3 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Order Information
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip
                    label={statusConfig.label}
                    sx={{
                      backgroundColor: statusConfig.bg,
                      color: statusConfig.color,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", align: "center", gap: 1, mb: 2 }}>
                  <Person color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Customer
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {order.customer.firstName} {order.customer.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.customer.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", align: "center", gap: 1, mb: 2 }}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {format(new Date(order.createdAt), "MMM dd, yyyy")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(order.createdAt), "hh:mm a")}
                    </Typography>
                  </Box>
                </Box>

                {order.updatedAt !== order.createdAt && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{ display: "flex", align: "center", gap: 1, mb: 2 }}
                    >
                      <CalendarToday color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last Updated
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {format(new Date(order.updatedAt), "MMM dd, yyyy")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(order.updatedAt), "hh:mm a")}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}

                {order.completedAt && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", align: "center", gap: 1 }}>
                      <CalendarToday color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {format(new Date(order.completedAt), "MMM dd, yyyy")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(order.completedAt), "hh:mm a")}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card elevation={0} sx={{ borderRadius: 1 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Actions
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {canEdit && (
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Edit />}
                      onClick={() => setEditDialogOpen(true)}
                      sx={{ borderRadius: 1, justifyContent: "flex-start" }}
                    >
                      Edit Order
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      startIcon={<Cancel />}
                      onClick={() => setCancelDialogOpen(true)}
                      sx={{ borderRadius: 1, justifyContent: "flex-start" }}
                    >
                      Cancel Order
                    </Button>
                  )}

                  {!canEdit && !canCancel && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      No actions available for this order
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit Order Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 1 } }}
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Edit color="primary" />
              Edit Order
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Order Title *"
                  fullWidth
                  value={editFormData.title || ""}
                  onChange={(e) => {
                    setEditFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                    if (editFormErrors.title) {
                      setEditFormErrors((prev) => ({ ...prev, title: "" }));
                    }
                  }}
                  error={!!editFormErrors.title}
                  helperText={
                    editFormErrors.title ||
                    `${(editFormData.title || "").length}/100 characters`
                  }
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description *"
                  fullWidth
                  multiline
                  rows={5}
                  value={editFormData.description || ""}
                  onChange={(e) => {
                    setEditFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                    if (editFormErrors.description) {
                      setEditFormErrors((prev) => ({
                        ...prev,
                        description: "",
                      }));
                    }
                  }}
                  error={!!editFormErrors.description}
                  helperText={
                    editFormErrors.description ||
                    `${(editFormData.description || "").length}/1000 characters`
                  }
                  inputProps={{ maxLength: 1000 }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <DateTimePicker
                  label="Estimated Completion Date & Time"
                  value={selectedDateTime}
                  onChange={(newValue) => {
                    setSelectedDateTime(newValue);
                    setEditFormData((prev) => ({
                      ...prev,
                      estimatedCompletion: newValue
                        ? newValue.toISOString()
                        : undefined,
                    }));
                    if (editFormErrors.estimatedCompletion) {
                      setEditFormErrors((prev) => ({
                        ...prev,
                        estimatedCompletion: "",
                      }));
                    }
                  }}
                  minDateTime={new Date(Date.now() + 60 * 60 * 1000)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!editFormErrors.estimatedCompletion,
                      helperText: editFormErrors.estimatedCompletion,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Special Instructions"
                  fullWidth
                  multiline
                  rows={3}
                  value={editFormData.special_instructions || ""}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      special_instructions: e.target.value,
                    }))
                  }
                  helperText="Optional: Add any special requirements or notes"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateOrder}
              variant="contained"
              disabled={updating}
              startIcon={updating ? <CircularProgress size={16} /> : <Save />}
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Cancel Order Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 1 } }}
        >
          <DialogTitle color="error">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Cancel />
              Cancel Order
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone.
            </Alert>
            <Typography>
              Are you sure you want to cancel this order? Once cancelled, the
              order cannot be reactivated.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelling}
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancelOrder}
              variant="contained"
              color="error"
              disabled={cancelling}
              startIcon={
                cancelling ? <CircularProgress size={16} /> : <Cancel />
              }
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Media Dialog */}
        <Dialog
          open={deleteMediaDialogOpen}
          onClose={() => setDeleteMediaDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 1 } }}
        >
          <DialogTitle color="error">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Delete />
              Delete Media File
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this media file? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setDeleteMediaDialogOpen(false)}
              disabled={deletingMedia}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteMedia}
              variant="contained"
              color="error"
              disabled={deletingMedia}
              startIcon={
                deletingMedia ? <CircularProgress size={16} /> : <Delete />
              }
            >
              {deletingMedia ? "Deleting..." : "Delete File"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Media Dialog */}
        <Dialog
          open={addMediaDialogOpen}
          onClose={() => setAddMediaDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 1 } }}
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Add color="primary" />
              Add Media Files
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <strong>Upload Guidelines:</strong>
              <br />
              • Maximum 10 files per upload • Individual file size: 5MB maximum
              • Total upload size: 10MB maximum
              <br />• Supported formats: JPG, PNG, GIF, MP4, PDF
            </Alert>

            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.mp4,.pdf"
              onChange={handleFileSelect}
              style={{
                width: "100%",
                padding: 12,
                border: "2px dashed #ccc",
                borderRadius: 8,
              }}
            />

            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Files ({selectedFiles.length}):
                </Typography>
                {selectedFiles.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.5,
                    }}
                  >
                    <Typography variant="body2">{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => {
                setAddMediaDialogOpen(false);
                setSelectedFiles([]);
              }}
              disabled={addingMedia}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMedia}
              variant="contained"
              disabled={addingMedia || selectedFiles.length === 0}
              startIcon={addingMedia ? <CircularProgress size={16} /> : <Add />}
            >
              {addingMedia
                ? "Uploading..."
                : `Upload ${selectedFiles.length} Files`}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
}
