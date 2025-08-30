const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const AppError = require("../utils/AppError");

class UserService {
  async updateUserRole(userId, role, isActive) {
    const validRoles = ["CUSTOMER", "STAFF", "ADMIN"];
    if (!validRoles.includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updateData = { role };
    
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { 
        id: true, 
        email: true, 
        firstName: true,
        lastName: true,
        role: true, 
        isActive: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  async getCustomerDashboard(userId) {
    try {
      const [
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        recentOrders
      ] = await Promise.all([
        prisma.order.count({ where: { customerId: userId } }),
        
        prisma.order.count({ 
          where: { 
            customerId: userId, 
            status: 'PENDING' 
          } 
        }),
        
        prisma.order.count({ 
          where: { 
            customerId: userId, 
            status: 'IN_PROGRESS' 
          } 
        }),
        
        prisma.order.count({ 
          where: { 
            customerId: userId, 
            status: 'COMPLETED' 
          } 
        }),
        
        prisma.order.findMany({
          where: { customerId: userId },
          select: {
            id: true,
            orderNumber: true,
            title: true,
            description: true,
            status: true,
            estimatedCompletion: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        })
      ]);

      return {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          inProgress: inProgressOrders,
          completed: completedOrders
        },
        recentOrders
      };
    } catch (error) {
      console.error("Error fetching customer dashboard:", error);
      throw new AppError("Error fetching customer dashboard", 500);
    }
  }
}

module.exports = new UserService();
