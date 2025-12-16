import axios from 'axios';

// Direct backend URL (FastAPI), configurable via env for prod
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for AI responses
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      // No response means either connection refused or CORS blocked
      if (error.code === 'ECONNREFUSED' || 
          error.message === 'Network Error' || 
          error.message.includes('NetworkError') ||
          error.message.includes('ERR_CONNECTION_REFUSED')) {
        error.message = 'Cannot connect to server. Please make sure the backend is running on http://127.0.0.1:8000. Try restarting the frontend dev server.';
      } else if (error.message.includes('CORS') || error.code === 'ERR_CORS') {
        error.message = 'CORS error: Backend may not be allowing requests from this origin. Check CORS configuration.';
      } else {
        error.message = `Network error: ${error.message || 'Could not reach the server'}`;
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signin: async (email, password) => {
    const response = await api.post('/signin', { email, password });
    return response.data;
  },
  signup: async (username, email, password) => {
    const response = await api.post('/signup', { username, email, password });
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/api/v1/projects/get');
    return response.data;
  },
  create: async (name, description) => {
    const response = await api.post('/api/v1/projects/create', { name, description });
    return response.data;
  },
  update: async (projectId, projectName, projectDescription) => {
    const response = await api.put(`/api/v1/projects/update/${projectId}`, {
      projectName,
      projectDescription,
    });
    return response.data;
  },
  delete: async (projectId) => {
    const response = await api.delete(`/api/v1/projects/delete/${projectId}`);
    return response.data;
  },
};

// Chats API
export const chatsAPI = {
  getByProject: async (projectId) => {
    const response = await api.get(`/api/v1/projects/chat/get/${projectId}`);
    return response.data;
  },
  create: async (projectId, name, description, botProvider) => {
    const response = await api.post(`/api/v1/projects/chat/create/${projectId}`, {
      name,
      description,
      bot_provider: botProvider,
    });
    return response.data;
  },
  sendMessage: async (chatId, message) => {
    const response = await api.post(`/api/v1/projects/chat/messages/${chatId}`, {
      message,
    });
    return response.data;
  },
  updateBot: async (chatId, botProvider) => {
    const response = await api.patch(`/api/v1/projects/chat/updatebot/${chatId}`, {
      bot_provider: botProvider,
    });
    return response.data;
  },
};

export default api;

