import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import {
  FaUsers,
  FaBox,
  FaEnvelope,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaShoppingCart,
  FaCalendarAlt,
  FaDownload,
  FaPrint
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

export default function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  // Analytics data in USD
  const analyticsData = {
    totalUsers: 45,
    totalProducts: 6,
    totalInquiries: 12,
    totalRevenue: 1247.50,
    userGrowth: 12,
    productGrowth: 8,
    inquiryGrowth: 15,
    revenueGrowth: 22
  };

  // Format currency in USD
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const chartData = {
    revenue: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Revenue (USD)',
        data: [45, 89, 67, 123, 156, 78, 34],
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00D4FF',
        pointBorderColor: '#0A1628',
        pointBorderWidth: 2,
        pointRadius: 4,
      }]
    },
    inquiries: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Inquiries',
        data: [2, 4, 3, 5, 7, 3, 1],
        backgroundColor: 'rgba(0, 212, 255, 0.6)',
        borderColor: '#00D4FF',
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    products: {
      labels: ['Packet Tracer Labs', 'Security Docs', 'Network Tutorials', 'Guides', 'Enterprise Design'],
      datasets: [{
        label: 'Sales',
        data: [45, 32, 28, 25, 20],
        backgroundColor: [
          'rgba(0, 212, 255, 0.8)',
          'rgba(0, 102, 255, 0.8)',
          'rgba(0, 212, 255, 0.6)',
          'rgba(0, 102, 255, 0.6)',
          'rgba(0, 212, 255, 0.4)'
        ],
        borderColor: ['#00D4FF', '#0066FF', '#00D4FF', '#0066FF', '#00D4FF'],
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    categories: {
      labels: ['Labs', 'Documentation', 'Tutorials', 'Guides'],
      datasets: [{
        label: 'Products by Category',
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(0, 212, 255, 0.8)',
          'rgba(0, 102, 255, 0.8)',
          'rgba(0, 212, 255, 0.6)',
          'rgba(0, 102, 255, 0.6)'
        ],
        borderColor: ['#00D4FF', '#0066FF', '#00D4FF', '#0066FF'],
        borderWidth: 2,
      }]
    },
    status: {
      labels: ['New', 'Read', 'Replied'],
      datasets: [{
        label: 'Inquiry Status',
        data: [5, 4, 3],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: ['#FFCE56', '#36A2EB', '#4BC0C0'],
        borderWidth: 2,
      }]
    }
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
        ticks: {
          color: '#B0C4DE',
          callback: function(value) {
            return '$' + value;
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#B0C4DE' }
      }
    }
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: analyticsData.totalUsers,
      icon: <FaUsers className="text-3xl" />,
      color: 'from-blue-500 to-cyan-500',
      change: `+${analyticsData.userGrowth}%`,
      up: true
    },
    {
      title: 'Total Products',
      value: analyticsData.totalProducts,
      icon: <FaBox className="text-3xl" />,
      color: 'from-purple-500 to-pink-500',
      change: `+${analyticsData.productGrowth}%`,
      up: true
    },
    {
      title: 'Total Inquiries',
      value: analyticsData.totalInquiries,
      icon: <FaEnvelope className="text-3xl" />,
      color: 'from-yellow-500 to-orange-500',
      change: `+${analyticsData.inquiryGrowth}%`,
      up: true
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(analyticsData.totalRevenue),
      icon: <FaMoneyBillWave className="text-3xl" />,
      color: 'from-green-500 to-emerald-500',
      change: `+${analyticsData.revenueGrowth}%`,
      up: true
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
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
          {['today', 'week', 'month', 'year'].map((range) => (
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
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Revenue Trend (USD)</h3>
            <FaEye className="text-[#B0C4DE]" />
          </div>
          <div className="h-64">
            <Line data={chartData.revenue} options={chartOptions} />
          </div>
        </motion.div>

        {/* Inquiries Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Inquiries Overview</h3>
            <FaEnvelope className="text-[#B0C4DE]" />
          </div>
          <div className="h-64">
            <Bar data={chartData.inquiries} options={chartOptions} />
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
            <FaBox className="text-[#B0C4DE]" />
          </div>
          <div className="h-64">
            <Bar data={chartData.products} options={{ ...chartOptions, indexAxis: 'y' }} />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Products by Category</h3>
            <FaShoppingCart className="text-[#B0C4DE]" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={chartData.categories}
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

        {/* Inquiry Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Inquiry Status</h3>
            <FaEnvelope className="text-[#B0C4DE]" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <Pie
              data={chartData.status}
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

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Quick Stats</h3>
            <FaCalendarAlt className="text-[#B0C4DE]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0A1628] p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#00D4FF]">{analyticsData.totalInquiries}</p>
              <p className="text-sm text-[#B0C4DE]">Total Inquiries</p>
            </div>
            <div className="bg-[#0A1628] p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#0066FF]">{analyticsData.totalUsers}</p>
              <p className="text-sm text-[#B0C4DE]">Total Users</p>
            </div>
            <div className="bg-[#0A1628] p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#00D4FF]">{analyticsData.totalProducts}</p>
              <p className="text-sm text-[#B0C4DE]">Total Products</p>
            </div>
            <div className="bg-[#0A1628] p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#0066FF]">{formatCurrency(analyticsData.totalRevenue)}</p>
              <p className="text-sm text-[#B0C4DE]">Total Revenue</p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white rounded-lg hover:scale-105 transition-all">
              <FaDownload /> Export CSV
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2A3D5A] text-white rounded-lg hover:bg-[#3A4D6A] transition-all">
              <FaPrint /> Print Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}