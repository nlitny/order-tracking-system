// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Types
interface UserWithAuth {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  refreshTokenExpires: number;
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
      role: string;
      isActive: boolean;
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
  const unit = timeString.slice(-1);
  const value = parseInt(timeString.slice(0, -1));

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return Math.floor((currentTime + value * (multipliers[unit] || 1000)) / 1000);
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
          // ساخت داده برای ارسال
          const requestData: any = {
            email: credentials.email,
            password: credentials.password,
          };

          // اضافه کردن فیلدهای ثبت‌نام در صورت وجود
          if (credentials.firstName) {
            requestData.first_name = credentials.firstName;
            requestData.last_name = credentials.lastName;
            // rePassword را برای validation اضافه می‌کنیم
            if (credentials.rePassword) {
              requestData.re_password = credentials.rePassword;
            }
          }

          const { data } = await axios.post<AuthSuccessResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/authlogin`,
            requestData
          );

          if (!data.success || !data.data) {
            throw new Error(data.message || "Authentication failed");
          }

          // بررسی اینکه پاسخ نهایی باشد (نه pending)
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
          console.error("Authentication error:", error);

          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.message ||
              error.response?.data?.error ||
              "Authentication failed";
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
    async jwt({ token, user, trigger, session }) {
      // Initial login
      if (user) {
        const authUser = user as UserWithAuth;

        return {
          ...token,
          id: authUser.id,
          email: authUser.email,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          role: authUser.role,
          isActive: authUser.isActive,
          accessToken: authUser.accessToken,
          refreshToken: authUser.refreshToken,
          accessTokenExpires: authUser.accessTokenExpires,
          refreshTokenExpires: authUser.refreshTokenExpires,
        };
      }

      // Update logic
      if (trigger === "update" && session) {
        if (session.role) token.role = session.role;
        if (session.firstName) token.firstName = session.firstName;
        if (session.lastName) token.lastName = session.lastName;
        if (session.isActive !== undefined) token.isActive = session.isActive;
      }

      const currentTime = Math.floor(Date.now() / 1000);

      // Refresh token expiry check
      if (
        token.refreshTokenExpires &&
        currentTime >= Number(token.refreshTokenExpires)
      ) {
        console.log("Refresh token expired, forcing logout");
        return { ...token, error: "RefreshTokenExpired" };
      }

      // Access token still valid
      if (
        token.accessTokenExpires &&
        currentTime < Number(token.accessTokenExpires)
      ) {
        return token;
      }

      // Refresh access token
      try {
        console.log("Refreshing access token...");

        const { data } = await axios.post<RefreshTokenResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken: token.refreshToken }
        );

        if (!data.success || !data.data) {
          throw new Error(data.message || "Token refresh failed");
        }

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
        console.error("Token refresh failed:", error);

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
          role: token.role as string,
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
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  debug: process.env.NODE_ENV === "development",
};
