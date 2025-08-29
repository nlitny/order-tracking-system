export type AuthStep = "email" | "login" | "register";

export interface AuthFormData {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  re_password?: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  re_password?: string;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";
export interface PageAccess {
  path: string;
 allowedRoles: UserRole[];
}