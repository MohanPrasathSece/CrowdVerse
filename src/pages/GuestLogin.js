import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GuestLogin = () => {
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!guestName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (guestName.trim().length < 2) {
      alert('Name must be at least 2 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Clear any existing token first
      localStorage.removeItem('token');
      
      // Create a guest user object
      const guestUser = {
        id: `guest_${Date.now()}`,
        firstName: guestName.trim(),
        lastName: '',
        emailOrMobile: `guest_${Date.now()}@crowdverse.local`,
        isGuest: true
      };

      // Store guest user in localStorage without token
      loginUser(guestUser);
      
      // Navigate to finance page (same as regular users)
      navigate('/finance');
    } catch (error) {
      console.error('Guest login error:', error);
      alert('Failed to login as guest. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-off-white mb-2">Guest Login</h2>
          <p className="text-sm sm:text-base text-light-gray">
            Enter your name to participate in comments and polls
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="guestName" className="block text-xs sm:text-sm font-medium text-light-gray mb-2">
              Your Name
            </label>
            <input
              id="guestName"
              name="guestName"
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-3 bg-secondary-black border border-dark-gray rounded-lg text-off-white placeholder-light-gray/50 focus:outline-none focus:ring-2 focus:ring-off-white focus:border-transparent"
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-black bg-off-white hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-off-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Signing in...' : 'Continue as Guest'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-light-gray/60">
            Want full features?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-off-white hover:text-white font-medium"
            >
              Sign up for an account
            </button>
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-light-gray/70 hover:text-off-white transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestLogin;
