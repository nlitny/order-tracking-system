const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/responses');
const { PrismaClient } = require('@prisma/client');
const { isTokenBlacklisted } = require('../services/authService');

const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'Access token required', 401);
  }

  if (isTokenBlacklisted(token)) {
    return errorResponse(res, 'Token has been revoked. Please login again.', 401);
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return errorResponse(res, 'Invalid or expired token', 403);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user || !user.isActive) {
      return errorResponse(res, 'User not found or inactive', 403);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return errorResponse(res, 'Authentication failed', 500);
  }
};

module.exports = {
  authenticateToken
};
