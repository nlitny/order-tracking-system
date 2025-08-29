
const mediaFileService = require('../services/mediaFileService');
const AppError = require('../utils/AppError');

class MediaFileController {

  async uploadMedia(req, res, next) {
    try {
      const { id: orderId } = req.params;
      const userId = req.user.id;
      const files = req.files;

      if (!files || files.length === 0) {
        return next(new AppError('No files uploaded', 400));
      }

      const mediaFiles = await mediaFileService.uploadMediaFiles(
        orderId,
        files,
        userId
      );

      res.status(201).json({
        status: 'success',
        message: 'Media files uploaded successfully',
        data: {
          uploadedFiles: mediaFiles.length,
          mediaFiles
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderMedia(req, res, next) {
    try {
      const { id: orderId } = req.params;
      const userId = req.user.id;

      const mediaFiles = await mediaFileService.getMediaFilesByOrder(
        orderId,
        userId
      );

      res.status(200).json({
        status: 'success',
        data: {
          mediaFiles,
          count: mediaFiles.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMedia(req, res, next) {
    try {
      const { mediaId } = req.params;
      const userId = req.user.id;

      const result = await mediaFileService.deleteMediaFile(
        mediaId,
        userId
      );

      res.status(200).json({
        status: 'success',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMedia(req, res, next) {
    try {
      const { mediaId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const updatedMedia = await mediaFileService.updateMediaFile(
        mediaId,
        updateData,
        userId
      );

      res.status(200).json({
        status: 'success',
        message: 'Media file updated successfully',
        data: {
          mediaFile: updatedMedia
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MediaFileController();
