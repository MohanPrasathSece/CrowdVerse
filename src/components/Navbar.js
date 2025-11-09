import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isLanding = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const hideNavLinks = !user && (isLanding || isLoginPage || isSignupPage);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const getFirstName = (value = '') => {
    if (!value) return '';
    if (value.includes('@')) {
      const [namePart] = value.split('@');
      return namePart.split(/[^a-zA-Z]+/).filter(Boolean)[0] || namePart;
    }
    return value.split(' ')[0];
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const navLinks = user
    ? [
        { to: '/home', label: 'Home' },
        { to: '/dashboard', label: 'Market' },
        { to: '/portfolio', label: 'Portfolio' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Market' },
        { to: '/portfolio', label: 'Portfolio' },
      ];

  const mobileLinkDescriptions = {
    Home: 'Session dashboard & updates',
    Market: 'Live market coverage',
    Portfolio: 'Track your holdings'
  };

  return (
    <nav className={`sticky top-0 z-40 bg-gradient-bg border-b border-dark-gray backdrop-blur-lg transition-all duration-1000 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          <Link
            to={user ? '/home' : '/'}
            className="text-2xl font-bold text-off-white hover:text-white transition-all hover-scale flex items-center space-x-2"
          >
            <span className="gradient-border">CrowdVerse</span>
          </Link>

          {!hideNavLinks && (
            <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 text-sm uppercase tracking-[0.25em] text-light-gray/70">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} className="hover:text-off-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="ml-auto pl-4 flex items-center gap-4">
            {user ? (
              <>
                <button
                  className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-dark-gray/60 text-off-white hover:bg-dark-gray/70"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  aria-label="Toggle menu"
                >
                  <span className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? 'translate-y-1.5 rotate-45' : '-translate-y-1'}`}></span>
                  <span className={`block w-5 h-0.5 bg-current transition-opacity ${mobileOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? '-translate-y-1.5 -rotate-45' : 'translate-y-1'}`}></span>
                </button>

                <div className="hidden md:flex items-center space-x-3 bg-secondary-black/40 border border-dark-gray/50 rounded-full px-3 py-1.5 shadow-sm">
                  <div className="w-9 h-9 bg-off-white text-primary-black font-semibold rounded-full flex items-center justify-center">
                    {user.emailOrMobile.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-light-gray/60">Signed in</span>
                    <span className="text-sm text-off-white font-medium">{getFirstName(user.emailOrMobile)}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full border border-dark-gray/60 text-off-white hover:bg-dark-gray/70 transition-colors"
                    aria-label="Logout"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-5">
                {!isLoginPage && (
                  <Link
                    to="/login"
                    className="px-6 py-3 text-off-white hover:text-white font-semibold transition-all hover-scale"
                  >
                    Login
                  </Link>
                )}
                {!isSignupPage && (
                  <Link
                    to="/signup"
                    className="px-6 py-3 bg-off-white text-primary-black rounded-xl hover:bg-white font-semibold transition-all hover-lift animate-pulse shadow-lg"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {user && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 origin-top ${mobileOpen ? 'max-h-[640px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          <div className="px-5 pb-6 pt-5 bg-gradient-to-b from-primary-black/95 via-primary-black/92 to-primary-black/98 backdrop-blur-2xl border-b border-dark-gray/60">
            <div className="relative overflow-hidden rounded-3xl border border-dark-gray/40 bg-secondary-black/40 shadow-[0_20px_45px_rgba(0,0,0,0.3)]">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
              <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl"></div>
              <div className="relative flex items-center gap-4 px-5 py-6">
                <div className="w-12 h-12 rounded-2xl bg-off-white text-primary-black font-semibold flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
                  {user.emailOrMobile.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-light-gray/60">Signed in as</div>
                  <div className="text-lg text-off-white font-semibold leading-tight">
                    {getFirstName(user.emailOrMobile)}
                  </div>
                  <div className="text-xs text-light-gray/60 mt-1 truncate">{user.emailOrMobile}</div>
                </div>
                <div className="hidden xs:flex flex-col items-end text-right text-[10px] uppercase tracking-[0.35em] text-light-gray/50">
                  <span>Session</span>
                  <span className="text-off-white/80 text-lg tracking-normal">Live</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="group relative flex items-center justify-between gap-4 rounded-2xl border border-dark-gray/50 bg-primary-black/60 px-4 py-4 transition-all duration-200 hover:border-off-white/50 hover:bg-secondary-black/40"
                >
                  <div>
                    <div className="text-off-white font-semibold text-base">{link.label}</div>
                    <div className="text-xs text-light-gray/60 mt-1 uppercase tracking-[0.25em]">
                      {mobileLinkDescriptions[link.label] ?? 'Explore'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-light-gray/60 group-hover:text-off-white transition-colors">
                    <span className="text-[11px] uppercase tracking-[0.4em]">Go</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/70 bg-red-500/10 px-5 py-3 text-red-300 transition-all duration-200 hover:bg-red-500/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
