const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),

  firstName: Joi.string().min(2).max(50).optional().messages({
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name cannot exceed 50 characters",
    "string.empty": "First name is required",
  }),

  lastName: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name cannot exceed 50 characters",
    "string.empty": "Last name is required",
  }),

  rePassword: Joi.string().optional().messages({
    "any.only": "Passwords do not match",
  }),

  status: Joi.string().valid("login", "register", "pending").optional(),
})
  .custom((value, helpers) => {
    if (
      value.firstName &&
      value.lastName &&
      value.password &&
      value.rePassword
    ) {
      if (value.password !== value.rePassword) {
        return helpers.error("custom.passwordMismatch");
      }
    }
    return value;
  }, "Registration validation")
  .messages({
    "custom.passwordMismatch": "Passwords do not match",
  });

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional().allow("").messages({
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name cannot exceed 50 characters",
  }),
  lastName: Joi.string().min(2).max(50).optional().allow("").messages({
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name cannot exceed 50 characters",
  }),
  phone: Joi.string()
    .pattern(/^(\+98|0)?9\d{9}$/)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base": "Please provide a valid Iranian phone number",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update",
  });

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.empty": "New password is required",
    "any.required": "New password is required",
  }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
    "string.empty": "Refresh token cannot be empty",
  }),
});

module.exports = {
  authSchema,
  updateProfileSchema,
  changePasswordSchema,
  refreshTokenSchema,
};
