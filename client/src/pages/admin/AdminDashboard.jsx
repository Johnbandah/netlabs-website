import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaBox, 
  FaEnvelope, 
  FaEye, 
  FaCheckCircle, 
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaShoppingCart
} from 'react-icons/fa';
import API_URL from '../../api/config';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 6,
    totalInquiries: 1,
    newInquiries: 1,
    readInquiries: 0
  });
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Products', 
      value: stats.totalProducts, 
      icon: <FaBox className="text-3xl" />, 
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
      up: true
    },
    { 
      title: 'Total Inquiries', 
      value: stats.totalInquiries, 
      icon: <FaEnvelope className="text-3xl" />, 
      color: 'from-purple-500 to-pink-500',
      change: '+8%',
      up: true
    },
    { 
      title: 'New Inquiries', 
      value: stats.newInquiries, 
      icon: <FaClock className="text-3xl" />, 
      color: 'from-yellow-500 to-orange-500',
      change: '+5%',
      up: true
    },
    { 
      title: 'Read Inquiries', 
      value: stats.readInquiries, 
      icon: <FaCheckCircle className="text-3xl" />, 
      color: 'from-green-500 to-emerald-500',
      change: '-2%',
      up: false
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#B0C4DE]">Welcome back! Here's what's happening with your store.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#B0C4DE] text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm mt-2 ${
                  stat.up ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.up ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.change}
                </div>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <h3 className="text-white font-semibold mb-4">Recent Inquiries</h3>
          <p className="text-[#B0C4DE] text-sm">No recent inquiries yet.</p>
          <Link to="/admin/inquiries" className="text-[#00D4FF] text-sm hover:underline mt-2 inline-block">
            View all inquiries →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="block w-full text-left px-4 py-2 bg-[#0A1628] rounded-lg text-[#B0C4DE] hover:text-white hover:border-[#00D4FF] border border-transparent transition-all"
            >
              <FaBox className="inline mr-2" /> Manage Products
            </Link>
            <Link
              to="/admin/inquiries"
              className="block w-full text-left px-4 py-2 bg-[#0A1628] rounded-lg text-[#B0C4DE] hover:text-white hover:border-[#00D4FF] border border-transparent transition-all"
            >
              <FaEnvelope className="inline mr-2" /> View Inquiries
            </Link>
            <Link
              to="/store"
              className="block w-full text-left px-4 py-2 bg-[#0A1628] rounded-lg text-[#B0C4DE] hover:text-white hover:border-[#00D4FF] border border-transparent transition-all"
            >
              <FaShoppingCart className="inline mr-2" /> View Store
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}