import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUnlock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const validatePassword = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({...formData, password});
    setPasswordStrength(validatePassword(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-[#2A3D5A]';
    }
  };

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
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
          <p className="text-[#4A9BC7] mt-1">Create your account</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2"
          >
            <FaCheckCircle className="text-green-500" />
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
            <FaTimesCircle className="text-red-500" />
            {error}
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-[#1A3A5C] block mb-2 text-sm font-medium">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A9BC7]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 pl-10 rounded-lg bg-[#E8F4FD] text-[#1A3A5C] border border-[#B8D8F0] focus:border-[#00B4D8] outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

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
                onChange={handlePasswordChange}
                className="w-full p-3 pl-10 pr-12 rounded-lg bg-[#E8F4FD] text-[#1A3A5C] border border-[#B8D8F0] focus:border-[#00B4D8] outline-none transition-all"
                placeholder="Enter your password (min 6 characters)"
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-[#E8F4FD] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ 
                        width: passwordStrength === 'weak' ? '33%' : 
                               passwordStrength === 'medium' ? '66%' : 
                               passwordStrength === 'strong' ? '100%' : '0%' 
                      }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength === 'weak' ? 'text-red-500' :
                    passwordStrength === 'medium' ? 'text-yellow-500' :
                    passwordStrength === 'strong' ? 'text-green-500' :
                    'text-[#4A9BC7]'
                  }`}>
                    {getStrengthText()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="text-[#1A3A5C] block mb-2 text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <FaUnlock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A9BC7]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full p-3 pl-10 pr-12 rounded-lg bg-[#E8F4FD] text-[#1A3A5C] border border-[#B8D8F0] focus:border-[#00B4D8] outline-none transition-all"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A9BC7] hover:text-[#00B4D8] transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.confirmPassword && formData.password && (
              <div className="mt-1">
                <p className={`text-xs ${formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {formData.password === formData.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                </p>
              </div>
            )}
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
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account
                <FaArrowRight />
              </span>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#B8D8F0]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-[#4A9BC7]">Already have an account?</span>
          </div>
        </div>

        <Link
          to="/login"
          className="block w-full py-3 text-center text-[#00B4D8] font-semibold rounded-lg border-2 border-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-all"
        >
          Sign In
        </Link>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#B0C4DE]">
            🔒 By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}