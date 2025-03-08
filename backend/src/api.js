import axios from 'axios';

const API = axios.create({
   baseURL: 'http://localhost:5000/api/auth',
   withCredentials: false,
});

export const register = (userData) => API.post('/register', userData);
export const login = (userData) => API.post('/login', userData);