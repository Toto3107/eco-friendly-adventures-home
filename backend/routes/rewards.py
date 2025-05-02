
from flask import Blueprint, request, jsonify
from models import User, Badge, UserBadge, db
from routes.auth import token_required

rewards_bp = Blueprint('rewards', __name__)

# Get all badges
@rewards_bp.route('/rewards', methods=['GET'])
@token_required
def get_rewards(current_user):
    # Get all badges
    badges = Badge.query.order_by(Badge.points_required).all()
    
    # Get user's earned badges
    user_badges = UserBadge.query.filter_by(user_id=current_user.id).all()
    earned_badge_ids = [ub.badge_id for ub in user_badges]
    
    # Format response
    badges_list = []
    for badge in badges:
        badges_list.append({
            'id': badge.id,
            'name': badge.name,
            'description': badge.description,
            'icon': badge.icon,
            'pointsRequired': badge.points_required,
            'unlocked': badge.id in earned_badge_ids
        })
    
    return jsonify({
        'badges': badges_list,
        'userPoints': current_user.points
    }), 200
