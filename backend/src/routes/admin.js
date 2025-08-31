const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roles");
const { validateRequest } = require('../middleware/validation');
const { registerAdminSchema } = require('../validations/adminValidation');

require('../docs/adminDocs');

/**
 * Register new admin or staff
 * @desc    Register a new admin or staff member (Admin only)
 * @route   POST /api/v1/admin/register
 * @access  Private (Admin only)
 */
router.post("/register", authenticateToken, authorizeRoles("ADMIN"), validateRequest(registerAdminSchema),adminController.registerAdmin);

/**
 * Get all users with orders
 * @desc    Get all users with their orders and pagination
 * @route   GET /api/v1/admin/users
 * @access  Private (Admin only)
 */
router.get("/users", authenticateToken, authorizeRoles("ADMIN"), adminController.getAllUsersWithOrders);

/**
 * Get admin dashboard
 * @desc    Get admin dashboard statistics and recent orders
 * @route   GET /api/v1/admin/dashboard
 * @access  Private (Admin only)
 */
router.get("/dashboard", authenticateToken,authorizeRoles("ADMIN" , "STAFF"), adminController.getAdminDashboard);

module.exports = router;
