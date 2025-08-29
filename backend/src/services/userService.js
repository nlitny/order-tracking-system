
// services/userService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const AppError = require("../utils/AppError");

class UserService {
  async updateUserRole(userId, role) {
    const validRoles = ["CUSTOMER", "STAFF", "ADMIN"];
    if (!validRoles.includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true }
    });

    return updatedUser;
  }
}

module.exports = new UserService();