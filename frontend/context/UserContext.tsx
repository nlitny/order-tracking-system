// contexts/UserContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios/csrAxios";

// Types based on the new API response
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Optional fields that might be added later
  avatar?: string;
  profilePicture?: string;
  isTwoStepEnabled?: boolean;
  stripeAccountId?: string | null;
  stripeAccountEnabled?: boolean;
  stripeAccountStatus?: string | null;
  likedProjects?: string[];
  savedProjects?: string[];
}

// API Response type
interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
  };
}

// User Context States
enum UserState {
  IDLE = "idle",
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
  ERROR = "error",
  SESSION_LOADING = "session_loading",
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  isError: boolean;
  error: any;
  state: UserState;
  fetchUser: () => Promise<void>;
  updateUser: (userData: UserData) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
  isSessionReady: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Configuration
const CONFIG = {
  MAX_RETRY_ATTEMPTS: 5,
  INITIAL_RETRY_DELAY: 500, // ms
  MAX_RETRY_DELAY: 5000, // ms
  SESSION_SETTLE_TIME: 300, // ms - زمان انتظار برای تسویه session
} as const;

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();

  // States
  const [user, setUser] = useState<UserData | null>(null);
  const [state, setState] = useState<UserState>(UserState.IDLE);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);

  // Refs for tracking
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSessionStateRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Computed values
  const loading =
    state === UserState.LOADING || state === UserState.SESSION_LOADING;
  const isAuthenticated = state === UserState.AUTHENTICATED && !!user;
  const isSessionReady = status !== "loading";

  // Cancel any pending operations
  const cancelPendingOperations = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
  }, []);

  // Calculate retry delay with exponential backoff
  const calculateRetryDelay = (attempt: number): number => {
    const delay = CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
    return Math.min(delay, CONFIG.MAX_RETRY_DELAY);
  };

  // Sleep utility
  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Check if error is retryable
  const isRetryableError = (error: any): boolean => {
    if (!error.response) return true; // Network errors are retryable

    const status = error.response.status;
    // Retry on 401 (might be session timing), 5xx errors, and 429 (rate limit)
    return status === 401 || status === 429 || (status >= 500 && status < 600);
  };

  // Enhanced fetch user with proper error handling and retry logic
  const fetchUser = useCallback(
    async (
      isRetry: boolean = false,
      retryAttempt: number = 1
    ): Promise<void> => {
      // Cancel any existing request
      cancelPendingOperations();

      // Don't fetch if session is not authenticated or no access token
      if (status !== "authenticated" || !session?.user?.accessToken) {
        return;
      }

      // Set loading state
      if (!isRetry) {
        setState(UserState.LOADING);
        setIsError(false);
        setError(null);
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        // Use the new profile endpoint
        const response = await axiosInstance.get<ProfileApiResponse>(
          "/auth/profile",
          {
            signal: abortControllerRef.current.signal,
            timeout: 10000, // 10 second timeout
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        // Check if API response is successful
        if (!response.data.success || !response.data.data?.user) {
          throw new Error(
            response.data.message || "Failed to fetch user profile"
          );
        }

        const userData = response.data.data.user;

        // Process profile picture URL if exists
        if (userData.profilePicture) {
          userData.profilePicture = userData.profilePicture.replace(
            "/api/users",
            ""
          );
        }

        // Map any additional fields from session if needed
        const enhancedUserData: UserData = {
          ...userData,
          // Add any session-based fields if needed
          ...(session.user.firstName && { firstName: session.user.firstName }),
          ...(session.user.lastName && { lastName: session.user.lastName }),
        };

        setUser(enhancedUserData);
        setState(UserState.AUTHENTICATED);
        setIsError(false);
        setError(null);

        console.log("✅ User profile fetched successfully:", enhancedUserData);
      } catch (err: any) {
        console.error("❌ Error fetching user profile:", err);

        // Handle abort
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
          return;
        }

        // Handle API error responses
        if (err.response?.data) {
          const apiError = err.response.data;
          console.error("API Error:", apiError.message || apiError);
        }

        // Check if we should retry
        const shouldRetry =
          retryAttempt < CONFIG.MAX_RETRY_ATTEMPTS && isRetryableError(err);

        if (shouldRetry) {
          console.log(
            `🔄 Retrying user fetch (attempt ${retryAttempt + 1}/${
              CONFIG.MAX_RETRY_ATTEMPTS
            })`
          );
          const delay = calculateRetryDelay(retryAttempt);

          fetchTimeoutRef.current = setTimeout(() => {
            fetchUser(true, retryAttempt + 1);
          }, delay);
        } else {
          // Final failure
          console.error(
            `💥 Failed to fetch user after ${retryAttempt} attempts`
          );
          setIsError(true);
          setError(err);
          setUser(null);
          setState(UserState.ERROR);
        }
      }
    },
    [status, session?.user?.accessToken, cancelPendingOperations]
  );

  // Update user data
  const updateUser = useCallback(
    (userData: UserData) => {
      console.log("🔄 Updating user data:", userData);
      setUser(userData);
      if (state !== UserState.AUTHENTICATED) {
        setState(UserState.AUTHENTICATED);
      }
    },
    [state]
  );

  // Clear user data
  const clearUser = useCallback(() => {
    console.log("🧹 Clearing user data");
    cancelPendingOperations();
    setUser(null);
    setState(UserState.UNAUTHENTICATED);
    setIsError(false);
    setError(null);
  }, [cancelPendingOperations]);

  // Handle session changes with proper timing
  useEffect(() => {
    const handleSessionChange = async () => {
      const currentSessionState = `${status}-${
        session?.user?.email || "none"
      }-${session?.user?.accessToken ? "token" : "no-token"}`;

      // Skip if session state hasn't actually changed
      if (
        currentSessionState === lastSessionStateRef.current &&
        isInitializedRef.current
      ) {
        return;
      }

      console.log("🔄 Session state changed:", {
        status,
        hasSession: !!session,
        hasToken: !!session?.user?.accessToken,
        userEmail: session?.user?.email,
      });

      lastSessionStateRef.current = currentSessionState;

      switch (status) {
        case "loading":
          if (!isInitializedRef.current) {
            console.log("⏳ Session loading...");
            setState(UserState.SESSION_LOADING);
          }
          break;

        case "authenticated":
          // Check if we have necessary session data
          if (!session?.user?.accessToken) {
            console.warn("⚠️ Session authenticated but no access token found");
            clearUser();
            break;
          }

          console.log("✅ Session authenticated, fetching user profile...");
          // Add a small delay to ensure session is fully settled
          setState(UserState.LOADING);

          // Wait a bit for session to fully settle, especially after login
          await sleep(CONFIG.SESSION_SETTLE_TIME);

          // Double-check we're still authenticated after the delay
          if (status === "authenticated" && session?.user?.accessToken) {
            await fetchUser();
          }
          break;

        case "unauthenticated":
          console.log("❌ Session unauthenticated, clearing user");
          clearUser();
          break;

        default:
          console.log("🔄 Session state idle");
          setState(UserState.IDLE);
      }

      isInitializedRef.current = true;
    };

    handleSessionChange();
  }, [
    status,
    session?.user?.email,
    session?.user?.accessToken,
    fetchUser,
    clearUser,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 UserProvider unmounting, cleaning up");
      cancelPendingOperations();
    };
  }, [cancelPendingOperations]);

  // Context value
  const contextValue: UserContextType = {
    user,
    loading,
    isError,
    error,
    state,
    fetchUser: () => fetchUser(),
    updateUser,
    clearUser,
    isAuthenticated,
    isSessionReady,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Enhanced useUser hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Enhanced useUserData hook with more utilities
export const useUserData = () => {
  const { user, loading, isError, state, isAuthenticated, isSessionReady } =
    useUser();

  return {
    user,
    loading,
    isError,
    isAuthenticated,
    isSessionReady,
    state,
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    initials: user
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
      : "",
    // Role-based utilities
    hasRole: (role: string) => user?.role === role || false,
    hasAnyRole: (roles: string[]) => roles.includes(user?.role || "") || false,
    isCustomer: user?.role === "CUSTOMER",
    isAdmin: user?.role === "ADMIN",
    isVendor: user?.role === "VENDOR",
    // Profile completeness
    isProfileComplete: user
      ? !!(user.firstName && user.lastName && user.email)
      : false,
    // Activity status
    isActiveUser: user?.isActive === true,
  };
};

// Hook for handling authentication state in components
export const useAuthState = () => {
  const { state, loading, isAuthenticated, isSessionReady } = useUser();

  return {
    state,
    loading,
    isAuthenticated,
    isSessionReady,
    isInitializing:
      state === UserState.SESSION_LOADING ||
      (!isSessionReady && !isAuthenticated),
    isReady:
      isSessionReady &&
      (isAuthenticated || state === UserState.UNAUTHENTICATED),
    shouldShowLogin: isSessionReady && state === UserState.UNAUTHENTICATED,
    shouldWaitForAuth: !isSessionReady || state === UserState.SESSION_LOADING,
  };
};

// Hook for role-based access control
export const useRoleAccess = () => {
  const { user } = useUser();

  return {
    canAccessAdmin: user?.role === "ADMIN",
    canAccessVendor: user?.role === "VENDOR" || user?.role === "ADMIN",
    canAccessCustomer: !!user && user.isActive,
    hasRole: (role: string) => user?.role === role,
    hasAnyRole: (roles: string[]) => roles.includes(user?.role || ""),
    userRole: user?.role || null,
  };
};
