import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaBox, 
  FaDownload,
  FaShoppingCart,
  FaUserCog,
  FaSignOutAlt,
  FaShoppingBag,
  FaCreditCard,
  FaHeadset,
  FaChartLine,
  FaBell,
  FaWallet,
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
  FaQuestionCircle
} from 'react-icons/fa';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/store', icon: <FaStore />, label: 'Browse Store' },
    { path: '/my-downloads', icon: <FaDownload />, label: 'My Downloads' },
    { path: '/orders', icon: <FaCreditCard />, label: 'Purchase History' },
    { path: '/wallet', icon: <FaWallet />, label: 'My Wallet' },
    { path: '/profile/edit', icon: <FaUserCog />, label: 'Edit Profile' },
    { path: '/contact', icon: <FaHeadset />, label: 'Support' },
  ];

  const isActive = (path) => location.pathname === path;

  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] text-center">
          <p className="text-[#B0C4DE]">Please login to view your dashboard</p>
          <Link to="/login" className="text-[#00D4FF] hover:underline mt-4 inline-block">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Purchases', value: '12', icon: <FaShoppingBag />, color: 'text-blue-400' },
    { label: 'Downloads', value: '8', icon: <FaDownload />, color: 'text-purple-400' },
    { label: 'Saved Items', value: '5', icon: <FaBox />, color: 'text-green-400' },
    { label: 'Support Tickets', value: '2', icon: <FaHeadset />, color: 'text-orange-400' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-[#0A1628]">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 text-white text-2xl bg-[#1A2D4A] p-2 rounded-lg"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#1A2D4A] border-r border-[#2A3D5A] transition-transform duration-300 z-40 pt-16 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* User Profile */}
        <div className="p-4 border-b border-[#2A3D5A]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] rounded-xl flex items-center justify-center text-xl text-white font-bold">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{user.name}</p>
              <p className="text-[#B0C4DE] text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white'
                  : 'text-[#B0C4DE] hover:bg-[#2A3D5A] hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">✓</span>
              )}
            </Link>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all mt-4 border-t border-[#2A3D5A] pt-4"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A3D5A]">
          <p className="text-xs text-[#B0C4DE] text-center">
            NetLabs+ User v1.0
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <div className="p-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">{user.name}!</span>
                </h1>
                <p className="text-[#B0C4DE] mt-1">Manage your account and track your learning progress</p>
              </div>
              <button className="px-4 py-2 bg-[#1A2D4A] border border-[#2A3D5A] rounded-lg text-[#B0C4DE] hover:border-[#00D4FF] transition-all flex items-center gap-2">
                <FaBell />
                <span className="relative -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color} text-2xl`}>{stat.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-[#B0C4DE]">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
              <Link to="/store" className="text-sm text-[#00D4FF] hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.slice(0, 6).map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="bg-[#1A2D4A] p-5 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all group hover:transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-[#00D4FF] text-2xl group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold group-hover:text-[#00D4FF] transition-colors">
                        {action.label}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-[#1A2D4A] p-5 rounded-xl border border-[#2A3D5A]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">Recent Activity</h4>
                <FaChartLine className="text-[#B0C4DE]" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-[#00D4FF]/20 rounded-full flex items-center justify-center text-[#00D4FF]">
                    <FaDownload />
                  </div>
                  <div>
                    <p className="text-white">Downloaded "Packet Tracer Labs"</p>
                    <p className="text-[#B0C4DE] text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-[#00D4FF]/20 rounded-full flex items-center justify-center text-[#00D4FF]">
                    <FaShoppingBag />
                  </div>
                  <div>
                    <p className="text-white">Purchased "Network Security Tutorials"</p>
                    <p className="text-[#B0C4DE] text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-[#00D4FF]/20 rounded-full flex items-center justify-center text-[#00D4FF]">
                    <FaUser />
                  </div>
                  <div>
                    <p className="text-white">Updated profile information</p>
                    <p className="text-[#B0C4DE] text-xs">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}