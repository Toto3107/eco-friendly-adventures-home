
import React, { useState, useEffect } from 'react';

const TasksPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Use a reusable bottle", completed: false },
    { id: 2, text: "Switch off unused lights", completed: false },
    { id: 3, text: "Take a shorter shower", completed: false },
    { id: 4, text: "Use public transportation or walk", completed: false },
    { id: 5, text: "Eat a plant-based meal", completed: false },
    { id: 6, text: "Avoid single-use plastics today", completed: false },
  ]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("ecowattTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ecowattTasks", JSON.stringify(tasks));
  }, [tasks]);

  const createConfetti = () => {
    const colors = ['#FEC6A1', '#D1F0C2', '#D3E4FD', '#FEF7CD', '#FFDEE2'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 50}%`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.style.opacity = '1';
        confetti.style.transform = `rotate(${Math.random() * 360}deg) translate(${Math.random() * 100 - 50}px, ${Math.random() * 200 + 50}px)`;
        confetti.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
          confetti.style.opacity = '0';
          setTimeout(() => document.body.removeChild(confetti), 1000);
        }, 1000);
      }, Math.random() * 500);
    }
  };

  const handleTaskToggle = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (!task.completed) {
            createConfetti();
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  return (
    <div className="container fade-in" style={{ padding: '2rem 0' }}>
      <h2 style={{ 
        fontSize: '2rem', 
        color: 'var(--primary)', 
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        Daily Eco-Friendly Tasks
      </h2>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {tasks.map(task => (
          <div 
            key={task.id} 
            className="card"
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '1rem',
              opacity: task.completed ? 0.7 : 1
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleTaskToggle(task.id)}
              style={{
                width: '20px',
                height: '20px',
                marginRight: '1rem',
                cursor: 'pointer'
              }}
            />
            <span style={{ 
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'var(--text-light)' : 'var(--text-dark)'
            }}>
              {task.text}
            </span>
            {task.completed && (
              <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}>
                +10 points ✨
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
