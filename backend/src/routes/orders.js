const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateRequest } = require('../middleware/validation');
const { createOrderSchema } = require('../validations/orderValidation');
const { authenticateToken } = require('../middleware/auth');

require('../docs/orderDocs');

// Apply authentication to all order routes
router.use(authenticateToken);

/**
 * Get all orders
 * @desc    Get all orders with pagination and filtering
 * @route   GET /api/v1/orders
 * @access  Private
 */
router.get('/', authenticateToken,orderController.getOrders);

/**
 * Get single order
 * @desc    Get single order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
router.get('/:id',authenticateToken,orderController.getOrderById);

/**
 * Create new order
 * @desc    Create new order
 * @route   POST /api/v1/orders/new
 * @access  Private
 */
router.post('/new', validateRequest(createOrderSchema), orderController.createOrder);

/**
 * Update order
 * @desc    Update order by ID
 * @route   patch /api/v1/orders/update/:id
 * @access  Private
 */
router.patch('/update/:id',authenticateToken, orderController.updateOrder);

/**
 * Cancel order
 * @desc    Cancel order by ID
 * @route   patch /api/v1/orders/:id/cancel
 * @access  Private
 */

router.patch('/:id/cancel', authenticateToken, orderController.cancelOrder);

module.exports = router;
