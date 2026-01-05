import React, { useEffect, useState, useContext } from 'react';
import newsService from '../services/newsService';
import { votePoll } from '../utils/apiEnhanced';
import CommentsPanel from '../components/CommentsPanel';
import { AuthContext } from '../context/AuthContext';

const News = () => {
    const { user } = useContext(AuthContext);
    const [newsItems, setNewsItems] = useState(() => {
        try {
            const cached = localStorage.getItem('crowdverse_news_cache_v2_General');
            return cached ? JSON.parse(cached) : [];
        } catch (e) {
            console.error('Failed to parse news cache:', e);
            return [];
        }
    });
    const [loading, setLoading] = useState(newsItems.length === 0);
    const [activeNewsId, setActiveNewsId] = useState(null);


    const fetchAllNews = async (forceRefresh = false) => {
        try {
            setLoading(true);
            const data = await newsService.fetchNews('General', forceRefresh);

            if (!Array.isArray(data)) {
                console.error('News data is not an array:', data);
                setNewsItems([]);
                return;
            }

            // Strict frontend exclusion of money news just in case
            const filteredData = data.filter(item => {
                if (!item) return false;
                const moneyCats = ['Crypto', 'Stocks', 'Commodities', 'Markets', 'Equities'];
                if (moneyCats.includes(item.category)) return false;

                const moneyKeywords = /bitcoin|crypto|stock market|nifty|sensex|commodity|gold price|silver price|crude oil/i;
                if (item.title && moneyKeywords.test(item.title)) return false;

                return true;
            });

            setNewsItems(filteredData);
            // If cache was valid but returned too few articles, force a real fetch
            if (filteredData.length < 5 && !forceRefresh) {
                console.log('Too few general news items in cache, forcing refresh...');
                fetchAllNews(true);
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllNews();
    }, []);

    const handleVote = async (pollId, optionIndex) => {
        if (!user) return alert('Please login to vote');
        try {
            const { data: updatedPoll } = await votePoll(pollId, optionIndex);
            setNewsItems(prev => prev.map(item => {
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
        setActiveNewsId(activeNewsId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-black flex items-center justify-center">
                <div className="text-off-white animate-pulse">Loading Global Intelligence...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-5xl font-semibold text-off-white mb-4">World Intelligence</h1>
                        <p className="text-light-gray/70 text-lg">Curated perspective on Politics, Geopolitics, and Foreign Affairs — stripped of market noise.</p>
                    </div>
                    <button
                        onClick={() => fetchAllNews(true)}
                        className="px-6 py-2 border border-off-white/20 rounded-lg text-off-white hover:bg-off-white hover:text-primary-black transition-all flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Refreshing...' : 'Refresh Intelligence'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                    {newsItems.map((item) => (
                        <div
                            key={item._id || item.id}
                            className="bg-secondary-black/30 border border-dark-gray/60 rounded-xl overflow-hidden hover:border-off-white/20 transition-all h-full flex flex-col"
                        >
                            <div className="p-4 sm:p-5 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.category === 'Politics' ? 'bg-blue-500/20 text-blue-400' :
                                        item.category === 'Geopolitics' ? 'bg-purple-500/20 text-purple-400' :
                                            'bg-emerald-500/20 text-emerald-400'
                                        }`}>
                                        {item.category === 'Geopolitics' ? 'Foreign Affairs' : item.category}
                                    </span>
                                    <span className="text-light-gray/50 text-xs font-medium">{item.source} • {item.time || new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-semibold text-off-white mb-3 leading-tight">{item.title}</h2>
                                <div className="text-light-gray/80 text-base sm:text-lg leading-relaxed mb-4">
                                    <div className="space-y-4">
                                        <p>{item.fullContent || item.summary}</p>
                                    </div>
                                </div>

                                {/* Poll Section */}
                                {item.poll && (
                                    <div className="mb-8 bg-primary-black/50 rounded-xl p-8 border border-dark-gray/50">
                                        <h3 className="text-off-white font-semibold mb-4 flex items-center gap-2 text-xl sm:text-2xl">
                                            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            {item.poll.question}
                                        </h3>
                                        <div className="space-y-3">
                                            {item.poll.options.map((option, idx) => {
                                                const totalVotes = item.poll.options.reduce((acc, curr) => acc + curr.votes, 0);
                                                const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);

                                                // Check if this option is the one the user voted for
                                                const userId = user?.isGuest ? user.id : user?._id;
                                                const isVoted = item.poll.voters?.some(v => {
                                                    if (typeof v === 'object' && v !== null) {
                                                        return String(v.userId) === String(userId) && v.optionIndex === idx;
                                                    }
                                                    // Legacy strings don't track index, so we can't reliably highlight which one was clicked
                                                    return false;
                                                });

                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleVote(item.poll._id, idx)}
                                                        className="w-full relative group"
                                                        disabled={!user}
                                                    >
                                                        <div className="absolute inset-0 bg-dark-gray/30 rounded-lg overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-500 ${isVoted ? 'bg-emerald-500/20' : 'bg-blue-600/20'}`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <div className={`relative flex items-center justify-between p-4 rounded-lg border border-dark-gray/50 group-hover:border-off-white/30 transition-all ${isVoted ? 'border-emerald-500/50' : ''}`}>
                                                            <span className={`font-semibold text-base sm:text-lg ${isVoted ? 'text-emerald-400' : 'text-off-white/90'}`}>{option.text}</span>
                                                            <span className="text-light-gray/60 text-sm">{percentage}% ({option.votes})</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {!user && <p className="text-xs text-red-400 mt-2 text-center">Login to vote</p>}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-dark-gray/50 mt-auto">
                                    <button
                                        onClick={() => toggleComments(item._id)}
                                        className="flex items-center gap-2 text-light-gray/70 hover:text-off-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        <span>{activeNewsId === item._id ? 'Hide Discussion' : 'Join Discussion'}</span>
                                    </button>

                                    <div className="flex items-center gap-2 text-sm text-light-gray/50">
                                        <span>Sentiment:</span>
                                        <span className={`uppercase font-medium ${item.sentiment === 'bullish' ? 'text-green-400' :
                                            item.sentiment === 'bearish' ? 'text-red-400' :
                                                'text-yellow-400'
                                            }`}>
                                            {item.sentiment}
                                        </span>
                                    </div>
                                </div>

                                {activeNewsId === item._id && (
                                    <div className="mt-6 animate-fadeIn">
                                        <CommentsPanel asset={item._id} isNews={true} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default News;
