import React, { useEffect, useState, useContext } from 'react';
import newsService from '../services/newsService';
import { votePoll } from '../utils/apiEnhanced';
import CommentsPanel from './CommentsPanel';
import NewsIntelligencePanel from './NewsIntelligencePanel';
import { AuthContext } from '../context/AuthContext';

const SectorNews = ({ category, title, description }) => {
    const { user } = useContext(AuthContext);
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeNewsId, setActiveNewsId] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const data = await newsService.fetchNews(category);
                if (data.length < 2) {
                    // Try one force refresh if we got almost nothing
                    const freshData = await newsService.fetchNews(category, true);
                    setNewsItems(freshData);
                } else {
                    setNewsItems(data);
                }
            } catch (error) {
                console.error(`Failed to fetch ${category} news:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [category]);

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
            <div className="py-10 text-center">
                <div className="text-light-gray animate-pulse">Loading {title} News...</div>
            </div>
        );
    }

    if (newsItems.length === 0) return null;

    return (
        <div className="mt-16 mb-12 animate-fadeIn">
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-off-white mb-2">{title} Intelligence</h2>
                <p className="text-light-gray/70">{description || `Latest ${category} updates and community sentiment.`}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsItems.map((item) => (
                    <div
                        key={item.id || item._id}
                        className="bg-secondary-black/30 border border-dark-gray/60 rounded-xl p-6 hover:border-off-white/20 transition-all flex flex-col h-full hover-glow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold px-2 py-0.5 bg-blue-400/10 rounded">
                                {item.source}
                            </span>
                            <span className="text-[10px] text-light-gray/50">{item.time}</span>
                        </div>

                        <h3 className="text-lg font-bold text-off-white mb-3 line-clamp-2 leading-tight">
                            {item.title}
                        </h3>

                        <p className="text-sm text-light-gray/70 leading-relaxed mb-4">
                            {item.fullContent || item.summary}
                        </p>

                        {item.poll && (
                            <div className="mt-auto pt-4 border-t border-dark-gray/30">
                                <h4 className="text-xs font-bold text-off-white/80 mb-3 uppercase tracking-wider">{item.poll.question}</h4>
                                <div className="space-y-2">
                                    {item.poll.options.map((opt, idx) => {
                                        const total = item.poll.options.reduce((a, b) => a + b.votes, 0);
                                        const pct = total === 0 ? 0 : Math.round((opt.votes / total) * 100);

                                        const userId = user?.isGuest ? user.id : user?._id;
                                        const isVoted = item.poll.voters?.some(v =>
                                            typeof v === 'object' && v !== null && String(v.userId) === String(userId) && v.optionIndex === idx
                                        );

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleVote(item.poll._id, idx)}
                                                className="w-full relative py-2 px-3 rounded-lg bg-primary-black/40 border border-dark-gray/50 group overflow-hidden"
                                                disabled={!user}
                                            >
                                                <div
                                                    className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ${isVoted ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                                <div className="relative flex justify-between items-center z-10">
                                                    <span className={`text-[11px] font-bold ${isVoted ? 'text-emerald-400' : 'text-off-white/70'}`}>{opt.text}</span>
                                                    <span className="text-[10px] text-light-gray/50 font-medium">{pct}%</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* AI Intelligence Analysis */}
                        <NewsIntelligencePanel newsItem={item} />


                        <div className="mt-4 pt-3 flex items-center justify-between border-t border-dark-gray/30">
                            <button
                                onClick={() => toggleComments(item.id)}
                                className="text-[10px] font-bold uppercase tracking-widest text-light-gray/50 hover:text-off-white transition-colors flex items-center gap-1.5"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                {activeNewsId === item.id ? 'Hide Chat' : 'Join Chat'}
                            </button>
                            <div className={`text-[10px] font-bold uppercase tracking-widest ${item.sentiment === 'bullish' ? 'text-green-400' : item.sentiment === 'bearish' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {item.sentiment}
                            </div>
                        </div>

                        {activeNewsId === item.id && (
                            <div className="mt-4 pt-4 border-t border-dark-gray/30 animate-fadeIn">
                                <CommentsPanel asset={item.id} isNews={true} small={true} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectorNews;
