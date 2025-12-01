import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-primary-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-32 sm:pb-28 md:pt-36 lg:pt-28 xl:pt-24 2xl:pt-20">
        <div className="absolute inset-0 hero-gradient pointer-events-none" aria-hidden="true"></div>
        <div className="hero-orb absolute -top-32 -left-24 w-80 h-80 sm:w-[420px] sm:h-[420px]" aria-hidden="true"></div>
        <div className="hero-orb-secondary absolute bottom-[-20%] right-[-10%] w-[360px] h-[360px] sm:w-[480px] sm:h-[480px]" aria-hidden="true"></div>
        <div className="hero-grid absolute inset-0 opacity-30" aria-hidden="true"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-4xl mx-auto text-center space-y-10 px-6 sm:px-10 py-4 sm:py-12 md:py-16 hero-panel">
            <div className="flex justify-center" aria-hidden="true">
              <span className="hero-accent-line"></span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight leading-tight">
              <span className="hero-title-gradient">CrowdVerse</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-light-gray/80 max-w-2xl mx-auto leading-relaxed">
              Track the pulse of the market and make better decisions together.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-6 hero-cta-wrap">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 sm:py-4 bg-off-white text-primary-black font-medium rounded-lg hover:bg-white transition-colors hero-cta-primary text-sm sm:text-base"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 sm:py-4 border border-dark-gray/50 text-off-white rounded-lg hover:border-dark-gray transition-colors hero-cta-secondary text-sm sm:text-base"
              >
                Sign In
              </Link>
              <Link
                to="/guest"
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 sm:py-4 border border-light-gray/30 text-light-gray/80 rounded-lg hover:border-light-gray/50 hover:text-off-white transition-all text-sm sm:text-base"
              >
                Continue as Guest
              </Link>
            </div>
            <div className="hero-spark hidden sm:block" aria-hidden="true">
              <span className="hero-spark-orb"></span>
              <span className="hero-spark-orb" data-delay="150"></span>
              <span className="hero-spark-orb" data-delay="300"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-dark-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-off-white mb-4">Built for Performance</h2>
            <p className="text-sm sm:text-base text-light-gray/70 max-w-xl mx-auto">
              Everything you need to monitor markets and manage portfolios in one minimal platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 md:gap-12">
            {[
              {
                title: 'Crowd Intelligence',
                description: 'CrowdVerse curates market context from the community so you spot sentiment shifts before they hit the tape.',
                symbol: 'CI'
              },
              {
                title: 'Indian Equities Core',
                description: 'Real-time coverage of NSE leaders tuned for long-only, swing, and intraday outlooks.',
                symbol: 'IN'
              },
              {
                title: 'Crypto Momentum',
                description: 'Dedicated trackers for BTC, ETH, and high-beta alt pairs so you can align trades with digital market flows.',
                symbol: 'CM'
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="group text-center space-y-4 p-5 sm:p-6 rounded-2xl border border-dark-gray/30 transition-all duration-150 hover:-translate-y-2 hover:border-off-white/40 hover:bg-secondary-black/40"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full border border-dark-gray/40 flex items-center justify-center transition-colors duration-150 group-hover:border-off-white/60">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] text-light-gray/70">{feature.symbol}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-off-white">{feature.title}</h3>
                <p className="text-sm sm:text-base text-light-gray/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Coverage */}
      <section className="py-20 border-t border-dark-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-light text-off-white">Market Coverage</h2>
              <p className="text-sm sm:text-base text-light-gray/80 leading-relaxed">
                Track the Indian stock market with real-time NSE data covering major indices and blue-chip stocks. 
                Monitor cryptocurrency markets with live pricing for Bitcoin, Ethereum, and other top digital assets.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <h4 className="text-off-white font-medium">Indian Equities</h4>
                  <ul className="text-xs sm:text-sm text-light-gray/70 space-y-1">
                    <li>• Reliance Industries</li>
                    <li>• TCS & Infosys</li>
                    <li>• HDFC & ICICI Bank</li>
                    <li>• ITC & L&T</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-off-white font-medium">Cryptocurrencies</h4>
                  <ul className="text-xs sm:text-sm text-light-gray/70 space-y-1">
                    <li>• Bitcoin (BTC)</li>
                    <li>• Ethereum (ETH)</li>
                    <li>• Solana (SOL)</li>
                    <li>• Top Altcoins</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-secondary-black/50 rounded-2xl p-8 border border-dark-gray/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-gray/60">Market Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-dark-gray/20">
                    <span className="text-off-white">RELIANCE</span>
                    <span className="text-green-400">₹2,456.75</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-dark-gray/20">
                    <span className="text-off-white">BTC/USDT</span>
                    <span className="text-green-400">$43,250.00</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-off-white">ETH/USDT</span>
                    <span className="text-red-400">$2,890.45</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer intentionally omitted; global layout handles site footer */}
    </div>
  );
};

export default Landing;
