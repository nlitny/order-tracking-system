"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  CircularProgress,
  Box,
  Alert,
  Typography,
  Button,
} from "@mui/material";
import { useUser, useAuthState } from "@/context/UserContext";
import { checkPageAccess } from "@/components/permissions";
import { UserRole } from "@/types/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
  timeout?: number;
  showErrorDetails?: boolean;
  allowUnauthenticated?: boolean;
  usePagePermissions?: boolean;
}

type AuthStatus =
  | "loading"
  | "authorized"
  | "unauthorized"
  | "error"
  | "session_expired"
  | "access_denied";

// Enhanced Type Guard for session validation
function isValidAuthenticatedSession(session: any): boolean {
  try {
    return !!(
      session &&
      session.user &&
      session.user.id &&
      session.user.email &&
      session.user.accessToken &&
      typeof session.user.isActive === "boolean"
    );
  } catch {
    return false;
  }
}

// Custom Hook for Authentication Logic Management
function useAuthProtection(
  requiredRoles?: UserRole[],
  fallbackPath = "/auth",
  timeout = 15000,
  allowUnauthenticated = false,
  usePagePermissions = true
) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    loading: userLoading,
    isError: userError,
    state: userState,
    isAuthenticated,
    isSessionReady,
  } = useUser();
  const { isInitializing, isReady, shouldShowLogin } = useAuthState();

  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Memoized redirect function with better error handling
  const redirectWithError = useCallback(
    (path: string, errorType?: string, customMessage?: string) => {
      try {
        const url = new URL(path, window.location.origin);

        // Only add callback URL for login pages
        if (path.includes("/auth") || path.includes("/login")) {
          url.searchParams.set("callbackUrl", pathname);
        }

        if (errorType) {
          url.searchParams.set("error", errorType);
        }
        if (customMessage) {
          url.searchParams.set("message", encodeURIComponent(customMessage));
        }

        router.replace(url.toString());
      } catch (err) {
        // Fallback redirect without query params
        router.replace(path);
      }
    },
    [pathname, router]
  );

  // Timeout management
  useEffect(() => {
    if (timeout <= 0) return;

    const timeoutId = setTimeout(() => {
      if (!isReady && !allowUnauthenticated) {
        setTimeoutReached(true);
        setError("Authentication timeout. Please try again.");
        setAuthStatus("error");
      }
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [timeout, isReady, allowUnauthenticated]);

  // Main authentication logic
  useEffect(() => {
    let isMounted = true;

    const handleAuthState = async () => {
      if (!isMounted) return;

      try {
        setError(null);

        // Handle loading states
        if (!isSessionReady || isInitializing || userLoading) {
          setAuthStatus("loading");
          setLocalLoading(true);
          return;
        }

        // Handle timeout
        if (timeoutReached) {
          setAuthStatus("error");
          setLocalLoading(false);
          return;
        }

        // Handle unauthenticated state
        if (status === "unauthenticated" || shouldShowLogin) {
          if (allowUnauthenticated) {
            setAuthStatus("authorized");
            setLocalLoading(false);
            return;
          }

          setAuthStatus("unauthorized");
          setLocalLoading(false);
          redirectWithError(
            fallbackPath,
            "unauthenticated",
            "Please sign in to access this page"
          );
          return;
        }

        // Handle authenticated state
        if (status === "authenticated") {
          // Check session validity
          if (!isValidAuthenticatedSession(session)) {
            await signOut({ redirect: false });
            setAuthStatus("session_expired");
            redirectWithError(
              fallbackPath,
              "invalid_session",
              "Invalid session. Please sign in again."
            );
            return;
          }

          // Handle session errors (like token expiration)
          if (session?.error) {
            let errorMessage = "Authentication error occurred";
            let errorType = "auth_error";

            if (
              session.error.includes("RefreshToken") ||
              session.error.includes("AccessToken")
            ) {
              errorMessage = "Your session has expired. Please sign in again.";
              errorType = "session_expired";
            }

            await signOut({ redirect: false });
            setAuthStatus("session_expired");
            redirectWithError(fallbackPath, errorType, errorMessage);
            return;
          }

          // Check if user is active
          if (session.user.isActive === false) {
            setAuthStatus("unauthorized");
            redirectWithError(
              "/account-inactive",
              "account_inactive",
              "Your account is currently inactive"
            );
            return;
          }

          // Wait for user context to load if we have session but no user data yet
          if (!user && !userError) {
            setAuthStatus("loading");
            setLocalLoading(true);
            return;
          }

          // Handle user context errors
          if (userError) {
            setError("Failed to load user profile");
            setAuthStatus("error");
            setLocalLoading(false);
            return;
          }

          // Get user role
          const userRole = user?.role || session.user.role;
          if (usePagePermissions) {
            const hasPageAccess = checkPageAccess(pathname, [
              userRole as UserRole,
            ]);

            if (!hasPageAccess) {
              setAuthStatus("access_denied");
              setLocalLoading(false);
              if (userRole === "ADMIN") {
                router.replace("/dashboard/admin");
              } else if (userRole === "STAFF") {
                router.replace("/dashboard/staff");
              } else if (userRole === "CUSTOMER") {
                router.replace("/dashboard");
              } else {
                router.replace("/unauthorized");
              }
              return;
            }
          } else if (requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.includes(
              userRole as UserRole
            );

            if (!hasRequiredRole) {
              setAuthStatus("access_denied");
              setLocalLoading(false);
              router.replace("/unauthorized");
              return;
            }
          }

          setAuthStatus("authorized");
          setLocalLoading(false);
          return;
        }

        // Handle unexpected states
        setError("Unexpected authentication state");
        setAuthStatus("error");
        setLocalLoading(false);
      } catch (err) {
        if (isMounted) {
          setError("Authentication verification failed");
          setAuthStatus("error");
          setLocalLoading(false);
        }
      }
    };

    handleAuthState();

    return () => {
      isMounted = false;
    };
  }, [
    status,
    session,
    user,
    userState,
    isSessionReady,
    isAuthenticated,
    userLoading,
    userError,
    requiredRoles,
    fallbackPath,
    redirectWithError,
    router,
    allowUnauthenticated,
    timeoutReached,
    shouldShowLogin,
    isInitializing,
    usePagePermissions,
    pathname,
  ]);

  // Calculate loading state
  const isLoading = useMemo(() => {
    return (
      localLoading ||
      status === "loading" ||
      isInitializing ||
      userLoading ||
      authStatus === "loading"
    );
  }, [localLoading, status, isInitializing, userLoading, authStatus]);

  return {
    isLoading,
    error,
    authStatus,
    session,
    user,
    timeoutReached,
  };
}

// Enhanced Loading Component
const LoadingSpinner = ({ message = "Verifying authentication..." }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "background.default",
      gap: 3,
      p: 4,
    }}
  >
    <CircularProgress
      size={60}
      thickness={4}
      sx={{
        color: "primary.main",
      }}
    />
    <Typography
      variant="h6"
      color="text.secondary"
      textAlign="center"
      sx={{ maxWidth: 300 }}
    >
      {message}
    </Typography>
    <Typography variant="body2" color="text.disabled" textAlign="center">
      Please wait while we verify your credentials...
    </Typography>
  </Box>
);

// Enhanced Error Component
interface ErrorDisplayProps {
  error: string;
  showDetails?: boolean;
  onRetry?: () => void;
  authStatus?: AuthStatus;
}

const ErrorDisplay = ({
  error,
  showDetails = false,
  onRetry,
  authStatus,
}: ErrorDisplayProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "background.default",
      p: 4,
      gap: 3,
    }}
  >
    <Alert
      severity={
        authStatus === "session_expired"
          ? "warning"
          : authStatus === "access_denied"
          ? "info"
          : "error"
      }
      sx={{
        maxWidth: 600,
        width: "100%",
        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
      action={
        onRetry && (
          <Button
            color="inherit"
            size="small"
            onClick={onRetry}
            variant="outlined"
          >
            Retry
          </Button>
        )
      }
    >
      <Typography variant="body1" gutterBottom>
        {error}
      </Typography>
      {showDetails && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {authStatus === "session_expired"
              ? "Your session has expired. Please sign in again to continue."
              : authStatus === "access_denied"
              ? "You don't have permission to access this page."
              : "If this problem persists, please try refreshing the page or contact support."}
          </Typography>
          {authStatus === "session_expired" && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                href="/auth"
                size="small"
              >
                Sign In Again
              </Button>
            </Box>
          )}
        </>
      )}
    </Alert>
  </Box>
);

// Main Protected Route Component
export default function ProtectedRoute({
  children,
  requiredRoles,
  fallbackPath = "/auth",
  timeout = 15000,
  showErrorDetails = true,
  allowUnauthenticated = false,
  usePagePermissions = true,
}: ProtectedRouteProps) {
  const { isLoading, error, authStatus, timeoutReached } = useAuthProtection(
    requiredRoles,
    fallbackPath,
    timeout,
    allowUnauthenticated,
    usePagePermissions
  );

  // Retry function for error state
  const handleRetry = useCallback(() => {
    if (timeoutReached) {
      // For timeout errors, reload the page
      window.location.reload();
    } else {
      // For other errors, redirect to login
      window.location.href = fallbackPath;
    }
  }, [timeoutReached, fallbackPath]);

  // Render based on auth status
  switch (authStatus) {
    case "loading":
      return (
        <LoadingSpinner
          message={
            timeoutReached
              ? "Authentication is taking longer than usual..."
              : "Verifying authentication..."
          }
        />
      );

    case "error":
    case "session_expired":
    case "access_denied":
      return (
        <ErrorDisplay
          error={
            authStatus === "access_denied"
              ? "Access Denied - You don't have permission to view this page"
              : error || "Authentication error occurred"
          }
          showDetails={showErrorDetails}
          onRetry={authStatus !== "access_denied" ? handleRetry : undefined}
          authStatus={authStatus}
        />
      );

    case "authorized":
      return <>{children}</>;

    case "unauthorized":
    default:
      // Show loading while redirecting to prevent flash
      return <LoadingSpinner message="Redirecting..." />;
  }
}

// Enhanced convenience wrapper components
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute usePagePermissions={true} requiredRoles={["ADMIN"]}>
    {children}
  </ProtectedRoute>
);

export const VendorRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute usePagePermissions={true} requiredRoles={["STAFF"]}>
    {children}
  </ProtectedRoute>
);

export const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute usePagePermissions={true} requiredRoles={["CUSTOMER"]}>
    {children}
  </ProtectedRoute>
);

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowUnauthenticated={true}>{children}</ProtectedRoute>;
