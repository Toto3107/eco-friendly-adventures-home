
/**
 * Ecowatt API adapter for connecting React frontend to Flask backend
 */

const API_URL = 'http://127.0.0.1:5000/api';

// Helper function to get auth token from localStorage
const getToken = () => localStorage.getItem('ecowattToken');

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers,
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }
    
    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const register = (username, email, password) => {
  return apiCall('/register', 'POST', { username, email, password });
};

export const login = (email, password) => {
  return apiCall('/login', 'POST', { email, password });
};

export const logout = () => {
  localStorage.removeItem('ecowattToken');
  return apiCall('/logout', 'POST');
};

// Tasks API
export const getTasks = () => {
  return apiCall('/tasks');
};

export const completeTask = (taskId) => {
  return apiCall('/tasks/complete', 'POST', { task_id: taskId });
};

// Quiz API
export const getQuizQuestions = () => {
  return apiCall('/quiz');
};

export const submitQuizAnswer = (questionId, selectedOption) => {
  return apiCall('/quiz/submit', 'POST', { question_id: questionId, selected_option: selectedOption });
};

// Rewards API
export const getRewards = () => {
  return apiCall('/rewards');
};

// Profile API
export const getProfile = () => {
  return apiCall('/profile');
};

export const updateProfile = (name) => {
  return apiCall('/profile', 'PUT', { name });
};

export default {
  register,
  login,
  logout,
  getTasks,
  completeTask,
  getQuizQuestions,
  submitQuizAnswer,
  getRewards,
  getProfile,
  updateProfile
};
