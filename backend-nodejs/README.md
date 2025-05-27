
# Ecowatt Node.js Backend

A RESTful API backend for the Ecowatt environmental awareness application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- Task management with point system
- Environmental quiz with scoring
- Badge/reward system
- User profile management
- JWT-based authentication
- MongoDB integration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend-nodejs
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecowatt
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
BCRYPT_SALT_ROUNDS=12
```

5. Start MongoDB (if running locally)

6. Seed the database:
```bash
npm run seed
```

7. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all tasks (requires auth)
- `POST /api/tasks/complete` - Complete a task (requires auth)

### Quiz
- `GET /api/quiz` - Get quiz questions (requires auth)
- `POST /api/quiz/submit` - Submit quiz answer (requires auth)

### Rewards
- `GET /api/rewards` - Get user rewards and badges (requires auth)

### Profile
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)

### Health Check
- `GET /api/health` - Health check endpoint

## Project Structure

```
backend-nodejs/
├── models/
│   ├── User.js          # User model with authentication
│   ├── Task.js          # Task model
│   ├── Question.js      # Quiz question model
│   └── Badge.js         # Badge/reward model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── tasks.js         # Task management routes
│   ├── quiz.js          # Quiz routes
│   ├── rewards.js       # Rewards and badges routes
│   └── profile.js       # User profile routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── server.js            # Main server file
├── seed.js              # Database seeding script
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md           # This file
```

## Database Models

### User
- username, email, password
- points, completedTasks, quizAnswers, badges
- Authentication methods and relationships

### Task
- text, description, category, points, icon
- Active status for managing available tasks

### Question
- text, options, correctAnswer, category, difficulty
- Points awarded for correct answers

### Badge
- name, description, icon, pointsRequired
- Category and active status

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Helmet for security headers
- Input validation and sanitization

## Development

For development, use:
```bash
npm run dev
```

This starts the server with nodemon for auto-restart on file changes.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Set a strong JWT secret
4. Configure proper CORS origins
5. Run with `npm start`

## Testing the API

You can test the API endpoints using tools like:
- Postman
- curl commands
- Your React frontend application

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

## Support

For issues and questions, please check the API responses and server logs. All endpoints return appropriate HTTP status codes and error messages.
