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

  const getFirstName = (user) => {
    if (!user) return '';
    // If firstName is available, use it
    if (user.firstName) {
      return user.firstName;
    }
    // For guest users, extract from email or use a default
    if (user.isGuest && user.emailOrMobile) {
      const guestMatch = user.emailOrMobile.match(/guest_(\d+)@/);
      if (guestMatch) {
        return `Guest ${guestMatch[1].slice(-4)}`; // Show last 4 digits of timestamp
      }
    }
    // Fallback to email parsing for backward compatibility
    const value = user.emailOrMobile || '';
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

  const handleNavClick = (to) => {
    // If clicking on the same page, scroll to top
    if (location.pathname === to || (to === '/dashboard' && location.pathname.startsWith('/dashboard'))) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = user
    ? [
      { to: '/finance', label: 'Home' },
      { to: '/news', label: 'News' },
      { to: '/dashboard', label: 'Market' },
      { to: '/portfolio', label: 'Portfolio' },
    ]
    : [
      { to: '/', label: 'Home' },
      { to: '/news', label: 'News' },
      { to: '/dashboard', label: 'Market' },
      { to: '/portfolio', label: 'Portfolio' },
    ];

  return (
    <nav className={`sticky top-0 z-40 bg-gradient-bg border-b border-dark-gray backdrop-blur-lg transition-all duration-1000 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          <Link
            to={user ? '/finance' : '/'}
            className="text-2xl font-bold text-off-white hover:text-white transition-all hover-scale flex items-center space-x-2"
          >
            <span className="flex items-center">
              <img
                src="/logo.png"
                alt="CrowdVerse logo"
                className="h-16 w-16 rounded-md object-contain"
              />
            </span>
          </Link>

          {!hideNavLinks && (
            <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 text-sm uppercase tracking-[0.25em] text-light-gray/70">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to ||
                  (link.to === '/dashboard' && location.pathname.startsWith('/dashboard'));
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => handleNavClick(link.to)}
                    className={`transition-all ${isActive
                      ? 'text-off-white font-semibold'
                      : 'hover:text-off-white'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="ml-auto pl-4 flex items-center gap-4">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden md:inline-flex items-center px-3 py-2 text-xs font-semibold rounded-full border border-blue-500/60 text-blue-300 hover:bg-blue-600/10 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}

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
                    {getFirstName(user).charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-light-gray/60">
                      {user.isGuest ? 'Guest' : 'Signed in'}
                    </span>
                    <span className="text-sm text-off-white font-medium">{getFirstName(user)}</span>
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
                      <path d="M15 3h4a 2 2 0 0 1 2 2v14a 2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 sm:space-x-5">
                {!isLoginPage && (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base text-off-white hover:text-white font-semibold transition-all hover-scale"
                  >
                    Login
                  </Link>
                )}
                {!isSignupPage && (
                  <Link
                    to="/signup"
                    className="px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-base bg-off-white text-primary-black rounded-xl hover:bg-white font-semibold transition-all hover-lift shadow-lg whitespace-nowrap"
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
          className={`md:hidden overflow-hidden transition-all duration-400 origin-top ${mobileOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}`}
        >
          <div className="px-4 pb-5 pt-4 bg-primary-black/95 border-b border-dark-gray/60">
            <div className="pb-3 border-b border-dark-gray/40">
              <span className="text-xs tracking-[0.35em] uppercase text-light-gray/60">Menu</span>
            </div>

            <div className="mt-4 flex flex-col">
              {user.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => handleNavClick('/admin')}
                  className={`flex items-center justify-between px-3 py-4 text-base font-semibold border-b border-dark-gray/50 transition-all ${location.pathname === '/admin'
                    ? 'text-off-white bg-off-white/10 border-l-2 border-l-off-white'
                    : 'text-off-white/90 hover:text-white'
                    }`}
                >
                  <span>Admin Panel</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-light-gray/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}

              {navLinks.map((link) => {
                const isActive = location.pathname === link.to ||
                  (link.to === '/dashboard' && location.pathname.startsWith('/dashboard'));
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => handleNavClick(link.to)}
                    className={`flex items-center justify-between px-3 py-4 text-base font-semibold border-b border-dark-gray/50 last:border-b-0 transition-all ${isActive
                      ? 'text-off-white bg-off-white/10 border-l-2 border-l-off-white'
                      : 'text-off-white/90 hover:text-white'
                      }`}
                  >
                    <span>{link.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-light-gray/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-lg border border-dark-gray/60 px-4 py-3.5 text-base font-semibold text-off-white hover:bg-secondary-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
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
      )}
    </nav>
  );
};

export default Navbar;
