const adminService = require("../services/adminService");
const { successResponse, errorResponse } = require("../utils/responses");

class AdminController {
  async registerAdmin(req, res, next) {
    try {
      const { email, firstName, lastName, password, rePassword, role } = req.body;

      if (!email || !firstName || !lastName || !password || !rePassword || !role) {
        return errorResponse(res, "All fields are required", 400);
      }

      if (password !== rePassword) {
        return errorResponse(res, "Passwords do not match", 400);
      }

      if (!['ADMIN', 'STAFF'].includes(role)) {
        return errorResponse(res, "Role must be either ADMIN or STAFF", 400);
      }

      const newAdmin = await adminService.createAdmin({
        email,
        firstName,
        lastName,
        password,
        role
      });

      return successResponse(
        res,
        `${role} registered successfully`,
        { user: newAdmin },
        201
      );
    } catch (error) {
      next(error);
    }
  }
  async getAllUsersWithOrders(req, res, next) {
  try {
    const { page, limit, search, role, isActive } = req.query;
    
    const filters = { search, role, isActive };
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    };

    const result = await adminService.getAllUsersWithOrders(filters, pagination);
    
    return successResponse(res, "Users with orders retrieved successfully", result);
  } catch (error) {
    next(error);
  }
}

async getAdminDashboard(req, res, next) {
  try {
    const dashboardData = await adminService.getAdminDashboard();
    
    return successResponse(res, "Admin dashboard data retrieved successfully", dashboardData);
  } catch (error) {
    next(error);
  }
}
}

module.exports = new AdminController();
