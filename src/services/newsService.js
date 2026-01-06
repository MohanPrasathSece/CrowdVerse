import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 60000,
});

// News cache management
const NEWS_CACHE_KEY = 'crowdverse_news_cache_v2';
const NEWS_CACHE_TIMESTAMP_KEY = 'crowdverse_news_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Sample news data as fallback
const SAMPLE_NEWS = [
  {
    title: "Global Summit Discusses New Environmental Policies",
    source: "World News",
    time: "2 hours ago",
    category: "Geopolitics",
    sentiment: "neutral",
    summary: "Diplomats from over 50 countries gather to discuss sustainable development and climate action..."
  },
  {
    title: "New Cultural Festival Celebrated Across India",
    source: "India Today",
    time: "4 hours ago",
    category: "Politics",
    sentiment: "neutral",
    summary: "Massive crowds join the festivities as local governments promote traditional heritage and unity..."
  },
  {
    title: "Developments in International Trade Agreements",
    source: "Global Intelligence",
    time: "5 hours ago",
    category: "Geopolitics",
    sentiment: "neutral",
    summary: "New treaties aim to streamline cross-border cooperation and strengthen bilateral ties between nations..."
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
  async fetchNews(category = 'General', refresh = false) {
    const cacheKey = `${NEWS_CACHE_KEY}_${category}`;
    const timestampKey = `${NEWS_CACHE_TIMESTAMP_KEY}_${category}`;

    // Check if cache is valid (less than 24 hours old)
    const timestamp = localStorage.getItem(timestampKey);
    const isValid = timestamp && (Date.now() - parseInt(timestamp) < CACHE_DURATION);

    if (isValid && !refresh) {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Check if cached data is truncated. If top items have "..." or "[+", force a refresh anyway.
            const isTruncated = parsed.slice(0, 10).some(item =>
              (item.summary && (item.summary.includes('...') || item.summary.includes('[+'))) ||
              (item.fullContent && (item.fullContent.includes('...') || item.fullContent.includes('[+')))
            );

            if (!isTruncated) {
              console.log(`📰 Using cached ${category} news data (${parsed.length} items)`);
              return parsed.filter(n => n.source !== 'Yahoo Entertainment');
            } else {
              console.log(`📰 Cached news is truncated. Forcing fresh fetch...`);
            }
          }
        } catch (e) {
          console.error('Error parsing news cache', e);
        }
      }
    }

    try {
      console.log(`📰 Fetching fresh ${category} news data...`);

      // Try to fetch from API
      const response = await API.get('/news', {
        params: {
          category: category === 'All' ? undefined : category,
          refresh: refresh ? 'true' : undefined
        }
      });
      const newsData = response.data;

      if (!Array.isArray(newsData)) {
        throw new Error('API returned invalid news data format');
      }

      // Deduplicate by title (client-side safety check)
      const seenTitles = new Set();
      const uniqueNews = [];

      for (const article of newsData) {
        // Normalize title for stricter comparison: lowercase and only alphanumeric
        const titleKey = (article.title || '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .trim();

        if (!titleKey || seenTitles.has(titleKey)) {
          console.log(`🚫 Skipping duplicate/noisy article: ${article.title}`);
          continue;
        }

        seenTitles.add(titleKey);
        if (article.source === 'Yahoo Entertainment') continue;
        uniqueNews.push(article);
      }

      // Format the news data with proper time formatting and keep identifiers/polls
      const formattedNews = uniqueNews.map(article => ({
        id: article._id || article.id,
        _id: article._id || article.id,
        title: article.title,
        source: article.source || 'Market News',
        time: this.formatTimeAgo(new Date(article.createdAt).getTime()),
        createdAt: article.createdAt,
        category: article.category || 'General',
        sentiment: article.sentiment || 'neutral',
        summary: article.summary || '',
        fullContent: article.content || article.summary || '',
        imageUrl: article.imageUrl,
        url: article.url,
        poll: article.poll || null,
      }));

      // Cache the formatted news
      localStorage.setItem(cacheKey, JSON.stringify(formattedNews));
      localStorage.setItem(timestampKey, Date.now().toString());

      return formattedNews;
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);

      // On error, try one last check of cache even if expired
      const lastResort = localStorage.getItem(cacheKey);
      if (lastResort) {
        try {
          return JSON.parse(lastResort);
        } catch (e) { }
      }

      return SAMPLE_NEWS;
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
