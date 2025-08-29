
// controllers/notificationController.js
const notificationService = require('../services/notificationService');
const { successResponse, errorResponse } = require('../utils/responses');
const { asyncHandler } = require('../utils/asyncHandler');

class NotificationController {
  // گرفتن تمام اعلان‌های کاربر
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

  // علامت‌گذاری اعلان به عنوان خوانده شده
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

  // گرفتن تعداد اعلان‌های خوانده نشده
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
