const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../utils/AppError');

class OrderService {

  async generateOrderNumber() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const todayOrdersCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });
    
    const sequence = String(todayOrdersCount + 1).padStart(5, '0');
    return `ORD-${dateStr}-${sequence}`;
  }


  async createOrder(orderData, customerId) {
    try {
      const orderNumber = await this.generateOrderNumber();

      const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId,
            title: orderData.title,
            description: orderData.description || '',
            special_instructions: orderData.special_instructions || null,
            estimatedCompletion: orderData.estimatedCompletion ? new Date(orderData.estimatedCompletion) : null,
            status: 'PENDING'
          },
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        await tx.orderHistory.create({
          data: {
            orderId: order.id,
            status: 'PENDING',
            comment: 'Order created',
            changedBy: customerId,
            metadata: {
              action: 'ORDER_CREATED',
              initialData: {
                title: order.title,
                description: order.description
              }
            }
          }
        });

        return order;
      });

      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.code === 'P2002') {
        throw new AppError('Duplicate order number', 400);
      }
      throw new AppError('Error creating order', 500);
    }
  }


  async getOrderById(orderId, userId = null) {
    try {
      const whereClause = { id: orderId };
      
      if (userId) {
        whereClause.customerId = userId;
      }

      const orderBasic = await prisma.order.findUnique({
        where: whereClause,
        select: {
          status: true
        }
      });

      if (!orderBasic) {
        throw new AppError('Order not found', 404);
      }

      const includeClause = {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        orderHistory: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10,
          select: {
            id: true,
            status: true,
            comment: true,
            createdAt: true,
            metadata: true
          }
        }
      };

      if (orderBasic.status === 'COMPLETED') {
        includeClause.mediaFiles = {
          select: {
            id: true,
            fileName: true,
            originalName: true,
            mimeType: true,
            size: true,
            fileType: true,
            isPublic: true,
            description: true,
            createdAt: true
          }
        };
      }

      const order = await prisma.order.findUnique({
        where: whereClause,
        include: includeClause
      });

      if (orderBasic.status !== 'COMPLETED') {
        order.mediaFiles = [];
      }

      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error fetching order:', error);
      throw new AppError('Error retrieving order', 500);
    }
  }


async updateOrder(orderId, updateData, userId) {
  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      throw new AppError('Order not found', 404);
    }

    if (existingOrder.customerId !== userId) {
      throw new AppError('Access denied. You can only update your own orders', 403);
    }

    if (existingOrder.status !== 'PENDING') {
      throw new AppError('Order can only be updated when status is PENDING', 400);
    }

    const updateFields = {};

    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.special_instructions !== undefined) updateFields.special_instructions = updateData.special_instructions;
    if (updateData.estimatedCompletion !== undefined) {
      updateFields.estimatedCompletion = updateData.estimatedCompletion ? new Date(updateData.estimatedCompletion) : null;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new AppError('At least one field is required to update', 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: updateFields,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      await tx.orderHistory.create({
        data: {
          orderId: orderId,
          status: existingOrder.status,
          comment: 'Order details updated by customer',
          changedBy: userId,
          metadata: {
            action: 'ORDER_UPDATED',
            updatedFields: Object.keys(updateFields),
            changes: updateFields
          }
        }
      });

      return updatedOrder;
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error updating order:', error);
    throw new AppError('Error updating order', 500);
  }
}

  async getOrders(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const { customerId, status, search } = filters;
      
      const skip = (page - 1) * limit;
      
      const whereClause = {};
      
      if (customerId) {
        whereClause.customerId = customerId;
      }
      
      if (status) {
        whereClause.status = status;
      }
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { orderNumber: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where: whereClause,
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: parseInt(limit)
        }),
        prisma.order.count({ where: whereClause })
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit: parseInt(limit)
        }
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new AppError('Error retrieving orders list', 500);
    }
  }

async cancelOrder(orderId, userId) {
  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!existingOrder) {
      throw new AppError('Order not found', 404);
    }

    if (existingOrder.customerId !== userId) {
      throw new AppError('Access denied. You can only cancel your own orders', 403);
    }

    const cancellableStatuses = ['PENDING', 'IN_PROGRESS'];
    if (!cancellableStatuses.includes(existingOrder.status)) {
      throw new AppError(`Order cannot be cancelled. Current status: ${existingOrder.status}. Only PENDING or IN_PROGRESS orders can be cancelled`, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date()
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          orderHistory: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              status: true,
              comment: true,
              createdAt: true,
              metadata: true
            }
          }
        }
      });

      await tx.orderHistory.create({
        data: {
          orderId: orderId,
          status: 'CANCELLED',
          comment: 'Order cancelled by customer',
          changedBy: userId,
          metadata: {
            action: 'ORDER_CANCELLED',
            cancelledBy: 'customer',
            previousStatus: existingOrder.status,
            cancelledAt: new Date().toISOString()
          }
        }
      });

      return cancelledOrder;
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error cancelling order:', error);
    throw new AppError('Error cancelling order', 500);
  }
}

}

module.exports = new OrderService();
