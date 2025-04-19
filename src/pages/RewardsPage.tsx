
import React, { useEffect, useState } from 'react';

type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
};

const RewardsPage = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const savedTasks = localStorage.getItem('ecowattTasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const completed = tasks.filter((task: {completed: boolean}) => task.completed).length;
      setCompletedTasks(completed);
      setUserPoints(completed * 10); // Each task is worth 10 points
    }
  }, []);

  const badges: Badge[] = [
    {
      id: 1,
      name: "Green Starter",
      description: "Completed your first eco-friendly task",
      icon: "🌱",
      pointsRequired: 10
    },
    {
      id: 2,
      name: "Eco Enthusiast",
      description: "Earned 50 points through eco-friendly actions",
      icon: "🌿",
      pointsRequired: 50
    },
    {
      id: 3,
      name: "Planet Protector",
      description: "Earned 100 points by being environmentally conscious",
      icon: "🌍",
      pointsRequired: 100
    },
    {
      id: 4,
      name: "Sustainability Champion",
      description: "Reached 200 points with your green habits",
      icon: "🏆",
      pointsRequired: 200
    },
    {
      id: 5,
      name: "Climate Hero",
      description: "An impressive 500 points earned through eco-actions",
      icon: "⭐",
      pointsRequired: 500
    }
  ];

  return (
    <div className="container fade-in" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', color: 'var(--primary)', textAlign: 'center', marginBottom: '1rem' }}>
        Your Eco Rewards
      </h2>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          backgroundColor: 'var(--soft-green)', 
          display: 'inline-block', 
          padding: '1rem 2rem', 
          borderRadius: '20px',
          marginBottom: '1rem' 
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{userPoints}</span> points
        </div>
        <p>You've completed {completedTasks} eco-friendly tasks!</p>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--primary)' }}>
          You're doing amazing! Keep up the good work! 🌍💚
        </p>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Your Badges</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {badges.map(badge => {
          const isUnlocked = userPoints >= badge.pointsRequired;
          
          return (
            <div 
              key={badge.id}
              className="card"
              style={{
                textAlign: 'center',
                opacity: isUnlocked ? 1 : 0.6,
                transform: isUnlocked ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                {isUnlocked ? badge.icon : '🔒'}
              </div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{badge.name}</h4>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>{badge.description}</p>
              <p>
                <span style={{ 
                  backgroundColor: isUnlocked ? 'var(--soft-green)' : 'var(--soft-gray)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem'
                }}>
                  {isUnlocked ? 'Unlocked!' : `${badge.pointsRequired} points needed`}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsPage;
