
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task');
const Question = require('./models/Question');
const Badge = require('./models/Badge');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecowatt')
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedTasks = [
  {
    text: "Use a reusable bottle",
    description: "Replace single-use plastic bottles with a reusable water bottle",
    category: "waste",
    points: 10,
    icon: "💧"
  },
  {
    text: "Switch off unused lights",
    description: "Turn off lights when leaving a room to save energy",
    category: "energy",
    points: 5,
    icon: "💡"
  },
  {
    text: "Take a shorter shower",
    description: "Reduce shower time by 2 minutes to conserve water",
    category: "water",
    points: 8,
    icon: "🚿"
  },
  {
    text: "Use public transportation or walk",
    description: "Choose eco-friendly transportation options",
    category: "transport",
    points: 15,
    icon: "🚌"
  },
  {
    text: "Eat a plant-based meal",
    description: "Choose a vegetarian or vegan meal today",
    category: "food",
    points: 12,
    icon: "🥗"
  },
  {
    text: "Avoid single-use plastics today",
    description: "Say no to plastic bags, straws, and containers",
    category: "waste",
    points: 10,
    icon: "🌱"
  }
];

const seedQuestions = [
  {
    text: "What percentage of the Earth's surface is covered by water?",
    options: ["50%", "60%", "71%", "80%"],
    correctAnswer: 2,
    category: "water",
    difficulty: "easy",
    points: 5
  },
  {
    text: "Which greenhouse gas is most abundant in Earth's atmosphere?",
    options: ["Carbon dioxide", "Methane", "Water vapor", "Nitrous oxide"],
    correctAnswer: 2,
    category: "climate",
    difficulty: "medium",
    points: 10
  },
  {
    text: "How long does it take for a plastic bottle to decompose?",
    options: ["10 years", "50 years", "100 years", "450+ years"],
    correctAnswer: 3,
    category: "waste",
    difficulty: "medium",
    points: 10
  },
  {
    text: "What is the most effective way to reduce your carbon footprint?",
    options: ["Recycling", "Using LED bulbs", "Reducing meat consumption", "Taking shorter showers"],
    correctAnswer: 2,
    category: "climate",
    difficulty: "hard",
    points: 15
  },
  {
    text: "Which renewable energy source generates the most electricity globally?",
    options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
    correctAnswer: 2,
    category: "energy",
    difficulty: "medium",
    points: 10
  }
];

const seedBadges = [
  {
    name: "Eco Starter",
    description: "Complete your first eco-friendly task",
    icon: "🌱",
    pointsRequired: 10,
    category: "tasks"
  },
  {
    name: "Green Warrior",
    description: "Earn 50 points through eco-friendly actions",
    icon: "⚔️",
    pointsRequired: 50,
    category: "tasks"
  },
  {
    name: "Quiz Master",
    description: "Answer 10 quiz questions correctly",
    icon: "🧠",
    pointsRequired: 50,
    category: "quiz"
  },
  {
    name: "Eco Champion",
    description: "Reach 100 points and become an environmental champion",
    icon: "🏆",
    pointsRequired: 100,
    category: "special"
  },
  {
    name: "Planet Protector",
    description: "Earn 200 points protecting our planet",
    icon: "🌍",
    pointsRequired: 200,
    category: "special"
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Task.deleteMany({});
    await Question.deleteMany({});
    await Badge.deleteMany({});

    // Seed tasks
    await Task.insertMany(seedTasks);
    console.log('✅ Tasks seeded successfully');

    // Seed questions
    await Question.insertMany(seedQuestions);
    console.log('✅ Quiz questions seeded successfully');

    // Seed badges
    await Badge.insertMany(seedBadges);
    console.log('✅ Badges seeded successfully');

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
