export interface AuthFormData {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  re_password?: string;
}

export interface AuthResponse {
  status: "login" | "register" | "success";
  message: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
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

export type AuthStep = "email" | "login" | "register";
