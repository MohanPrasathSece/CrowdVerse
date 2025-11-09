import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

// Market endpoints (backend proxies)
export const getQuote = (symbol) => API.get(`/market/quote`, { params: { symbol } });
export const getCryptoMarkets = () => API.get(`/market/crypto`);
export const getStockMarkets = () => API.get(`/market/stocks`);

export default API;
