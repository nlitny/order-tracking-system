const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../utils/AppError');
const { cloudinary } = require('../config/cloudinary');

class CustomerMediaService {
  
  async uploadCustomerMedia(orderId, files, userId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      if (order.customerId !== userId) {
        throw new AppError('Access denied. You can only upload media for your own orders', 403);
      }

      if (!['PENDING', 'IN_PROGRESS'].includes(order.status)) {
        throw new AppError('Media can only be uploaded for PENDING or IN_PROGRESS orders', 400);
      }

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxSize = 10 * 1024 * 1024; 
      
      if (totalSize > maxSize) {
        throw new AppError('Total file size exceeds 10MB limit', 400);
      }

      
      console.log('Files received in service:');
      files.forEach((file, index) => {
        console.log(`File ${index}:`, {
          filename: file.filename,
          public_id: file.public_id, 
          path: file.path,
          originalname: file.originalname
        });
      });

      const mediaFiles = await Promise.all(
        files.map(async (file) => {
          const fileType = this.getFileType(file.mimetype);
          
          const cloudinaryId = file.public_id || 
                               file.filename || 
                               this.extractPublicIdFromPath(file.path);
          
          console.log(`Creating media record for ${file.originalname}:`, {
            cloudinaryId,
            path: file.path
          });
          
          return await prisma.customerMedia.create({
            data: {
              orderId,
              fileName: file.filename,
              originalName: file.originalname,
              mimeType: file.mimetype,
              size: file.size,
              path: file.path,
              cloudinaryId: cloudinaryId,
              uploadedBy: userId,
              fileType,
              isPublic: false
            }
          });
        })
      );

      await prisma.orderHistory.create({
        data: {
          orderId,
          status: order.status,
          comment: `Customer uploaded ${files.length} media file(s)`,
          changedBy: userId,
          metadata: {
            action: 'CUSTOMER_MEDIA_UPLOADED',
            filesCount: files.length,
            totalSize
          }
        }
      });

      return mediaFiles;

    } catch (error) {
      if (files && files.length > 0) {
        await Promise.all(
          files.map(file => {
            const cloudinaryId = file.public_id || 
                               file.filename || 
                               this.extractPublicIdFromPath(file.path);
            if (cloudinaryId) {
              return cloudinary.uploader.destroy(cloudinaryId).catch(console.error);
            }
          })
        );
      }
      
      if (error instanceof AppError) throw error;
      console.error('Error uploading customer media:', error);
      throw new AppError('Error uploading media files', 500);
    }
  }

  extractPublicIdFromPath(cloudinaryPath) {
    try {
      const match = cloudinaryPath.match(/\/([^\/]+)\.[^\/]+$/);
      if (match && match[1]) {
        return `order-media/${match[1]}`;
      }
      return null;
    } catch (error) {
      console.error('Error extracting public_id from path:', error);
      return null;
    }
  }

async getCustomerMediaByOrder(orderId, userId, userRole) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (userRole === 'ADMIN' || userRole === 'STAFF') {
    } 
    else if (userRole === 'CUSTOMER') {
      if (order.customerId !== userId) {
        throw new AppError('Access denied. You can only view your own order media files', 403);
      }
    } 
    else {
      throw new AppError('Access denied', 403);
    }

    const mediaFiles = await prisma.customerMedia.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        originalName: true,
        mimeType: true,
        size: true,
        fileType: true,
        path: true,
        cloudinaryId: true, 
        createdAt: true
      }
    });

    return mediaFiles;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error retrieving media files', 500);
  }
}

  async deleteCustomerMedia(mediaId, userId) {
    try {
      const media = await prisma.customerMedia.findUnique({
        where: { id: mediaId },
        include: {
          order: true
        }
      });

      if (!media) {
        throw new AppError('Media file not found', 404);
      }

      if (media.uploadedBy !== userId || media.order.customerId !== userId) {
        throw new AppError('Access denied', 403);
      }

      if (media.order.status !== 'PENDING') {
        throw new AppError('Media can only be deleted for PENDING orders', 400);
      }

      if (media.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(media.cloudinaryId);
          console.log(`Deleted from Cloudinary: ${media.cloudinaryId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
        }
      }

      await prisma.customerMedia.delete({
        where: { id: mediaId }
      });

      await prisma.orderHistory.create({
        data: {
          orderId: media.orderId,
          status: media.order.status,
          comment: `Customer deleted media file: ${media.originalName}`,
          changedBy: userId,
          metadata: {
            action: 'CUSTOMER_MEDIA_DELETED',
            fileName: media.originalName,
            cloudinaryId: media.cloudinaryId
          }
        }
      });

      return { message: 'Media file deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting media file', 500);
    }
  }

  getFileType(mimeType) {
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType === 'application/pdf') return 'DOCUMENT';
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    return 'OTHER';
  }
}

module.exports = new CustomerMediaService();
