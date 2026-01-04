import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { votePredictionPoll } from '../utils/apiEnhanced';
import CommentsPanel from './CommentsPanel';

const PredictionPoll = ({ poll }) => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(poll);
    const [loading, setLoading] = useState(false);
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
        <div className="border border-dark-gray/50 rounded-2xl p-8 bg-primary-black/40 hover:border-off-white/30 transition-all duration-300 h-full flex flex-col">
            <div className="mb-4">
                {/* Future AI Summary could go here */}
                <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                        Prediction
                    </span>
                    <span className="text-xs text-light-gray/50">Total Votes: {totalVotes}</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-bold text-off-white mb-8 leading-tight tracking-tight">{data.question}</h3>
            </div>

            <div className="space-y-3 mb-6">
                {data.options.map((opt, index) => {
                    const percent = calculatePercentage(opt.votes);
                    const isVoted = votedOption === index;

                    return (
                        <div key={index} className="relative group">
                            <button
                                onClick={() => handleVote(index)}
                                className="w-full relative group"
                            >
                                <div className="absolute inset-0 bg-dark-gray/30 rounded-lg overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${isVoted ? 'bg-emerald-500/20' : 'bg-blue-600/20'}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                <div className={`relative flex items-center justify-between p-4 sm:p-5 rounded-lg border border-dark-gray/50 group-hover:border-off-white/30 transition-all ${isVoted ? 'border-emerald-500/50' : ''}`}>
                                    <span className={`text-base sm:text-xl font-semibold ${isVoted ? 'text-emerald-400' : 'text-off-white/90'}`}>
                                        {opt.text}
                                    </span>
                                    <span className="text-light-gray/60 text-sm">
                                        {percent}% ({opt.votes})
                                    </span>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-dark-gray/40 pt-4 mt-auto">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-sm text-light-gray/80 hover:text-off-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {showComments ? 'Hide Discussion' : 'Join the Discussion'}
                </button>

                {showComments && (
                    <div className="mt-4 animate-fadeIn">
                        <CommentsPanel asset={data._id} isPrediction={true} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictionPoll;
