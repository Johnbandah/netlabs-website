import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  FaUsers,
  FaBox,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaShoppingCart,
  FaCalendarAlt,
  FaDownload,
  FaPrint,
  FaSpinner,
  FaClock
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  // Sample data - always show this
  const sampleData = {
    stats: {
      totalRevenue: 1247.50,
      totalOrders: 12,
      totalUsers: 45,
      totalProducts: 6,
      pendingOrders: 3,
      newUsers: 12
    },
    revenueTrend: [
      { _id: '2026-09-01', revenue: 45 },
      { _id: '2026-09-02', revenue: 89 },
      { _id: '2026-09-03', revenue: 67 },
      { _id: '2026-09-04', revenue: 123 },
      { _id: '2026-09-05', revenue: 156 },
      { _id: '2026-09-06', revenue: 78 },
      { _id: '2026-09-07', revenue: 34 }
    ],
    revenueByCategory: [
      { _id: 'Labs', revenue: 500 },
      { _id: 'Documentation', revenue: 300 },
      { _id: 'Tutorials', revenue: 250 },
      { _id: 'Guides', revenue: 197.50 }
    ],
    topProducts: [
      { _id: 'Packet Tracer Labs', revenue: 450, totalSold: 15 },
      { _id: 'Security Tutorials', revenue: 250, totalSold: 10 },
      { _id: 'Documentation Suite', revenue: 200, totalSold: 10 },
      { _id: 'Troubleshooting Guide', revenue: 150, totalSold: 10 },
      { _id: 'Enterprise Design', revenue: 197.50, totalSold: 5 }
    ],
    userStats: { totalUsers: 45, activeUsers: 40, newUsers: 12 },
    recentOrders: [
      { _id: '1', userName: 'John Doe', totalAmount: 29.99, status: 'completed', createdAt: new Date().toISOString() },
      { _id: '2', userName: 'Jane Smith', totalAmount: 49.98, status: 'pending', createdAt: new Date().toISOString() },
      { _id: '3', userName: 'Mike Johnson', totalAmount: 14.99, status: 'completed', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Chart data with sample values
  const revenueChartData = {
    labels: sampleData.revenueTrend.map(item => {
      const date = new Date(item._id);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [{
      label: 'Revenue ($)',
      data: sampleData.revenueTrend.map(item => item.revenue),
      borderColor: '#00D4FF',
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00D4FF',
      pointBorderColor: '#0A1628',
      pointBorderWidth: 2,
      pointRadius: 4,
    }]
  };

  const categoryChartData = {
    labels: sampleData.revenueByCategory.map(item => item._id || 'Other'),
    datasets: [{
      label: 'Revenue by Category',
      data: sampleData.revenueByCategory.map(item => item.revenue),
      backgroundColor: [
        'rgba(0, 212, 255, 0.8)',
        'rgba(0, 102, 255, 0.8)',
        'rgba(74, 155, 199, 0.8)',
        'rgba(0, 212, 255, 0.6)'
      ],
      borderColor: ['#00D4FF', '#0066FF', '#4A9BC7', '#00D4FF'],
      borderWidth: 2,
    }]
  };

  const topProductsChartData = {
    labels: sampleData.topProducts.map(item => item._id || 'Unknown'),
    datasets: [{
      label: 'Revenue',
      data: sampleData.topProducts.map(item => item.revenue),
      backgroundColor: [
        'rgba(0, 212, 255, 0.8)',
        'rgba(0, 102, 255, 0.8)',
        'rgba(74, 155, 199, 0.8)',
        'rgba(0, 212, 255, 0.6)',
        'rgba(0, 102, 255, 0.6)'
      ],
      borderColor: ['#00D4FF', '#0066FF', '#4A9BC7', '#00D4FF', '#0066FF'],
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#B0C4DE',
          font: { size: 12, weight: 'bold' }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#B0C4DE' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#B0C4DE' }
      }
    }
  };

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: formatCurrency(sampleData.stats.totalRevenue), 
      icon: <FaMoneyBillWave className="text-3xl" />, 
      color: 'from-green-500 to-emerald-500',
      change: '+22%',
      up: true
    },
    { 
      title: 'Total Orders', 
      value: sampleData.stats.totalOrders, 
      icon: <FaShoppingCart className="text-3xl" />, 
      color: 'from-blue-500 to-cyan-500',
      change: '+15%',
      up: true
    },
    { 
      title: 'Total Users', 
      value: sampleData.stats.totalUsers, 
      icon: <FaUsers className="text-3xl" />, 
      color: 'from-purple-500 to-pink-500',
      change: '+12%',
      up: true
    },
    { 
      title: 'Pending Orders', 
      value: sampleData.stats.pendingOrders, 
      icon: <FaClock className="text-3xl" />, 
      color: 'from-yellow-500 to-orange-500',
      change: '-5%',
      up: false
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FaSpinner className="text-4xl text-[#00D4FF] animate-spin" />
        <p className="text-[#B0C4DE]">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-[#B0C4DE]">Track your store performance and insights</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['today', 'week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                timeRange === range
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white'
                  : 'bg-[#1A2D4A] text-[#B0C4DE] border border-[#2A3D5A] hover:border-[#00D4FF]'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
          <button className="px-4 py-2 bg-[#1A2D4A] text-[#B0C4DE] rounded-lg border border-[#2A3D5A] hover:border-[#00D4FF] transition-all flex items-center gap-2">
            <FaDownload /> Export
          </button>
          <button className="px-4 py-2 bg-[#1A2D4A] text-[#B0C4DE] rounded-lg border border-[#2A3D5A] hover:border-[#00D4FF] transition-all flex items-center gap-2">
            <FaPrint /> Print
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-[#B0C4DE] text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm mt-2 ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.up ? <FaArrowUp /> : <FaArrowDown />} {stat.change}
                </div>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl text-white shadow-lg shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
            <FaEye className="text-[#B0C4DE]" />
          </div>
          <div className="h-64">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Revenue by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Revenue by Category</h3>
            <FaBox className="text-[#B0C4DE]" />
          </div>
          <div className="h-64">
            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { color: '#B0C4DE', font: { size: 12 } }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Top Products</h3>
            <FaShoppingCart className="text-[#B0C4DE]" />
          </div>
          <div className="h-64">
            <Bar data={topProductsChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Quick Stats</h3>
            <FaCalendarAlt className="text-[#B0C4DE]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0A1628] p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#00D4FF]">{sampleData.stats.totalOrders}</p>
              <p className="text-sm text-[#B0C4DE]">Total Orders</p>
            </div>
            <div className="bg-[#0A1628] p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#0066FF]">{formatCurrency(sampleData.stats.totalRevenue)}</p>
              <p className="text-sm text-[#B0C4DE]">Total Revenue</p>
            </div>
            <div className="bg-[#0A1628] p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#00D4FF]">{sampleData.stats.totalUsers}</p>
              <p className="text-sm text-[#B0C4DE]">Total Users</p>
            </div>
            <div className="bg-[#0A1628] p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#0066FF]">{sampleData.stats.totalProducts}</p>
              <p className="text-sm text-[#B0C4DE]">Total Products</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-[#00D4FF] hover:underline">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {sampleData.recentOrders.map((order, index) => (
            <div key={index} className="flex items-center justify-between bg-[#0A1628] p-3 rounded-lg">
              <div>
                <p className="text-white font-medium">{order.userName || 'Guest'}</p>
                <p className="text-[#B0C4DE] text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[#00D4FF] font-bold">{formatCurrency(order.totalAmount)}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}