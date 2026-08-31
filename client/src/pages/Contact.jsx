import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase">Contact Us</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Touch</span>
          </h1>
          <p className="text-[#B0C4DE] max-w-2xl mx-auto mt-4 text-lg">
            Have a project in mind? Let's talk about how we can help secure your network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-[#1A2D4A] p-8 rounded-xl border border-[#2A3D5A]">
              <h3 className="text-white font-semibold text-xl mb-6">Contact Information</h3>
              <div className="space-y-4 text-[#B0C4DE]">
                <p className="flex items-center gap-3">
                  <FaEnvelope className="text-[#00D4FF] text-xl" />
                  <span>info.netlabsplus@gmail.com</span>
                </p>
                <p className="flex items-center gap-3">
                  <FaEnvelope className="text-[#00D4FF] text-xl" />
                  <span>support@netlabsplus.store</span>
                </p>
                <p className="flex items-center gap-3">
                  <FaPhone className="text-[#00D4FF] text-xl" />
                  <span>+263 86772 11857</span>
                </p>
                <p className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#00D4FF] text-xl" />
                  <span>Victoria Falls, Zimbabwe</span>
                </p>
              </div>
            </div>

            <div className="bg-[#1A2D4A] p-8 rounded-xl border border-[#2A3D5A]">
              <h3 className="text-white font-semibold text-xl mb-4">Business Hours</h3>
              <div className="space-y-2 text-[#B0C4DE]">
                <p className="flex items-center gap-3">
                  <FaClock className="text-[#00D4FF] text-xl" />
                  <span><span className="text-white">Monday - Friday:</span> 8:00 AM - 6:00 PM</span>
                </p>
                <p className="flex items-center gap-3 ml-9">
                  <span><span className="text-white">Saturday:</span> 9:00 AM - 3:00 PM</span>
                </p>
                <p className="flex items-center gap-3 ml-9">
                  <span><span className="text-white">Sunday:</span> Closed</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-[#1A2D4A] p-8 rounded-xl border border-[#2A3D5A]"
          >
            {submitted && (
              <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-6">
                ✅ Thank you! We will get back to you soon.
              </div>
            )}

            <div className="mb-4">
              <label className="text-white block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-white block mb-2 font-medium">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-white block mb-2 font-medium">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                placeholder="What is this regarding?"
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-white block mb-2 font-medium">Message</label>
              <textarea
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all resize-none"
                placeholder="Tell us about your project..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}