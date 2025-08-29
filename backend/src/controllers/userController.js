
const userService = require("../services/userService");
const { successResponse } = require("../utils/responses");

class UserController {
  async updateUserRole(req, res, next) {
    try {
      const { userId, role } = req.body;

      const updatedUser = await userService.updateUserRole(userId, role);

      return successResponse(res, {
        message: "User role updated successfully",
        user: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();