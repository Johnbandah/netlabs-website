import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaBox, 
  FaDownload,
  FaShoppingBag,
  FaHeadset,
  FaChartLine,
  FaUser
} from 'react-icons/fa';
import NotificationDropdown from '../components/NotificationDropdown';

export default function UserDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Purchases', value: '12', icon: <FaShoppingBag />, color: 'text-blue-400' },
    { label: 'Downloads', value: '8', icon: <FaDownload />, color: 'text-purple-400' },
    { label: 'Saved Items', value: '5', icon: <FaBox />, color: 'text-green-400' },
    { label: 'Support Tickets', value: '2', icon: <FaHeadset />, color: 'text-orange-400' },
  ];

  return (
    <div>
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
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">{user?.name}!</span>
            </h1>
            <p className="text-[#B0C4DE] mt-1">Manage your account and track your learning progress</p>
          </div>
          <NotificationDropdown />
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

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
            <FaChartLine className="text-[#B0C4DE]" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00D4FF]/20 rounded-full flex items-center justify-center text-[#00D4FF]">
                <FaDownload />
              </div>
              <div>
                <p className="text-white font-medium">Downloaded "Packet Tracer Labs"</p>
                <p className="text-[#B0C4DE] text-sm">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00D4FF]/20 rounded-full flex items-center justify-center text-[#00D4FF]">
                <FaShoppingBag />
              </div>
              <div>
                <p className="text-white font-medium">Purchased "Network Security Tutorials"</p>
                <p className="text-[#B0C4DE] text-sm">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00D4FF]/20 rounded-full flex items-center justify-center text-[#00D4FF]">
                <FaUser />
              </div>
              <div>
                <p className="text-white font-medium">Updated profile information</p>
                <p className="text-[#B0C4DE] text-sm">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}