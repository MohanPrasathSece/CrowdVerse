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
        <div className="min-h-screen bg-primary-black text-off-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-semibold text-off-white mb-2">
                        Predict what will happen this year
                    </h1>
                    <p className="text-light-gray/60 text-base sm:text-lg">
                        Cast your vote on the most controversial topics of 2024 and see what the community thinks.
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
