
// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

/**
 * Get all notifications for the authenticated user
 * @desc    Get all notifications with pagination
 * @route   GET /api/v1/notifications
 * @access  Private
 */
router.get('/', notificationController.getAllNotifications);

/**
 * Mark notification as read
 * @desc    Mark a specific notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
router.patch('/:id/read', notificationController.markAsRead);

/**
 * Get unread notifications count
 * @desc    Get count of unread notifications for authenticated user
 * @route   GET /api/v1/notifications/unread-count
 * @access  Private
 */
router.get('/unread-count', notificationController.getUnreadCount);

module.exports = router;
