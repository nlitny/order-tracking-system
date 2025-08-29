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

router.post('/authlogin', validateRequest(authSchema), authController.auth);

router.post('/logout', authenticateToken, authController.logout);

router.post('/logout-all', authenticateToken, authController.logoutAll);

router.post('/refresh-token', validateRequest(refreshTokenSchema), authenticateRefreshToken, authController.refreshToken);

router.get('/profile', authenticateToken, authController.getProfile);

router.patch('/profile', authenticateToken, validateRequest(updateProfileSchema), authController.updateProfile);

router.post('/change-password', authenticateToken, validateRequest(changePasswordSchema), authController.changePassword);

router.post('/profile/picture', authenticateToken, upload.single('profilePicture'), authController.uploadProfilePicture);

router.delete('/profile/picture', authenticateToken, authController.removeProfilePicture);

module.exports = router;
