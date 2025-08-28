
const express = require('express');
const router = express.Router();

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
router.get('/', (req, res) => {
  res.json({ message: 'Get all users - Coming Soon' });
});

// @desc    Get user profile
// @route   GET /api/v1/users/:id
// @access  Private
router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id} - Coming Soon` });
});

module.exports = router;
