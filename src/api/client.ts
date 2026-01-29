import axios from 'axios'

// Utiliser l'URL complète pour le développement et production
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://127.0.0.1:8080/api/v1' 
  : '/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const healthClient = axios.create({
  baseURL: import.meta.env.DEV 
    ? 'http://127.0.0.1:8080/api/health' 
    : '/api/health',
  headers: {
    'Content-Type': 'application/json',
  },
})
