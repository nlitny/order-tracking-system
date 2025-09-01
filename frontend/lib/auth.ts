import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { UserRole } from "@/types/types";

function getApiUrl(): string {
  if (typeof window === "undefined") {
    if (process.env.INTERNAL_API_URL) {
      return process.env.INTERNAL_API_URL;
    }
    return "http://backend:5000";
  }

  return process.env.NEXT_PUBLIC_API_BASEURL || "http://localhost:5000";
}

interface UserWithAuth {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  profilePicture?: string;
  refreshTokenExpires: number;
  phone?: string;
}

interface AuthSuccessResponse {
  success: true;
  message: string;
  data: {
    status: "register" | "login";
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role: UserRole;
      isActive: boolean;
      profilePicture?: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresIn: string;
      refreshTokenExpiresIn: string;
    };
  };
}

interface RefreshTokenResponse {
  success: true;
  message: string;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresIn: string;
      refreshTokenExpiresIn: string;
    };
  };
}

function parseExpirationTime(timeString: string): number {
  const currentTime = Date.now();

  const match = timeString.match(/^(\d+)([smhd])$/);

  if (!match) {
    console.warn(
      `[NextAuth] Invalid time format: ${timeString}, using default 1 hour`
    );
    return Math.floor((currentTime + 60 * 60 * 1000) / 1000);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const expireTimeMs = currentTime + value * multipliers[unit];

  return Math.floor(expireTimeMs / 1000);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "auth-completion",
      name: "Auth Completion",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        rePassword: { label: "Confirm Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const requestData: any = {
            email: credentials.email,
            password: credentials.password,
          };

          if (credentials.firstName) {
            requestData.firstName = credentials.firstName;
            requestData.lastName = credentials.lastName;
            if (credentials.rePassword) {
              requestData.rePassword = credentials.rePassword;
            }
          }

          const apiUrl = getApiUrl();
          console.log(`[NextAuth] Making request to: ${apiUrl}`);

          const { data } = await axios.post<AuthSuccessResponse>(
            `${apiUrl}/api/v1/auth/authlogin`,
            requestData,
            {
              timeout: 15000,
            }
          );

          if (!data.success || !data.data) {
            throw new Error(data.message || "Authentication failed");
          }

          if (data.data.status !== "login" && data.data.status !== "register") {
            throw new Error("Invalid response status");
          }

          const { user, tokens } = data.data;

          if (
            !user.id ||
            !user.email ||
            !tokens.accessToken ||
            !tokens.refreshToken
          ) {
            throw new Error("Invalid response data");
          }

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            profilePicture: user.profilePicture,
            phone: user.phone,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            accessTokenExpires: parseExpirationTime(
              tokens.accessTokenExpiresIn
            ),
            refreshTokenExpires: parseExpirationTime(
              tokens.refreshTokenExpiresIn
            ),
          } as UserWithAuth;
        } catch (error) {
          console.error("[NextAuth] Authorize error:", error);

          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.message ||
              error.response?.data?.error ||
              `Network error: ${error.message}`;
            throw new Error(errorMessage);
          }

          if (error instanceof Error) {
            throw error;
          }

          throw new Error("An unexpected error occurred");
        }
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log(`[NextAuth] Redirect: ${url} -> baseUrl: ${baseUrl}`);
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        const authUser = user as UserWithAuth;

        return {
          ...token,
          id: authUser.id,
          email: authUser.email,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          role: authUser.role,
          phone: authUser.phone || null,
          profilePicture: authUser.profilePicture || null,
          isActive: authUser.isActive,
          accessToken: authUser.accessToken,
          refreshToken: authUser.refreshToken,
          accessTokenExpires: authUser.accessTokenExpires,
          refreshTokenExpires: authUser.refreshTokenExpires,
        };
      }

      if (trigger === "update" && session) {
        if (session.role) token.role = session.role;
        if (session.firstName) token.firstName = session.firstName;
        if (session.lastName) token.lastName = session.lastName;
        if (session.isActive !== undefined) token.isActive = session.isActive;
      }

      const currentTime = Math.floor(Date.now() / 1000);

      const ACCESS_TOKEN_BUFFER = 5 * 60;
      const REFRESH_TOKEN_BUFFER = 1 * 60;

      if (
        token.refreshTokenExpires &&
        currentTime >= Number(token.refreshTokenExpires) - REFRESH_TOKEN_BUFFER
      ) {
        console.log(
          "[NextAuth] Refresh token expired, user needs to login again"
        );
        return { ...token, error: "RefreshTokenExpired" };
      }

      if (
        token.accessTokenExpires &&
        currentTime < Number(token.accessTokenExpires) - ACCESS_TOKEN_BUFFER
      ) {
        console.log("[NextAuth] Token status:", {
          currentTime: new Date(currentTime * 1000).toISOString(),
          accessExpires: new Date(
            Number(token.accessTokenExpires) * 1000
          ).toISOString(),
          refreshExpires: new Date(
            Number(token.refreshTokenExpires) * 1000
          ).toISOString(),
          timeUntilExpiry: Number(token.accessTokenExpires) - currentTime,
          needsRefresh: false,
        });

        return token;
      }

      try {
        console.log("[NextAuth] Attempting to refresh access token...");
        console.log("[NextAuth] Token refresh needed:", {
          currentTime: new Date(currentTime * 1000).toISOString(),
          accessExpires: new Date(
            Number(token.accessTokenExpires) * 1000
          ).toISOString(),
        });

        const apiUrl = getApiUrl();
        console.log(`[NextAuth] Refresh token request to: ${apiUrl}`);

        const { data } = await axios.post<RefreshTokenResponse>(
          `${apiUrl}/api/v1/auth/refresh-token`,
          {
            refreshToken: token.refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 15000,
          }
        );

        if (!data.success || !data.data) {
          throw new Error(data.message || "Token refresh failed");
        }

        console.log("[NextAuth] Token refreshed successfully");

        return {
          ...token,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
          accessTokenExpires: parseExpirationTime(
            data.data.tokens.accessTokenExpiresIn
          ),
          refreshTokenExpires: parseExpirationTime(
            data.data.tokens.refreshTokenExpiresIn
          ),
        };
      } catch (error) {
        console.error("[NextAuth] Token refresh failed:", error);

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401 || status === 403) {
            return { ...token, error: "InvalidRefreshToken" };
          }
        }

        return { ...token, error: "RefreshTokenError" };
      }
    },

    async session({ session, token }) {
      if (token.error) {
        return { ...session, error: token.error };
      }

      if (token.id && token.email && token.accessToken) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          role: token.role as UserRole,
          profilePicture: token.profilePicture as string,
          phone: token.phone as string,
          isActive: token.isActive as boolean,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
        };
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },

  debug: true,
};
