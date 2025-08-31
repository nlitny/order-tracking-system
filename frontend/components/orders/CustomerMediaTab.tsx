import React, { useState } from "react";
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
  Image as ImageIcon,
  VideoFile,
  PictureAsPdf,
  AudioFile,
  InsertDriveFile,
  CloudUpload,
  Warning,
} from "@mui/icons-material";
import { MediaFile } from "@/types/order";
import { orderService } from "@/services/orderService";
import { useToast } from "@/lib/toast/toast";
import { format } from "date-fns";

interface CustomerMediaTabProps {
  orderId: string;
  mediaFiles: MediaFile[];
  loading: boolean;
  canEdit: boolean;
  onUpdate: () => void;
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

const ALLOWED_TYPES = [
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

export default function CustomerMediaTab({
  orderId,
  mediaFiles,
  loading,
  canEdit,
  onUpdate,
}: CustomerMediaTabProps) {
  const theme = useTheme();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

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
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const maxTotalSize = 10 * 1024 * 1024; // 10MB

    const validFiles = fileArray.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        showErrorToast(`${file.name}: Unsupported file format`);
        return false;
      }
      if (file.size > maxFileSize) {
        showErrorToast(`${file.name}: File exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      showErrorToast("Total upload size exceeds 10MB limit");
      return;
    }

    if (validFiles.length > 10) {
      showErrorToast("Maximum 10 files allowed per upload");
      return;
    }

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      await orderService.addMedia(orderId, selectedFiles);
      showSuccessToast(`Successfully uploaded ${selectedFiles.length} file(s)`);
      setAddDialogOpen(false);
      setSelectedFiles([]);
      onUpdate();
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await orderService.deleteMedia(selectedMediaId);
      showSuccessToast("Media file deleted successfully");
      setDeleteDialogOpen(false);
      onUpdate();
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = (file: MediaFile) => {
    const link = document.createElement("a");
    link.href = file.path;
    link.download = file.originalName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      {canEdit && (
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
              Customer Media Files
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Share files and references with your service provider
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
            Upload Files
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
            No Files Uploaded Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {canEdit
              ? "Start by uploading files to share with your service provider"
              : "No media files have been uploaded for this order"}
          </Typography>
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Upload First File
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
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
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
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
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

                        {canEdit && (
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
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                },
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
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
            Upload Media Files
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share files and references with your service provider
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Upload Guidelines:
            </Typography>
            <Typography variant="body2" component="div">
              • Maximum 10 files per upload
              <br />
              • Individual file size: 5MB maximum
              <br />
              • Total upload size: 10MB maximum
              <br />• Supported formats: Images, Videos, PDFs, Audio files
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
              accept={ALLOWED_TYPES.join(",")}
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
              Select multiple files to share with your service provider
            </Typography>
          </Box>

          {selectedFiles.length > 0 && (
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
              ? "Uploading..."
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
              Delete Media File
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            This action cannot be undone
          </Alert>
          <Typography variant="body1">
            Are you sure you want to permanently delete this media file?
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
    </Box>
  );
}
