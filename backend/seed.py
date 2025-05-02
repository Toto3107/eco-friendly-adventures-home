
import json
from app import app, db
from models import User, Task, Badge, QuizQuestion
from werkzeug.security import generate_password_hash

def seed_database():
    print("Seeding database...")
    
    # Create tasks
    tasks = [
        Task(text="Use a reusable bottle", description="Avoid single-use plastic bottles", points=10),
        Task(text="Switch off unused lights", description="Conserve energy throughout the day", points=10),
        Task(text="Take a shorter shower", description="Conserve water by reducing shower time", points=10),
        Task(text="Use public transportation or walk", description="Reduce carbon emissions from private vehicles", points=10),
        Task(text="Eat a plant-based meal", description="Reduce environmental impact of meat consumption", points=10),
        Task(text="Avoid single-use plastics today", description="Decline plastic straws, bags, and containers", points=10),
    ]
    
    # Create badges
    badges = [
        Badge(name="Green Starter", description="Completed your first eco-friendly task", icon="🌱", points_required=10),
        Badge(name="Eco Enthusiast", description="Earned 50 points through eco-friendly actions", icon="🌿", points_required=50),
        Badge(name="Planet Protector", description="Earned 100 points by being environmentally conscious", icon="🌍", points_required=100),
        Badge(name="Sustainability Champion", description="Reached 200 points with your green habits", icon="🏆", points_required=200),
        Badge(name="Climate Hero", description="An impressive 500 points earned through eco-actions", icon="⭐", points_required=500),
    ]
    
    # Create quiz questions
    questions = [
        QuizQuestion(
            text="Which of these actions saves the most water?",
            options=json.dumps([
                "Taking shorter showers", 
                "Using a dishwasher instead of washing by hand", 
                "Turning off the tap while brushing teeth", 
                "Washing clothes in cold water"
            ]),
            correct_answer=1
        ),
        QuizQuestion(
            text="What is the most effective way to reduce your carbon footprint?",
            options=json.dumps([
                "Using public transportation", 
                "Eating less meat", 
                "Recycling regularly", 
                "Using energy-efficient appliances"
            ]),
            correct_answer=1
        ),
        QuizQuestion(
            text="Which material takes the longest to decompose in a landfill?",
            options=json.dumps([
                "Paper", 
                "Aluminum cans", 
                "Plastic bottles", 
                "Glass bottles"
            ]),
            correct_answer=2
        ),
        QuizQuestion(
            text="What percentage of the Earth's surface is covered by water?",
            options=json.dumps([
                "50%", 
                "60%", 
                "70%", 
                "80%"
            ]),
            correct_answer=2
        ),
        QuizQuestion(
            text="Which of these is NOT a renewable resource?",
            options=json.dumps([
                "Solar energy", 
                "Wind power", 
                "Natural gas", 
                "Hydroelectric power"
            ]),
            correct_answer=2
        ),
    ]
    
    # Add demo user
    demo_user = User(
        username="demo_user",
        email="demo@example.com",
        password_hash=generate_password_hash("password123"),
        points=0
    )
    
    # Add everything to the database
    db.session.add(demo_user)
    
    for task in tasks:
        db.session.add(task)
    
    for badge in badges:
        db.session.add(badge)
    
    for question in questions:
        db.session.add(question)
    
    db.session.commit()
    print("Database seeded successfully!")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_database()
