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
  async getAllUsersWithOrders(filters = {}, pagination = {}) {
  try {
    const { page = 1, limit = 10 } = pagination;
    const { search, role, isActive } = filters;
    
    const skip = (page - 1) * limit;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (role) {
      where.role = role;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
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
          _count: {
            select: {
              orders: true
            }
          },
          orders: {
            select: {
              id: true,
              orderNumber: true,
              title: true,
              status: true,
              createdAt: true,
              estimatedCompletion: true
            },
            orderBy: { createdAt: 'desc' },
            take: 3
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalUsers: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error("Error fetching users with orders:", error);
    throw new AppError("Error fetching users with orders", 500);
  }
}

async getAdminDashboard() {
  try {
    const [
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      adminCount,
      staffCount,
      customerCount,
      recentOrders
    ] = await Promise.all([
      prisma.order.count(),
      
      prisma.order.count({ where: { status: 'PENDING' } }),
      
      prisma.order.count({ where: { status: 'IN_PROGRESS' } }),
      
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      
      prisma.user.count({ where: { role: 'ADMIN' } }),
      
      prisma.user.count({ where: { role: 'STAFF' } }),
      
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      
      prisma.order.findMany({
        select: {
          id: true,
          orderNumber: true,
          title: true,
          status: true,
          createdAt: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    return {
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        inProgress: inProgressOrders,
        completed: completedOrders
      },
      users: {
        admins: adminCount,
        staff: staffCount,
        customers: customerCount,
        total: adminCount + staffCount + customerCount
      },
      recentOrders
    };
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw new AppError("Error fetching admin dashboard", 500);
  }
}
}

module.exports = new AdminService();