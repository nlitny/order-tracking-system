const express = require('express');
const router = express.Router();
const mediaFileController = require('../controllers/mediaFileController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require("../middleware/roles");
const { streamUpload } = require('../config/cloudinary');

require('../docs/mediaFileDocs');

/**
 * Upload media files for an order (Admin/Staff only)
 * @desc    Upload media files with stream processing for admin and staff
 * @route   POST /api/v1/orders/:id/mediafiles
 * @access  Private (Admin/Staff only)
 */
router.post('/:id/mediafiles',
  authenticateToken,
  authorizeRoles('ADMIN', 'STAFF'),
  streamUpload.array('files', 20),
  mediaFileController.uploadMedia
);

/**
 * Get media files for an order 
 * @desc    Get all media files for a specific order (Admin/Staff always, Customer only for completed orders)
 * @route   GET /api/v1/orders/:id/mediafiles
 * @access  Private (Admin/Staff/Customer with restrictions)
 */
router.get('/:id/mediafiles',
  authenticateToken, 
  authorizeRoles("ADMIN", "STAFF", "CUSTOMER"), 
  mediaFileController.getOrderMedia
);

/**
 * Update media file information (Admin/Staff only)
 * @desc    Update media file metadata (description, isPublic, etc.)
 * @route   PUT /api/v1/orders/:id/mediafiles/:mediaId
 * @access  Private (Admin/Staff only)
 */
router.put('/:id/mediafiles/:mediaId',
  authenticateToken,
  authorizeRoles('ADMIN', 'STAFF'),
  mediaFileController.updateMedia
);

/**
 * Delete media file (Admin/Staff only)
 * @desc    Delete a specific media file
 * @route   DELETE /api/v1/orders/:id/mediafiles/:mediaId
 * @access  Private (Admin/Staff only)
 */
router.delete('/:id/mediafiles/:mediaId',
  authenticateToken,
  authorizeRoles('ADMIN', 'STAFF'),
  mediaFileController.deleteMedia
);

module.exports = router;
