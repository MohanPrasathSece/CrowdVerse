import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// News cache management
const NEWS_CACHE_KEY = 'crowdverse_news_cache';
const NEWS_CACHE_TIMESTAMP_KEY = 'crowdverse_news_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Sample news data as fallback
const SAMPLE_NEWS = [
  {
    title: "Fed Signals Rate Pause Amid Economic Uncertainty",
    source: "Reuters",
    time: "2 hours ago",
    category: "Markets",
    sentiment: "neutral",
    summary: "Federal Reserve officials indicate potential pause in rate hikes as economic data shows mixed signals..."
  },
  {
    title: "Bitcoin Surges Past $45,000 as Institutional Interest Grows",
    source: "CoinDesk",
    time: "4 hours ago", 
    category: "Crypto",
    sentiment: "bullish",
    summary: "Major financial institutions announce increased crypto allocations, driving Bitcoin to new monthly highs..."
  },
  {
    title: "Tech Stocks Lead Market Rally on AI Optimism",
    source: "Bloomberg",
    time: "5 hours ago",
    category: "Equities", 
    sentiment: "bullish",
    summary: "Nasdaq jumps 2% as AI-related companies report strong earnings and positive outlooks..."
  }
];

class NewsService {
  // Check if cache is valid (less than 24 hours old)
  isCacheValid() {
    const timestamp = localStorage.getItem(NEWS_CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheAge = Date.now() - parseInt(timestamp);
    return cacheAge < CACHE_DURATION;
  }

  // Get cached news
  getCachedNews() {
    try {
      const cachedNews = localStorage.getItem(NEWS_CACHE_KEY);
      return cachedNews ? JSON.parse(cachedNews) : null;
    } catch (error) {
      console.error('Error parsing cached news:', error);
      return null;
    }
  }

  // Set news cache
  setCachedNews(news) {
    try {
      localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(news));
      localStorage.setItem(NEWS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error caching news:', error);
    }
  }

  // Format time ago from timestamp
  formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  // Fetch news from API or return cached
  async fetchNews() {
    // Return cached news if still valid
    if (this.isCacheValid()) {
      const cachedNews = this.getCachedNews();
      if (cachedNews) {
        console.log('📰 Using cached news data');
        return cachedNews;
      }
    }

    try {
      console.log('📰 Fetching fresh news data');
      
      // Try to fetch from API
      const response = await API.get('/news/market');
      const newsData = response.data;
      
      // Format the news data with proper time formatting
      const formattedNews = newsData.map(article => ({
        title: article.title,
        source: article.source || 'Market News',
        time: this.formatTimeAgo(article.publishedAt || Date.now()),
        category: article.category || 'Markets',
        sentiment: article.sentiment || 'neutral',
        summary: article.summary || article.description || article.content?.substring(0, 150) + '...'
      }));

      // Cache the formatted news
      this.setCachedNews(formattedNews);
      
      return formattedNews;
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // If API fails, use sample data with current timestamps
      console.log('📰 Using sample news data as fallback');
      const sampleNewsWithTime = SAMPLE_NEWS.map(news => ({
        ...news,
        time: this.formatTimeAgo(Date.now() - Math.random() * 6 * 60 * 60 * 1000) // Random time within last 6 hours
      }));
      
      // Cache sample data for a shorter period (1 hour)
      try {
        localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(sampleNewsWithTime));
        localStorage.setItem(NEWS_CACHE_TIMESTAMP_KEY, (Date.now() + 23 * 60 * 60 * 1000).toString()); // Cache for 23 hours
      } catch (cacheError) {
        console.error('Error caching sample news:', cacheError);
      }
      
      return sampleNewsWithTime;
    }
  }

  // Clear news cache (for testing or manual refresh)
  clearCache() {
    localStorage.removeItem(NEWS_CACHE_KEY);
    localStorage.removeItem(NEWS_CACHE_TIMESTAMP_KEY);
    console.log('📰 News cache cleared');
  }
}

const newsService = new NewsService();
export default newsService;
