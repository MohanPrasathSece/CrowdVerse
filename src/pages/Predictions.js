import React, { useEffect, useState } from 'react';
import { getPredictionPolls } from '../utils/apiEnhanced';
import PredictionPoll from '../components/PredictionPoll';

const Predictions = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const { data } = await getPredictionPolls();
                setPolls(data);
            } catch (err) {
                console.error('Failed to fetch predictions', err);
                setError('Failed to load predictions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []);

    return (
        <div className="min-h-screen bg-primary-black text-off-white selection:bg-indigo-500/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="mb-16 space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400">
                        <div className="h-px w-8 bg-indigo-500/40"></div>
                        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-bold">Community Consensus</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold text-off-white tracking-tight leading-[1.1]">
                        What's the <span className="text-transparent bg-clip-text bg-gradient-to-r from-off-white via-indigo-200 to-indigo-400">Verdict?</span>
                    </h1>
                    <p className="text-light-gray/60 text-lg sm:text-xl max-w-2xl leading-relaxed">
                        Join thousands of participants in predicting the future of tech, finance, and global markets using our crowd-intelligence engine.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-20">
                        <div className="w-10 h-10 border-4 border-off-white/20 border-t-off-white rounded-full animate-spin"></div>
                        <p className="text-light-gray/50 animate-pulse">Loading predictions...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideUp">
                        {polls.length > 0 ? (
                            polls.map(poll => (
                                <PredictionPoll key={poll._id} poll={poll} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-light-gray/50 py-10">
                                No prediction polls active at the moment.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predictions;
