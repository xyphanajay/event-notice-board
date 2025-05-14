const express = require('express');
const router = express.Router();

// Import controller placeholder
// const requestController = require('../controllers/request.controller');

// Get all join requests for an event
router.get('/event/:eventId', (req, res) => {
  // Placeholder - will be implemented later
  res.status(501).json({ message: 'Not implemented yet' });
});

// Create a join request
router.post('/event/:eventId', (req, res) => {
  // Placeholder - will be implemented later
  res.status(501).json({ message: 'Not implemented yet' });
});

// Approve a join request
router.put('/:id/approve', (req, res) => {
  // Placeholder - will be implemented later
  res.status(501).json({ message: 'Not implemented yet' });
});

// Decline a join request
router.put('/:id/decline', (req, res) => {
  // Placeholder - will be implemented later
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;