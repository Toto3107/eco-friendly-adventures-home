
// Application State
let userPoints = 0;
let completedTasks = 0;
let earnedBadges = 0;

// Sample Data
const tasks = [
    { id: 1, text: "Use a reusable water bottle today", points: 10, completed: false },
    { id: 2, text: "Turn off lights when leaving a room", points: 5, completed: false },
    { id: 3, text: "Walk or bike instead of driving", points: 15, completed: false },
    { id: 4, text: "Recycle paper, plastic, and glass", points: 8, completed: false },
    { id: 5, text: "Unplug electronics when not in use", points: 7, completed: false }
];

const quizQuestions = [
    {
        id: 1,
        text: "What percentage of the Earth's surface is covered by water?",
        options: ["50%", "65%", "71%", "80%"],
        correct: 2,
        points: 10
    },
    {
        id: 2,
        text: "Which gas is most responsible for global warming?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correct: 1,
        points: 15
    },
    {
        id: 3,
        text: "How long does it take for a plastic bottle to decompose?",
        options: ["50 years", "100 years", "450 years", "1000 years"],
        correct: 2,
        points: 12
    }
];

const badges = [
    { id: 1, name: "First Steps", description: "Complete your first eco task", icon: "🌱", pointsRequired: 10, unlocked: false },
    { id: 2, name: "Water Saver", description: "Use reusable water bottles", icon: "💧", pointsRequired: 50, unlocked: false },
    { id: 3, name: "Quiz Master", description: "Answer 5 quiz questions correctly", icon: "🧠", pointsRequired: 75, unlocked: false },
    { id: 4, name: "Eco Warrior", description: "Earn 100 points", icon: "🏆", pointsRequired: 100, unlocked: false }
];

let currentQuizIndex = 0;
let selectedOption = null;

// Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to corresponding nav link
    document.querySelector(`[href="#${pageId}"]`).classList.add('active');
    
    // Load page content
    switch(pageId) {
        case 'tasks':
            loadTasks();
            break;
        case 'quiz':
            loadQuiz();
            break;
        case 'rewards':
            loadRewards();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

// Navigation event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });
    
    // Load initial page
    loadProfile();
    loadRewards();
});

// Tasks functionality
function loadTasks() {
    const container = document.getElementById('tasksContainer');
    container.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <div class="task-text ${task.completed ? 'task-completed' : ''}">${task.text}</div>
            ${task.completed ? `<div class="task-points">+${task.points} points ✨</div>` : ''}
        `;
        container.appendChild(taskElement);
    });
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
        task.completed = true;
        userPoints += task.points;
        completedTasks++;
        
        showNotification(`Task completed! You earned ${task.points} points!`, 'success');
        createConfetti();
        checkBadges();
        loadTasks();
        updateProfile();
    }
}

// Quiz functionality
function loadQuiz() {
    const container = document.getElementById('quizContainer');
    
    if (currentQuizIndex >= quizQuestions.length) {
        currentQuizIndex = 0;
    }
    
    const question = quizQuestions[currentQuizIndex];
    selectedOption = null;
    
    container.innerHTML = `
        <div class="question-card">
            <div class="question-text">${question.text}</div>
            <div class="quiz-options" id="quizOptions">
                ${question.options.map((option, index) => 
                    `<div class="quiz-option" onclick="selectOption(${index})">${option}</div>`
                ).join('')}
            </div>
            <button class="btn btn-primary" onclick="submitAnswer()" id="submitBtn">Submit Answer</button>
        </div>
    `;
}

function selectOption(index) {
    selectedOption = index;
    document.querySelectorAll('.quiz-option').forEach((option, i) => {
        option.classList.remove('selected');
        if (i === index) {
            option.classList.add('selected');
        }
    });
}

function submitAnswer() {
    if (selectedOption === null) {
        showNotification('Please select an answer before submitting.', 'error');
        return;
    }
    
    const question = quizQuestions[currentQuizIndex];
    const isCorrect = selectedOption === question.correct;
    
    // Show correct/incorrect visual feedback
    document.querySelectorAll('.quiz-option').forEach((option, i) => {
        option.style.pointerEvents = 'none';
        if (i === question.correct) {
            option.classList.add('correct');
        } else if (i === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    if (isCorrect) {
        userPoints += question.points;
        showNotification(`Correct! You earned ${question.points} points!`, 'success');
        checkBadges();
        updateProfile();
    } else {
        showNotification('Incorrect! Try again with another question.', 'error');
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuizIndex++;
        loadQuiz();
    }, 2000);
}

// Rewards functionality
function loadRewards() {
    updateProgressBar();
    loadBadges();
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const nextBadge = badges.find(badge => !badge.unlocked);
    const maxPoints = nextBadge ? nextBadge.pointsRequired : 100;
    const progressPercentage = Math.min(100, (userPoints / maxPoints) * 100);
    
    progressFill.style.width = progressPercentage + '%';
    progressText.textContent = `${userPoints} points`;
}

function loadBadges() {
    const container = document.getElementById('badgesGrid');
    container.innerHTML = '';
    
    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = `badge-card ${badge.unlocked ? '' : 'locked'}`;
        badgeElement.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-info">
                <h3>${badge.name}</h3>
                <p>${badge.description}</p>
                <span class="badge-status ${badge.unlocked ? 'unlocked' : 'locked'}">
                    ${badge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
            </div>
        `;
        container.appendChild(badgeElement);
    });
}

function checkBadges() {
    badges.forEach(badge => {
        if (!badge.unlocked && userPoints >= badge.pointsRequired) {
            badge.unlocked = true;
            earnedBadges++;
            showNotification(`New Badge Earned! You've earned the ${badge.name} badge!`, 'success');
        }
    });
}

// Profile functionality
function loadProfile() {
    updateProfile();
}

function updateProfile() {
    document.getElementById('profilePoints').textContent = userPoints;
    document.getElementById('profileTasks').textContent = completedTasks;
    document.getElementById('profileBadges').textContent = earnedBadges;
}

function editProfile() {
    const currentName = document.getElementById('profileName').textContent;
    const newName = prompt('Enter your new name:', currentName);
    if (newName && newName.trim()) {
        document.getElementById('profileName').textContent = newName.trim();
        showNotification('Profile updated successfully!', 'success');
    }
}

// Utility functions
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function createConfetti() {
    const colors = ['#FEC6A1', '#D1F0C2', '#D3E4FD', '#FEF7CD', '#FFDEE2'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 50}%;
            z-index: 10000;
            pointer-events: none;
            border-radius: 50%;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.transition = 'all 1s ease-out';
            confetti.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 200 + 50}px) rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(confetti);
            }, 1000);
        }, Math.random() * 500);
    }
}

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
