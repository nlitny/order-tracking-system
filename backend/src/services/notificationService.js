
// services/notificationService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationService {
  // ارسال اعلان برای ساخت order جدید
  async createOrderNotifications(order, customerId) {
    try {
      const notifications = [];
      
      // اعلان برای customer
      const customerNotification = await prisma.notification.create({
        data: {
          userId: customerId,
          orderId: order.id,
          type: 'ORDER_UPDATE',
          title: 'Order Registered Successfully',
          message: 'Your order has been registered and is awaiting staff approval.',
          sentAt: new Date()
        }
      });
      notifications.push(customerNotification);

      // گرفتن لیست admin ها و staff ها
      const adminsAndStaff = await prisma.user.findMany({
        where: {
          role: {
            in: ['ADMIN', 'STAFF']
          },
          isActive: true
        },
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      });

      // ارسال اعلان برای admin ها و staff ها
      for (const user of adminsAndStaff) {
        const adminNotification = await prisma.notification.create({
          data: {
            userId: user.id,
            orderId: order.id,
            type: 'ORDER_UPDATE',
            title: 'New Order Received',
            message: `A new order has been registered by ${order.customer.firstName} ${order.customer.lastName}.`,
            sentAt: new Date()
          }
        });
        notifications.push(adminNotification);
      }

      return notifications;
    } catch (error) {
      console.error('Error creating order notifications:', error);
      throw error;
    }
  }

  // ارسال اعلان برای تغییر status
  async createStatusUpdateNotification(order, newStatus) {
    try {
      let title = '';
      let message = '';

      switch (newStatus) {
        case 'IN_PROGRESS':
          title = 'Order Approved';
          message = 'Your order has been approved and is currently in progress.';
          break;
        case 'ON_HOLD':
          title = 'Order On Hold';
          message = 'Your order is in the processing queue.';
          break;
        case 'CANCELLED':
          title = 'Order Cancelled';
          message = 'Unfortunately, your order has been cancelled. Please contact support for follow-up.';
          break;
        case 'COMPLETED':
          title = 'Order Completed';
          message = 'Your order has been completed successfully.';
          break;
        default:
          return null;
      }

      const notification = await prisma.notification.create({
        data: {
          userId: order.customerId,
          orderId: order.id,
          type: newStatus === 'COMPLETED' ? 'ORDER_COMPLETED' : 'ORDER_UPDATE',
          title,
          message,
          sentAt: new Date()
        }
      });

      return notification;
    } catch (error) {
      console.error('Error creating status update notification:', error);
      throw error;
    }
  }

  // گرفتن تمام اعلان‌های یک کاربر
  async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          include: {
            order: {
              select: {
                id: true,
                orderNumber: true,
                title: true,
                status: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.notification.count({
          where: { userId }
        })
      ]);

      return {
        notifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  // علامت‌گذاری اعلان به عنوان خوانده شده
  async markAsRead(notificationId, userId) {
    try {
      // بررسی اینکه اعلان متعلق به همین کاربر است
      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId
        }
      });

      if (!notification) {
        throw new Error('Notification not found or access denied');
      }

      const updatedNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });

      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // گرفتن تعداد اعلان‌های خوانده نشده
  async getUnreadCount(userId) {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      });
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
