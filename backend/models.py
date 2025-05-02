
from app import db
from datetime import datetime

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    points = db.Column(db.Integer, default=0)
    joined_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    tasks = db.relationship('UserTask', backref='user', lazy=True)
    quiz_attempts = db.relationship('UserQuiz', backref='user', lazy=True)
    badges = db.relationship('UserBadge', backref='user', lazy=True)

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500))
    points = db.Column(db.Integer, default=10)
    
    # Relationships
    user_tasks = db.relationship('UserTask', backref='task', lazy=True)

# UserTask model (for tracking completed tasks)
class UserTask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    date_completed = db.Column(db.DateTime, default=datetime.utcnow)

# QuizQuestion model
class QuizQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    options = db.Column(db.String(1000), nullable=False)  # Store as JSON string
    correct_answer = db.Column(db.Integer, nullable=False)  # Index of correct option
    
    # Relationships
    user_quiz_attempts = db.relationship('UserQuiz', backref='question', lazy=True)

# UserQuiz model (for tracking quiz attempts)
class UserQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('quiz_question.id'), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)
    date_attempted = db.Column(db.DateTime, default=datetime.utcnow)

# Badge model
class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    icon = db.Column(db.String(50))  # Emoji or icon reference
    points_required = db.Column(db.Integer, nullable=False)
    
    # Relationships
    user_badges = db.relationship('UserBadge', backref='badge', lazy=True)

# UserBadge model (for tracking earned badges)
class UserBadge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badge.id'), nullable=False)
    date_awarded = db.Column(db.DateTime, default=datetime.utcnow)
