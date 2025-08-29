const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");

class AdminService {
  async createAdmin(userData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() }
    });

    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    if (!['ADMIN', 'STAFF'].includes(userData.role)) {
      throw new AppError("Invalid role. Only ADMIN or STAFF allowed", 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const newAdmin = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        isActive: true,
        role: userData.role 
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    return newAdmin;
  }
}

module.exports = new AdminService();