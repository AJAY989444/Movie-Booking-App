import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response error handler (e.g. handle 401s, 403s)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Tokens might have expired
      console.warn('Unauthorized or forbidden action. Clearing token.');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  userLogin: (email, password) => apiClient.post('/auth/users/login', { email, password }),
  adminLogin: (email, password) => apiClient.post('/auth/admins/login', { email, password }),
};

export const userAPI = {
  register: (name, email, password, phoneNumber) => 
    apiClient.post('/users', { name, email, password, phoneNumber }),
  getProfile: () => apiClient.get('/users/me'),
  updatePassword: (oldPassword, newPassword) => 
    apiClient.put('/users/updatePassword', { oldPassword, newPassword }),
  getAllUsers: (pageNo = 0, pageSize = 10, sortBy = 'id', sortDir = 'asc') => 
    apiClient.get(`/users?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`),
  getUserById: (id) => apiClient.get(`/users/${id}`),
};

export const movieAPI = {
  getAll: (status = false, sortBy = 'id', sortDir = 'asc') => 
    apiClient.get(`/movies?status=${status}&sortBy=${sortBy}&sortDir=${sortDir}`),
  getById: (id) => apiClient.get(`/movies/id?id=${id}`),
  getByTitle: (title) => apiClient.get(`/movies/title?title=${title}`),
  create: (formData) => apiClient.post('/movies', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => {
    // Note: backend takes id as a request param, but details are in multipart form
    return apiClient.put(`/movies?id=${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => apiClient.delete(`/movies?id=${id}`),
};

export const hallAPI = {
  getAll: (status = false, page = 0, size = 100, sortBy = 'id', sortDir = 'asc') => 
    apiClient.get(`/halls?status=${status}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
  getById: (id) => apiClient.get(`/halls/id?id=${id}`),
  create: (name, capacity) => apiClient.post('/halls', { name, capacity }),
  update: (id, name, capacity) => apiClient.put(`/halls?id=${id}`, { name, capacity }),
  delete: (id) => apiClient.delete(`/halls?id=${id}`),
};

export const seatAPI = {
  getAll: () => apiClient.get('/seats'),
  getById: (id) => apiClient.get(`/seats/id?id=${id}`),
  getByHall: (hallId) => apiClient.get(`/seats/hall?hallId=${hallId}`),
  create: (seatNumber, hallId) => apiClient.post('/seats', { seatNumber, hallId }),
  update: (id, seatNumber, hallId) => apiClient.put(`/seats?id=${id}`, { seatNumber, hallId }),
  delete: (id) => apiClient.delete(`/seats?id=${id}`),
};

export const showtimeAPI = {
  getByMovieId: (movieId) => apiClient.get(`/showtimes/movie/${movieId}`),
  getAll: () => apiClient.get('/showtimes'),
  getById: (id) => apiClient.get(`/showtimes/${id}`),
  create: (movieId, showtimeDate, startTime, duration, hallId) => 
    apiClient.post(`/showtimes/${movieId}`, {
      showtimeDate,
      startTime,
      duration,
      hall_id: hallId,
    }),
  delete: (id) => apiClient.delete(`/showtimes/${id}`),
};

export const ticketAPI = {
  create: (movieId, userId, seatId, showtimeId, staffId = 0) => 
    apiClient.post(`/tickets/${movieId}`, {
      status: 'BOOKED',
      user_id: userId,
      seat_id: seatId,
      showtime_id: showtimeId,
      staff_id: staffId,
    }),
  getById: (id) => apiClient.get(`/tickets/${id}`),
  getByUserId: (userId) => apiClient.get(`/tickets/user/${userId}`),
  getAll: () => apiClient.get('/tickets'),
  delete: (id) => apiClient.delete(`/tickets/${id}`),
};

export default apiClient;
