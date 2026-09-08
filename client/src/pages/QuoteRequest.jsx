import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaUser, 
  FaPhone, 
  FaBuilding, 
  FaArrowRight,
  FaCheckCircle,
  FaSpinner,
  FaLock
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API_URL from '../api/config';

export default function QuoteRequest() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (!isLogin && authForm.password !== authForm.confirmPassword) {
      setAuthError('Passwords do not match');
      setAuthLoading(false);
      return;
    }

    const result = isLogin
      ? await login(authForm.email, authForm.password)
      : await register(authForm.name, authForm.email, authForm.password);

    if (result.success) {
      setShowAuthModal(false);
      await submitQuote();
    } else {
      setAuthError(result.message || 'Authentication failed');
    }
    setAuthLoading(false);
  };

  const submitQuote = async () => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      console.log('📤 Sending quote request to:', `${API_URL}/api/quote-requests`);
      console.log('📤 Data:', formData);

      const response = await fetch(`${API_URL}/api/quote-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null
        }),
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 4000);
      } else {
        setErrorMessage(data.message || 'There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    await submitQuote();
  };

  // Success Screen
  if (success) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1A2D4A] p-8 rounded-2xl border border-green-500/50 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quote Request Submitted!</h2>
          <p className="text-[#B0C4DE] mb-4">
            Thank you for your request! A NetLabs+ representative will contact you within 24 hours.
          </p>
          <p className="text-[#00D4FF] text-sm mb-6">
            We'll review your requirements and provide a detailed quote.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block"
          >
            Return Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Quote</span>
          </h1>
          <p className="text-[#B0C4DE] mt-2">
            Tell us about your networking needs and we'll provide a custom quote.
          </p>
          {!user && (
            <p className="text-[#00D4FF] text-sm mt-2 flex items-center justify-center gap-2">
              <FaLock className="text-xs" />
              You'll be asked to login or create an account before submitting.
            </p>
          )}
        </motion.div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
            ❌ {errorMessage}
          </div>
        )}

        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white block mb-2 text-sm font-medium">Full Name *</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-white block mb-2 text-sm font-medium">Email Address *</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-white block mb-2 text-sm font-medium">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                  placeholder="+263 77 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="text-white block mb-2 text-sm font-medium">Company Name</label>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                  placeholder="Enter your company name"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-white block mb-2 text-sm font-medium">Project Details *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
              placeholder="Describe your project in detail. What networking services do you need? What is the scope of work? Do you have any specific requirements?"
              required
            />
          </div>

          {!user && (
            <div className="mt-4 bg-[#00D4FF]/10 border border-[#00D4FF]/30 p-4 rounded-lg">
              <p className="text-[#00D4FF] text-sm flex items-center gap-2">
                <FaLock className="text-xs" />
                You will be asked to login or create an account before submitting.
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-[#2A3D5A]">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Request <FaArrowRight />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Auth Modal - Login/Register */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {isLogin ? 'Login to Submit' : 'Create Account'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-[#B0C4DE] hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-[#B0C4DE] text-sm mb-4">
                {isLogin 
                  ? 'Login to your account to submit your quote request.' 
                  : 'Create an account to submit your quote request.'}
              </p>

              {authError && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="text-white block mb-1 text-sm">Full Name</label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                      className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                      placeholder="Enter your name"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="text-white block mb-1 text-sm">Email Address</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="text-white block mb-1 text-sm">Password</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label className="text-white block mb-1 text-sm">Confirm Password</label>
                    <input
                      type="password"
                      value={authForm.confirmPassword}
                      onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                      className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  {authLoading ? 'Processing...' : (isLogin ? 'Login & Submit' : 'Create Account & Submit')}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setAuthError('');
                  }}
                  className="text-[#00D4FF] hover:underline text-sm"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </button>
              </div>

              <p className="text-center text-[#B0C4DE] text-xs mt-4">
                🔒 Your information is secure and will not be shared
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}