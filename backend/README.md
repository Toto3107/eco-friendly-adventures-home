
# Ecowatt Backend API

This is the Flask backend API for the Ecowatt application.

## Setup Instructions

1. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following content:
   ```
   SECRET_KEY=your_secret_key_here
   DATABASE_URL=sqlite:///ecowatt.db
   ```

4. Initialize and seed the database:
   ```
   python seed.py
   ```

5. Run the application:
   ```
   python app.py
   ```

The API will be available at http://127.0.0.1:5000/

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks/complete` - Mark task as complete/incomplete

### Quiz
- `GET /api/quiz` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answer

### Rewards
- `GET /api/rewards` - Get all badges and user's unlocked badges

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## Working with the Frontend

To connect this backend with the frontend:

1. Ensure CORS is enabled (already configured in the app)
2. Update the frontend API calls to point to this backend server
3. Use the JWT token for authentication by setting the Authentication header

Example:
```javascript
fetch('http://127.0.0.1:5000/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```
