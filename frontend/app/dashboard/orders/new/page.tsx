"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  Button,
  Backdrop,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Fade,
  Alert,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Assignment,
  AttachFile,
  Preview,
  CheckCircle,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FileUploadSection } from "@/components/orders/FileUploadSection";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { orderService } from "@/services/orderService";
import { OrderFormData, AttachedFile, FormErrors } from "@/types/order";
import { useToast } from "@/lib/toast/toast";
import { useNotifications } from "@/hooks/useNotifications";

const steps = [
  {
    label: "Order Details",
    icon: <Assignment />,
    description: "Basic information about your order",
  },
  {
    label: "Attachments",
    icon: <AttachFile />,
    description: "Upload supporting files (optional)",
  },
  {
    label: "Review & Submit",
    icon: <Preview />,
    description: "Review your order before submission",
  },
];

export default function CreateOrderPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showSuccessToast, showErrorToast, showInfoToast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const { refreshNotifications } = useNotifications();
  const [formData, setFormData] = useState<OrderFormData>({
    title: "",
    description: "",
    estimatedCompletion: "",
    special_instructions: "",
  });

  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Order title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (selectedDateTime) {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      if (selectedDateTime < oneHourFromNow) {
        newErrors.estimatedCompletion =
          "Estimated completion must be at least 1 hour from now";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateForm()) {
      return;
    }

    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step: number) => {
    if (step === 0 || completed[step - 1]) {
      setActiveStep(step);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      estimatedCompletion: "",
      special_instructions: "",
    });
    setFiles([]);
    setSelectedDateTime(null);
    setActiveStep(0);
    setCompleted({});
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setActiveStep(0);
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const orderPayload: OrderFormData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        estimatedCompletion: selectedDateTime
          ? selectedDateTime.toISOString()
          : undefined,
        special_instructions:
          formData.special_instructions?.trim() || undefined,
      };

      setUploadProgress(30);
      const orderRes = (await orderService.createOrder(orderPayload)) as any;

      if (!orderRes || !orderRes.data) {
        throw new Error("Failed to create order");
      }

      setUploadProgress(60);

      if (files.length > 0) {
        await orderService.uploadMedia(
          orderRes.data.id,
          files.map((f) => f.file)
        );
      }

      setUploadProgress(90);

      await refreshNotifications();

      setUploadProgress(100);

      if (files.length > 0) {
        showSuccessToast("Order created and files uploaded successfully");
      } else {
        showSuccessToast("Order created successfully");
      }

      showInfoToast("You Have Unread Notification", {
        position: "bottom-left",
      });

      setTimeout(() => {
        resetForm();
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      console.error("Order creation failed:", err);
      showErrorToast("Failed to create order. Please try again.");
      setUploadProgress(0);
      setIsSubmitting(false);
    }
  };

  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 0:
        return (
          !!formData.title.trim() &&
          !!formData.description.trim() &&
          Object.keys(errors).length === 0
        );
      case 1:
        return true;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const canProceed = () => {
    if (activeStep === 0) {
      return (
        formData.title.trim() &&
        formData.description.trim() &&
        Object.keys(errors).length === 0
      );
    }
    return true;
  };

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
            color: "white",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: {
                xs: "1.5rem",
                sm: "2rem",
                md: "2.125rem",
                color: "#EFE9D5",
              },
            }}
          >
            Create New Order
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              fontSize: { xs: "0.875rem", md: "1rem", color: "#EFE9D5" },
            }}
          >
            Follow the steps below to create your order with all necessary
            details
          </Typography>
        </Paper>

        {/* Stepper */}
        <Card elevation={0} sx={{ mb: 4, borderRadius: 1 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel={!isMobile}
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{
                "& .MuiStepLabel-root": {
                  cursor: "pointer",
                },
                "& .MuiStepContent-root": {
                  borderLeft: isMobile
                    ? `1px solid ${theme.palette.divider}`
                    : "none",
                  ml: isMobile ? 2 : 0,
                  pl: isMobile ? 2 : 0,
                },
              }}
            >
              {steps.map((step, index) => (
                <Step
                  key={step.label}
                  completed={isStepCompleted(index)}
                  onClick={() => handleStepClick(index)}
                >
                  <StepLabel
                    StepIconComponent={({
                      active,
                      completed: stepCompleted,
                    }) => (
                      <Box
                        sx={{
                          width: { xs: 32, md: 40 },
                          height: { xs: 32, md: 40 },
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: stepCompleted
                            ? "success.main"
                            : active
                            ? "primary.main"
                            : "grey.300",
                          color: stepCompleted || active ? "white" : "grey.600",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {stepCompleted ? <CheckCircle /> : step.icon}
                      </Box>
                    )}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "0.875rem", md: "1rem" },
                      }}
                    >
                      {step.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", md: "0.75rem" } }}
                    >
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        {isSubmitting && (
          <Card elevation={0} sx={{ mb: 3, borderRadius: 1 }}>
            <CardContent sx={{ py: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {uploadProgress < 100
                    ? "Creating order..."
                    : "Order created successfully!"}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  {uploadProgress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ borderRadius: 1, height: 6 }}
              />
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Fade in timeout={300}>
              <Card elevation={0} sx={{ borderRadius: 1, minHeight: 400 }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  {/* Step 0: Order Details */}
                  {activeStep === 0 && (
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        <Assignment color="primary" />
                        Order Details
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            label="Order Title *"
                            placeholder="Enter a descriptive title for your order"
                            value={formData.title}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }));
                              if (errors.title) {
                                setErrors((prev) => ({
                                  ...prev,
                                  title: undefined,
                                }));
                              }
                            }}
                            error={!!errors.title}
                            helperText={
                              errors.title ||
                              `${formData.title.length}/100 characters`
                            }
                            inputProps={{ maxLength: 100 }}
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <TextField
                            label="Description *"
                            placeholder="Provide detailed information about your order requirements"
                            multiline
                            rows={5}
                            value={formData.description}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }));
                              if (errors.description) {
                                setErrors((prev) => ({
                                  ...prev,
                                  description: undefined,
                                }));
                              }
                            }}
                            error={!!errors.description}
                            helperText={
                              errors.description ||
                              `${formData.description.length}/1000 characters`
                            }
                            inputProps={{ maxLength: 1000 }}
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <DateTimePicker
                            label="Estimated Completion Date & Time"
                            value={selectedDateTime}
                            onChange={(newValue) => {
                              setSelectedDateTime(newValue);
                              setFormData((prev) => ({
                                ...prev,
                                estimatedCompletion: newValue
                                  ? newValue.toISOString()
                                  : "",
                              }));
                              if (errors.estimatedCompletion) {
                                setErrors((prev) => ({
                                  ...prev,
                                  estimatedCompletion: undefined,
                                }));
                              }
                            }}
                            minDateTime={new Date(Date.now() + 60 * 60 * 1000)} // 1 hour from now
                            format="MMM dd, yyyy - hh:mm a"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                variant: "outlined",
                                error: !!errors.estimatedCompletion,
                                helperText:
                                  errors.estimatedCompletion ||
                                  "When do you need this completed? (Optional)",
                                placeholder: "Select date and time...",
                              },
                              actionBar: {
                                actions: ["clear", "accept", "cancel"],
                              },
                              mobilePaper: {
                                sx: {
                                  maxWidth: "100%",
                                  margin: 1,
                                },
                              },
                            }}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-root": {
                                fontSize: { xs: "0.875rem", md: "1rem" },
                              },
                            }}
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <TextField
                            label="Special Instructions"
                            placeholder="Any specific requirements or additional information"
                            multiline
                            rows={3}
                            value={formData.special_instructions}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                special_instructions: e.target.value,
                              }))
                            }
                            helperText="Optional: Add any special requirements or notes"
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {/* Step 1: File Upload */}
                  {activeStep === 1 && (
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        <AttachFile color="primary" />
                        Attachments
                      </Typography>
                      <FileUploadSection
                        files={files}
                        onFilesChange={setFiles}
                        error={errors.attachments}
                      />
                    </Box>
                  )}

                  {/* Step 2: Review */}
                  {activeStep === 2 && (
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        <Preview color="primary" />
                        Review Your Order
                      </Typography>

                      <Alert severity="info" sx={{ mb: 3 }}>
                        Please review all the information below before
                        submitting your order.
                      </Alert>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <Paper
                            variant="outlined"
                            sx={{ p: { xs: 2, md: 3 }, borderRadius: 1 }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                              sx={{
                                fontSize: { xs: "0.75rem", md: "0.875rem" },
                              }}
                            >
                              ORDER TITLE
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                mb: 2,
                                fontSize: { xs: "0.875rem", md: "1rem" },
                              }}
                            >
                              {formData.title}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                              sx={{
                                fontSize: { xs: "0.75rem", md: "0.875rem" },
                              }}
                            >
                              DESCRIPTION
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 2,
                                whiteSpace: "pre-wrap",
                                fontSize: { xs: "0.75rem", md: "0.875rem" },
                              }}
                            >
                              {formData.description}
                            </Typography>

                            {selectedDateTime && (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  gutterBottom
                                  sx={{
                                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                                  }}
                                >
                                  ESTIMATED COMPLETION
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mb: 2,
                                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                                  }}
                                >
                                  {selectedDateTime.toLocaleString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </Typography>
                              </>
                            )}

                            {formData.special_instructions && (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  gutterBottom
                                  sx={{
                                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                                  }}
                                >
                                  SPECIAL INSTRUCTIONS
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    whiteSpace: "pre-wrap",
                                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                                  }}
                                >
                                  {formData.special_instructions}
                                </Typography>
                              </>
                            )}
                          </Paper>
                        </Grid>

                        {files.length > 0 && (
                          <Grid size={{ xs: 12 }}>
                            <Paper
                              variant="outlined"
                              sx={{ p: { xs: 2, md: 3 }, borderRadius: 1 }}
                            >
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                gutterBottom
                                sx={{
                                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                                }}
                              >
                                ATTACHED FILES ({files.length})
                              </Typography>
                              {files.map((file) => (
                                <Typography
                                  key={file.id}
                                  variant="body2"
                                  sx={{
                                    ml: 1,
                                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                                  }}
                                >
                                  • {file.name} (
                                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                                </Typography>
                              ))}
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  )}

                  {/* Navigation Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      gap: 2,
                      mt: 4,
                      pt: 3,
                      borderTop: 1,
                      borderColor: "grey.200",
                    }}
                  >
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0 || isSubmitting}
                      variant="outlined"
                      size="large"
                      sx={{
                        minWidth: { xs: "100%", sm: 120 },
                      }}
                    >
                      Back
                    </Button>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      {activeStep < steps.length - 1 ? (
                        <Button
                          onClick={handleNext}
                          variant="contained"
                          size="large"
                          disabled={!canProceed() || isSubmitting}
                          sx={{
                            minWidth: { xs: "100%", sm: 120 },
                          }}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          variant="contained"
                          size="large"
                          disabled={isSubmitting || !canProceed()}
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CheckCircle />
                            )
                          }
                          sx={{
                            minWidth: { xs: "100%", sm: 140 },
                          }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Order"}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: "sticky" }, top: 20 }}>
              <OrderSummary
                formData={formData}
                files={files}
                currentStep={activeStep}
                selectedDateTime={selectedDateTime}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Loading Backdrop */}
        <Backdrop open={isSubmitting} sx={{ color: "#fff", zIndex: 9999 }}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
              {uploadProgress < 100
                ? "Creating your order..."
                : "Order created successfully!"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, color: "white" }}>
              {uploadProgress < 100
                ? "Please wait while we process your request"
                : "Preparing to reset form..."}
            </Typography>
          </Box>
        </Backdrop>
      </Container>
    </LocalizationProvider>
  );
}
