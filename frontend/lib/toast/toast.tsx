// app/auth/hooks/useToast.tsx
"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Box,
  IconButton,
  Slide,
  SlideProps,
  Snackbar,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import {
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
  InfoOutlined,
  WarningAmberRounded,
  Close as CloseIcon,
  TaskAlt,
  ReportProblem,
  Announcement,
  NotificationImportant,
} from "@mui/icons-material";
import { brandColors } from "@/theme/theme";

// ==================== Types ====================

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  variant?: ToastVariant;
  action?: ReactNode;
  hideCloseButton?: boolean;
  showProgressBar?: boolean;
}

export type ToastVariant = "filled" | "outlined" | "standard" | "glass";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
export type ToastSeverity = "success" | "error" | "info" | "warning";

export interface ToastContextType {
  showToast: (
    message: string,
    severity: ToastSeverity,
    options?: ToastOptions
  ) => void;
  showSuccessToast: (message: string, options?: ToastOptions) => void;
  showErrorToast: (message: string, options?: ToastOptions) => void;
  showInfoToast: (message: string, options?: ToastOptions) => void;
  showWarningToast: (message: string, options?: ToastOptions) => void;
  closeToast: () => void;
}

interface ToastProviderProps {
  children: ReactNode;
  defaultOptions?: ToastOptions;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
  options: Required<ToastOptions>;
  key: number;
  startTime?: number;
}

// ==================== Styled Components ====================

const StyledAlert = styled(Alert, {
  shouldForwardProp: (prop) => !["customVariant"].includes(prop as string),
})<{ customVariant?: ToastVariant }>(({ theme, severity, customVariant }) => {
  const baseStyles = {
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    minHeight: 56,
    fontSize: "0.95rem",
    fontWeight: 500,
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    position: "relative" as const,
    overflow: "hidden" as const,

    ".MuiAlert-icon": {
      padding: theme.spacing(0.75),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.4rem",
    },

    ".MuiAlert-message": {
      padding: `${theme.spacing(1)} ${theme.spacing(0.5)}`,
      display: "flex",
      alignItems: "center",
      flex: 1,
    },

    ".MuiAlert-action": {
      padding: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },

    "&:hover": {
      transform: "translateY(-1px)",
    },
  };

  // Color mapping with brand colors
  const colorConfig = {
    success: {
      main: brandColors.lightTeal,
      dark: brandColors.teal,
      contrast: "#ffffff",
    },
    error: {
      main: "#f44336",
      dark: "#d32f2f",
      contrast: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      dark: "#f57c00",
      contrast: "#ffffff",
    },
    info: {
      main: brandColors.teal,
      dark: brandColors.navy,
      contrast: "#ffffff",
    },
  };

  const colors = colorConfig[severity || "info"];

  switch (customVariant) {
    case "glass":
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${alpha(
          colors.main,
          0.15
        )} 0%, ${alpha(colors.dark, 0.08)} 100%)`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(colors.main, 0.25)}`,
        boxShadow: `0 8px 32px ${alpha(
          colors.main,
          0.15
        )}, inset 0 1px 0 ${alpha("#ffffff", 0.2)}`,
        color: colors.dark,

        ".MuiAlert-icon": {
          color: colors.main,
          background: `linear-gradient(135deg, ${alpha(
            colors.main,
            0.15
          )} 0%, ${alpha(colors.main, 0.08)} 100%)`,
          borderRadius: "50%",
          width: 36,
          height: 36,
        },
      };

    case "filled":
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%)`,
        color: colors.contrast,
        boxShadow: `0 6px 20px ${alpha(colors.main, 0.4)}, 0 2px 8px ${alpha(
          colors.main,
          0.2
        )}`,

        ".MuiAlert-icon": {
          color: colors.contrast,
          background: alpha(colors.contrast, 0.15),
          borderRadius: "50%",
          width: 36,
          height: 36,
        },
      };

    case "outlined":
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${alpha(
          colors.main,
          0.08
        )} 0%, ${alpha(colors.dark, 0.04)} 100%)`,
        border: `2px solid ${colors.main}`,
        color: colors.dark,
        boxShadow: `0 4px 16px ${alpha(colors.main, 0.15)}`,

        ".MuiAlert-icon": {
          color: colors.main,
          background: alpha(colors.main, 0.1),
          borderRadius: "50%",
          width: 36,
          height: 36,
        },
      };

    default: // standard
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${alpha(
          colors.main,
          0.12
        )} 0%, ${alpha(colors.dark, 0.06)} 100%)`,
        color: colors.dark,
        boxShadow: `0 4px 12px ${alpha(theme.palette.grey[500], 0.15)}`,
        border: `1px solid ${alpha(colors.main, 0.2)}`,

        ".MuiAlert-icon": {
          color: colors.main,
        },
      };
  }
});

const ToastIconContainer = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ProgressBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== "duration" && prop !== "severity",
})<{ duration: number; severity: ToastSeverity }>(({ duration, severity }) => {
  const colorConfig = {
    success: brandColors.lightTeal,
    error: "#f44336",
    warning: "#ff9800",
    info: brandColors.teal,
  };

  return {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    background: `linear-gradient(90deg, ${colorConfig[severity]} 0%, ${alpha(
      colorConfig[severity],
      0.7
    )} 100%)`,
    animation: `progressAnimation ${duration}ms linear`,
    transformOrigin: "left",

    "@keyframes progressAnimation": {
      "0%": {
        width: "100%",
      },
      "100%": {
        width: "0%",
      },
    },
  };
});

// ==================== Default values ====================

const DEFAULT_OPTIONS: Required<ToastOptions> = {
  duration: 5000,
  position: "top-right",
  variant: "glass", // Changed to glass as default
  action: null,
  hideCloseButton: false,
  showProgressBar: true, // Added progress bar by default
};

const getSlideDirection = (
  position: ToastPosition
): SlideProps["direction"] => {
  if (position.includes("right")) return "left";
  if (position.includes("left")) return "right";
  if (position.includes("top")) return "down";
  return "up";
};

const getPositionCoordinates = (
  position: ToastPosition
): { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" } => {
  const vertical: "top" | "bottom" = position.includes("top")
    ? "top"
    : "bottom";
  let horizontal: "left" | "center" | "right";
  if (position.includes("left")) horizontal = "left";
  else if (position.includes("right")) horizontal = "right";
  else horizontal = "center";
  return { vertical, horizontal };
};

const getToastIcon = (severity: ToastSeverity) => {
  switch (severity) {
    case "success":
      return <TaskAlt />;
    case "error":
      return <ReportProblem />;
    case "warning":
      return <NotificationImportant />;
    case "info":
    default:
      return <Announcement />;
  }
};

// ==================== Context & Provider ====================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({
  children,
  defaultOptions = {},
}: ToastProviderProps) {
  const theme = useTheme();

  const [toastState, setToastState] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
    options: { ...DEFAULT_OPTIONS, ...defaultOptions },
    key: 0,
  });

  const { open, message, severity, options, key, startTime } = toastState;
  const {
    position,
    duration,
    variant,
    action,
    hideCloseButton,
    showProgressBar,
  } = options;

  const toastCountRef = useRef(0);
  const requestIdRef = useRef<number | null>(null);

  const triggerToast = useCallback(
    (
      newMessage: string,
      newSeverity: ToastSeverity,
      newOptions?: ToastOptions
    ) => {
      const newKey = toastCountRef.current++;

      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
      }

      requestIdRef.current = requestAnimationFrame(() => {
        setToastState({
          open: true,
          message: newMessage,
          severity: newSeverity,
          options: {
            ...DEFAULT_OPTIONS,
            ...defaultOptions,
            ...newOptions,
          } as Required<ToastOptions>,
          key: newKey,
          startTime: Date.now(),
        });
      });
    },
    [defaultOptions]
  );

  const closeToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, open: false }));
  }, []);

  // Enhanced convenience methods with better defaults for the project
  const showToast = useCallback(
    (message: string, severity: ToastSeverity, options?: ToastOptions) => {
      triggerToast(message, severity, options);
    },
    [triggerToast]
  );

  const showSuccessToast = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, "success", {
        variant: "glass",
        duration: 4000,
        ...options,
      });
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, "error", {
        variant: "filled",
        duration: 6000,
        ...options,
      });
    },
    [showToast]
  );

  const showInfoToast = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, "info", {
        variant: "glass",
        duration: 4000,
        ...options,
      });
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, "warning", {
        variant: "outlined",
        duration: 5000,
        ...options,
      });
    },
    [showToast]
  );

  useEffect(() => {
    return () => {
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  const positionCoords = getPositionCoordinates(position);
  const slideDirection = getSlideDirection(position);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccessToast,
        showErrorToast,
        showInfoToast,
        showWarningToast,
        closeToast,
      }}
    >
      {children}
      <Snackbar
        key={key}
        open={open}
        autoHideDuration={duration}
        onClose={(_event, reason) => {
          if (reason !== "clickaway") {
            closeToast();
          }
        }}
        anchorOrigin={positionCoords}
        sx={{
          mt: { xs: 8, md: 1 },
          mx: { xs: 1, sm: 0 },
          maxWidth: { xs: "calc(100% - 16px)", sm: 420 },
          minWidth: { xs: "calc(100% - 16px)", sm: 320 },
          zIndex: theme.zIndex.snackbar + 100,
        }}
        TransitionComponent={(props) => (
          <Slide {...props} direction={slideDirection} timeout={400} />
        )}
      >
        <StyledAlert
          customVariant={variant}
          severity={severity}
          onClose={hideCloseButton ? undefined : closeToast}
          icon={false}
          action={
            action ||
            (!hideCloseButton && (
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeToast}
                sx={{
                  opacity: 0.8,
                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            ))
          }
        >
          <ToastIconContainer>{getToastIcon(severity)}</ToastIconContainer>
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            {message}
          </Typography>

          {/* Progress Bar */}
          {showProgressBar && open && (
            <ProgressBar duration={duration} severity={severity} />
          )}
        </StyledAlert>
      </Snackbar>

      <div
        id="__next-toast-context"
        style={{ display: "none" }}
        data-testid="toast-context-store"
      >
        {JSON.stringify({
          showSuccess: showSuccessToast,
          showError: showErrorToast,
          showInfo: showInfoToast,
          showWarning: showWarningToast,
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function createStandaloneToast() {
  let showSuccessToast = (message: string, options?: ToastOptions) => {
    console.log("✅ Success:", message);
  };

  let showErrorToast = (message: string, options?: ToastOptions) => {
    console.error("❌ Error:", message);
  };

  let showInfoToast = (message: string, options?: ToastOptions) => {
    console.info("ℹ️ Info:", message);
  };

  let showWarningToast = (message: string, options?: ToastOptions) => {
    console.warn("⚠️ Warning:", message);
  };

  if (typeof window !== "undefined") {
    try {
      const toastContextElement = document.getElementById(
        "__next-toast-context"
      );
      if (toastContextElement) {
        const contextData = JSON.parse(toastContextElement.textContent || "{}");
        if (contextData.showSuccess) showSuccessToast = contextData.showSuccess;
        if (contextData.showError) showErrorToast = contextData.showError;
        if (contextData.showInfo) showInfoToast = contextData.showInfo;
        if (contextData.showWarning) showWarningToast = contextData.showWarning;
      }
    } catch (error) {
      console.error("Failed to get toast context", error);
    }
  }

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    showToast: (
      message: string,
      severity: ToastSeverity,
      options?: ToastOptions
    ) => {
      switch (severity) {
        case "success":
          return showSuccessToast(message, options);
        case "error":
          return showErrorToast(message, options);
        case "warning":
          return showWarningToast(message, options);
        case "info":
        default:
          return showInfoToast(message, options);
      }
    },
    closeToast: () => {},
  };
}
