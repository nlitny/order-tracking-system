
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../utils/AppError');
const { cloudinary } = require('../config/cloudinary');

class MediaFileService {

  async uploadMediaFiles(orderId, files, userId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
        throw new AppError('Access denied. Only admin and staff can upload media files', 403);
      }

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxSize = 50 * 1024 * 1024; 

      if (totalSize > maxSize) {
        throw new AppError('Total file size exceeds 50MB limit', 400);
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

          return await prisma.mediaFile.create({
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
              isPublic: true
            }
          });
        })
      );

      await prisma.orderHistory.create({
        data: {
          orderId,
          status: order.status,
          comment: `Admin/Staff uploaded ${files.length} media file(s)`,
          changedBy: userId,
          metadata: {
            action: 'ADMIN_MEDIA_UPLOADED',
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
      console.error('Error uploading media files:', error);
      throw new AppError('Error uploading media files', 500);
    }
  }

  extractPublicIdFromPath(cloudinaryPath) {
    try {
      const match = cloudinaryPath.match(/\/([^\/]+)\.[^\/]+$/);
      if (match && match[1]) {
        return `admin-media/${match[1]}`;
      }
      return null;
    } catch (error) {
      console.error('Error extracting public_id from path:', error);
      return null;
    }
  }

  async getMediaFilesByOrder(orderId, userId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: {
            select: { id: true }
          }
        }
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (['ADMIN', 'STAFF'].includes(user.role)) {
      } else if (user.role === 'CUSTOMER') {
        if (order.customerId !== userId) {
          throw new AppError('Access denied. You can only view media files for your own orders', 403);
        }
        if (order.status !== 'COMPLETED') {
          throw new AppError('Access denied. Media files are only available for completed orders', 403);
        }
      } else {
        throw new AppError('Access denied', 403);
      }

      const mediaFiles = await prisma.mediaFile.findMany({
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
          isPublic: true,
          description: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return mediaFiles;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error retrieving media files', 500);
    }
  }

  async deleteMediaFile(mediaId, userId) {
    try {
      const media = await prisma.mediaFile.findUnique({
        where: { id: mediaId },
        include: {
          order: true
        }
      });

      if (!media) {
        throw new AppError('Media file not found', 404);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
        throw new AppError('Access denied', 403);
      }

      if (media.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(media.cloudinaryId);
          console.log(`Deleted from Cloudinary: ${media.cloudinaryId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
        }
      }

      await prisma.mediaFile.delete({
        where: { id: mediaId }
      });

      await prisma.orderHistory.create({
        data: {
          orderId: media.orderId,
          status: media.order.status,
          comment: `Admin/Staff deleted media file: ${media.originalName}`,
          changedBy: userId,
          metadata: {
            action: 'ADMIN_MEDIA_DELETED',
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

  async updateMediaFile(mediaId, updateData, userId) {
    try {
      const media = await prisma.mediaFile.findUnique({
        where: { id: mediaId }
      });

      if (!media) {
        throw new AppError('Media file not found', 404);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
        throw new AppError('Access denied', 403);
      }

      const updatedMedia = await prisma.mediaFile.update({
        where: { id: mediaId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        select: {
          id: true,
          fileName: true,
          originalName: true,
          mimeType: true,
          size: true,
          fileType: true,
          path: true,
          cloudinaryId: true,
          isPublic: true,
          description: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return updatedMedia;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating media file', 500);
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

module.exports = new MediaFileService();
