
from flask import Blueprint, request, jsonify
from models import User, Task, UserTask, Badge, UserBadge, db
from routes.auth import token_required
from datetime import datetime, date

tasks_bp = Blueprint('tasks', __name__)

# Get all tasks
@tasks_bp.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    # Get all tasks
    tasks = Task.query.all()
    
    # Get completed tasks for today
    today = date.today()
    completed_tasks = UserTask.query.filter(
        UserTask.user_id == current_user.id,
        db.func.date(UserTask.date_completed) == today
    ).all()
    
    completed_task_ids = [ut.task_id for ut in completed_tasks]
    
    # Format response
    tasks_list = []
    for task in tasks:
        tasks_list.append({
            'id': task.id,
            'text': task.text,
            'description': task.description,
            'points': task.points,
            'completed': task.id in completed_task_ids
        })
    
    return jsonify({
        'tasks': tasks_list
    }), 200

# Mark task as complete
@tasks_bp.route('/tasks/complete', methods=['POST'])
@token_required
def complete_task(current_user):
    data = request.get_json()
    
    # Check if task_id is provided
    if 'task_id' not in data:
        return jsonify({'message': 'Task ID is required'}), 400
    
    task_id = data['task_id']
    
    # Check if task exists
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    # Check if task is already completed today
    today = date.today()
    existing_completion = UserTask.query.filter(
        UserTask.user_id == current_user.id,
        UserTask.task_id == task_id,
        db.func.date(UserTask.date_completed) == today
    ).first()
    
    if existing_completion:
        # Toggle completion (remove if already completed)
        db.session.delete(existing_completion)
        current_user.points -= task.points
        db.session.commit()
        return jsonify({
            'message': 'Task marked as incomplete',
            'points_removed': task.points,
            'total_points': current_user.points
        }), 200
    
    # Create new task completion
    new_completion = UserTask(
        user_id=current_user.id,
        task_id=task_id,
        date_completed=datetime.utcnow()
    )
    
    # Add points to user
    current_user.points += task.points
    
    db.session.add(new_completion)
    db.session.commit()
    
    # Check for new badges
    new_badges = check_for_new_badges(current_user)
    
    return jsonify({
        'message': 'Task marked as complete',
        'points_earned': task.points,
        'total_points': current_user.points,
        'new_badges': new_badges
    }), 200

# Helper function to check for new badges
def check_for_new_badges(user):
    new_badges = []
    
    # Get all badges that user can earn based on points
    eligible_badges = Badge.query.filter(Badge.points_required <= user.points).all()
    
    for badge in eligible_badges:
        # Check if user already has this badge
        existing_badge = UserBadge.query.filter_by(
            user_id=user.id,
            badge_id=badge.id
        ).first()
        
        if not existing_badge:
            # Award new badge
            new_user_badge = UserBadge(
                user_id=user.id,
                badge_id=badge.id,
                date_awarded=datetime.utcnow()
            )
            
            db.session.add(new_user_badge)
            new_badges.append({
                'id': badge.id,
                'name': badge.name,
                'description': badge.description,
                'icon': badge.icon
            })
    
    if new_badges:
        db.session.commit()
    
    return new_badges
