import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isActive: boolean;
      accessToken: string;
      profilePicture?: string | null;
      refreshToken: string;
      phone?: string | null;
    };
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    profilePicture?: string | null;
    refreshTokenExpires: number;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    error?: string;
    phone?: string | null;
    profilePicture?: string | null;
  }
}
