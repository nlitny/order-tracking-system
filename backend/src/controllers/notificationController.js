
const notificationService = require('../services/notificationService');
const { successResponse, errorResponse } = require('../utils/responses');
const { asyncHandler } = require('../utils/asyncHandler');

class NotificationController {
  getAllNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const result = await notificationService.getUserNotifications(
      userId, 
      parseInt(page), 
      parseInt(limit)
    );

    return successResponse(
      res,
      'Notifications retrieved successfully',
      result
    );
  });

  markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await notificationService.markAsRead(id, userId);

    return successResponse(
      res,
      'Notification marked as read',
      { notification }
    );
  });

  getUnreadCount = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);

    return successResponse(
      res,
      'Unread count retrieved successfully',
      { unreadCount: count }
    );
  });
}

module.exports = new NotificationController();
