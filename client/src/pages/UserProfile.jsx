import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaSave, 
  FaTimes,
  FaCamera,
  FaCheck,
  FaSpinner,
  FaCalendarAlt
} from 'react-icons/fa';

export default function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Save profile data to localStorage for demo
      const updatedUser = {
        ...user,
        ...formData
      };
      localStorage.setItem('netlabs_user', JSON.stringify(updatedUser));
      
      // Update auth context (force reload)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] text-center">
          <p className="text-[#B0C4DE]">Please login to view your profile</p>
          <a href="/login" className="text-[#00D4FF] hover:underline mt-4 inline-block">
            Login Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Profile</span>
          </h1>
          <p className="text-[#B0C4DE] mb-8">Manage your account information and settings</p>

          {/* Profile Card */}
          <div className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] p-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] rounded-full flex items-center justify-center text-3xl text-white font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 bg-[#00D4FF] p-2 rounded-full text-[#0A1628] hover:scale-110 transition-all">
                  <FaCamera className="text-sm" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-[#B0C4DE]">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-[#00D4FF]/20 text-[#00D4FF] text-xs rounded-full">
                  {user.role === 'admin' ? 'Administrator' : 'Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] p-6">
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded-lg mb-4 flex items-center gap-2">
                <FaCheck className="text-green-400" />
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2">
                <FaTimes className="text-red-400" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white block mb-2 text-sm font-medium">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-white block mb-2 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    disabled
                  />
                </div>
                <p className="text-xs text-[#4A9BC7] mt-1">Email cannot be changed</p>
              </div>

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
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="text-white block mb-2 text-sm font-medium">Member Since</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                  <input
                    type="text"
                    value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                    className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-white block mb-2 text-sm font-medium">Address</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-[#B0C4DE]" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all resize-none"
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-white block mb-2 text-sm font-medium">Bio / About Me</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all resize-none"
                placeholder="Tell us a little about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaSave />
                  Save Changes
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}