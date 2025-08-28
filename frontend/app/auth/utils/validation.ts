import {
  AuthFormData,
  ValidationErrors,
  PasswordStrength,
  AuthStep,
} from "./types";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const calculatePasswordStrength = (
  password: string
): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score += 20;
  else suggestions.push("Use at least 8 characters");

  if (/[a-z]/.test(password)) score += 20;
  else suggestions.push("Add lowercase letters");

  if (/[A-Z]/.test(password)) score += 20;
  else suggestions.push("Add uppercase letters");

  if (/[0-9]/.test(password)) score += 20;
  else suggestions.push("Add numbers");

  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  else suggestions.push("Add special characters");

  let label = "Very Weak";
  let color = "#f44336";

  if (score >= 80) {
    label = "Very Strong";
    color = "#4caf50";
  } else if (score >= 60) {
    label = "Strong";
    color = "#8bc34a";
  } else if (score >= 40) {
    label = "Fair";
    color = "#ff9800";
  } else if (score >= 20) {
    label = "Weak";
    color = "#ff5722";
  }

  return { score, label, color, suggestions };
};

export const validateForm = (
  formData: AuthFormData,
  step: AuthStep
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.email) {
    errors.email = "Email address is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (step === "login") {
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  }

  if (step === "register") {
    if (!formData.first_name?.trim()) {
      errors.first_name = "First name is required";
    } else if (formData.first_name.trim().length < 2) {
      errors.first_name = "First name must be at least 2 characters";
    }

    if (!formData.last_name?.trim()) {
      errors.last_name = "Last name is required";
    } else if (formData.last_name.trim().length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.re_password) {
      errors.re_password = "Please confirm your password";
    } else if (formData.password !== formData.re_password) {
      errors.re_password = "Passwords do not match";
    }
  }

  return errors;
};
