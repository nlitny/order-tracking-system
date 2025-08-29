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
import { UserRole } from "@/types/types";

// Essential User Data Types - فقط اطلاعات ضروری
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
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
  REFRESHING = "refreshing",
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  isError: boolean;
  error: any;
  state: UserState;
  fetchUser: () => Promise<void>;
  updateUser: (userData: UserData) => void;
  updateUserSession: () => Promise<void>;
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
  AUTO_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 دقیقه
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  SESSION_SETTLE_TIME: 500,
} as const;

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: session, status, update: updateSession } = useSession();

  // States
  const [user, setUser] = useState<UserData | null>(null);
  const [state, setState] = useState<UserState>(UserState.IDLE);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);

  // Refs for preventing loops and managing operations
  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const isFetchingRef = useRef(false); // 🔴 جلوگیری از multiple fetch
  const lastFetchTimeRef = useRef<number>(0); // 🔴 جلوگیری از درخواست های مکرر
  const retryCountRef = useRef<number>(0);

  // Computed values
  const loading = state === UserState.LOADING || state === UserState.REFRESHING;
  const isAuthenticated = state === UserState.AUTHENTICATED && !!user;
  const isSessionReady = status !== "loading";

  // Cancel operations
  const cancelOperations = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    isFetchingRef.current = false;
  }, []);

  // Extract essential user data from API response
  const extractEssentialUserData = useCallback((userData: any): UserData => {
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName || userData.first_name,
      lastName: userData.lastName || userData.last_name,
      phone: userData.phone,
      role: userData.role,
      isActive: userData.isActive,
      profilePicture: userData.profilePicture || userData.profilePicture,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  }, []);

  // 🔴 اصلاح شده - جلوگیری از infinite loop
  const fetchUser = useCallback(
    async (force: boolean = false): Promise<void> => {
      // جلوگیری از درخواست مکرر
      if (isFetchingRef.current && !force) {
        console.log("🚫 Fetch already in progress, skipping...");
        return;
      }

      // جلوگیری از درخواست های خیلی نزدیک به هم (حداقل 1 ثانیه فاصله)
      const now = Date.now();
      if (!force && now - lastFetchTimeRef.current < 1000) {
        console.log("🚫 Too frequent fetch request, skipping...");
        return;
      }

      if (status !== "authenticated" || !session?.user?.accessToken) {
        console.log("🚫 Not authenticated or no access token");
        return;
      }

      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      setState(UserState.LOADING);
      setIsError(false);
      setError(null);

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        console.log("🔄 Fetching user profile...");

        const response = await axiosInstance.get<ProfileApiResponse>(
          "/auth/profile",
          {
            signal: abortControllerRef.current.signal,
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (!response.data.success || !response.data.data?.user) {
          throw new Error("Invalid API response");
        }

        const userData = extractEssentialUserData(response.data.data.user);

        setUser(userData);
        setState(UserState.AUTHENTICATED);
        setIsError(false);
        setError(null);
        retryCountRef.current = 0; // Reset retry count on success

        console.log("✅ User profile fetched successfully:", userData);
      } catch (err: any) {
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
          console.log("🚫 Request was canceled");
          return;
        }

        console.error("❌ Error fetching user:", err);

        // Handle different error types
        const status = err.response?.status;

        if (status === 401) {
          // Unauthorized - clear user and session
          console.error("🚫 Unauthorized access - clearing user data");
          setUser(null);
          setState(UserState.UNAUTHENTICATED);
          clearInterval(refreshIntervalRef.current!);
        } else if (status === 403) {
          // Forbidden - don't retry, but keep current user data
          console.error("🚫 Forbidden access - keeping current user data");
          setIsError(true);
          setError(err);
          // Don't change state if we have user data
          if (!user) {
            setState(UserState.ERROR);
          }
        } else if (status >= 500 || !status) {
          // Server errors or network errors - retry with exponential backoff
          retryCountRef.current++;

          if (retryCountRef.current <= CONFIG.MAX_RETRY_ATTEMPTS) {
            const delay =
              CONFIG.RETRY_DELAY * Math.pow(2, retryCountRef.current - 1);
            console.log(
              `🔄 Retrying in ${delay}ms (attempt ${retryCountRef.current}/${CONFIG.MAX_RETRY_ATTEMPTS})`
            );

            setTimeout(() => {
              fetchUser(true);
            }, delay);
            return;
          } else {
            console.error("❌ Max retry attempts reached");
          }
        }

        setIsError(true);
        setError(err);

        // Only set error state if we don't have user data
        if (!user) {
          setState(UserState.ERROR);
        }
      } finally {
        isFetchingRef.current = false;
      }
    },
    [status, session?.user?.accessToken, extractEssentialUserData, user]
  );

  // 🔴 اصلاح شده - حذف recursive call
  const updateUserSession = useCallback(async (): Promise<void> => {
    if (!session?.user || !user) {
      console.warn("No session or user data to update");
      return;
    }

    try {
      console.log("🔄 Updating session...");

      await updateSession({
        ...session,
        user: {
          ...session.user,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          profilePicture: user.profilePicture,
          phone: user.phone,
        },
      });

      console.log("✅ Session updated successfully");
    } catch (error) {
      console.error("❌ Failed to update session:", error);
    }
  }, [session, user, updateSession]);

  // 🔴 اصلاح شده - حذف recursive call
  const updateUser = useCallback(
    (userData: UserData) => {
      console.log("🔄 Updating user data:", userData);
      setUser(userData);

      if (state !== UserState.AUTHENTICATED) {
        setState(UserState.AUTHENTICATED);
      }

      // فقط session را آپدیت کن بدون dependency loop
      updateUserSession().catch(console.error);
    },
    [state, updateUserSession]
  );

  // Clear user data
  const clearUser = useCallback(() => {
    console.log("🧹 Clearing user data");
    cancelOperations();
    setUser(null);
    setState(UserState.UNAUTHENTICATED);
    setIsError(false);
    setError(null);
    retryCountRef.current = 0;
  }, [cancelOperations]);

  // 🔴 اصلاح شده - Auto refresh بدون loop
  const startAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    refreshIntervalRef.current = setInterval(async () => {
      if (
        status === "authenticated" &&
        session?.user?.accessToken &&
        state === UserState.AUTHENTICATED &&
        !isFetchingRef.current // فقط اگر درحال fetch نباشیم
      ) {
        console.log("🔄 Auto-refreshing user data...");

        try {
          const response = await axiosInstance.get<ProfileApiResponse>(
            "/auth/profile",
            {
              timeout: 5000, // کاهش timeout برای auto-refresh
              headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
              },
            }
          );

          if (response.data.success && response.data.data?.user) {
            const newUserData = extractEssentialUserData(
              response.data.data.user
            );

            // فقط در صورت تغییر واقعی داده‌ها آپدیت کن
            const hasChanges =
              JSON.stringify(user) !== JSON.stringify(newUserData);

            if (hasChanges) {
              console.log("📱 User data changed, updating...");
              setUser(newUserData);
            } else {
              console.log("✅ User data is up to date");
            }
          }
        } catch (error: any) {
          const status = error.response?.status;
          if (status === 401) {
            // Token expired, clear user
            console.error("🚫 Token expired during auto-refresh");
            clearUser();
          } else {
            console.error("❌ Auto-refresh failed:", error.message);
          }
        }
      }
    }, CONFIG.AUTO_REFRESH_INTERVAL);

    console.log("⏰ Auto-refresh started (every 5 minutes)");
  }, [
    status,
    session?.user?.accessToken,
    state,
    user,
    extractEssentialUserData,
    clearUser,
  ]);

  const stopAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      console.log("⏹️ Auto-refresh stopped");
    }
  }, []);

  // 🔴 اصلاح شده - Handle session changes بدون infinite loop
  useEffect(() => {
    const handleSessionChange = async () => {
      console.log("🔄 Session status changed:", status);

      switch (status) {
        case "loading":
          if (!isInitializedRef.current) {
            setState(UserState.LOADING);
          }
          break;

        case "authenticated":
          if (!session?.user?.accessToken) {
            console.warn("⚠️ No access token in session");
            clearUser();
            stopAutoRefresh();
            break;
          }

          // فقط در صورت عدم وجود user یا عدم initialization
          if (!isInitializedRef.current || (!user && !isFetchingRef.current)) {
            console.log("✅ Authenticated, fetching user profile...");
            await fetchUser();
            startAutoRefresh();
            isInitializedRef.current = true;
          } else if (user && !refreshIntervalRef.current) {
            // اگر user موجود است اما auto-refresh فعال نیست
            startAutoRefresh();
          }
          break;

        case "unauthenticated":
          console.log("❌ Unauthenticated");
          clearUser();
          stopAutoRefresh();
          isInitializedRef.current = false;
          break;
      }
    };

    handleSessionChange();
  }, [
    status,
    session?.user?.accessToken,
    // 🔴 حذف user از dependency ها تا از infinite loop جلوگیری شود
    // user,
    fetchUser,
    clearUser,
    startAutoRefresh,
    stopAutoRefresh,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 UserProvider unmounting");
      cancelOperations();
    };
  }, [cancelOperations]);

  const contextValue: UserContextType = {
    user,
    loading,
    isError,
    error,
    state,
    fetchUser: () => fetchUser(false),
    updateUser,
    updateUserSession,
    clearUser,
    isAuthenticated,
    isSessionReady,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// useUser hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Enhanced utility hooks (بدون تغییر)
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
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() : "",
    initials: user
      ? `${user.firstName?.charAt(0) || ""}${
          user.lastName?.charAt(0) || ""
        }`.toUpperCase()
      : "",
    hasRole: (role: string) => user?.role === role,
    hasAnyRole: (roles: string[]) => roles.includes(user?.role || ""),
    isActiveUser: user?.isActive === true,
    hasProfileImage: !!user?.profilePicture,
    profileImageUrl: user?.profilePicture || null,
  };
};

// Auth state hook (بدون تغییر)
export const useAuthState = () => {
  const { state, loading, isAuthenticated, isSessionReady } = useUser();

  return {
    state,
    loading,
    isAuthenticated,
    isSessionReady,
    isInitializing: state === UserState.LOADING,
    isReady:
      isSessionReady &&
      (isAuthenticated || state === UserState.UNAUTHENTICATED),
    shouldShowLogin: isSessionReady && state === UserState.UNAUTHENTICATED,
    shouldWaitForAuth: !isSessionReady || state === UserState.LOADING,
  };
};
