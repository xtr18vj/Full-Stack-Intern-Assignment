import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
};

// Authors API
export const authorsApi = {
  getAll: (search?: string) =>
    api.get('/authors', { params: { search } }),
  getById: (id: number) => api.get(`/authors/${id}`),
  create: (data: { name: string; bio?: string }) =>
    api.post('/authors', data),
  update: (id: number, data: { name?: string; bio?: string }) =>
    api.patch(`/authors/${id}`, data),
  delete: (id: number) => api.delete(`/authors/${id}`),
};

// Books API
export const booksApi = {
  getAll: (params?: {
    search?: string;
    authorId?: number;
    available?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/books', { params }),
  getById: (id: number) => api.get(`/books/${id}`),
  create: (data: {
    title: string;
    isbn: string;
    description?: string;
    publishedAt?: string;
    quantity?: number;
    authorId: number;
  }) => api.post('/books', data),
  update: (
    id: number,
    data: {
      title?: string;
      isbn?: string;
      description?: string;
      publishedAt?: string;
      quantity?: number;
      authorId?: number;
    }
  ) => api.patch(`/books/${id}`, data),
  delete: (id: number) => api.delete(`/books/${id}`),
};

// Users API
export const usersApi = {
  getAll: (search?: string) =>
    api.get('/users', { params: { search } }),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: { email: string; password: string; name: string }) =>
    api.post('/users', data),
};

// Borrows API
export const borrowsApi = {
  getAll: (includeReturned?: boolean) =>
    api.get('/borrows', { params: { includeReturned } }),
  getByUser: (userId: number, includeReturned?: boolean) =>
    api.get(`/borrows/user/${userId}`, { params: { includeReturned } }),
  getById: (id: number) => api.get(`/borrows/${id}`),
  borrow: (data: { userId: number; bookId: number; dueAt?: string }) =>
    api.post('/borrows/borrow', data),
  return: (borrowId: number) =>
    api.post('/borrows/return', { borrowId }),
};

export default api;
