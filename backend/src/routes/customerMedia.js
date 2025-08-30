const express = require('express');
const router = express.Router();
const customerMediaController = require('../controllers/customerMediaController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Import swagger documentation
require('../docs/customerMediaDocs');

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * Upload customer media files for an order
 * @desc    Upload media files (images, videos, documents) for a specific order
 * @route   POST /api/v1/orders/:id/customermedia
 * @access  Private (Customer only)
 */
router.post('/:id/customermedia',upload.array('files', 10), customerMediaController.uploadMedia);

/**
 * Get customer media files for an order
 * @desc    Get all media files uploaded by customer for a specific order
 * @route   GET /api/v1/orders/:id/customermedia
 * @access  Private (Customer only)
 */
router.get('/:id/customermedia',customerMediaController.getOrderMedia);

/**
 * Delete customer media file
 * @desc    Delete a specific media file uploaded by customer
 * @route   DELETE /api/v1/orders/customermedia/:mediaId
 * @access  Private (Customer only)
 */
router.delete('/customermedia/:mediaId',customerMediaController.deleteMedia);

module.exports = router;
