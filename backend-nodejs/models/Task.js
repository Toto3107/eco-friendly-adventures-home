
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['energy', 'water', 'waste', 'transport', 'food', 'general'],
    default: 'general'
  },
  points: {
    type: Number,
    default: 10
  },
  icon: {
    type: String,
    default: '🌱'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
