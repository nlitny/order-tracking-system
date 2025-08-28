const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validation');
const { 
  authSchema, 
  updateProfileSchema, 
  changePasswordSchema 
} = require('../validations/authValidation');
const { authRateLimit } = require('../middleware/rateLimit');
const { authenticateToken } = require('../middleware/auth');

require('../docs/authDocs');

router.use(authRateLimit);

router.post('/authlogin', validateRequest(authSchema), authController.auth);
router.post('/logout', authenticateToken, authController.logout);
router.post('/refresh-token', authenticateToken, authController.refreshToken);
router.get('/profile', authenticateToken, authController.getProfile);
router.patch('/profile', authenticateToken, validateRequest(updateProfileSchema), authController.updateProfile);
router.post('/change-password', authenticateToken, validateRequest(changePasswordSchema), authController.changePassword);

module.exports = router;
