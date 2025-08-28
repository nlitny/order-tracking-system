
const express = require('express');
const router = express.Router();

// @desc    Upload media file
// @route   POST /api/v1/media/upload
// @access  Private
router.post('/upload', (req, res) => {
  res.json({ message: 'Media upload - Coming Soon' });
});

// @desc    Get media file
// @route   GET /api/v1/media/:id
// @access  Private
router.get('/:id', (req, res) => {
  res.json({ message: `Get media ${req.params.id} - Coming Soon` });
});

module.exports = router;
