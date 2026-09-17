import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaSave,
  FaTag,
  FaPercent,
  FaDollarSign,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaBox
} from 'react-icons/fa';
import API_URL from '../../api/config';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    perUserLimit: '1',
    status: 'active'
  });

  // Sample coupons for demo
  const sampleCoupons = [
    {
      _id: '1',
      code: 'WELCOME10',
      description: '10% off for new customers',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 10,
      maxDiscountAmount: 50,
      startDate: '2026-09-01T00:00:00.000Z',
      endDate: '2026-12-31T23:59:59.000Z',
      usageLimit: 100,
      usedCount: 23,
      perUserLimit: 1,
      status: 'active',
      createdAt: '2026-09-01T10:00:00.000Z'
    },
    {
      _id: '2',
      code: 'SUMMER20',
      description: '20% off summer sale',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 50,
      maxDiscountAmount: 100,
      startDate: '2026-06-01T00:00:00.000Z',
      endDate: '2026-08-31T23:59:59.000Z',
      usageLimit: 200,
      usedCount: 187,
      perUserLimit: 2,
      status: 'expired',
      createdAt: '2026-06-01T08:00:00.000Z'
    },
    {
      _id: '3',
      code: 'FLASH50',
      description: '$50 off orders over $200',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 200,
      maxDiscountAmount: 50,
      startDate: '2026-09-05T00:00:00.000Z',
      endDate: '2026-09-10T23:59:59.000Z',
      usageLimit: 50,
      usedCount: 12,
      perUserLimit: 1,
      status: 'active',
      createdAt: '2026-09-05T09:00:00.000Z'
    }
  ];

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setCoupons(sampleCoupons);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      perUserLimit: '1',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount.toString(),
      maxDiscountAmount: coupon.maxDiscountAmount.toString(),
      startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
      endDate: coupon.endDate ? coupon.endDate.split('T')[0] : '',
      usageLimit: coupon.usageLimit.toString(),
      perUserLimit: coupon.perUserLimit.toString(),
      status: coupon.status
    });
    setShowModal(true);
  };

  const handleDeleteCoupon = (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    setCoupons(coupons.filter(c => c._id !== id));
    showNotification(`Coupon "${code}" deleted successfully!`, 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discountValue) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const couponData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
      maxDiscountAmount: parseFloat(formData.maxDiscountAmount) || 0,
      usageLimit: parseInt(formData.usageLimit) || 0,
      perUserLimit: parseInt(formData.perUserLimit) || 1,
      _id: editingCoupon?._id || 'coup_' + Date.now()
    };

    if (editingCoupon) {
      setCoupons(coupons.map(c => c._id === editingCoupon._id ? couponData : c));
      showNotification(`Coupon "${couponData.code}" updated successfully!`, 'success');
    } else {
      setCoupons([couponData, ...coupons]);
      showNotification(`Coupon "${couponData.code}" created successfully!`, 'success');
    }

    setShowModal(false);
    setEditingCoupon(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getDiscountTypeLabel = (type) => {
    return type === 'percentage' ? '%' : '$';
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || coupon.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FaSpinner className="text-4xl text-[#00D4FF] animate-spin" />
        <p className="text-[#B0C4DE]">Loading coupons...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}
          >
            {notification.type === 'success' ? <FaCheck /> : <FaTimes />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#B0C4DE] hover:text-white transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Coupon Code *</label>
                    <div className="relative">
                      <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all uppercase"
                        placeholder="e.g., WELCOME10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                      placeholder="Brief description of the coupon"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Discount Value *</label>
                    <div className="relative">
                      {formData.discountType === 'percentage' ? (
                        <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      ) : (
                        <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      )}
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                        placeholder={formData.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 20'}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Min Order Amount</label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      <input
                        type="number"
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                        className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                        placeholder="e.g., 50"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Max Discount</label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      <input
                        type="number"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                        className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                        placeholder="e.g., 50"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Start Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">End Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Usage Limit</label>
                    <div className="relative">
                      <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                        className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                        placeholder="0 = Unlimited"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Per User Limit</label>
                    <div className="relative">
                      <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
                      <input
                        type="number"
                        value={formData.perUserLimit}
                        onChange={(e) => setFormData({...formData, perUserLimit: e.target.value})}
                        className="w-full p-3 pl-10 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                        placeholder="e.g., 1"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-[#2A3D5A]">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-[#2A3D5A] text-white font-semibold rounded-lg hover:bg-[#3A4D6A] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Coupons & Discounts</h1>
          <p className="text-[#B0C4DE]">Create and manage promotional codes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddCoupon}
          className="px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:shadow-lg shadow-[#00D4FF]/20 transition-all flex items-center gap-2"
        >
          <FaPlus />
          Add Coupon
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#00D4FF]">{coupons.length}</p>
          <p className="text-xs text-[#B0C4DE]">Total Coupons</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-green-400">
            {coupons.filter(c => c.status === 'active').length}
          </p>
          <p className="text-xs text-[#B0C4DE]">Active</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {coupons.filter(c => c.status === 'inactive').length}
          </p>
          <p className="text-xs text-[#B0C4DE]">Inactive</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-red-400">
            {coupons.filter(c => c.status === 'expired').length}
          </p>
          <p className="text-xs text-[#B0C4DE]">Expired</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'active', 'inactive', 'expired'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white'
                  : 'bg-[#1A2D4A] text-[#B0C4DE] hover:bg-[#2A3D5A]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A1628] border-b border-[#2A3D5A]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Uses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3D5A]">
              <AnimatePresence>
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[#B0C4DE]">
                      <FaTag className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No coupons found</p>
                      <p className="text-sm opacity-50 mt-1">Create your first coupon</p>
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon, index) => (
                    <motion.tr
                      key={coupon._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-[#2A3D5A]/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaTag className="text-[#00D4FF]" />
                          <span className="text-white font-mono font-bold">{coupon.code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#B0C4DE] text-sm">{coupon.description || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">
                          {coupon.discountType === 'percentage' ? (
                            <span>{coupon.discountValue}%</span>
                          ) : (
                            <span>${coupon.discountValue}</span>
                          )}
                          {coupon.minOrderAmount > 0 && (
                            <span className="text-xs text-[#B0C4DE] block">Min ${coupon.minOrderAmount}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(coupon.status)}`}>
                          {coupon.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#B0C4DE] text-sm">
                          {coupon.usedCount} / {coupon.usageLimit === 0 ? '∞' : coupon.usageLimit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCoupon(coupon)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-500/10"
                            title="Edit coupon"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                            title="Delete coupon"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}