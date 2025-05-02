
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import os
from dotenv import load_dotenv
import jwt

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///ecowatt.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS for all routes
CORS(app, supports_credentials=True)

# Initialize database
db = SQLAlchemy(app)

# Import models after initializing db
from models import User, Task, UserTask, QuizQuestion, UserQuiz, Badge, UserBadge

# Import routes
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.quiz import quiz_bp
from routes.rewards import rewards_bp
from routes.profile import profile_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(tasks_bp, url_prefix='/api')
app.register_blueprint(quiz_bp, url_prefix='/api')
app.register_blueprint(rewards_bp, url_prefix='/api')
app.register_blueprint(profile_bp, url_prefix='/api')

@app.route('/')
def index():
    return jsonify({"message": "Welcome to Ecowatt API!"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
