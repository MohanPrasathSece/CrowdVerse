import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
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
    setLoading(true);

    try {
      const { data } = await login(formData);
      loginUser({ emailOrMobile: data.emailOrMobile, _id: data._id }, data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 pt-16 pb-10 sm:py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-off-white mb-2">Welcome Back</h2>
          <p className="text-sm sm:text-base text-light-gray mb-4">Sign in to your account</p>
          <p className="text-xs sm:text-sm text-light-gray/60">Unlock Retail Psychology for Stocks & Crypto.</p>
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
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 sm:py-3 bg-off-white text-primary-black rounded-lg hover:bg-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-light-gray">
            Don't have an account?{' '}
            <Link to="/signup" className="text-off-white hover:text-white font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
