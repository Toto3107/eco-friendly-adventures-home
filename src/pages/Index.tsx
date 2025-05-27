
import { useEffect, useState } from "react";
import leafIcon from "../assets/leaf-icon.svg";

const Index = () => {
  // User data state
  const [userData, setUserData] = useState({
    name: "Eco Warrior",
    points: 120,
    completedTasks: 8,
    badges: [
      { id: 1, title: "Green Hero", description: "Completed 5 eco tasks", icon: "🌱", unlocked: true },
      { id: 2, title: "Plastic-Free Pro", description: "Avoided plastic for 7 days", icon: "🌊", unlocked: true },
      { id: 3, title: "Energy Saver", description: "Reduced energy consumption by 10%", icon: "⚡", unlocked: false },
      { id: 4, title: "Water Guardian", description: "Saved 100 gallons of water", icon: "💧", unlocked: false },
      { id: 5, title: "Zero Waste", description: "Generated no waste for 3 days", icon: "♻️", unlocked: false },
      { id: 6, title: "Nature Explorer", description: "Planted 3 trees", icon: "🌳", unlocked: false },
    ],
  });

  // Daily tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Use a reusable bottle", completed: false },
    { id: 2, text: "Switch off unused lights", completed: false },
    { id: 3, text: "Take a shorter shower", completed: false },
    { id: 4, text: "Use public transportation or walk", completed: false },
    { id: 5, text: "Eat a plant-based meal", completed: false },
    { id: 6, text: "Avoid single-use plastics today", completed: false },
  ]);

  // Quiz state
  const [quizData, setQuizData] = useState({
    question: "Which of these actions saves the most water?",
    options: [
      { id: 1, text: "Taking a shorter shower", correct: false },
      { id: 2, text: "Turning off the tap while brushing teeth", correct: false },
      { id: 3, text: "Using a dishwasher instead of hand-washing", correct: true },
      { id: 4, text: "Washing clothes in cold water", correct: false },
    ],
    answered: false,
    selectedOption: null,
  });

  // Current section state
  const [currentSection, setCurrentSection] = useState("home");
  
  // Username edit state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userData.name);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("ecowattUserData");
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
    
    const savedTasks = localStorage.getItem("ecowattTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("ecowattUserData", JSON.stringify(userData));
  }, [userData]);
  
  useEffect(() => {
    localStorage.setItem("ecowattTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskToggle = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (!task.completed) {
            // Create confetti when completing a task
            createConfetti();
            
            // Add points when marking as complete
            setUserData(prev => ({
              ...prev,
              points: prev.points + 10,
              completedTasks: prev.completedTasks + 1
            }));
          } else {
            // Remove points when un-marking
            setUserData(prev => ({
              ...prev,
              points: Math.max(0, prev.points - 10),
              completedTasks: Math.max(0, prev.completedTasks - 1)
            }));
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const handleQuizAnswer = (optionId) => {
    const selectedOption = quizData.options.find(opt => opt.id === optionId);
    if (quizData.answered) return;
    
    setQuizData(prev => ({
      ...prev,
      answered: true,
      selectedOption: optionId,
    }));
    
    if (selectedOption.correct) {
      // Add points for correct answer
      setUserData(prev => ({
        ...prev,
        points: prev.points + 15
      }));
      createConfetti();
    }
  };

  const resetQuiz = () => {
    setQuizData({
      question: "What is the most effective way to reduce your carbon footprint?",
      options: [
        { id: 1, text: "Buying local produce", correct: false },
        { id: 2, text: "Reducing meat consumption", correct: true },
        { id: 3, text: "Using public transportation", correct: false },
        { id: 4, text: "Recycling properly", correct: false },
      ],
      answered: false,
      selectedOption: null,
    });
  };

  const handleNameSubmit = () => {
    setUserData(prev => ({
      ...prev,
      name: newName
    }));
    setIsEditingName(false);
  };

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
      
      // Animate the confetti
      setTimeout(() => {
        confetti.style.opacity = '1';
        confetti.style.transform = `rotate(${Math.random() * 360}deg) translate(${Math.random() * 100 - 50}px, ${Math.random() * 200 + 50}px)`;
        confetti.style.transition = 'all 1s ease-out';
        
        // Remove the confetti after animation
        setTimeout(() => {
          confetti.style.opacity = '0';
          setTimeout(() => document.body.removeChild(confetti), 1000);
        }, 1000);
      }, Math.random() * 500);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="eco-header">
        <nav className="eco-container eco-nav">
          <div className="eco-logo">
            <span className="logo-icon">🌿</span>
            <span>Ecowatt</span>
          </div>
          <div className="eco-nav-links">
            <button className={`eco-nav-link ${currentSection === 'home' ? 'font-bold text-[#1f7247]' : ''}`} onClick={() => setCurrentSection('home')}>Home</button>
            <button className={`eco-nav-link ${currentSection === 'tasks' ? 'font-bold text-[#1f7247]' : ''}`} onClick={() => setCurrentSection('tasks')}>Daily Tasks</button>
            <button className={`eco-nav-link ${currentSection === 'quiz' ? 'font-bold text-[#1f7247]' : ''}`} onClick={() => setCurrentSection('quiz')}>Quiz</button>
            <button className={`eco-nav-link ${currentSection === 'rewards' ? 'font-bold text-[#1f7247]' : ''}`} onClick={() => setCurrentSection('rewards')}>Rewards</button>
            <button className={`eco-nav-link ${currentSection === 'profile' ? 'font-bold text-[#1f7247]' : ''}`} onClick={() => setCurrentSection('profile')}>Profile</button>
          </div>
        </nav>
      </header>

      <div className="eco-container">
        {/* Home Section */}
        {currentSection === 'home' && (
          <section className="eco-section">
            <div className="eco-hero">
              <div className="eco-hero-content">
                <h1 className="text-4xl font-bold mb-4 text-[#1f7247]">Welcome to Ecowatt</h1>
                <h2 className="text-2xl font-medium mb-6">Let's build a greener future together!</h2>
                <p className="text-lg text-gray-600 mb-8">Join our community of eco-warriors making a positive impact on the planet through daily sustainable actions.</p>
                <div className="flex flex-wrap gap-4">
                  <button className="eco-button" onClick={() => setCurrentSection('tasks')}>Start Today's Tasks</button>
                  <button className="eco-button secondary" onClick={() => setCurrentSection('quiz')}>Take a Quiz</button>
                </div>
              </div>
              <div className="eco-hero-image">
                <img src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&h=500&fit=crop" alt="Sun light passing through green leaves" className="rounded-2xl shadow-lg w-[400px] h-auto" />
              </div>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="eco-card">
                <div className="text-center text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold mb-2 text-center">Daily Eco Tasks</h3>
                <p className="text-center text-gray-600">Build sustainable habits with simple daily actions that benefit our planet.</p>
              </div>
              
              <div className="eco-card">
                <div className="text-center text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-bold mb-2 text-center">Fun Eco Quizzes</h3>
                <p className="text-center text-gray-600">Test your environmental knowledge and learn new facts about sustainability.</p>
              </div>
              
              <div className="eco-card">
                <div className="text-center text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2 text-center">Earn Rewards</h3>
                <p className="text-center text-gray-600">Get recognized for your efforts with points and special achievement badges.</p>
              </div>
            </div>
          </section>
        )}

        {/* Tasks Section */}
        {currentSection === 'tasks' && (
          <section className="eco-section">
            <h2 className="eco-section-title">Daily Eco-Friendly Tasks</h2>
            <p className="text-center text-gray-600 mb-8">Complete these tasks to earn points and help the environment!</p>
            
            <div className="eco-task-list max-w-2xl mx-auto">
              {tasks.map(task => (
                <div key={task.id} className={`eco-task-item ${task.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="eco-task-checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(task.id)}
                  />
                  <span className="eco-task-text">{task.text}</span>
                  {task.completed && <span className="ml-2 text-green-500">+10 points</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quiz Section */}
        {currentSection === 'quiz' && (
          <section className="eco-section">
            <h2 className="eco-section-title">Environmental Quiz</h2>
            <p className="text-center text-gray-600 mb-8">Test your knowledge and learn something new!</p>
            
            <div className="eco-quiz-container">
              <h3 className="eco-quiz-question">{quizData.question}</h3>
              
              <div className="eco-quiz-options">
                {quizData.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`eco-quiz-option ${
                      quizData.answered && option.id === quizData.selectedOption 
                        ? (option.correct ? 'correct' : 'incorrect') 
                        : ''
                    } ${
                      quizData.answered && option.correct ? 'correct' : ''
                    }`}
                    onClick={() => handleQuizAnswer(option.id)}
                  >
                    {option.text}
                    {quizData.answered && option.id === quizData.selectedOption && option.correct && (
                      <span className="ml-2">✅ Correct! +15 points</span>
                    )}
                    {quizData.answered && option.id === quizData.selectedOption && !option.correct && (
                      <span className="ml-2">❌ Incorrect</span>
                    )}
                  </div>
                ))}
              </div>
              
              {quizData.answered && (
                <button className="eco-button mt-6" onClick={resetQuiz}>Next Question</button>
              )}
            </div>
          </section>
        )}

        {/* Rewards Section */}
        {currentSection === 'rewards' && (
          <section className="eco-section">
            <h2 className="eco-section-title">Your Eco Rewards</h2>
            <p className="text-center text-gray-600 mb-4">You have earned <span className="font-bold text-[#1f7247]">{userData.points} points</span> so far!</p>
            <p className="text-center text-gray-600 mb-8">Keep up the good work to unlock more badges.</p>
            
            <div className="eco-badges-grid">
              {userData.badges.map(badge => (
                <div key={badge.id} className="eco-card eco-badge">
                  <div className={`eco-badge-icon ${badge.unlocked ? '' : 'locked'}`}>
                    <span className="text-3xl">{badge.icon}</span>
                  </div>
                  <h3 className="eco-badge-title">{badge.title}</h3>
                  <p className="eco-badge-description">{badge.description}</p>
                  {!badge.unlocked && (
                    <span className="text-xs mt-2 text-gray-500">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Profile Section */}
        {currentSection === 'profile' && (
          <section className="eco-section">
            <h2 className="eco-section-title">Your Profile</h2>
            
            <div className="eco-profile-card">
              <div className="eco-profile-header">
                <div className="eco-profile-avatar">
                  <span className="text-4xl">👤</span>
                </div>
                <div className="eco-profile-info">
                  <h3 className="eco-profile-name">
                    {isEditingName ? (
                      <div className="flex items-center">
                        <input 
                          type="text" 
                          className="eco-input mr-2"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                        <button className="eco-button" onClick={handleNameSubmit}>Save</button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {userData.name}
                        <button 
                          className="ml-2 text-sm text-blue-500"
                          onClick={() => setIsEditingName(true)}
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    )}
                  </h3>
                  <div className="eco-profile-stats">
                    <div className="eco-profile-stat">
                      <div className="eco-profile-stat-value">{userData.points}</div>
                      <div className="eco-profile-stat-label">Points</div>
                    </div>
                    <div className="eco-profile-stat">
                      <div className="eco-profile-stat-value">{userData.completedTasks}</div>
                      <div className="eco-profile-stat-label">Tasks Completed</div>
                    </div>
                    <div className="eco-profile-stat">
                      <div className="eco-profile-stat-value">
                        {userData.badges.filter(b => b.unlocked).length}
                      </div>
                      <div className="eco-profile-stat-label">Badges Earned</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="eco-profile-edit">
                <h4 className="font-medium mb-4">Activity Summary</h4>
                <p className="mb-4">
                  You've been doing great! You've completed {userData.completedTasks} eco-friendly tasks and earned {userData.badges.filter(b => b.unlocked).length} badges.
                  Keep going to unlock more rewards and help make our planet greener!
                </p>
                
                <h4 className="font-medium mt-6 mb-2">Your Impact</h4>
                <p className="text-sm text-gray-600">
                  By completing these eco-friendly tasks, you've potentially:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                  <li>Saved approximately {userData.completedTasks * 2.5} gallons of water</li>
                  <li>Reduced your carbon footprint by {userData.completedTasks * 0.3} kg of CO2</li>
                  <li>Avoided {userData.completedTasks * 0.2} kg of plastic waste</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1f7247] text-white py-8 mt-12">
        <div className="eco-container">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🌿</span>
                <span className="text-xl font-bold">Ecowatt</span>
              </div>
              <p className="mt-2 max-w-md">
                Making sustainability easy, fun, and rewarding for everyone.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-bold mb-2">Quick Links</h4>
                <ul className="space-y-1">
                  <li><button className="text-white hover:underline" onClick={() => setCurrentSection('home')}>Home</button></li>
                  <li><button className="text-white hover:underline" onClick={() => setCurrentSection('tasks')}>Daily Tasks</button></li>
                  <li><button className="text-white hover:underline" onClick={() => setCurrentSection('quiz')}>Quiz</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">More</h4>
                <ul className="space-y-1">
                  <li><button className="text-white hover:underline" onClick={() => setCurrentSection('rewards')}>Rewards</button></li>
                  <li><button className="text-white hover:underline" onClick={() => setCurrentSection('profile')}>Profile</button></li>
                  <li><a className="text-white hover:underline" href="#">About Us</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-green-600 mt-8 pt-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Ecowatt. All rights reserved. Made with 💚 for the planet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
