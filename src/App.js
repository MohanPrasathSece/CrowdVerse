import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Home from './pages/Home';
import Stocks from './pages/Stocks';
import Crypto from './pages/Crypto';
import PrivateRoute from './components/PrivateRoute';
import Asset from './pages/Asset';

// Component to handle dynamic title updates
function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'CrowdVerse - Home',
      '/login': 'CrowdVerse - Sign In',
      '/signup': 'CrowdVerse - Sign Up',
      '/home': 'CrowdVerse - Home',
      '/stocks': 'CrowdVerse - Market',
      '/crypto': 'CrowdVerse - Market',
      '/dashboard': 'CrowdVerse - Market',
      '/portfolio': 'CrowdVerse - Portfolio'
    };

    // Handle dynamic asset pages - always show Market for asset pages
    if (location.pathname.startsWith('/asset/')) {
      document.title = 'CrowdVerse - Market';
    } else {
      document.title = titles[location.pathname] || 'CrowdVerse - Track Markets with Real-time Intelligence';
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <TitleUpdater />
        <div className="flex flex-col min-h-screen bg-primary-black">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/asset/:symbol" element={<Asset />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/stocks"
                element={
                  <PrivateRoute>
                    <Stocks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/crypto"
                element={
                  <PrivateRoute>
                    <Crypto />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <PrivateRoute>
                    <Portfolio />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
