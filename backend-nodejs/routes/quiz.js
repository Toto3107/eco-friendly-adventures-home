
const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

const router = express.Router();

// Get quiz questions
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true })
      .select('-correctAnswer')
      .limit(10);

    res.json({ questions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Server error fetching quiz questions' });
  }
});

// Submit quiz answer
router.post('/submit', auth, async (req, res) => {
  try {
    const { question_id, selected_option } = req.body;
    
    const question = await Question.findById(question_id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const user = await User.findById(req.user._id);
    const isCorrect = question.correctAnswer === selected_option;
    
    // Record the answer
    user.quizAnswers.push({
      questionId: question_id,
      selectedOption: selected_option,
      isCorrect
    });

    let pointsEarned = 0;
    const newBadges = [];

    if (isCorrect) {
      pointsEarned = question.points;
      user.points += pointsEarned;

      // Check for new badges
      const badges = await Badge.find({ 
        pointsRequired: { $lte: user.points },
        isActive: true 
      });
      
      badges.forEach(badge => {
        const alreadyHasBadge = user.badges.some(
          ub => ub.badgeId.toString() === badge._id.toString()
        );
        
        if (!alreadyHasBadge) {
          user.badges.push({ badgeId: badge._id });
          newBadges.push(badge);
        }
      });
    }

    await user.save();

    res.json({
      is_correct: isCorrect,
      correct_answer: question.correctAnswer,
      points_earned: pointsEarned,
      total_points: user.points,
      new_badges: newBadges
    });
  } catch (error) {
    console.error('Error submitting quiz answer:', error);
    res.status(500).json({ message: 'Server error submitting answer' });
  }
});

module.exports = router;
