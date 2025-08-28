"use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Paper,
  Container,
  useTheme,
  alpha,
  FormControl,
  FormHelperText,
  Backdrop,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Send,
  ArrowBack,
  AttachFile,
  CalendarToday,
  Subject,
  Description,
  CheckCircle,
  Error,
  Grade,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Types
interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface OrderFormData {
  subject: string;
  description: string;
  preferred_deadline: Date | null;
  special_instructions: string;
  attachments: AttachedFile[];
}

interface FormErrors {
  subject?: string;
  description?: string;
  preferred_deadline?: string;
  special_instructions?: string;
  attachments?: string;
}

export default function CreateNewOrder() {
  const theme = useTheme();

  // Form state
  const [formData, setFormData] = useState<OrderFormData>({
    subject: "",
    description: "",
    preferred_deadline: null,
    special_instructions: "",
    attachments: [],
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // File upload handlers
  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      const newFiles: AttachedFile[] = [];
      const fileErrors: string[] = [];

      Array.from(files).forEach((file) => {
        if (file.size > maxSize) {
          fileErrors.push(`${file.name}: File size exceeds 10MB limit`);
          return;
        }

        if (!allowedTypes.includes(file.type)) {
          fileErrors.push(`${file.name}: File type not supported`);
          return;
        }

        // Check for duplicates
        const isDuplicate = formData.attachments.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size
        );

        if (!isDuplicate) {
          newFiles.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            file,
          });
        }
      });

      if (fileErrors.length > 0) {
        setErrors((prev) => ({
          ...prev,
          attachments: fileErrors.join(", "),
        }));
      } else {
        setErrors((prev) => ({ ...prev, attachments: undefined }));
      }

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    },
    [formData.attachments]
  );

  // Drag and drop handlers
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

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((file) => file.id !== fileId),
    }));
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Order title is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Order title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (
      formData.preferred_deadline &&
      formData.preferred_deadline < new Date()
    ) {
      newErrors.preferred_deadline = "Deadline cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate API call
      const submitData = new FormData();
      submitData.append("subject", formData.subject);
      submitData.append("description", formData.description);
      if (formData.preferred_deadline) {
        submitData.append(
          "preferred_deadline",
          formData.preferred_deadline.toISOString()
        );
      }
      if (formData.special_instructions) {
        submitData.append(
          "special_instructions",
          formData.special_instructions
        );
      }

      formData.attachments.forEach((file, index) => {
        submitData.append(`attachments[${index}]`, file.file);
      });

      // Replace this with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          subject: "",
          description: "",
          preferred_deadline: null,
          special_instructions: "",
          attachments: [],
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      setSubmitError("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <IconButton
              href="/dashboard"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                Create New Order
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Fill out the details below to submit your new order
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Success Alert */}
        <Collapse in={submitSuccess}>
          <Alert
            icon={<CheckCircle fontSize="inherit" />}
            severity="success"
            sx={{ mb: 3, fontWeight: 500 }}
          >
            Order submitted successfully! You will be redirected shortly.
          </Alert>
        </Collapse>

        {/* Error Alert */}
        <Collapse in={!!submitError}>
          <Alert
            icon={<Error fontSize="inherit" />}
            severity="error"
            sx={{ mb: 3, fontWeight: 500 }}
            onClose={() => setSubmitError(null)}
          >
            {submitError}
          </Alert>
        </Collapse>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Main Form */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card elevation={0}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Order Details
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* Order Title */}
                    <FormControl fullWidth error={!!errors.subject}>
                      <TextField
                        label="Order Title"
                        placeholder="Enter a descriptive title for your order"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        error={!!errors.subject}
                        helperText={errors.subject}
                        InputProps={{
                          startAdornment: (
                            <Subject sx={{ color: "action.active", mr: 1 }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    </FormControl>

                    {/* Description */}
                    <FormControl fullWidth error={!!errors.description}>
                      <TextField
                        label="Description"
                        placeholder="Provide detailed information about your order requirements"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        error={!!errors.description}
                        helperText={
                          errors.description ||
                          `${formData.description.length}/500 characters`
                        }
                        inputProps={{ maxLength: 500 }}
                        InputProps={{
                          startAdornment: (
                            <Description
                              sx={{
                                color: "action.active",
                                mr: 1,
                                alignSelf: "flex-start",
                                mt: 1,
                              }}
                            />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    </FormControl>
                    {/* Preferred Deadline - Alternative Simple Solution */}
                    <FormControl fullWidth error={!!errors.preferred_deadline}>
                      <TextField
                        label="Preferred Deadline (Optional)"
                        type="date"
                        value={
                          formData.preferred_deadline
                            ? formData.preferred_deadline
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          setFormData((prev) => ({
                            ...prev,
                            preferred_deadline: date,
                          }));
                        }}
                        error={!!errors.preferred_deadline}
                        helperText={
                          errors.preferred_deadline ||
                          "Select your preferred completion date"
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <CalendarToday
                              sx={{ color: "action.active", mr: 1 }}
                            />
                          ),
                        }}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0], // Prevent past dates
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    </FormControl>

                    {/* Special Instructions */}
                    <FormControl fullWidth>
                      <TextField
                        label="Special Instructions (Optional)"
                        placeholder="Any specific requirements, preferences, or notes"
                        multiline
                        rows={3}
                        value={formData.special_instructions}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            special_instructions: e.target.value,
                          }))
                        }
                        inputProps={{ maxLength: 300 }}
                        helperText={`${formData.special_instructions.length}/300 characters`}
                        InputProps={{
                          startAdornment: (
                            <Grade
                              sx={{
                                color: "action.active",
                                mr: 1,
                                alignSelf: "flex-start",
                                mt: 1,
                              }}
                            />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* File Upload & Actions */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* File Upload */}
                <Card elevation={0}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Attachments
                    </Typography>

                    {/* Drag & Drop Area */}
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: "center",
                        border: `2px dashed ${
                          dragActive
                            ? theme.palette.secondary.main
                            : alpha(theme.palette.grey[400], 0.5)
                        }`,
                        bgcolor: dragActive
                          ? alpha(theme.palette.secondary.main, 0.05)
                          : alpha(theme.palette.grey[50], 0.5),
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          borderColor: theme.palette.secondary.main,
                          bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        },
                      }}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e.target.files)}
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
                      />

                      <CloudUpload
                        sx={{
                          fontSize: 48,
                          color: theme.palette.secondary.main,
                          mb: 1,
                        }}
                      />
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Drop files here
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        or click to browse
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: PDF, Images, Word, Text files (Max: 10MB
                        each)
                      </Typography>
                    </Paper>

                    {errors.attachments && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {errors.attachments}
                      </FormHelperText>
                    )}

                    {/* Uploaded Files List */}
                    {formData.attachments.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          Uploaded Files ({formData.attachments.length})
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {formData.attachments.map((file) => (
                            <Paper
                              key={file.id}
                              elevation={0}
                              sx={{
                                p: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                border: `1px solid ${theme.palette.grey[200]}`,
                                borderRadius: 1,
                              }}
                            >
                              <AttachFile fontSize="small" color="action" />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {formatFileSize(file.size)}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => removeFile(file.id)}
                                sx={{ color: theme.palette.error.main }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Paper>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card elevation={0}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Order Summary
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Title Status
                        </Typography>
                        <Chip
                          size="small"
                          label={formData.subject ? "Complete" : "Required"}
                          color={formData.subject ? "success" : "error"}
                          variant="outlined"
                        />
                      </Box>

                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Description Status
                        </Typography>
                        <Chip
                          size="small"
                          label={formData.description ? "Complete" : "Required"}
                          color={formData.description ? "success" : "error"}
                          variant="outlined"
                        />
                      </Box>

                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Attachments
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formData.attachments.length} files
                        </Typography>
                      </Box>

                      {formData.preferred_deadline && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Deadline
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formData.preferred_deadline.toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={
                    isSubmitting || !formData.subject || !formData.description
                  }
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : <Send />
                  }
                  sx={{
                    height: 56,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  {isSubmitting ? "Submitting Order..." : "Submit Order"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isSubmitting}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
              Submitting your order...
            </Typography>
          </Box>
        </Backdrop>
      </Container>
    </LocalizationProvider>
  );
}
