import React, { useState } from 'react';

const NewsIntelligencePanel = ({ newsItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!newsItem) return null;

    // Generate AI analysis based on news category and content
    const generateAnalysis = () => {
        const { category, sentiment, title, content } = newsItem;

        let contextualAnalysis = '';
        let implications = '';
        let outlook = '';

        if (category === 'Politics') {
            contextualAnalysis = `This policy development reflects India's strategic direction in governance and institutional reform. The decision carries significant implications for domestic policy frameworks and may influence state-level implementations across the country.`;
            implications = `Key stakeholders including citizens, businesses, and regional governments will need to adapt to these changes. The implementation timeline and enforcement mechanisms will be critical factors determining the success of this initiative.`;
            outlook = `Monitor legislative progress, judicial reviews, and public response in the coming weeks. Long-term effects will depend on execution quality and stakeholder cooperation. This could set precedents for similar initiatives in other areas.`;
        } else if (category === 'Geopolitics') {
            contextualAnalysis = `This geopolitical development signals a strategic shift in India's international positioning. The move reflects broader realignments in global power dynamics and trade relationships that could reshape regional cooperation frameworks.`;
            implications = `Economic partnerships, defense cooperation, and technology transfer agreements may see accelerated progress. Indian businesses in affected sectors should prepare for new market opportunities and regulatory changes.`;
            outlook = `Watch for follow-up agreements, implementation timelines, and reactions from other major powers. India's middle power diplomacy continues to expand its strategic autonomy and economic leverage globally.`;
        } else if (category === 'General') {
            contextualAnalysis = `This development represents a significant shift in India's socio-economic landscape. The change addresses long-standing challenges while opening new opportunities for innovation and growth in key sectors.`;
            implications = `Citizens, businesses, and institutions will experience direct impacts through changed operational frameworks. Early adopters may gain competitive advantages as the new systems mature and scale.`;
            outlook = `Track implementation metrics, user adoption rates, and administrative efficiency gains. Success will depend on infrastructure readiness, public acceptance, and effective change management by authorities.`;
        }

        // Add sentiment-based nuance
        if (sentiment === 'bullish') {
            outlook += ' Overall trajectory appears positive with strong momentum indicators.';
        } else if (sentiment === 'bearish') {
            outlook += ' Challenges and headwinds require careful navigation and risk mitigation.';
        } else {
            outlook += ' Balanced outlook with both opportunities and challenges to consider.';
        }

        return {
            contextualAnalysis,
            implications,
            outlook
        };
    };

    const analysis = generateAnalysis();

    return (
        <div className="mt-6 border-t border-dark-gray/50 pt-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-left group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-off-white group-hover:text-white transition-colors">
                            AI Intelligence Analysis
                        </h3>
                        <p className="text-xs text-light-gray/60">
                            {isExpanded ? 'Hide detailed analysis' : 'View strategic insights & implications'}
                        </p>
                    </div>
                </div>
                <svg
                    className={`w-5 h-5 text-light-gray/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="mt-6 grid grid-cols-1 gap-4 animate-fadeIn">
                    {/* Contextual Analysis */}
                    <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                            <h4 className="text-sm uppercase tracking-widest font-bold text-emerald-400">
                                Contextual Analysis
                            </h4>
                        </div>
                        <p className="text-off-white/80 leading-relaxed text-sm sm:text-base">
                            {analysis.contextualAnalysis}
                        </p>
                    </div>

                    {/* Implications */}
                    <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                            <h4 className="text-sm uppercase tracking-widest font-bold text-amber-400">
                                Key Implications
                            </h4>
                        </div>
                        <p className="text-off-white/80 leading-relaxed text-sm sm:text-base">
                            {analysis.implications}
                        </p>
                    </div>

                    {/* Outlook */}
                    <div className="p-5 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/5">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400" />
                            <h4 className="text-sm uppercase tracking-widest font-bold text-fuchsia-400">
                                Strategic Outlook
                            </h4>
                        </div>
                        <p className="text-off-white/80 leading-relaxed text-sm sm:text-base">
                            {analysis.outlook}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsIntelligencePanel;
