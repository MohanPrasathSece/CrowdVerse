import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GuestLogin from './pages/GuestLogin';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Finance from './pages/Finance';
import News from './pages/News';
import Predictions from './pages/Predictions';
import Stocks from './pages/Stocks';
import Crypto from './pages/Crypto';
import Commodities from './pages/Commodities';
import PrivateRoute from './components/PrivateRoute';
import BetaSignupModal from './components/BetaSignupModal';
import Asset from './pages/Asset';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

// Component to handle dynamic title updates
function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'CrowdVerse - Home',
      '/login': 'CrowdVerse - Sign In',
      '/signup': 'CrowdVerse - Sign Up',
      '/guest': 'CrowdVerse - Guest Login',
      '/finance': 'CrowdVerse - Finance',
      '/news': 'CrowdVerse - News',
      '/predictions': 'CrowdVerse - Predictions',
      '/stocks': 'CrowdVerse - Market',
      '/crypto': 'CrowdVerse - Market',
      '/commodities': 'CrowdVerse - Market',
      '/dashboard': 'CrowdVerse - Market',
      '/portfolio': 'CrowdVerse - Portfolio',
      '/admin': 'CrowdVerse - Admin'
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
        <BetaSignupModal />
        <ScrollToTop />
        <TitleUpdater />
        <div className="flex flex-col min-h-screen bg-primary-black font-sans text-off-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/guest" element={<GuestLogin />} />
              <Route path="/asset/:symbol" element={<Asset />} />
              <Route
                path="/finance"
                element={
                  <PrivateRoute>
                    <Finance />
                  </PrivateRoute>
                }
              />
              <Route
                path="/news"
                element={
                  <PrivateRoute>
                    <News />
                  </PrivateRoute>
                }
              />
              <Route
                path="/predictions"
                element={
                  <PrivateRoute>
                    <Predictions />
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
                path="/commodities"
                element={
                  <PrivateRoute>
                    <Commodities />
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
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
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
