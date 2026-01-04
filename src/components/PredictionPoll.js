import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { votePredictionPoll } from '../utils/apiEnhanced';
import CommentsPanel from './CommentsPanel';

const PredictionPoll = ({ poll }) => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(poll);
    const [showComments, setShowComments] = useState(false);
    const [votedOption, setVotedOption] = useState(() => {
        const userId = user?.isGuest ? user.id : user?._id;
        const vote = poll.voters?.find(v => {
            if (typeof v === 'object' && v !== null) {
                return String(v.userId) === String(userId);
            }
            return false;
        });
        return vote ? vote.optionIndex : null;
    });

    const totalVotes = data.options.reduce((acc, opt) => acc + opt.votes, 0);

    const handleVote = async (index) => {
        if (!user) return alert('Login required to vote');
        if (votedOption === index) return;

        // Optimistic update
        const newData = { ...data };
        if (votedOption !== null && newData.options[votedOption]) {
            newData.options[votedOption].votes = Math.max(0, newData.options[votedOption].votes - 1);
        }
        newData.options[index].votes += 1;
        setData(newData);
        setVotedOption(index);

        try {
            await votePredictionPoll(data._id, index);
        } catch (err) {
            console.error('Vote failed', err);
        }
    };

    const calculatePercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return ((votes / totalVotes) * 100).toFixed(1);
    };

    if (showComments) {
        // Expanded View - Matching Asset.js exactly
        return (
            <div className="col-span-full border border-dark-gray/40 rounded-3xl bg-secondary-black/20 shadow-2xl overflow-hidden animate-fadeIn mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                    {/* Header - Exactly like Asset.js */}
                    <div className="mb-8 transition-all duration-700 opacity-100">
                        <div className="w-full space-y-8 py-6 sm:py-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[11px] uppercase tracking-[0.35em] text-light-gray/60">Prediction</div>
                                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-off-white tracking-tight leading-tight">
                                        {data.question}
                                    </h1>
                                    <div className="text-sm sm:text-base text-light-gray/70">ID: PRE-{data._id.slice(-6).toUpperCase()}</div>
                                </div>
                                <button
                                    onClick={() => setShowComments(false)}
                                    className="px-4 py-2 rounded-lg border border-dark-gray text-light-gray hover:text-off-white hover:bg-secondary-black/60 transition-all"
                                >
                                    ← Back
                                </button>
                            </div>
                            <div className="h-px w-48 bg-dark-gray/50"></div>
                        </div>
                    </div>

                    {/* Poll Section - Styled like SentimentPoll/IntentPoll */}
                    <div className="border border-dark-gray/60 rounded-2xl p-5 bg-secondary-black/50 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-off-white font-semibold">Community Consensus</h3>
                            <span className="text-[11px] px-2 py-1 rounded-lg border border-indigo-500 text-indigo-300 bg-indigo-600/10 uppercase tracking-[0.15em]">
                                {totalVotes} Votes
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl border border-dark-gray/70 bg-primary-black/50 mb-6">
                            {data.options.map((opt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleVote(index)}
                                    className={`flex-1 text-sm px-3 py-2 rounded-lg transition-all ${votedOption === index
                                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500 scale-[1.01]'
                                        : 'text-light-gray/80 hover:text-indigo-300 hover:bg-indigo-600/10 border border-transparent'
                                        }`}
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {data.options.map((opt, index) => {
                                const percent = calculatePercentage(opt.votes);
                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between text-sm text-light-gray/70 mb-1">
                                            <span>{opt.text}</span>
                                            <span className="text-off-white/90">{percent}%</span>
                                        </div>
                                        <div className="h-2 w-full rounded-md bg-primary-black/60 border border-dark-gray/60 overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${index === 0 ? 'from-indigo-600/70 to-indigo-400/70' :
                                                    index === 1 ? 'from-blue-600/70 to-blue-400/70' :
                                                        'from-slate-600/70 to-slate-400/70'
                                                    } transition-all duration-1000`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Comments - Matches Asset.js */}
                    <CommentsPanel asset={data._id} isPrediction={true} />

                    {/* AI Intelligence Section - Styled exactly like IntelligencePanel.js */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-off-white font-semibold text-2xl">Quick Intelligence Panel</h3>
                            <button
                                onClick={async () => {
                                    const btn = document.getElementById(`analyze-btn-${data._id}`);
                                    if (btn) btn.disabled = true;
                                    try {
                                        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/predictions/${data._id}/analyze`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' }
                                        });
                                        const updatedData = await response.json();
                                        if (updatedData._id) {
                                            setData(updatedData);
                                            alert('AI Analysis updated based on latest comments!');
                                        }
                                    } catch (err) {
                                        console.error('Analysis failed', err);
                                        alert('Failed to update AI analysis.');
                                    } finally {
                                        if (btn) btn.disabled = false;
                                    }
                                }}
                                id={`analyze-btn-${data._id}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Refresh AI Insights
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                                <div className="mb-3 flex items-center gap-2 text-light-gray/70">
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                                    <div className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold text-[11px] sm:text-[13px]">Global News Summary</div>
                                </div>
                                <div className="text-off-white/90 whitespace-pre-wrap leading-[2.25] text-base sm:text-lg">
                                    {data.aiNewsSummary || 'AI is synthesizing global news headlines, regulatory updates, and geopolitical events relevant to this prediction outcome...'}
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                                <div className="mb-3 flex items-center gap-2 text-light-gray/70">
                                    <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
                                    <div className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold text-[11px] sm:text-[13px]">Community Comments Summary</div>
                                </div>
                                <div className="text-off-white/90 whitespace-pre-wrap leading-[2.25] text-base sm:text-lg">
                                    {data.aiCommentsSummary || 'Synthesizing cross-platform sentiment from Reddit, Discord, and Telegram communities to identify emerging consensus...'}
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                                <div className="mb-3 flex items-center gap-2 text-light-gray/70">
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                                    <div className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold text-[11px] sm:text-[13px]">Market Sentiment Summary</div>
                                </div>
                                <div className="text-off-white/90 whitespace-pre-wrap leading-[2.25] text-base sm:text-lg">
                                    {data.aiSentimentSummary || 'Analyzing historical patterns and current momentum to project potential trajectory of this topic...'}
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                                <div className="mb-3 flex items-center gap-2 text-light-gray/70">
                                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400" />
                                    <div className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold text-[11px] sm:text-[13px]">Final AI Takeaway</div>
                                </div>
                                <div className="text-off-white/90 whitespace-pre-wrap leading-[2.25] text-base sm:text-lg italic">
                                    {data.aiFinalSummary || 'The prediction remains highly dynamic. While sentiment leans bullish, critical milestones will determine the long-term validity.'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-8">
                        <button
                            onClick={() => {
                                setShowComments(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-light-gray/40 hover:text-off-white text-[10px] uppercase tracking-[0.3em] font-bold transition-all"
                        >
                            ↑ Back to Predictions Grid
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Collapsed View - Simple Card
    return (
        <div className="group relative bg-secondary-black/20 border border-dark-gray/40 rounded-3xl p-8 hover:border-off-white/20 transition-all flex flex-col h-full overflow-hidden">
            {/* Design Element */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>

            <div className="flex-1 space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                        Prediction
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[10px] text-light-gray/40 font-bold uppercase tracking-widest">Live Engine</span>
                    </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-off-white leading-tight mt-4 line-clamp-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-off-white group-hover:to-indigo-300 transition-all duration-500">
                    {data.question}
                </h3>
            </div>

            <div className="mt-10 pt-6 border-t border-dark-gray/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                        {totalVotes}
                    </div>
                    <span className="text-[11px] text-light-gray/60 font-medium uppercase tracking-wider">Predictions Cast</span>
                </div>

                <button
                    onClick={() => setShowComments(true)}
                    className="flex items-center gap-2 text-off-white font-bold tracking-widest text-[11px] uppercase group/btn"
                >
                    Analyze <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </div>
    );
};

export default PredictionPoll;
