const express = require('express');
const router = express.Router();
const mediaFileController = require('../controllers/mediaFileController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require("../middleware/roles");
const { streamUpload } = require('../config/cloudinary');

require('../docs/mediaFileDocs');

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN', 'STAFF'));

/**
 * Upload media files for an order (Admin/Staff only)
 * @desc    Upload media files with stream processing for admin and staff
 * @route   POST /api/v1/orders/:id/mediafiles
 * @access  Private (Admin/Staff only)
 */

router.post('/:id/mediafiles',streamUpload.array('files', 20),mediaFileController.uploadMedia);

/**
 * Get media files for an order (Admin/Staff only)
 * @desc    Get all media files for a specific order
 * @route   GET /api/v1/orders/:id/mediafiles
 * @access  Private (Admin/Staff only)
 */

router.get('/:id/mediafiles',mediaFileController.getOrderMedia);

/**
 * Update media file information (Admin/Staff only)
 * @desc    Update media file metadata (description, isPublic, etc.)
 * @route   PUT /api/v1/orders/:id/mediafiles/:mediaId
 * @access  Private (Admin/Staff only)
 */

router.put('/:id/mediafiles/:mediaId', mediaFileController.updateMedia);

/**
 * Delete media file (Admin/Staff only)
 * @desc    Delete a specific media file
 * @route   DELETE /api/v1/orders/:id/mediafiles/:mediaId
 * @access  Private (Admin/Staff only)
 */

router.delete('/:id/mediafiles/:mediaId', mediaFileController.deleteMedia);

module.exports = router;
