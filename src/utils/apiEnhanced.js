import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Existing exports omitted for brevity in this snippet
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getQuote = (symbol) => API.get('/market/quote', { params: { symbol } });
export const getCryptoMarkets = () => API.get('/market/crypto');
export const getStockMarkets = () => API.get('/market/stocks');

/* --- New Poll & Comment helpers --- */
export const getSentiment = (asset) => API.get(`/assets/${asset}/sentiment`);
export const voteSentiment = (asset, sentiment) => API.post(`/assets/${asset}/sentiment`, { sentiment });
export const getMySentiment = (asset) => API.get(`/assets/${asset}/sentiment/me`);

export const getIntent = (asset) => API.get(`/assets/${asset}/intent`);
export const voteIntent = (asset, action) => API.post(`/assets/${asset}/intent`, { action });
export const getMyIntent = (asset) => API.get(`/assets/${asset}/intent/me`);

export const getComments = (asset, page = 1, limit = 20) =>
  API.get(`/assets/${asset}/comments`, { params: { page, limit } });
export const addComment = (asset, text) => API.post(`/assets/${asset}/comments`, { text });
export const editComment = (id, text) => API.patch(`/assets/comments/${id}`, { text });
export const deleteComment = (id) => API.delete(`/assets/comments/${id}`);

export const getAISummary = (assetName, recentComments = [], recentNews = [], marketSentiment = '', refresh = false) =>
  API.post('/ai-summary', { asset_name: assetName, recent_comments: recentComments, recent_news: recentNews, market_sentiment: marketSentiment, refresh });

export default API;
