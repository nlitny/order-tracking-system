
const express = require('express');
const router = express.Router();

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private
router.get('/', (req, res) => {
  res.json({ message: 'Get all orders - Coming Soon' });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
router.get('/:id', (req, res) => {
  res.json({ message: `Get order ${req.params.id} - Coming Soon` });
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
router.post('/', (req, res) => {
  res.json({ message: 'Create order - Coming Soon' });
});

// @desc    Update order
// @route   PUT /api/v1/orders/:id
// @access  Private
router.put('/:id', (req, res) => {
  res.json({ message: `Update order ${req.params.id} - Coming Soon` });
});

module.exports = router;
