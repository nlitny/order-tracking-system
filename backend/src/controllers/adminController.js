
// controllers/adminController.js
const adminService = require("../services/adminService");
const { successResponse, errorResponse } = require("../utils/responses");

class AdminController {
  async registerAdmin(req, res, next) {
    try {
      const { email, firstName, lastName, password, rePassword } = req.body;

      if (!email || !firstName || !lastName || !password || !rePassword) {
        return errorResponse(res, "All fields are required", 400);
      }

      if (password !== rePassword) {
        return errorResponse(res, "Passwords do not match", 400);
      }

      const newAdmin = await adminService.createAdmin({
        email,
        firstName,
        lastName,
        password
      });

      return successResponse(
        res,
        "Admin registered successfully",
        { user: newAdmin },
        201
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
