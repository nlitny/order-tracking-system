const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const {
  generateAccessToken,
  generateRefreshToken
} = require('../utils/jwt');

const prisma = new PrismaClient();

const tokenBlacklist = new Set();

const checkEmailExists = async (email) => {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
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
      isActive: true
    }
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
      role: 'CUSTOMER' 
    }
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
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
};

const generateAuthTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d'
  };
};

const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const addToBlacklist = (token) => {
  tokenBlacklist.add(token);
  
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, 15 * 60 * 1000); 
};

const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

const logUserActivity = async (userId, activity, details = {}) => {
  try {
    console.log(`User Activity: ${activity}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...details
    });
  } catch (error) {
    console.error('Failed to log user activity:', error);
  }
};

module.exports = {
  checkEmailExists,
  getUserWithPassword, 
  createUser,
  updateUserProfile,
  updatePassword,
  generateAuthTokens,
  sanitizeUser,
  verifyPassword,
  addToBlacklist,
  isTokenBlacklisted,
  logUserActivity
};
