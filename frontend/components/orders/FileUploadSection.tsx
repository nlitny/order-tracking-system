"use client";
import React, { useCallback, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  FormHelperText,
  IconButton,
  useTheme,
  alpha,
  Chip,
  Grid,
  LinearProgress,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  AttachFile,
  Image,
  VideoFile,
  PictureAsPdf,
  InsertDriveFile,
  Warning,
} from "@mui/icons-material";
import { AttachedFile } from "@/types/order";

interface FileUploadSectionProps {
  files: AttachedFile[];
  onFilesChange: (files: AttachedFile[]) => void;
  error?: string;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total
const MAX_FILES = 10;

const FILE_TYPE_INFO = {
  "image/jpeg": { icon: <Image />, color: "#4CAF50", label: "JPEG" },
  "image/png": { icon: <Image />, color: "#4CAF50", label: "PNG" },
  "image/gif": { icon: <Image />, color: "#4CAF50", label: "GIF" },
  "video/mp4": { icon: <VideoFile />, color: "#FF9800", label: "MP4" },
  "application/pdf": { icon: <PictureAsPdf />, color: "#F44336", label: "PDF" },
  default: { icon: <InsertDriveFile />, color: "#9E9E9E", label: "FILE" },
};

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  onFilesChange,
  error,
}) => {
  const theme = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const validateFiles = (
    fileList: FileList
  ): { validFiles: AttachedFile[]; errors: string[] } => {
    const validFiles: AttachedFile[] = [];
    const errors: string[] = [];

    // Check total number of files
    if (files.length + fileList.length > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} files allowed`);
      return { validFiles, errors };
    }

    const currentTotalSize = files.reduce((sum, file) => sum + file.size, 0);
    let newTotalSize = 0;

    Array.from(fileList).forEach((file) => {
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`);
        return;
      }

      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 10MB limit`);
        return;
      }

      // Check total size
      if (currentTotalSize + newTotalSize + file.size > MAX_TOTAL_SIZE) {
        errors.push(`Total file size would exceed 50MB limit`);
        return;
      }

      // Check for duplicates
      const isDuplicate = files.some(
        (existing) => existing.name === file.name && existing.size === file.size
      );

      if (isDuplicate) {
        errors.push(`${file.name}: File already exists`);
        return;
      }

      newTotalSize += file.size;
      validFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      });
    });

    return { validFiles, errors };
  };

  const handleFileUpload = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const { validFiles, errors } = validateFiles(fileList);

      setUploadErrors(errors);

      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
      }
    },
    [files, onFilesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      onFilesChange(files.filter((file) => file.id !== fileId));
      setUploadErrors([]);
    },
    [files, onFilesChange]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    return (
      FILE_TYPE_INFO[fileType as keyof typeof FILE_TYPE_INFO] ||
      FILE_TYPE_INFO.default
    );
  };

  const getTotalSize = () => files.reduce((sum, file) => sum + file.size, 0);
  const getSizePercentage = () => (getTotalSize() / MAX_TOTAL_SIZE) * 100;

  return (
    <Card elevation={0} sx={{ borderRadius: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            File Attachments
          </Typography>
          <Chip
            label={`${files.length}/${MAX_FILES}`}
            size="small"
            color={files.length >= MAX_FILES ? "error" : "default"}
            variant="outlined"
          />
        </Box>

        {/* Upload Area */}
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            border: `2px dashed ${
              dragActive
                ? theme.palette.primary.main
                : alpha(theme.palette.grey[400], 0.5)
            }`,
            backgroundColor: dragActive
              ? alpha(theme.palette.primary.main, 0.05)
              : alpha(theme.palette.grey[50], 0.5),
            borderRadius: 1,
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files)}
            accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4"
          />

          <CloudUpload
            sx={{
              fontSize: 64,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Drop files here or click to browse
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Upload supporting documents, images, or videos
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {ALLOWED_TYPES.map((type) => {
              const info = getFileIcon(type);
              return (
                <Chip
                  key={type}
                  label={info.label}
                  size="small"
                  variant="outlined"
                  icon={info.icon}
                  sx={{ fontSize: "0.75rem" }}
                />
              );
            })}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 2 }}
          >
            Max file size: 10MB • Max total: 50MB • Max files: {MAX_FILES}
          </Typography>
        </Paper>

        {/* Storage Usage */}
        {files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Storage Used
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatFileSize(getTotalSize())} /{" "}
                {formatFileSize(MAX_TOTAL_SIZE)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(getSizePercentage(), 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.grey[300], 0.3),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  backgroundColor:
                    getSizePercentage() > 90
                      ? theme.palette.error.main
                      : getSizePercentage() > 70
                      ? theme.palette.warning.main
                      : theme.palette.success.main,
                },
              }}
            />
          </Box>
        )}

        {/* Error Messages */}
        {(error || uploadErrors.length > 0) && (
          <Box sx={{ mt: 2 }}>
            {error && <FormHelperText error>{error}</FormHelperText>}
            {uploadErrors.map((err, index) => (
              <Alert key={index} severity="error" sx={{ mt: 1 }}>
                {err}
              </Alert>
            ))}
          </Box>
        )}

        {/* File List */}
        {files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AttachFile fontSize="small" />
              Uploaded Files ({files.length})
            </Typography>
            <Grid container spacing={2}>
              {files.map((file) => {
                const fileInfo = getFileIcon(file.type);
                return (
                  <Grid size={{ xs: 12 }} key={file.id}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        borderRadius: 1,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          elevation: 2,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: alpha(fileInfo.color, 0.1),
                          color: fileInfo.color,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {fileInfo.icon}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Tooltip title={file.name}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Tooltip>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(file.size)}
                          </Typography>
                          <Chip
                            label={fileInfo.label}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: "0.65rem",
                              backgroundColor: alpha(fileInfo.color, 0.1),
                              color: fileInfo.color,
                            }}
                          />
                        </Box>
                      </Box>

                      <Tooltip title="Remove file">
                        <IconButton
                          size="small"
                          onClick={() => removeFile(file.id)}
                          sx={{
                            color: theme.palette.error.main,
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
