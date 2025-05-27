
const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  pointsRequired: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['tasks', 'quiz', 'streak', 'special'],
    default: 'tasks'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);
