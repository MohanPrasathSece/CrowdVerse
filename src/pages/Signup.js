import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await signup(formData);
      loginUser({ emailOrMobile: data.emailOrMobile, _id: data._id }, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-off-white mb-2">Create Account</h2>
          <p className="text-sm sm:text-base text-light-gray">Join us to start tracking</p>
        </div>

        <div className="bg-secondary-black px-5 py-6 sm:p-8 rounded-lg border border-dark-gray shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="emailOrMobile" className="block text-xs sm:text-sm font-medium text-light-gray mb-2">
                Email or Mobile Number
              </label>
              <input
                type="text"
                id="emailOrMobile"
                name="emailOrMobile"
                value={formData.emailOrMobile}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-gray border border-dark-gray rounded-lg text-off-white focus:outline-none focus:ring-2 focus:ring-off-white"
                placeholder="Enter your email or mobile"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-light-gray mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-gray border border-dark-gray rounded-lg text-off-white focus:outline-none focus:ring-2 focus:ring-off-white"
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-light-gray mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-gray border border-dark-gray rounded-lg text-off-white focus:outline-none focus:ring-2 focus:ring-off-white"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-off-white text-primary-black rounded-lg hover:bg-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-light-gray">
            Already have an account?{' '}
            <Link to="/login" className="text-off-white hover:text-white font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
