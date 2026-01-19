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
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight leading-tight flex justify-center">
              <img
                src="/logoname.png"
                alt="CrowdVerse"
                className="object-contain"
                style={{ height: '80px', width: 'auto' }}
              />
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
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/guest"
                className="text-sm text-light-gray/60 hover:text-off-white transition-colors"
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



      {/* Early Access CTA */}
      <section className="py-20 border-t border-dark-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-secondary-black/30 border border-dark-gray/30 p-8 sm:p-12 md:p-16 text-center">
            <div className="absolute inset-0 hero-gradient opacity-10 pointer-events-none"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-light text-off-white tracking-tight">Ready to see the market differently?</h2>
              <p className="text-base sm:text-lg text-light-gray/70 max-w-2xl mx-auto">
                Join our private beta today and get 6 months of premium features for free when we launch.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-beta-modal'))}
                  className="px-8 py-3 bg-off-white text-primary-black font-semibold rounded-lg hover:bg-white transition-all transform hover:scale-105"
                >
                  Join Early Access
                </button>
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
