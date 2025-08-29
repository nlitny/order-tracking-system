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
}

module.exports = new AdminController();
