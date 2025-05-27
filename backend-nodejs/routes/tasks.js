
const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true });
    const user = await User.findById(req.user._id);
    
    // Mark completed tasks
    const tasksWithStatus = tasks.map(task => ({
      ...task.toObject(),
      completed: user.completedTasks.some(ct => ct.taskId.toString() === task._id.toString())
    }));

    res.json({ tasks: tasksWithStatus });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Complete a task
router.post('/complete', auth, async (req, res) => {
  try {
    const { task_id } = req.body;
    
    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if task already completed
    const alreadyCompleted = user.completedTasks.some(
      ct => ct.taskId.toString() === task_id
    );
    
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Add task to completed tasks and update points
    user.completedTasks.push({ taskId: task_id });
    user.points += task.points;

    // Check for new badges
    const badges = await Badge.find({ 
      pointsRequired: { $lte: user.points },
      isActive: true 
    });
    
    const newBadges = [];
    badges.forEach(badge => {
      const alreadyHasBadge = user.badges.some(
        ub => ub.badgeId.toString() === badge._id.toString()
      );
      
      if (!alreadyHasBadge) {
        user.badges.push({ badgeId: badge._id });
        newBadges.push(badge);
      }
    });

    await user.save();

    res.json({
      message: 'Task completed successfully',
      points_earned: task.points,
      total_points: user.points,
      new_badges: newBadges
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ message: 'Server error completing task' });
  }
});

module.exports = router;
