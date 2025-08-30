const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validation');
const { upload } = require('../config/profilePictureConfig');
const { 
  authSchema, 
  updateProfileSchema, 
  changePasswordSchema,
  refreshTokenSchema 
} = require('../validations/authValidation');
const { authRateLimit } = require('../middleware/rateLimit');
const { authenticateToken, authenticateRefreshToken } = require('../middleware/auth');

require('../docs/authDocs');

router.use(authRateLimit);

/**
 * User authentication (login)
 * @desc    Authenticate user and return tokens
 * @route   POST /api/v1/auth/authlogin
 * @access  Public
 */
router.post('/authlogin', validateRequest(authSchema), authController.auth);

/**
 * User logout
 * @desc    Logout user and invalidate current refresh token
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * User logout from all devices
 * @desc    Logout user from all devices and invalidate all refresh tokens
 * @route   POST /api/v1/auth/logout-all
 * @access  Private
 */
router.post('/logout-all', authenticateToken, authController.logoutAll);

/**
 * Refresh access token
 * @desc    Get new access token using refresh token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Private
 */
router.post('/refresh-token', validateRequest(refreshTokenSchema), authenticateRefreshToken, authController.refreshToken);

/**
 * Get user profile
 * @desc    Get current user profile information
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * Update user profile
 * @desc    Update current user profile information
 * @route   PATCH /api/v1/auth/profile
 * @access  Private
 */
router.patch('/profile', authenticateToken, validateRequest(updateProfileSchema), authController.updateProfile);

/**
 * Change password
 * @desc    Change user password
 * @route   POST /api/v1/auth/change-password
 * @access  Private
 */
router.post('/change-password', authenticateToken, validateRequest(changePasswordSchema), authController.changePassword);

/**
 * Upload profile picture
 * @desc    Upload user profile picture
 * @route   POST /api/v1/auth/profile/picture
 * @access  Private
 */
router.post('/profile/picture', authenticateToken, upload.single('profilePicture'), authController.uploadProfilePicture);

/**
 * Remove profile picture
 * @desc    Remove user profile picture
 * @route   DELETE /api/v1/auth/profile/picture
 * @access  Private
 */
router.delete('/profile/picture', authenticateToken, authController.removeProfilePicture);

module.exports = router;

