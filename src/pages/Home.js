import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const marketNarrative = [
  {
    phase: 'Opening Pulse',
    headline: 'Indices shrugged off overnight weakness with a gap-up start.',
    detail:
      'Banking heavyweights carried the first hour as buy programs fired across high-beta names, setting the tone for a risk-on session.',
    metricLabel: 'NIFTY 50',
    metricValue: '19,674.25',
    metricDelta: '+1.21% on the day',
  },
  {
    phase: 'Midday Momentum',
    headline: 'Crypto joined the rally as BTC defended the $66K shelf and accelerated.',
    detail:
      'Flows rotated from defensives into growth trades; desks reported stronger appetite for digital assets as volatility stayed contained.',
    metricLabel: 'BTC/USD',
    metricValue: '$67,234',
    metricDelta: '+3.29% in 24h',
  },
  {
    phase: 'Closing Narrative',
    headline: 'Market breadth stayed constructive while liquidity pockets remained deep.',
    detail:
      'Crypto market cap reclaimed the $2.8T handle and equity futures held gains, hinting at follow-through if macro data cooperates overnight.',
    metricLabel: 'Crypto Market Cap',
    metricValue: '$2.85T',
    metricDelta: '+4.2% across 24h',
  },
];

const lookoutSignals = [
  'Options order flow tilts bullish with weekly call skew rising 12%.',
  'Emerging market ETFs continue to attract inflows, supporting broader risk tone.',
  'Liquidity conditions stable; overnight funding spreads holding near one-month lows.',
];

const marketThumbnails = [
  {
    title: 'Global Equities Pulse',
    subtitle: 'NIFTY • SENSEX • Dow Futures',
    background:
      'linear-gradient(135deg, rgba(104,126,255,0.55), rgba(30,30,30,0.6)), url(https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80)',
    to: '/dashboard',
  },
  {
    title: 'Digital Assets Heatmap',
    subtitle: 'BTC • ETH • Alt baskets',
    background:
      'linear-gradient(135deg, rgba(255,178,68,0.55), rgba(30,30,30,0.6)), url(https://images.unsplash.com/photo-1640172478435-451ac951cb9b?auto=format&fit=crop&w=800&q=80)',
    to: '/dashboard',
  },
  {
    title: 'Macro Signals Monitor',
    subtitle: 'Yields • FX • Commodities',
    background:
      'linear-gradient(135deg, rgba(120,180,120,0.55), rgba(30,30,30,0.6)), url(https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=800&q=80)',
    to: '/dashboard',
  },
];

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-16 transition-all duration-700 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="w-full max-w-5xl space-y-8 py-12 sm:py-16">
            <div className="uppercase tracking-[0.35em] text-[10px] sm:text-xs text-light-gray/60">
              Today’s Market Story
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold text-off-white tracking-tight">
              From Opening Bell to Close
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-light-gray/80 leading-relaxed max-w-3xl">
              We trace the session’s tone across equities and crypto, stitching together liquidity signals, institutional flows,
              and the narratives that mattered most.
            </p>
            <div className="h-px w-48 bg-dark-gray/50"></div>
          </div>
        </div>

        {/* Market Thumbnails */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-12 transition-all duration-700 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
          {marketThumbnails.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="relative overflow-hidden rounded-2xl border border-dark-gray/60 h-40 sm:h-44 flex items-end p-5 bg-center bg-cover hover-enlarge transition-transform"
              style={{ backgroundImage: item.background }}
            >
              <div className="backdrop-blur-sm bg-primary-black/45 px-4 py-3 rounded-xl space-y-1">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-light-gray/70">View Market</div>
                <div className="text-off-white font-semibold text-base sm:text-lg">{item.title}</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-light-gray/60">{item.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Narrative Flow */}
        <div className={`space-y-6 mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
          {marketNarrative.map((scene) => (
            <div
              key={scene.phase}
              className="p-6 sm:p-8 border border-dark-gray/60 rounded-3xl bg-primary-black/60 backdrop-blur-sm hover-enlarge transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-4">
                <div className="space-y-2 max-w-3xl">
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-light-gray/60">{scene.phase}</span>
                  <h2 className="text-lg sm:text-2xl font-semibold text-off-white">{scene.headline}</h2>
                  <p className="text-sm text-light-gray/70 leading-relaxed">{scene.detail}</p>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[220px] text-left sm:text-right">
                  <div className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-light-gray/60">{scene.metricLabel}</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-off-white">{scene.metricValue}</div>
                  <div className="text-sm text-green-400 mt-1">{scene.metricDelta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Signals to Watch */}
        <div className={`bg-gradient-bg p-6 sm:p-8 rounded-3xl border border-dark-gray/70 mb-8 hover-glow transition-all duration-1000 delay-500 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
          <h3 className="text-xl sm:text-2xl font-bold text-off-white mb-4">Signals on the Radar</h3>
          <p className="text-sm text-light-gray/70 mb-6 max-w-3xl">
            These are the threads we’re following into the next session—the moves beneath the headline numbers that could steer the narrative from here.
          </p>
          <ul className="space-y-3 sm:space-y-4 list-disc list-inside text-light-gray/80 text-sm">
            {lookoutSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
