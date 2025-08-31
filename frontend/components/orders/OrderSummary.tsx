"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Assignment,
  Description,
  Schedule,
  AttachFile,
  Notes,
  CheckCircle,
  Warning,
  Info,
} from "@mui/icons-material";
import { OrderFormData, AttachedFile } from "@/types/order";

interface OrderSummaryProps {
  formData: OrderFormData;
  files: AttachedFile[];
  currentStep?: number;
  selectedDateTime?: Date | null;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  formData,
  files,
  currentStep = 0,
  selectedDateTime,
}) => {
  const theme = useTheme();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTotalFileSize = () =>
    files.reduce((sum, file) => sum + file.size, 0);

  const getCompletionStatus = () => {
    const required = {
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    const completed = Object.values(required).filter(Boolean).length;
    const total = Object.keys(required).length;

    return { completed, total, percentage: (completed / total) * 100 };
  };

  const status = getCompletionStatus();

  const summaryItems = [
    {
      icon: <Assignment fontSize="small" />,
      label: "Title",
      value: formData.title.trim(),
      required: true,
      status: formData.title.trim() ? "complete" : "missing",
    },
    {
      icon: <Description fontSize="small" />,
      label: "Description",
      value: formData.description.trim(),
      required: true,
      status: formData.description.trim() ? "complete" : "missing",
      preview: formData.description.trim()
        ? `${formData.description.substring(0, 50)}${
            formData.description.length > 50 ? "..." : ""
          }`
        : undefined,
    },
    {
      icon: <Schedule fontSize="small" />,
      label: "Due Date & Time",
      value: selectedDateTime?.toISOString() || "",
      required: false,
      status: selectedDateTime ? "complete" : "optional",
      display: selectedDateTime
        ? selectedDateTime.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : undefined,
    },
    {
      icon: <Notes fontSize="small" />,
      label: "Special Instructions",
      value: formData.special_instructions?.trim(),
      required: false,
      status: formData.special_instructions?.trim() ? "complete" : "optional",
      preview: formData.special_instructions?.trim()
        ? `${formData.special_instructions.substring(0, 30)}${
            formData.special_instructions.length > 30 ? "..." : ""
          }`
        : undefined,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "success";
      case "missing":
        return "error";
      case "optional":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle fontSize="small" />;
      case "missing":
        return <Warning fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Progress Overview */}
      <Card elevation={0} sx={{ borderRadius: 1 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: "1.125rem", md: "1.25rem" },
            }}
          >
            Order Progress
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                Completion Status
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                {status.completed}/{status.total} Required
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={status.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.grey[300], 0.3),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  backgroundColor:
                    status.percentage === 100
                      ? theme.palette.success.main
                      : theme.palette.primary.main,
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justify: "center", gap: 1 }}>
            <Chip
              icon={status.percentage === 100 ? <CheckCircle /> : <Warning />}
              label={
                status.percentage === 100 ? "Ready to Submit" : "Incomplete"
              }
              color={status.percentage === 100 ? "success" : "warning"}
              size="small"
              variant="outlined"
              sx={{ fontSize: { xs: "0.6875rem", md: "0.75rem" } }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card elevation={0} sx={{ borderRadius: 1 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: "1.125rem", md: "1.25rem" },
            }}
          >
            Order Summary
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {summaryItems.map((item, index) => (
              <Box key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ color: "text.secondary" }}>{item.icon}</Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                    >
                      {item.label}
                      {item.required && (
                        <span style={{ color: theme.palette.error.main }}>
                          *
                        </span>
                      )}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(item.status)}
                    size="small"
                    label={
                      item.status === "complete"
                        ? "✓"
                        : item.status === "missing"
                        ? "Required"
                        : "Optional"
                    }
                    color={getStatusColor(item.status) as any}
                    variant="outlined"
                    sx={{
                      borderRadius: 1,
                      fontSize: { xs: "0.6875rem", md: "0.75rem" },
                      minWidth: "fit-content",
                    }}
                  />
                </Box>

                {item.value && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      backgroundColor: alpha(theme.palette.grey[50], 0.5),
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                        wordBreak: "break-word",
                      }}
                    >
                      {item.display ||
                        item.preview ||
                        (item.value.length > 30
                          ? `${item.value.substring(0, 30)}...`
                          : item.value)}
                    </Typography>
                  </Paper>
                )}

                {index < summaryItems.length - 1 && <Divider sx={{ mt: 1 }} />}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* File Summary */}
      {files.length > 0 && (
        <Card elevation={0} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.125rem", md: "1.25rem" },
              }}
            >
              <AttachFile fontSize="small" />
              Attachments
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  Total Files
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  {files.length} files
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  Total Size
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  {formatFileSize(getTotalFileSize())}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
                {files.slice(0, 3).map((file) => (
                  <Box
                    key={file.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.5,
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        fontSize: { xs: "0.6875rem", md: "0.75rem" },
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        flexShrink: 0,
                        fontSize: { xs: "0.6875rem", md: "0.75rem" },
                      }}
                    >
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                ))}
                {files.length > 3 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontStyle: "italic",
                      fontSize: { xs: "0.6875rem", md: "0.75rem" },
                    }}
                  >
                    +{files.length - 3} more files...
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderColor: alpha(theme.palette.primary.main, 0.2),
          borderRadius: 1,
        }}
      >
        <Typography
          variant="body2"
          color="primary"
          sx={{
            fontWeight: 600,
            textAlign: "center",
            fontSize: { xs: "0.875rem", md: "0.875rem" },
          }}
        >
          Step {currentStep + 1} of 3
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textAlign: "center",
            display: "block",
            mt: 0.5,
            fontSize: { xs: "0.6875rem", md: "0.75rem" },
          }}
        >
          {currentStep === 0 && "Fill in order details"}
          {currentStep === 1 && "Upload files (optional)"}
          {currentStep === 2 && "Review and submit"}
        </Typography>
      </Paper>
    </Box>
  );
};
