import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Skeleton,
  Tooltip,
  TextField,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  Fade,
  Grow,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add,
  Download,
  Delete,
  Edit,
  Save,
  Cancel,
  Image as ImageIcon,
  VideoFile,
  PictureAsPdf,
  AudioFile,
  InsertDriveFile,
  CloudUpload,
  Warning,
} from "@mui/icons-material";
import { AdminMediaFile, UserRole } from "@/types/order";
import { orderService } from "@/services/orderService";
import { format } from "date-fns";
import { useToast } from "@/lib/toast/toast";
import { useUser } from "@/context/UserContext";

interface AdminMediaTabProps {
  orderId: string;
  canViewAdminMedia: boolean;
  onUpdate?: () => void;
}

const FILE_TYPE_ICONS = {
  IMAGE: <ImageIcon sx={{ fontSize: 32 }} />,
  VIDEO: <VideoFile sx={{ fontSize: 32 }} />,
  DOCUMENT: <PictureAsPdf sx={{ fontSize: 32 }} />,
  AUDIO: <AudioFile sx={{ fontSize: 32 }} />,
} as const;

const FILE_TYPE_COLORS = {
  IMAGE: "#4CAF50",
  VIDEO: "#2196F3",
  DOCUMENT: "#FF5722",
  AUDIO: "#9C27B0",
} as const;

const ADMIN_ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/mkv",
  "video/webm",
  "video/flv",
  "application/pdf",
  "audio/mp3",
  "audio/wav",
];

const MAX_DESCRIPTION_LENGTH = 500;

export default function AdminMediaTab({
  orderId,
  canViewAdminMedia,
  onUpdate,
}: AdminMediaTabProps) {
  const theme = useTheme();
  const [mediaFiles, setMediaFiles] = useState<AdminMediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string>("");
  const [editingMedia, setEditingMedia] = useState<AdminMediaFile | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );
  const { showSuccessToast, showErrorToast } = useToast();
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";

  useEffect(() => {
    if (canViewAdminMedia) {
      fetchMediaFiles();
    }
  }, [orderId, canViewAdminMedia]);

  const fetchMediaFiles = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAdminMediaFiles(orderId);
      setMediaFiles(response.data.mediaFiles);
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const maxFileSize = 1 * 1024 * 1024 * 1024; // 1GB

    const validFiles = fileArray.filter((file) => {
      if (!ADMIN_ALLOWED_TYPES.includes(file.type)) {
        showErrorToast(`${file.name}: Unsupported file format`);
        return false;
      }
      if (file.size > maxFileSize) {
        showErrorToast(`${file.name}: File exceeds 1GB size limit`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 1000);

      await orderService.uploadAdminMedia(orderId, selectedFiles);

      clearInterval(progressInterval);
      setUploadProgress(100);

      showSuccessToast(
        `Successfully uploaded ${selectedFiles.length} deliverable file(s)`
      );
      setAddDialogOpen(false);
      setSelectedFiles([]);
      setUploadProgress(0);
      fetchMediaFiles();
      onUpdate?.();
    } catch (error: any) {
      showErrorToast(error.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await orderService.deleteAdminMedia(selectedMediaId);
      showSuccessToast("Deliverable file deleted successfully");
      setDeleteDialogOpen(false);
      fetchMediaFiles();
      onUpdate?.();
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditDescription = async () => {
    if (!editingMedia) return;

    if (editDescription.length > MAX_DESCRIPTION_LENGTH) {
      showErrorToast(
        `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`
      );
      return;
    }

    setUpdating(true);
    try {
      await orderService.updateMediaDescription(editingMedia.id, {
        description: editDescription,
      });
      showSuccessToast("Description updated successfully");
      setEditDialogOpen(false);
      setEditingMedia(null);
      setEditDescription("");
      fetchMediaFiles();
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownload = (file: AdminMediaFile) => {
    const link = document.createElement("a");
    link.href = file.path;
    link.download = file.originalName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditDialog = (file: AdminMediaFile) => {
    setEditingMedia(file);
    setEditDescription(file.description || "");
    setEditDialogOpen(true);
  };

  const toggleDescriptionExpanded = (fileId: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const truncateDescription = (description: string, fileId: string) => {
    const isExpanded = expandedDescriptions.has(fileId);
    const maxLength = 100;

    if (description.length <= maxLength || isExpanded) {
      return description;
    }

    return description.substring(0, maxLength) + "...";
  };

  if (!canViewAdminMedia) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, textAlign: "center" }}>
        <Alert
          severity="info"
          icon={<InsertDriveFile />}
          sx={{
            borderRadius: 2,
            "& .MuiAlert-message": { fontSize: "1rem" },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Deliverable Files Coming Soon
          </Typography>
          <Typography variant="body2">
            Your deliverable files will be available here once the order is
            completed.
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={200} />
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {isAdmin && (
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Deliverable Files
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload and manage client deliverable files
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: theme.shadows[3],
            }}
          >
            Upload Deliverables
          </Button>
        </Box>
      )}

      {mediaFiles.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              width: 80,
              height: 80,
              mx: "auto",
              mb: 3,
            }}
          >
            <InsertDriveFile sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {isAdmin ? "No Deliverables Yet" : "No Files Available"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isAdmin
              ? "Start by uploading deliverable files for your client"
              : "Deliverable files will appear here once available"}
          </Typography>
          {isAdmin && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Upload First Deliverable
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={`${mediaFiles.length} file${
                mediaFiles.length !== 1 ? "s" : ""
              }`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              Total size:{" "}
              {formatFileSize(
                mediaFiles.reduce((sum, file) => sum + file.size, 0)
              )}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {mediaFiles.map((file, index) => (
              <Grid key={file.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Grow in timeout={(index + 1) * 150}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "grey.200",
                      borderRadius: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: theme.shadows[4],
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {file.fileType === "IMAGE" ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={file.path}
                        alt={file.originalName}
                        sx={{
                          objectFit: "cover",
                          cursor: "pointer",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                        onClick={() => handleDownload(file)}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: alpha(
                            FILE_TYPE_COLORS[file.fileType] ||
                              theme.palette.grey[500],
                            0.1
                          ),
                          color:
                            FILE_TYPE_COLORS[file.fileType] ||
                            theme.palette.grey[600],
                          cursor: "pointer",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: alpha(
                              FILE_TYPE_COLORS[file.fileType] ||
                                theme.palette.grey[500],
                              0.2
                            ),
                          },
                        }}
                        onClick={() => handleDownload(file)}
                      >
                        {FILE_TYPE_ICONS[file.fileType] || (
                          <InsertDriveFile sx={{ fontSize: 32 }} />
                        )}
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                            mr: 1,
                          }}
                        >
                          {file.originalName}
                        </Typography>
                        <Chip
                          label={file.fileType}
                          size="small"
                          sx={{
                            bgcolor: alpha(
                              FILE_TYPE_COLORS[file.fileType] ||
                                theme.palette.grey[500],
                              0.1
                            ),
                            color:
                              FILE_TYPE_COLORS[file.fileType] ||
                              theme.palette.grey[600],
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            minWidth: "auto",
                          }}
                        />
                      </Box>

                      {file.description && (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.5,
                              fontSize: "0.875rem",
                            }}
                          >
                            {truncateDescription(file.description, file.id)}
                          </Typography>
                          {file.description.length > 100 && (
                            <Button
                              size="small"
                              onClick={() => toggleDescriptionExpanded(file.id)}
                              sx={{
                                mt: 0.5,
                                p: 0,
                                minWidth: "auto",
                                textTransform: "none",
                                fontSize: "0.75rem",
                              }}
                            >
                              {expandedDescriptions.has(file.id)
                                ? "Show less"
                                : "Show more"}
                            </Button>
                          )}
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {formatFileSize(file.size)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(file.createdAt), "MMM dd, yyyy")}
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleDownload(file)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        >
                          Download
                        </Button>

                        {isAdmin && (
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Tooltip title="Edit Description" arrow>
                              <IconButton
                                size="small"
                                onClick={() => openEditDialog(file)}
                                sx={{
                                  color: "text.secondary",
                                  "&:hover": {
                                    color: "primary.main",
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete File" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedMediaId(file.id);
                                  setDeleteDialogOpen(true);
                                }}
                                sx={{
                                  color: "text.secondary",
                                  "&:hover": {
                                    color: "error.main",
                                    bgcolor: alpha(
                                      theme.palette.error.main,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Upload Deliverable Files
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share final deliverables with your client
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Upload Guidelines:
            </Typography>
            <Typography variant="body2" component="div">
              • Maximum file size: 1GB per file
              <br />
              • Supported formats: Images, Videos, PDFs, Audio files
              <br />• Files will be available for client download immediately
            </Typography>
          </Alert>

          <Box
            sx={{
              border: "2px dashed",
              borderColor:
                selectedFiles.length > 0 ? "primary.main" : "grey.300",
              borderRadius: 1,
              p: 4,
              textAlign: "center",
              bgcolor:
                selectedFiles.length > 0
                  ? alpha(theme.palette.primary.main, 0.05)
                  : "grey.50",
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <input
              type="file"
              multiple
              accept={ADMIN_ALLOWED_TYPES.join(",")}
              onChange={handleFileSelect}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
            <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Drop files here or click to browse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select multiple files to upload as deliverables
            </Typography>
          </Box>

          {uploading && (
            <Box sx={{ mt: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Uploading files...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(uploadProgress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }}
              />
            </Box>
          )}

          {selectedFiles.length > 0 && !uploading && (
            <Fade in>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Selected Files ({selectedFiles.length})
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                  {selectedFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        mb: 1,
                        bgcolor: "grey.50",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {file.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={formatFileSize(file.size)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Fade>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => {
              setAddDialogOpen(false);
              setSelectedFiles([]);
              setUploadProgress(0);
            }}
            disabled={uploading}
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading || selectedFiles.length === 0}
            startIcon={
              uploading ? <CircularProgress size={16} /> : <CloudUpload />
            }
            sx={{
              textTransform: "none",
              borderRadius: 1,
              px: 3,
              fontWeight: 600,
            }}
          >
            {uploading
              ? `Uploading... ${Math.round(uploadProgress)}%`
              : `Upload ${selectedFiles.length} File${
                  selectedFiles.length !== 1 ? "s" : ""
                }`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1 },
        }}
      >
        <DialogTitle sx={{ color: "error.main" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Warning />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Delete Deliverable File
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            This action cannot be undone
          </Alert>
          <Typography variant="body1">
            Are you sure you want to permanently delete this deliverable file?
            The client will no longer be able to access it.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Keep File
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              fontWeight: 600,
            }}
          >
            {deleting ? "Deleting..." : "Delete File"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Description Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1 },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Edit File Description
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add context or notes for this deliverable
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Describe this deliverable file..."
            error={editDescription.length > MAX_DESCRIPTION_LENGTH}
            helperText={`${editDescription.length}/${MAX_DESCRIPTION_LENGTH} characters`}
            inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => {
              setEditDialogOpen(false);
              setEditingMedia(null);
              setEditDescription("");
            }}
            disabled={updating}
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditDescription}
            variant="contained"
            disabled={
              updating || editDescription.length > MAX_DESCRIPTION_LENGTH
            }
            startIcon={updating ? <CircularProgress size={16} /> : <Save />}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              fontWeight: 600,
            }}
          >
            {updating ? "Saving..." : "Save Description"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
