import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get redirect URL from query params
  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        if (redirect === 'checkout') {
          navigate('/checkout');
        } else if (result.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } else {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4FD] to-[#FFFFFF] flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl border border-[#B8D8F0] shadow-2xl max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-[#1A3A5C]">Net</span>
            <span className="text-[#00B4D8]">Labs</span>
            <span className="text-[#1A3A5C]">+</span>
          </h1>
          <p className="text-[#4A9BC7] mt-1">Welcome back!</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2"
          >
            <span className="text-green-500">✅</span>
            {successMessage}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2"
          >
            <span className="text-red-500">❌</span>
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-[#1A3A5C] block mb-2 text-sm font-medium">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A9BC7]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 pl-10 rounded-lg bg-[#E8F4FD] text-[#1A3A5C] border border-[#B8D8F0] focus:border-[#00B4D8] outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[#1A3A5C] block mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A9BC7]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 pl-10 pr-12 rounded-lg bg-[#E8F4FD] text-[#1A3A5C] border border-[#B8D8F0] focus:border-[#00B4D8] outline-none transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A9BC7] hover:text-[#00B4D8] transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-sm text-[#4A9BC7] hover:text-[#00B4D8] transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Login
                <FaArrowRight />
              </span>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-[#4A9BC7] text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00B4D8] font-semibold hover:underline transition-colors">
            Sign Up
          </Link>
        </p>

        <div className="mt-4 text-center">
          <p className="text-xs text-[#B0C4DE]">🔒 Your information is secure and will not be shared</p>
        </div>
      </motion.div>
    </div>
  );
}