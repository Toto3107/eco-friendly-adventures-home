
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  
  return (
    <div>
      <header className="header">
        <nav className="container nav">
          <Link to="/" className="logo">
            <span className="logo-icon">🌿</span>
            <span>Ecowatt</span>
          </Link>
          <div className="nav-links">
            <Link 
              to="/tasks" 
              className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}
            >
              Daily Tasks
            </Link>
            <Link 
              to="/quiz" 
              className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}
            >
              Quiz
            </Link>
            <Link 
              to="/rewards" 
              className={`nav-link ${location.pathname === '/rewards' ? 'active' : ''}`}
            >
              Rewards
            </Link>
            <Link 
              to="/profile" 
              className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              Profile
            </Link>
          </div>
        </nav>
      </header>
      
      <main>
        <Outlet />
      </main>

      <footer style={{ 
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '2rem 0',
        marginTop: '3rem'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <p>© {new Date().getFullYear()} Ecowatt. All rights reserved. Made with 💚 for the planet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
