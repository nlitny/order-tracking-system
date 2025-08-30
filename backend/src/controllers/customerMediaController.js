
const customerMediaService = require('../services/customerMediaService');
const AppError = require('../utils/AppError');

class CustomerMediaController {

  async uploadMedia(req, res, next) {
    try {
      const { id: orderId } = req.params;
      const userId = req.user.id;
      const files = req.files;

      if (!files || files.length === 0) {
        return next(new AppError('No files uploaded', 400));
      }

      const mediaFiles = await customerMediaService.uploadCustomerMedia(
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
    const userRole = req.user.role;

    const mediaFiles = await customerMediaService.getCustomerMediaByOrder(
      orderId, 
      userId,
      userRole
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

      const result = await customerMediaService.deleteCustomerMedia(
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
}

module.exports = new CustomerMediaController();
