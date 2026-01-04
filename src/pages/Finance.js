import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../services/newsService';
import CommentsPanel from '../components/CommentsPanel';
import { AuthContext } from '../context/AuthContext';
import { votePoll } from '../utils/apiEnhanced';

const marketNarrative = [
  {
    phase: 'Opening Pulse',
    headline: 'Indices shrugged off overnight weakness with a gap-up start.',
    detail:
      'Banking heavyweights carried the first hour as buy programs fired across high-beta names, setting the tone for a risk-on session.',
    metricLabel: 'NIFTY 50',
    metricValue: '19,674.25',
    metricDelta: '+1.21% on the day',
  },
  {
    phase: 'Midday Momentum',
    headline: 'Crypto joined the rally as BTC defended the $66K shelf and accelerated.',
    detail:
      'Flows rotated from defensives into growth trades; desks reported stronger appetite for digital assets as volatility stayed contained.',
    metricLabel: 'BTC/USD',
    metricValue: '$67,234',
    metricDelta: '+3.29% in 24h',
  },
  {
    phase: 'Closing Narrative',
    headline: 'Market breadth stayed constructive while liquidity pockets remained deep.',
    detail:
      'Crypto market cap reclaimed the $2.8T handle and equity futures held gains, hinting at follow-through if macro data cooperates overnight.',
    metricLabel: 'Crypto Market Cap',
    metricValue: '$2.85T',
    metricDelta: '+4.2% across 24h',
  },
];

const lookoutSignals = [
  'Options order flow tilts bullish with weekly call skew rising 12%.',
  'Emerging market ETFs continue to attract inflows, supporting broader risk tone.',
  'Liquidity conditions stable; overnight funding spreads holding near one-month lows.',
];

const Finance = () => {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [trendingNews, setTrendingNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [activeNewsId, setActiveNewsId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Fetch news on component mount
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const news = await newsService.fetchNews();
        setTrendingNews(news.slice(0, 3)); // First 3 for trending
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();

    return () => clearTimeout(timer);
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    if (!user) return alert('Please login to vote');
    try {
      const { data: updatedPoll } = await votePoll(pollId, optionIndex);
      setTrendingNews(prev => prev.map(item => {
        if (item.poll && item.poll._id === pollId) {
          return { ...item, poll: updatedPoll };
        }
        return item;
      }));
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const toggleComments = (id) => {
    setActiveNewsId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-primary-black">
      {/* Beta Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-blue-300">
              🚀 We're in Beta Mode! Join us early and help shape the future of market analytics.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="w-full max-w-5xl space-y-8 py-6 sm:py-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-off-white tracking-tight">Welcome to CrowdVerse</h1>
            <p className="text-base sm:text-lg text-light-gray/80 leading-relaxed max-w-3xl">
              See what's trending in the market or switch to your preferred market
            </p>
            <p className="text-base sm:text-lg text-light-gray/80 leading-relaxed max-w-3xl">
              Real-time crowd sentiment on every stock & cryptocurrency - voted by traders, summarised by AI.
            </p>
            <div className="h-px w-48 bg-dark-gray/50"></div>
          </div>
        </div>


        {/* CTA Section - Markets */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 transition-all duration-700 delay-200 ${isVisible ? 'animate-slideInUp' : 'opacity-0'}`}>
          <Link
            to="/dashboard"
            state={{ activeView: 'stocks' }}
            className="group border border-off-white/20 rounded-xl p-8 bg-transparent hover:border-off-white/40 transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 border border-off-white/30 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-off-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-off-white mb-2">Stock Markets</h3>
                <p className="text-sm sm:text-base text-light-gray/60 mb-4">
                  Trade global equities with real-time data
                </p>
                <div className="flex items-center text-off-white/80 text-sm">
                  <span>Explore Markets</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard"
            state={{ activeView: 'crypto' }}
            className="group border border-off-white/20 rounded-xl p-8 bg-transparent hover:border-off-white/40 transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 border border-off-white/30 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-off-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-off-white mb-2">Crypto Markets</h3>
                <p className="text-sm sm:text-base text-light-gray/60 mb-4">
                  Digital assets with advanced analytics
                </p>
                <div className="flex items-center text-off-white/80 text-sm">
                  <span>Explore Markets</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard"
            state={{ activeView: 'commodities' }}
            className="group border border-off-white/20 rounded-xl p-8 bg-transparent hover:border-off-white/40 transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 border border-off-white/30 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-off-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-off-white mb-2">Commodities</h3>
                <p className="text-sm sm:text-base text-light-gray/60 mb-4">
                  Precious metals and energy resources
                </p>
                <div className="flex items-center text-off-white/80 text-sm">
                  <span>Explore Markets</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Trending News Section */}
        <div className={`mb-12 transition-all duration-700 delay-400 ${isVisible ? 'animate-slideInUp' : 'opacity-0'}`}>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-off-white mb-2">Trending Market News</h2>
            <p className="text-sm sm:text-base text-light-gray/70">Stay updated with the latest market movements and insights</p>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="border border-dark-gray/50 rounded-xl p-6 bg-primary-black/40 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-16 h-6 bg-dark-gray/60 rounded-full"></div>
                    <div className="w-20 h-4 bg-dark-gray/60 rounded"></div>
                  </div>
                  <div className="h-6 bg-dark-gray/60 rounded mb-2"></div>
                  <div className="h-12 bg-dark-gray/60 rounded mb-3"></div>
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-4 bg-dark-gray/60 rounded"></div>
                    <div className="w-12 h-4 bg-dark-gray/60 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingNews.map((news, index) => (
                <div key={index} className="border border-dark-gray/50 rounded-2xl p-8 bg-primary-black/40 hover:border-off-white/30 transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${news.category === 'Crypto' ? 'bg-blue-500/20 text-blue-400' :
                      news.category === 'Markets' ? 'bg-purple-500/20 text-purple-400' :
                        news.category === 'Equities' ? 'bg-green-500/20 text-green-400' :
                          'bg-orange-500/20 text-orange-400'
                      }`}>
                      {news.category}
                    </span>
                    <span className="text-xs text-light-gray/50">{news.time}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-off-white mb-3 group-hover:text-white transition-colors leading-tight line-clamp-2">
                    {news.title}
                  </h3>



                  {/* Poll (votes) */}
                  {news.poll && (
                    <div className="mt-4 mb-4 bg-primary-black/50 rounded-xl p-4 border border-dark-gray/50">
                      <h3 className="text-off-white font-semibold mb-3 flex items-center gap-2 text-base sm:text-lg">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a 2 2 0 002 2h2a2 2 0 002-2m0 0V5a 2 2 0 012-2h2a2 2 0 012 2v14a 2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {news.poll.question}
                      </h3>
                      <div className="space-y-3">
                        {news.poll.options.map((option, idx) => {
                          const totalVotes = news.poll.options.reduce((acc, curr) => acc + curr.votes, 0);
                          const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);

                          const userId = user?.isGuest ? user.id : user?._id;
                          const isVoted = news.poll.voters?.some(v => {
                            if (typeof v === 'object' && v !== null) {
                              return String(v.userId) === String(userId) && v.optionIndex === idx;
                            }
                            return false;
                          });

                          return (
                            <button
                              key={idx}
                              onClick={() => handleVote(news.poll._id, idx)}
                              className="w-full relative group"
                              disabled={!user}
                            >
                              <div className="absolute inset-0 bg-dark-gray/30 rounded-lg overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 ${isVoted ? 'bg-emerald-500/20' : 'bg-blue-600/20'}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <div className={`relative flex items-center justify-between p-4 rounded-lg border border-dark-gray/50 group-hover:border-off-white/30 transition-all text-base sm:text-lg ${isVoted ? 'border-emerald-500/50' : ''}`}>
                                <span className={`font-semibold ${isVoted ? 'text-emerald-400' : 'text-off-white/90'}`}>{option.text}</span>
                                <span className="text-light-gray/60 text-sm">{percentage}% ({option.votes})</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {!user && <p className="text-[10px] text-red-400 mt-2 text-center">Login to vote</p>}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-dark-gray/50 mt-2">
                    <button
                      onClick={() => news.id && toggleComments(news.id)}
                      className="flex items-center gap-2 text-xs text-light-gray/70 hover:text-off-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a 2 2 0 01-2-2V6a 2 2 0 012-2h14a 2 2 0 012 2v8a 2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>{activeNewsId === news.id ? 'Hide Discussion' : 'Join Discussion'}</span>
                    </button>

                    <div className={`flex items-center gap-1 text-xs ${news.sentiment === 'bullish' ? 'text-green-400' :
                      news.sentiment === 'bearish' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {news.sentiment}
                    </div>
                  </div>

                  {activeNewsId === news.id && news.id && (
                    <div className="mt-4 animate-fadeIn">
                      <CommentsPanel asset={news.id} isNews={true} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Finance Page Comments */}
        <div className="mt-12">
          <CommentsPanel asset="finance-overview" />
        </div>

        {/* Full News with Polls and Comments - REMOVED */}

        {/* Narrative Flow */}
        {marketNarrative.map((scene) => (
          <div
            key={scene.phase}
            className="p-6 sm:p-8 border border-dark-gray/60 rounded-3xl bg-primary-black/60 backdrop-blur-sm hover-enlarge transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-4">
              <div className="space-y-2 max-w-3xl">
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-light-gray/60">{scene.phase}</span>
                <h2 className="text-lg sm:text-2xl font-semibold text-off-white">{scene.headline}</h2>
                <p className="text-sm text-light-gray/70 leading-relaxed">{scene.detail}</p>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[220px] text-left sm:text-right">
                <div className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-light-gray/60">{scene.metricLabel}</div>
                <div className="text-2xl sm:text-3xl font-semibold text-off-white">{scene.metricValue}</div>
                <div className="text-sm text-green-400 mt-1">{scene.metricDelta}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Signals to Watch */}
        <div className={`bg-gradient-bg p-6 sm:p-8 rounded-3xl border border-dark-gray/70 mb-8 hover-glow transition-all duration-1000 delay-500 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
          <h3 className="text-xl sm:text-2xl font-bold text-off-white mb-4">Signals on the Radar</h3>
          <p className="text-sm text-light-gray/70 mb-6 max-w-3xl">
            These are the threads we’re following into the next session—the moves beneath the headline numbers that could steer the narrative from here.
          </p>
          <ul className="space-y-3 sm:space-y-4 list-disc list-inside text-light-gray/80 text-sm">
            {lookoutSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Finance;
