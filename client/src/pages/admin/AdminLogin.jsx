import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please enter email and password');
      setIsLoading(false);
      return;
    }

    // Use the main login function
    const result = await login(credentials.email, credentials.password);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        setError('You are not authorized as admin');
      }
    } else {
      setError(result.message || 'Invalid username or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-white">Net</span>
            <span className="text-[#00D4FF]">Labs</span>
            <span className="text-white">+</span>
          </h1>
          <p className="text-[#B0C4DE] mt-2">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-white block mb-2 text-sm font-medium">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none"
                placeholder="admin@netlabs.com"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-white block mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full p-3 pl-10 pr-12 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none"
                placeholder="admin123"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                <FaSignInAlt />
                Login
              </span>
            )}
          </button>
        </form>

        <div className="mt-4 p-3 bg-[#0A1628] rounded-lg border border-[#2A3D5A]">
          <p className="text-xs text-[#B0C4DE] text-center">
            <strong className="text-white">Admin Credentials:</strong><br />
            Email: admin@netlabs.com<br />
            Password: admin123
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-[#B0C4DE]">
            <a href="/login" className="text-[#00D4FF] hover:underline">User Login</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}