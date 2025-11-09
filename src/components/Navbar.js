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
          className={`md:hidden bg-primary-black/95 border-b border-dark-gray transition-all duration-300 origin-top ${mobileOpen ? 'max-h-60 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-off-white text-primary-black font-semibold rounded-full flex items-center justify-center">
                {user.emailOrMobile.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] uppercase tracking-[0.25em] text-light-gray/60">Signed in</span>
                <span className="text-sm text-off-white font-medium">{getFirstName(user.emailOrMobile)}</span>
              </div>
            </div>
            <div className="grid gap-3 border-t border-dark-gray/60 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block px-4 py-2 rounded-lg border border-dark-gray/60 text-light-gray/80 hover:text-off-white hover:border-off-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-400 bg-secondary-black/60 backdrop-blur-[80px] hover:bg-red-500/10 transition-colors"
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
