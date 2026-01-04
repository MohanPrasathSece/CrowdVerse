import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_COMMODITIES } from '../constants/featuredCommodities';
import CommentsPanel from '../components/CommentsPanel';

const Commodities = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCommodities = FEATURED_COMMODITIES.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (value) =>
        typeof value === 'number'
            ? `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : '—';

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <div id="commodities-market" className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-off-white mb-2 animate-slideInLeft">
                            Commodities Market
                        </h2>
                        <p className="text-light-gray animate-slideInLeft">Live tracking of precious metals and industrial materials</p>
                    </div>
                    <div className="mt-4 md:mt-0 animate-slideInRight">
                        <input
                            type="text"
                            placeholder="Search commodities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 bg-secondary-black border border-dark-gray rounded-lg text-off-white focus:outline-none focus:ring-2 focus:ring-off-white hover-glow"
                        />
                    </div>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slideInLeft text-sm sm:text-base">
                    <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
                        <div className="text-light-gray mb-1 flex justify-between items-center">
                            <span>Gold Spot <span className="text-[10px] text-light-gray/40 uppercase tracking-tighter">(1g)</span></span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Bullish</span>
                        </div>
                        <div className="text-2xl font-bold text-off-white">₹8,460.00</div>
                        <div className="text-sm text-green-400 font-medium">+0.42% today</div>
                    </div>
                    <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
                        <div className="text-light-gray mb-1 flex justify-between items-center">
                            <span>Silver Spot <span className="text-[10px] text-light-gray/40 uppercase tracking-tighter">(1g)</span></span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Bullish</span>
                        </div>
                        <div className="text-2xl font-bold text-off-white">₹102.30</div>
                        <div className="text-sm text-green-400 font-medium">+1.15% today</div>
                    </div>
                    <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
                        <div className="text-light-gray mb-1 flex justify-between items-center">
                            <span>Metals Index</span>
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">High Demand</span>
                        </div>
                        <div className="text-2xl font-bold text-off-white">9,580</div>
                        <div className="text-sm text-blue-400 font-medium tracking-tight">Real-time Synthesis</div>
                    </div>
                </div>

                <div className="mb-8 flex items-center gap-2">
                    <div className="h-4 w-1 bg-amber-500/60 rounded-full"></div>
                    <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-light-gray/40">
                        Global Standard: All values displayed below are calculated <span className="text-off-white/60">Per Gram</span>
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCommodities.map((item, index) => (
                    <Link
                        to={`/asset/${item.symbol}`}
                        state={{ name: item.name, marketType: 'commodities' }}
                        key={item.rank}
                        className="bg-gradient-bg border border-dark-gray rounded-2xl p-6 hover-enlarge transition-all animate-fadeIn block"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start space-x-3">
                                <div className="bg-amber-600/20 text-amber-500 border border-amber-600/40 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                                    #{item.rank}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-bold text-off-white mb-1 leading-tight line-clamp-3" title={item.name}>{item.name}</h3>
                                    <p className="text-base text-light-gray font-medium">{item.symbol}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-off-white mb-1">{formatCurrency(item.price)}</div>
                                {item.change !== null ? (
                                    <div className={`text-base font-medium ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                    </div>
                                ) : (
                                    <div className="text-base font-medium text-light-gray">—</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-dark-gray">
                                <span className="text-light-gray text-base">Open</span>
                                <span className="text-off-white font-medium">{formatCurrency(item.open)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-dark-gray">
                                <span className="text-light-gray text-base">High / Low</span>
                                <span className="text-off-white font-medium">{formatCurrency(item.high)} / {formatCurrency(item.low)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-light-gray text-base">Prev Close</span>
                                <span className="text-off-white font-medium">{formatCurrency(item.prevClose)}</span>
                            </div>
                        </div>

                        {/* Feature CTA Row */}
                        <div className="mt-4 pt-3 border-t border-dark-gray/50 flex items-center justify-between text-[12px] text-light-gray/70">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 rounded bg-primary-black/50 border border-dark-gray/60">Vote</span>
                                <span className="px-2 py-1 rounded bg-primary-black/50 border border-dark-gray/60">Comments</span>
                            </div>
                            <div className="uppercase tracking-[0.2em]">Open →</div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredCommodities.length === 0 && searchTerm && (
                <div className="text-center py-12 animate-fadeIn">
                    <div className="text-xl text-light-gray">No commodities found matching "{searchTerm}"</div>
                </div>
            )}

            {/* Comments Section */}
            <div className="mt-12">
                <CommentsPanel asset="commodities-market" />
            </div>
        </div>
    );
};

export default Commodities;
