
from flask import Blueprint, request, jsonify
from models import User, QuizQuestion, UserQuiz, db
from routes.auth import token_required
from routes.tasks import check_for_new_badges
import json

quiz_bp = Blueprint('quiz', __name__)

# Get quiz questions
@quiz_bp.route('/quiz', methods=['GET'])
@token_required
def get_quiz_questions(current_user):
    # Get all quiz questions
    questions = QuizQuestion.query.all()
    
    # Format response
    questions_list = []
    for question in questions:
        questions_list.append({
            'id': question.id,
            'text': question.text,
            'options': json.loads(question.options)
        })
    
    return jsonify({
        'questions': questions_list
    }), 200

# Submit quiz answer
@quiz_bp.route('/quiz/submit', methods=['POST'])
@token_required
def submit_quiz_answer(current_user):
    data = request.get_json()
    
    # Check if required fields are provided
    if not all(k in data for k in ['question_id', 'selected_option']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    question_id = data['question_id']
    selected_option = data['selected_option']
    
    # Check if question exists
    question = QuizQuestion.query.get(question_id)
    if not question:
        return jsonify({'message': 'Question not found'}), 404
    
    # Check if answer is correct
    is_correct = selected_option == question.correct_answer
    
    # Record quiz attempt
    quiz_attempt = UserQuiz(
        user_id=current_user.id,
        question_id=question_id,
        is_correct=is_correct
    )
    
    db.session.add(quiz_attempt)
    
    # Award points if answer is correct
    points_earned = 0
    if is_correct:
        points_earned = 15  # Award 15 points for correct answer
        current_user.points += points_earned
    
    db.session.commit()
    
    # Check for new badges
    new_badges = []
    if is_correct:
        new_badges = check_for_new_badges(current_user)
    
    return jsonify({
        'is_correct': is_correct,
        'correct_answer': question.correct_answer,
        'points_earned': points_earned,
        'total_points': current_user.points,
        'new_badges': new_badges
    }), 200
