const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateRequest } = require('../middleware/validation');
const { createOrderSchema } = require('../validations/orderValidation');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require("../middleware/roles");

// Import swagger documentation
require('../docs/orderDocs');

// Apply authentication to all order routes
router.use(authenticateToken);

/**
 * Get all orders
 * @desc    Get all orders with pagination and filtering
 * @route   GET /api/v1/orders
 * @access  Private
 */
router.get('/', orderController.getOrders);

/**
 * Create new order
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
router.post('/', validateRequest(createOrderSchema), orderController.createOrder);

/**
 * Get single order
 * @desc    Get single order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
router.get('/:id', orderController.getOrderById);

/**
 * Update order
 * @desc    Update order by ID
 * @route   PATCH /api/v1/orders/:id
 * @access  Private
 */
router.patch('/:id', orderController.updateOrder);

/**
 * Cancel order
 * @desc    Cancel order by ID
 * @route   PATCH /api/v1/orders/:id/cancel
 * @access  Private
 */
router.patch('/:id/cancel', orderController.cancelOrder);


router.patch('/:id/status', authorizeRoles("ADMIN", "STAFF"), orderController.updateOrderStatus);

module.exports = router;
