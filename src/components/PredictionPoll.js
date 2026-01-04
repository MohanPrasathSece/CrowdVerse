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

    return (
        <div className={`transition-all duration-500 bg-primary-black/50 rounded-2xl border border-dark-gray/50 hover:border-off-white/30 overflow-hidden ${showComments ? 'col-span-full shadow-2xl ring-1 ring-off-white/10' : ''}`}>
            <div className={`p-8 ${showComments ? 'bg-secondary-black/20' : ''}`}>
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-indigo-500/20 text-indigo-300 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                            P
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.3em] text-light-gray/50 mb-1">Prediction Poll</div>
                            <h3 className="text-xl sm:text-2xl font-bold text-off-white leading-tight">
                                {data.question}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className={`${showComments ? 'grid grid-cols-1 xl:grid-cols-2 gap-12' : 'flex flex-col'}`}>
                    {/* Poll Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] uppercase tracking-widest text-light-gray/40">Market Sentiment</span>
                            <span className="text-[10px] text-light-gray/50">Confidence: {totalVotes} votes</span>
                        </div>

                        <div className="space-y-3">
                            {data.options.map((opt, index) => {
                                const percent = calculatePercentage(opt.votes);
                                const isVoted = votedOption === index;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleVote(index)}
                                        className="w-full relative group transition-transform active:scale-[0.99]"
                                        disabled={!user}
                                    >
                                        <div className="absolute inset-0 bg-dark-gray/20 rounded-xl overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-700 ease-out ${isVoted ? 'bg-indigo-500/25' : 'bg-blue-600/15'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <div className={`relative flex items-center justify-between p-4 rounded-xl border border-dark-gray/40 group-hover:border-off-white/20 transition-all ${isVoted ? 'border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5' : ''}`}>
                                            <span className={`text-base font-semibold ${isVoted ? 'text-indigo-400' : 'text-off-white/90'}`}>
                                                {opt.text}
                                            </span>
                                            <span className={`text-sm font-bold ${isVoted ? 'text-indigo-400' : 'text-off-white'}`}>{percent}%</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Summary Section (Visible when expanded) - Matches Asset Intelligence Panel exactly */}
                    {showComments && (
                        <div className="space-y-6 animate-fadeIn">
                            <h4 className="text-off-white font-semibold text-lg">Quick Intelligence Panel</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-light-gray/70">Global News Summary</span>
                                    </div>
                                    <p className="text-off-white/90 text-sm sm:text-base leading-[1.8]">
                                        {data.aiNewsSummary || "AI is synthesizing global news headlines, regulatory updates, and geopolitical events relevant to this prediction outcome..."}
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-light-gray/70">Community Comments</span>
                                    </div>
                                    <p className="text-off-white/90 text-sm sm:text-base leading-[1.8]">
                                        {data.aiCommentsSummary || "Synthesizing cross-platform sentiment from Reddit, Discord, and Telegram communities to identify emerging consensus..."}
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-light-gray/70">Market Trajectory</span>
                                    </div>
                                    <p className="text-off-white/90 text-sm sm:text-base leading-[1.8]">
                                        {data.aiSentimentSummary || "Analyzing historical patterns and current momentum to project potential trajectory of this topic..."}
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
                                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-light-gray/70">Final AI Takeaway</span>
                                    </div>
                                    <p className="text-off-white/90 text-sm sm:text-base leading-[1.8] italic">
                                        {data.aiFinalSummary || "The prediction remains highly dynamic. While sentiment leans bullish, critical milestones in Q3 will determine the long-term validity."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-6 border-t border-dark-gray/20 flex flex-col gap-6">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 font-bold tracking-widest text-[11px] uppercase ${showComments
                            ? 'bg-off-white text-primary-black border-off-white shadow-xl shadow-off-white/10'
                            : 'bg-primary-black border-dark-gray/60 text-light-gray/80 hover:text-off-white hover:border-off-white/40'}`}
                    >
                        {showComments ? 'Minimize Prediction' : 'Open Prediction & Insights →'}
                    </button>

                    {showComments && (
                        <div className="animate-slideInDown">
                            <CommentsPanel asset={data._id} isPrediction={true} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictionPoll;
