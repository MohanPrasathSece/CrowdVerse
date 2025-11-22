import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Stocks from './Stocks';
import Crypto from './Crypto';

const comparisonCards = [
  {
    title: 'Equity vs Crypto Momentum',
    subtitle: 'Normalized 7-day performance view',
    series: [
      {
        name: 'NIFTY 50',
        color: '#8AB4FF',
        values: [0, 1.6, 2.1, 1.4, 2.8, 3.4, 4.6],
      },
      {
        name: 'BTC/USD',
        color: '#F5A623',
        values: [0, 2.8, 3.6, 4.2, 6.8, 7.4, 8.1],
      },
    ],
  },
  {
    title: 'Emerging vs Developed Flows',
    subtitle: 'Capital rotation over the past week',
    series: [
      {
        name: 'MSCI EM',
        color: '#7EE0C3',
        values: [0, 0.8, 1.4, 1.2, 1.9, 2.1, 2.7],
      },
      {
        name: 'MSCI World',
        color: '#FFDCA8',
        values: [0, 0.4, 0.9, 0.6, 1.3, 1.1, 1.5],
      },
    ],
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('stocks');
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setIsVisible(true);
    // Check if we have state from navigation (from Home page CTA buttons)
    if (location.state?.activeView) {
      setActiveTab(location.state.activeView);
    }
  }, [location.state]);

  // Separate useEffect for scrolling when activeTab changes
  useEffect(() => {
    if (location.state?.activeView && activeTab === location.state.activeView) {
      // Scroll to the appropriate section after content is rendered
      setTimeout(() => {
        const elementId = activeTab === 'stocks' 
          ? 'global-equities-snapshot' 
          : 'cryptocurrency-market';
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 800); // Longer delay to ensure content is fully rendered
    }
  }, [activeTab, location.state]);

  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString();

  const quickStats = [
    { label: 'NIFTY 50', value: '19,674.25', change: '+1.21%', tone: 'positive' },
    { label: 'BTC/USD', value: '$67,234', change: '+3.29%', tone: 'positive' },
    { label: 'Crypto Market Cap', value: '$2.85T', change: '+4.2% 24h', tone: 'positive' },
    { label: 'Market Status', value: 'Live', change: 'Synced', tone: 'neutral' },
  ];

  const buildPoints = (values) => {
    if (!values?.length) return '';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 120;
        const normalized = (value - min) / range;
        const y = 60 - normalized * 50 - 5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-16 transition-all duration-700 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="w-full max-w-4xl space-y-8 py-12 sm:py-16">
            <div className="uppercase tracking-[0.35em] text-[10px] sm:text-xs text-light-gray/60">
              Market Overview
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-off-white tracking-tight">
              Live Equity & Crypto Overview
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-light-gray/80 leading-relaxed max-w-2xl">
              Quick read on benchmark indices and digital assets to orient your trading session before diving into detailed screens.
            </p>
            <div className="h-px w-48 bg-dark-gray/50"></div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-light-gray/70">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                Live data captured moments ago
              </span>
              <span className="hidden sm:block text-light-gray/40">•</span>
              <span className="uppercase tracking-[0.25em] text-light-gray/60">{currentDate}</span>
              <span className="uppercase tracking-[0.25em] text-light-gray/60">{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
          {quickStats.map((item) => (
            <div
              key={item.label}
              className="p-5 sm:p-6 border border-dark-gray/60 rounded-2xl bg-primary-black/60 backdrop-blur-sm hover-enlarge transition-all"
            >
              <div className="text-xs sm:text-sm text-light-gray/70 mb-3 uppercase tracking-[0.2em]">{item.label}</div>
              <div className="text-xl sm:text-2xl font-semibold text-off-white">{item.value}</div>
              <div
                className={`text-xs sm:text-sm mt-2 ${
                  item.tone === 'positive'
                    ? 'text-green-400'
                    : item.tone === 'negative'
                      ? 'text-red-400'
                      : 'text-light-gray/60'
                }`}
              >
                {item.change}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Graphs */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 transition-all duration-1000 delay-350 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
          {comparisonCards.map((card) => (
            <div key={card.title} className="border border-dark-gray/60 rounded-3xl bg-primary-black/60 backdrop-blur-sm p-5 sm:p-6 hover-enlarge transition-all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-off-white">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-light-gray/70">{card.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-light-gray/60">
                  {card.series.map((line) => (
                    <span key={line.name} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: line.color }}
                      ></span>
                      {line.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full">
                <svg viewBox="0 0 120 60" preserveAspectRatio="none" className="w-full h-36">
                  <rect x="0" y="0" width="120" height="60" rx="12" className="fill-secondary-black/40" />
                  {card.series.map((line) => (
                    <polyline
                      key={line.name}
                      fill="none"
                      stroke={line.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      points={buildPoints(line.values)}
                    />
                  ))}
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Snapshot CTA */}
        <div className={`mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="border border-dark-gray/60 rounded-3xl bg-primary-black/60 backdrop-blur-sm px-6 sm:px-8 py-8 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="uppercase tracking-[0.35em] text-[10px] sm:text-xs text-light-gray/60">Portfolio Insights</span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-off-white">Balanced Growth Allocation</h3>
              <p className="text-sm text-light-gray/70">
                Explore a detailed breakdown of our illustrative holdings, allocations, and performance metrics tailored for a moderate-risk profile.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-3 rounded-xl border border-off-white/60 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] hover:bg-off-white hover:text-primary-black transition-all hover-scale"
            >
              View Portfolio Details
            </Link>
          </div>
        </div>


        {/* Tabs */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="flex flex-col sm:flex-row sm:space-x-1 bg-secondary-black p-1 rounded-xl mb-8 border border-dark-gray max-w-md hover-glow">
            <button
              onClick={() => setActiveTab('stocks')}
              className={`flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all hover-scale ${
                activeTab === 'stocks'
                  ? 'bg-off-white text-primary-black shadow-lg'
                  : 'text-light-gray hover:text-off-white hover:bg-dark-gray'
              }`}
            >
              Stocks
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all hover-scale ${
                activeTab === 'crypto'
                  ? 'bg-off-white text-primary-black shadow-lg'
                  : 'text-light-gray hover:text-off-white hover:bg-dark-gray'
              }`}
            >
              Crypto
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          {activeTab === 'stocks' ? <Stocks /> : <Crypto />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
