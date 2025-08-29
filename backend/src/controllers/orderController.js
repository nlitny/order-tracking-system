const orderService = require('../services/orderService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/responses');

class OrderController {
  /**
   * Create new order
   */
  async createOrder(req, res, next) {
    try {
      const customerId = req.user.id;
      const orderData = req.body;

      const order = await orderService.createOrder(orderData, customerId);

      return successResponse(res, {
        message: 'Order created successfully',
        data: order
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    const updatedOrder = await orderService.updateOrderStatus(id, status, adminId);

    return successResponse(res, {
      message: "Order status updated successfully",
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
}

  /**
   * Get all orders
   */
  async getOrders(req, res, next) {
    try {
      const { page, limit, status, search } = req.query;
      const userRole = req.user.role;
      const userId = req.user.id;

      const filters = { status, search };
      
      if (userRole === 'CUSTOMER') {
        filters.customerId = userId;
      }

      const pagination = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };
      
      const result = await orderService.getOrders(filters, pagination);

      return successResponse(res, {
        message: 'Orders retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single order
   */
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const userRole = req.user.role;
      const userId = req.user.id;

      const userIdFilter = userRole === 'CUSTOMER' ? userId : null;
      
      const order = await orderService.getOrderById(id, userIdFilter);

      return successResponse(res, {
        message: 'Order retrieved successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order
   */
  async updateOrder(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;

      const updatedOrder = await orderService.updateOrder(id, updateData, userId);

      return successResponse(res, {
        message: 'Order updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  }

  /**
 * Cancel order
 */
async cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cancelledOrder = await orderService.cancelOrder(id, userId);

    return successResponse(res, {
      message: 'Order cancelled successfully',
      data: cancelledOrder
    });
  } catch (error) {
    next(error);
  }
}

}

module.exports = new OrderController();
