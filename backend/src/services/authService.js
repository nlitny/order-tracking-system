const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { PrismaClient } = require("@prisma/client");
const { cloudinary } = require("../config/cloudinary");
const bcrypt = require("bcrypt");
const Redis = require("redis");

const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const prisma = new PrismaClient();

let redis;
const tokenBlacklist = new Set(); 

const initRedis = async () => {
  try {
    if (process.env.REDIS_URL) {
      redis = Redis.createClient({ url: process.env.REDIS_URL });
      await redis.connect();
      console.log("Redis connected for token blacklist");
    } else {
      console.log("Redis URL not found, using memory blacklist");
    }
  } catch (error) {
    console.error("Redis connection failed, using memory blacklist:", error);
  }
};

initRedis();

const checkEmailExists = async (email) => {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
};

const getUserWithPassword = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      role: true,
      isActive: true,
    },
  });
};

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  return await prisma.user.create({
    data: {
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      isActive: true,
      role: "CUSTOMER",
    },
  });
};

const updateUserProfile = async (userId, updateData) => {
  const dataToUpdate = {};

  if (updateData.firstName !== undefined && updateData.firstName !== null) {
    dataToUpdate.firstName = updateData.firstName.trim();
  }
  if (updateData.lastName !== undefined && updateData.lastName !== null) {
    dataToUpdate.lastName = updateData.lastName.trim();
  }
  if (updateData.phone !== undefined && updateData.phone !== null) {
    dataToUpdate.phone = updateData.phone ? updateData.phone.trim() : null;
  }
  if (updateData.email !== undefined && updateData.email !== null) {
    dataToUpdate.email = updateData.email.toLowerCase().trim();
  }

  return await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      profilePicture: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateProfilePicture = async (userId, profilePictureData) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profilePictureId: true,
        profilePicture: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.profilePictureId) {
      try {
        await cloudinary.uploader.destroy(user.profilePictureId);
        console.log(`Old profile picture deleted: ${user.profilePictureId}`);
      } catch (error) {
        console.error("Error deleting old profile picture:", error);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePicture: profilePictureData.path,
        profilePictureId: profilePictureData.public_id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profilePicture: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  } catch (error) {
    if (profilePictureData.public_id) {
      try {
        await cloudinary.uploader.destroy(profilePictureData.public_id);
      } catch (cleanupError) {
        console.error("Error cleaning up uploaded file:", cleanupError);
      }
    }
    throw error;
  }
};

const removeProfilePicture = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profilePictureId: true,
      },
    });

    if (!user || !user.profilePictureId) {
      throw new Error("No profile picture to remove");
    }

    await cloudinary.uploader.destroy(user.profilePictureId);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePicture: null,
        profilePictureId: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profilePicture: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

const generateAuthTokens = async (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const activeTokensCount = await prisma.refreshToken.count({
    where: {
      userId: user.id,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (activeTokensCount >= 5) {
    const oldestToken = await prisma.refreshToken.findFirst({
      where: {
        userId: user.id,
        isRevoked: false,
      },
      orderBy: { createdAt: "asc" },
    });

    if (oldestToken) {
      await prisma.refreshToken.update({
        where: { id: oldestToken.id },
        data: { isRevoked: true },
      });
    }
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: "1d",
    refreshTokenExpiresIn: "30d",
  };
};

const revokeUserRefreshTokens = async (userId, all = false) => {
  if (all) {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  } else {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }],
      },
      data: { isRevoked: true },
    });
  }
};

const revokeRefreshToken = async (tokenId) => {
  await prisma.refreshToken.update({
    where: { id: tokenId },
    data: { isRevoked: true },
  });
};

const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const addToBlacklist = async (token) => {
  try {
    if (redis) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.decode(token);
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

      if (expiresIn > 0) {
        await redis.setEx(`blacklist:${token}`, expiresIn, "revoked");
      }
    } else {
      tokenBlacklist.add(token);

      setTimeout(() => {
        tokenBlacklist.delete(token);
      }, 15 * 60 * 1000);
    }
  } catch (error) {
    console.error("Error adding token to blacklist:", error);
    tokenBlacklist.add(token);
  }
};

const isTokenBlacklisted = async (token) => {
  try {
    if (redis) {
      const result = await redis.get(`blacklist:${token}`);
      return result !== null;
    } else {
      return tokenBlacklist.has(token);
    }
  } catch (error) {
    console.error("Error checking token blacklist:", error);
    return tokenBlacklist.has(token);
  }
};

const logUserActivity = async (userId, activity, details = {}) => {
  try {
    console.log(`User Activity: ${activity}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...details,
    });
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
};

module.exports = {
  checkEmailExists,
  getUserWithPassword,
  createUser,
  updateUserProfile,
  updateProfilePicture,
  removeProfilePicture,
  updatePassword,
  generateAuthTokens,
  revokeUserRefreshTokens,
  revokeRefreshToken,
  sanitizeUser,
  verifyPassword,
  addToBlacklist,
  isTokenBlacklisted,
  logUserActivity,
};
