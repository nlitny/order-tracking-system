
const userService = require("../services/userService");
const { successResponse } = require("../utils/responses");

class UserController {
  async updateUserRole(req, res, next) {
    try {
      const { userId, role, isActive } = req.body;

      const updatedUser = await userService.updateUserRole(userId, role, isActive);

      return successResponse(res, "User updated successfully", {
        user: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  async getCustomerDashboard(req, res, next) {
    try {
      const userId = req.user.id;
      
      const dashboardData = await userService.getCustomerDashboard(userId);
      
      return successResponse(res, "Customer dashboard data retrieved successfully", dashboardData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
