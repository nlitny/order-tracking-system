import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      _id: string;
      email: string;
      roles: string[];
      accessToken: string;
      permission: AdminPermission[];
      refreshToken: string;
    };
    error?: string;
    requiresTwoStep?: boolean;
    message?: string;
    twoStepToken?: string;
  }


  interface User {
    id: string;
    _id: string;
    email: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    permission: AdminPermission[];
    requiresTwoStep?: boolean;
    message?: string;
    twoStepToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    email?: string;
    roles?: string[];
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    permission?: AdminPermission[];
    error?: string;
    requiresTwoStep?: boolean;
    message?: string;
    twoStepToken?: string;
  }
}
