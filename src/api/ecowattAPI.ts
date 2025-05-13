
/**
 * Ecowatt API adapter for connecting React frontend to Flask backend
 */

const API_URL = 'http://127.0.0.1:5000/api';

// Define types
type ApiResponse = any;
type LoginCredentials = { email: string; password: string };
type RegisterCredentials = { username: string; email: string; password: string };
type TaskData = { task_id: number };
type QuizSubmission = { question_id: number; selected_option: string | number };
type ProfileUpdate = { name: string };

// Helper function to get auth token from localStorage
const getToken = (): string | null => localStorage.getItem('ecowattToken');

// Helper function for API calls
const apiCall = async (
  endpoint: string, 
  method: string = 'GET', 
  data: any = null
): Promise<ApiResponse> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
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
export const register = (username: string, email: string, password: string): Promise<ApiResponse> => {
  return apiCall('/register', 'POST', { username, email, password });
};

export const login = (email: string, password: string): Promise<ApiResponse> => {
  return apiCall('/login', 'POST', { email, password });
};

export const logout = (): Promise<ApiResponse> => {
  localStorage.removeItem('ecowattToken');
  return apiCall('/logout', 'POST');
};

// Tasks API
export const getTasks = (): Promise<ApiResponse> => {
  return apiCall('/tasks');
};

export const completeTask = (taskId: number): Promise<ApiResponse> => {
  return apiCall('/tasks/complete', 'POST', { task_id: taskId });
};

// Quiz API
export const getQuizQuestions = (): Promise<ApiResponse> => {
  return apiCall('/quiz');
};

export const submitQuizAnswer = (
  questionId: number, 
  selectedOption: string | number
): Promise<ApiResponse> => {
  return apiCall('/quiz/submit', 'POST', { question_id: questionId, selected_option: selectedOption });
};

// Rewards API
export const getRewards = (): Promise<ApiResponse> => {
  return apiCall('/rewards');
};

// Profile API
export const getProfile = (): Promise<ApiResponse> => {
  return apiCall('/profile');
};

export const updateProfile = (name: string): Promise<ApiResponse> => {
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
