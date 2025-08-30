const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roles");

require('../docs/userDocs');

/**
 * Update user role
 * @desc    Update user role and activity status (Admin only)
 * @route   PATCH /api/v1/users/role
 * @access  Private (Admin only)
 */
router.patch("/role", authenticateToken, authorizeRoles("ADMIN"), userController.updateUserRole);

/**
 * Get customer dashboard
 * @desc    Get customer dashboard with order statistics
 * @route   GET /api/v1/users/dashboard
 * @access  Private (Customer only)
 */
router.get("/dashboard", authenticateToken, authorizeRoles("CUSTOMER"), userController.getCustomerDashboard
);

module.exports = router;
