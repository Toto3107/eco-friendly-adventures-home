
const express = require('express');
const Badge = require('../models/Badge');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user rewards and badges
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges.badgeId');
    const allBadges = await Badge.find({ isActive: true });
    
    // Create badges array with unlock status
    const badges = allBadges.map(badge => {
      const userHasBadge = user.badges.some(
        ub => ub.badgeId._id.toString() === badge._id.toString()
      );
      
      return {
        id: badge._id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        pointsRequired: badge.pointsRequired,
        unlocked: userHasBadge
      };
    });

    res.json({
      badges,
      userPoints: user.points
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server error fetching rewards' });
  }
});

module.exports = router;
