import React, { useEffect, useState, useContext } from 'react';
import { getNews, votePoll } from '../utils/apiEnhanced';
import CommentsPanel from '../components/CommentsPanel';
import { AuthContext } from '../context/AuthContext';

const News = () => {
    const { user } = useContext(AuthContext);
    const [newsItems, setNewsItems] = useState(() => {
        const cached = localStorage.getItem('cv_news_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(newsItems.length === 0);
    const [activeNewsId, setActiveNewsId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const { data } = await getNews();
                setNewsItems(data);
                localStorage.setItem('cv_news_cache', JSON.stringify(data));
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
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
                <div className="text-off-white animate-pulse">Loading Market Intelligence...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-5xl font-semibold text-off-white mb-4">Market Intelligence</h1>
                    <p className="text-light-gray/70 text-lg">Weekly curated insights on Crypto, Stocks, and Policy affecting the Indian market.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                    {newsItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-secondary-black/30 border border-dark-gray/60 rounded-xl overflow-hidden hover:border-off-white/20 transition-all h-full flex flex-col"
                        >
                            <div className="p-4 sm:p-5 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${item.category === 'Crypto' ? 'bg-blue-500/20 text-blue-400' :
                                        item.category === 'Stocks' ? 'bg-green-500/20 text-green-400' :
                                            'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {item.category}
                                    </span>
                                    <span className="text-light-gray/50 text-sm">{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-semibold text-off-white mb-3 leading-tight">{item.title}</h2>
                                <p
                                    className={`text-light-gray/80 text-base sm:text-lg leading-relaxed mb-4 ${expandedId === item._id ? '' : 'line-clamp-3'}`}
                                >
                                    {item.summary}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                                    className="text-xs text-blue-400 hover:text-blue-300 mb-4 self-start"
                                >
                                    {expandedId === item._id ? 'Show less' : 'Read more'}
                                </button>

                                {/* Poll Section */}
                                {item.poll && (
                                    <div className="mb-8 bg-primary-black/50 rounded-xl p-8 border border-dark-gray/50">
                                        <h3 className="text-off-white font-semibold mb-4 flex items-center gap-2 text-lg sm:text-xl">
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
        </div>
    );
};

export default News;
