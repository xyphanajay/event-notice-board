const { Event } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const eventId = req.params.id || req.params.eventId;
    const userId = req.user.id;
    
    // Find the event
    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if the current user is the host
    if (event.hostId !== userId) {
      return res.status(403).json({ message: 'Only the host can perform this action' });
    }
    
    // Add event to request object for later use
    req.event = event;
    
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};