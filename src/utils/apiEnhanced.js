import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  console.log('API Request - URL:', config.url);
  console.log('API Request - Token:', token);
  console.log('API Request - User data exists:', !!userData);

  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request - Added Bearer token');
  } else if (userData) {
    // For guest users, add user info to headers
    try {
      const user = JSON.parse(userData);
      console.log('API Request - Parsed user data:', user);
      if (user.isGuest) {
        const guestHeader = JSON.stringify({
          id: user.id,
          firstName: user.firstName,
          isGuest: true
        });
        config.headers['X-Guest-User'] = guestHeader;
        console.log('API Request - Added guest header:', guestHeader);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  console.log('API Request - Headers:', config.headers);
  return config;
});

// Existing exports omitted for brevity in this snippet
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getQuote = (symbol) => API.get('/market/quote', { params: { symbol } });
export const getCryptoMarkets = () => API.get('/market/crypto');
export const getStockMarkets = () => API.get('/market/stocks');
export const getCommodityMarkets = () => API.get('/market/commodities');

/* --- New Poll & Comment helpers --- */
export const getSentiment = (asset) => API.get(`/assets/${asset}/sentiment`);
export const voteSentiment = (asset, sentiment) => API.post(`/assets/${asset}/sentiment`, { sentiment });
export const getMySentiment = (asset) => API.get(`/assets/${asset}/sentiment/me`);

export const getIntent = (asset) => API.get(`/assets/${asset}/intent`);
export const voteIntent = (asset, action) => API.post(`/assets/${asset}/intent`, { action });
export const getMyIntent = (asset) => API.get(`/assets/${asset}/intent/me`);

export const getComments = (asset, page = 1, limit = 20) =>
  API.get(`/assets/${asset}/comments`, { params: { page, limit } });
export const addComment = (asset, text, parentId = null) => API.post(`/assets/${asset}/comments`, { text, parentId });
export const editComment = (id, text) => API.patch(`/assets/comments/${id}`, { text });
export const deleteComment = (id) => API.delete(`/assets/comments/${id}`);

// News API
export const getNews = () => API.get('/news');
export const votePoll = (pollId, optionIndex) => API.post(`/news/vote/${pollId}`, { optionIndex });
export const getNewsComments = (newsId) => API.get(`/news/${newsId}/comments`);
export const addNewsComment = (newsId, text, parentId = null) => API.post(`/news/${newsId}/comments`, { text, parentId });

// Prediction API
export const getPredictionPolls = () => API.get('/predictions');
export const votePredictionPoll = (pollId, optionIndex) => API.post(`/predictions/vote/${pollId}`, { optionIndex });
export const getPredictionComments = (pollId) => API.get(`/predictions/${pollId}/comments`);
export const addPredictionComment = (pollId, text, parentId = null) => API.post(`/predictions/${pollId}/comments`, { text, parentId });

export const getAISummary = (assetName, recentComments = [], recentNews = [], marketSentiment = '', refresh = false) =>
  API.post('/ai-summary', { asset_name: assetName, recent_comments: recentComments, recent_news: recentNews, market_sentiment: marketSentiment, refresh });

export default API;
