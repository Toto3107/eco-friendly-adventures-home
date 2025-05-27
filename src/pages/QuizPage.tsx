
import React, { useState } from 'react';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "Which of these actions saves the most water?",
      options: ["Taking shorter showers", "Using a dishwasher instead of washing by hand", "Turning off the tap while brushing teeth", "Washing clothes in cold water"],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "What is the most effective way to reduce your carbon footprint?",
      options: ["Using public transportation", "Eating less meat", "Recycling regularly", "Using energy-efficient appliances"],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "Which material takes the longest to decompose in a landfill?",
      options: ["Paper", "Aluminum cans", "Plastic bottles", "Glass bottles"],
      correctAnswer: 2
    },
    {
      id: 4,
      text: "What percentage of the Earth's surface is covered by water?",
      options: ["50%", "60%", "70%", "80%"],
      correctAnswer: 2
    },
    {
      id: 5,
      text: "Which of these is NOT a renewable resource?",
      options: ["Solar energy", "Wind power", "Natural gas", "Hydroelectric power"],
      correctAnswer: 2
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  return (
    <div className="container fade-in" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', color: 'var(--primary)', textAlign: 'center', marginBottom: '2rem' }}>
        Environmental Quiz
      </h2>
      
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {!showResult ? (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ backgroundColor: 'var(--soft-green)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                Question {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              {currentQuestion.text}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showFeedback && handleOptionSelect(index)}
                  disabled={showFeedback}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: 'none',
                    textAlign: 'left',
                    cursor: showFeedback ? 'default' : 'pointer',
                    backgroundColor: showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? '#D1F0C2'
                        : index === selectedOption
                          ? '#FFDEE2'
                          : 'white'
                      : 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {option}
                  {showFeedback && index === currentQuestion.correctAnswer && (
                    <span style={{ marginLeft: '1rem', color: 'var(--primary)' }}>✓</span>
                  )}
                  {showFeedback && index === selectedOption && index !== currentQuestion.correctAnswer && (
                    <span style={{ marginLeft: '1rem', color: 'red' }}>✕</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quiz Complete!</h3>
            <p style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
              Your Score: {score}/{questions.length}
            </p>
            
            <p style={{ marginBottom: '2rem' }}>
              {score === questions.length
                ? "Perfect score! You're an eco-expert! 🌍"
                : score >= questions.length / 2
                  ? "Great job! You know your environmental facts! 🌱"
                  : "Keep learning about environmental issues! 💚"}
            </p>
            
            <button
              onClick={resetQuiz}
              className="button"
              style={{ display: 'inline-block' }}
            >
              Take Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
