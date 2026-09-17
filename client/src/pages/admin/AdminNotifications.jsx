import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaCheck, 
  FaTimes, 
  FaTrash, 
  FaSpinner,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaDollarSign,
  FaEnvelope,
  FaBox,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaEye
} from 'react-icons/fa';
import { useNotification } from '../../context/NotificationContext';
import API_URL from '../../api/config';

export default function AdminNotifications() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    getTimeAgo 
  } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    types: {}
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      calculateStats();
    }, 500);
  }, [notifications]);

  const calculateStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const read = notifications.filter(n => n.read).length;
    
    const types = {};
    notifications.forEach(n => {
      types[n.type] = (types[n.type] || 0) + 1;
    });

    setStats({ total, unread, read, types });
  };

  const showNotification = (message, type = 'success') => {
    setNotificationMessage({ message, type });
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  const handleDeleteAll = () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) return;
    clearNotifications();
    showNotification('All notifications cleared!', 'success');
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    showNotification('All notifications marked as read!', 'success');
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success': return <FaCheckCircle className="text-green-400" />;
      case 'info': return <FaInfoCircle className="text-blue-400" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-400" />;
      case 'quote': return <FaDollarSign className="text-[#00D4FF]" />;
      case 'inquiry': return <FaEnvelope className="text-purple-400" />;
      case 'order': return <FaBox className="text-orange-400" />;
      case 'user': return <FaUser className="text-teal-400" />;
      default: return <FaBell className="text-[#B0C4DE]" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'success': return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'info': return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'quote': return 'border-[#00D4FF]/30 bg-[#00D4FF]/10 text-[#00D4FF]';
      case 'inquiry': return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
      case 'order': return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      case 'user': return 'border-teal-500/30 bg-teal-500/10 text-teal-400';
      default: return 'border-[#2A3D5A] bg-[#1A2D4A] text-[#B0C4DE]';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'success': return 'Success';
      case 'info': return 'Info';
      case 'warning': return 'Warning';
      case 'quote': return 'Quote Request';
      case 'inquiry': return 'Inquiry';
      case 'order': return 'Order';
      case 'user': return 'User';
      default: return 'General';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || notif.type === filterType;
    return matchesSearch && matchesType;
  });

  const getNotificationLink = (notif) => {
    if (notif.quoteId) return '/admin/quote-requests';
    if (notif.inquiryId) return '/admin/inquiries';
    if (notif.orderId) return '/admin/orders';
    return '#';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FaSpinner className="text-4xl text-[#00D4FF] animate-spin" />
        <p className="text-[#B0C4DE]">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Notification Toast */}
      <AnimatePresence>
        {notificationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              notificationMessage.type === 'success' 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}
          >
            {notificationMessage.type === 'success' ? <FaCheck /> : <FaTimes />}
            {notificationMessage.message}
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
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-[#B0C4DE]">Manage all your notifications and alerts</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-[#1A2D4A] text-[#00D4FF] rounded-lg border border-[#00D4FF]/30 hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all flex items-center gap-2"
          >
            <FaCheck /> Mark All Read
          </button>
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
          >
            <FaTrash /> Clear All
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#00D4FF]">{stats.total}</p>
          <p className="text-xs text-[#B0C4DE]">Total</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.unread}</p>
          <p className="text-xs text-[#B0C4DE]">Unread</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-green-400">{stats.read}</p>
          <p className="text-xs text-[#B0C4DE]">Read</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#00D4FF]">
            {Object.keys(stats.types).length}
          </p>
          <p className="text-xs text-[#B0C4DE]">Types</p>
        </div>
      </motion.div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'quote', 'inquiry', 'order', 'user', 'success', 'info', 'warning'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg transition-all text-sm ${
              filterType === type
                ? 'bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white'
                : 'bg-[#1A2D4A] text-[#B0C4DE] hover:bg-[#2A3D5A]'
            }`}
          >
            {type === 'All' ? 'All' : getTypeLabel(type)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
        />
      </div>

      {/* Notifications List */}
      <div className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-[#B0C4DE]">
            <FaBell className="text-6xl mx-auto mb-4 opacity-30" />
            <p className="text-xl">No notifications found</p>
            <p className="text-sm opacity-50 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-[#2A3D5A]">
            {filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-[#2A3D5A]/30 transition-all cursor-pointer ${
                  !notif.read ? 'bg-[#00D4FF]/5' : ''
                }`}
                onClick={() => {
                  markAsRead(notif.id);
                  setSelectedNotification(notif);
                  setShowModal(true);
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-2xl">
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm font-medium ${notif.read ? 'text-[#B0C4DE]' : 'text-white'}`}>
                          {notif.title}
                        </p>
                        <p className="text-sm text-[#B0C4DE] line-clamp-2 mt-1">{notif.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(notif.type)}`}>
                            {getTypeLabel(notif.type)}
                          </span>
                          <span className="text-xs text-[#B0C4DE]/50 flex items-center gap-1">
                            <FaClock className="text-[10px]" />
                            {getTimeAgo(notif.createdAt)}
                          </span>
                          {!notif.read && (
                            <span className="text-xs bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        {!notif.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            className="p-1.5 bg-[#0A1628] text-[#00D4FF] rounded-lg hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all"
                            title="Mark as read"
                          >
                            <FaCheck className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNotification(notif);
                            setShowModal(true);
                          }}
                          className="p-1.5 bg-[#0A1628] text-[#B0C4DE] rounded-lg hover:text-white transition-all"
                          title="View details"
                        >
                          <FaEye className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Details Modal */}
      <AnimatePresence>
        {showModal && selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getTypeIcon(selectedNotification.type)}</div>
                  <h2 className="text-xl font-bold text-white">Notification Details</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#B0C4DE] hover:text-white transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[#B0C4DE] text-sm">Title</p>
                  <p className="text-white font-semibold">{selectedNotification.title}</p>
                </div>

                <div>
                  <p className="text-[#B0C4DE] text-sm">Message</p>
                  <p className="text-white bg-[#0A1628] p-3 rounded-lg">{selectedNotification.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#B0C4DE] text-sm">Type</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(selectedNotification.type)}`}>
                      {getTypeLabel(selectedNotification.type)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#B0C4DE] text-sm">Status</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedNotification.read 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {selectedNotification.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[#B0C4DE] text-sm">Received</p>
                  <p className="text-white flex items-center gap-2">
                    <FaCalendarAlt className="text-[#00D4FF]" />
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedNotification.quoteId && (
                  <div>
                    <p className="text-[#B0C4DE] text-sm">Related Item</p>
                    <a
                      href="/admin/quote-requests"
                      className="text-[#00D4FF] hover:underline"
                    >
                      View Quote Request →
                    </a>
                  </div>
                )}
                {selectedNotification.inquiryId && (
                  <div>
                    <p className="text-[#B0C4DE] text-sm">Related Item</p>
                    <a
                      href="/admin/inquiries"
                      className="text-[#00D4FF] hover:underline"
                    >
                      View Inquiry →
                    </a>
                  </div>
                )}
                {selectedNotification.orderId && (
                  <div>
                    <p className="text-[#B0C4DE] text-sm">Related Item</p>
                    <a
                      href="/admin/orders"
                      className="text-[#00D4FF] hover:underline"
                    >
                      View Order →
                    </a>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-[#2A3D5A]">
                  {!selectedNotification.read && (
                    <button
                      onClick={() => {
                        markAsRead(selectedNotification.id);
                        setShowModal(false);
                      }}
                      className="flex-1 py-2 bg-[#00D4FF]/20 text-[#00D4FF] rounded-lg hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all flex items-center justify-center gap-2"
                    >
                      <FaCheck /> Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 bg-[#2A3D5A] text-white rounded-lg hover:bg-[#3A4D6A] transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}