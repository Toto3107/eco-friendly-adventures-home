
from flask import Blueprint, request, jsonify
from models import User, UserTask, UserBadge, db
from routes.auth import token_required
from sqlalchemy import func

profile_bp = Blueprint('profile', __name__)

# Get user profile
@profile_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    # Count completed tasks
    task_count = UserTask.query.filter_by(user_id=current_user.id).count()
    
    # Get user badges
    user_badges = UserBadge.query.filter_by(user_id=current_user.id).all()
    badges = [{'id': ub.badge.id, 'name': ub.badge.name, 'icon': ub.badge.icon} for ub in user_badges]
    
    # Format response
    profile = {
        'name': current_user.username,
        'email': current_user.email,
        'points': current_user.points,
        'completedTasks': task_count,
        'joinedDate': current_user.joined_date.isoformat().split('T')[0],
        'badges': badges
    }
    
    return jsonify(profile), 200

# Update user profile
@profile_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    if 'name' in data:
        current_user.username = data['name']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'profile': {
            'name': current_user.username,
            'email': current_user.email,
            'points': current_user.points
        }
    }), 200
