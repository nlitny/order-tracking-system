const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/responses");
const { asyncHandler } = require("../utils/asyncHandler");

const auth = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, rePassword } = req.body;

  const existingUser = await authService.checkEmailExists(email);

  if (!existingUser) {
    if (!firstName || !lastName || !password || !rePassword) {
      return successResponse(
        res,
        "Please register to complete your account setup",
        {
          status: "pending",
          message: "Please provide your registration details",
          required_fields: ["firstName", "lastName", "password", "rePassword"],
        }
      );
    } else {
      if (password !== rePassword) {
        return errorResponse(res, "Passwords do not match", 400);
      }

      const newUser = await authService.createUser({
        email,
        firstName,
        lastName,
        password,
      });

      const tokens = await authService.generateAuthTokens(newUser);

      console.log(
        `New user registered: ${newUser.email} at ${new Date().toISOString()}`
      );

      return successResponse(
        res,
        "Registration completed successfully",
        {
          status: "register",
          user: authService.sanitizeUser(newUser),
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            accessTokenExpiresIn: tokens.accessTokenExpiresIn,
            refreshTokenExpiresIn: tokens.refreshTokenExpiresIn,
          },
        },
        201
      );
    }
  } else {
    if (!existingUser.isActive) {
      return errorResponse(res, "Your account is deactivated", 403);
    }

    if (!password) {
      return successResponse(res, "Please enter your password to continue", {
        status: "login",
        message: "Password required for login",
        required_fields: ["password"],
      });
    } else {
      const isValidPassword = await authService.verifyPassword(
        password,
        existingUser.password
      );

      if (!isValidPassword) {
        return errorResponse(res, "Invalid password", 401);
      }

      const tokens = await authService.generateAuthTokens(existingUser);

      console.log(
        `User ${
          existingUser.email
        } logged in successfully at ${new Date().toISOString()}`
      );

      return successResponse(res, "Login successful", {
        status: "login",
        user: authService.sanitizeUser(existingUser),
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          accessTokenExpiresIn: tokens.accessTokenExpiresIn,
          refreshTokenExpiresIn: tokens.refreshTokenExpiresIn,
        },
      });
    }
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    // حذف refresh token مربوط به این دستگاه
    await authService.revokeUserRefreshTokens(req.user.id, false);

    // اضافه کردن access token به blacklist
    await authService.addToBlacklist(req.token);

    console.log(
      `User ${req.user.email} logged out at ${new Date().toISOString()}`
    );
    return successResponse(res, "Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse(res, "Logout failed", 500);
  }
});

const logoutAll = asyncHandler(async (req, res) => {
  try {
    // حذف همه refresh token های کاربر
    await authService.revokeUserRefreshTokens(req.user.id, true);

    // اضافه کردن access token فعلی به blacklist
    await authService.addToBlacklist(req.token);

    console.log(
      `User ${
        req.user.email
      } logged out from all devices at ${new Date().toISOString()}`
    );
    return successResponse(res, "Logged out from all devices successfully");
  } catch (error) {
    console.error("Logout all error:", error);
    return errorResponse(res, "Logout failed", 500);
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  try {
    // حذف refresh token قدیمی
    await authService.revokeRefreshToken(req.refreshTokenRecord.id);

    // ایجاد توکن‌های جدید
    const tokens = await authService.generateAuthTokens(req.user);

    console.log(
      `Token refreshed for user ${
        req.user.email
      } at ${new Date().toISOString()}`
    );

    return successResponse(res, "Token refreshed successfully", {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiresIn: tokens.accessTokenExpiresIn,
        refreshTokenExpiresIn: tokens.refreshTokenExpiresIn,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return errorResponse(res, "Token refresh failed", 500);
  }
});

const getProfile = asyncHandler(async (req, res) => {
  return successResponse(res, "Profile retrieved successfully", {
    user: authService.sanitizeUser(req.user),
  });
});

const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, "No image file provided", 400);
  }

  const profilePictureData = {
    path: req.file.path,
    public_id: req.file.public_id,
  };

  const updatedUser = await authService.updateProfilePicture(
    req.user.id,
    profilePictureData
  );

  await authService.logUserActivity(req.user.id, "PROFILE_PICTURE_UPDATED", {
    email: req.user.email,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  return successResponse(res, "Profile picture updated successfully", {
    user: authService.sanitizeUser(updatedUser),
  });
});

const removeProfilePicture = asyncHandler(async (req, res) => {
  const updatedUser = await authService.removeProfilePicture(req.user.id);

  await authService.logUserActivity(req.user.id, "PROFILE_PICTURE_REMOVED", {
    email: req.user.email,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  return successResponse(res, "Profile picture removed successfully", {
    user: authService.sanitizeUser(updatedUser),
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, email } = req.body;

  if (!firstName && !lastName && !phone && !email) {
    return errorResponse(res, "At least one field is required to update", 400);
  }

  if (email && email !== req.user.email) {
    const existingUser = await authService.checkEmailExists(email);
    if (existingUser) {
      return errorResponse(res, "Email already exists", 400);
    }
  }

  const updatedUser = await authService.updateUserProfile(req.user.id, {
    firstName,
    lastName,
    phone,
    email,
  });

  await authService.logUserActivity(req.user.id, "PROFILE_UPDATED", {
    email: req.user.email,
    changes: { firstName, lastName, phone, email },
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  return successResponse(res, "Profile updated successfully", {
    user: authService.sanitizeUser(updatedUser),
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    return errorResponse(
      res,
      "New password must be different from current password",
      400
    );
  }

  const userWithPassword = await authService.getUserWithPassword(req.user.id);

  if (!userWithPassword) {
    return errorResponse(res, "User not found", 404);
  }

  const isValidPassword = await authService.verifyPassword(
    currentPassword,
    userWithPassword.password
  );

  if (!isValidPassword) {
    return errorResponse(res, "Current password is incorrect", 400);
  }

  await authService.updatePassword(req.user.id, newPassword);

  // حذف همه refresh token ها بعد از تغییر رمز
  await authService.revokeUserRefreshTokens(req.user.id, true);

  console.log(
    `Password changed for user ${req.user.email} at ${new Date().toISOString()}`
  );

  return successResponse(
    res,
    "Password changed successfully. Please login again."
  );
});

module.exports = {
  auth,
  logout,
  logoutAll,
  refreshToken,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  removeProfilePicture,
  changePassword,
};
