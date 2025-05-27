
import React from 'react';
import leafIcon from "../assets/leaf-icon.svg";
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="fade-in">
      <section className="hero container" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              Welcome to Ecowatt
            </h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              Let's build a greener future together!
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
              Join our community of eco-warriors making a positive impact on the planet through daily sustainable actions.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/tasks" className="button">Start Today's Tasks</Link>
              <Link to="/quiz" className="button secondary">Take a Quiz</Link>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&h=500&fit=crop" 
              alt="Sun light passing through green leaves" 
              style={{ borderRadius: '1rem', width: '400px', height: 'auto' }}
            />
          </div>
        </div>
        
        <div style={{ 
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div className="card">
            <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
              Daily Eco Tasks
            </h3>
            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
              Build sustainable habits with simple daily actions that benefit our planet.
            </p>
          </div>
          
          <div className="card">
            <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
              Fun Eco Quizzes
            </h3>
            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
              Test your environmental knowledge and learn new facts about sustainability.
            </p>
          </div>
          
          <div className="card">
            <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
              Earn Rewards
            </h3>
            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
              Get recognized for your efforts with points and special achievement badges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
