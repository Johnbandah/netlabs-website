import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaTimes, 
  FaCheck, 
  FaCircle, 
  FaInfoCircle, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaDollarSign,
  FaEnvelope,
  FaUser,
  FaBox
} from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications, getTimeAgo } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success': return <FaCheckCircle className="text-green-400" />;
      case 'info': return <FaInfoCircle className="text-blue-400" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-400" />;
      case 'quote': return <FaDollarSign className="text-[#00D4FF]" />;
      case 'inquiry': return <FaEnvelope className="text-purple-400" />;
      case 'order': return <FaBox className="text-orange-400" />;
      default: return <FaCircle className="text-[#B0C4DE]" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'info': return 'border-blue-500/30 bg-blue-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'quote': return 'border-[#00D4FF]/30 bg-[#00D4FF]/10';
      case 'inquiry': return 'border-purple-500/30 bg-purple-500/10';
      case 'order': return 'border-orange-500/30 bg-orange-500/10';
      default: return 'border-[#2A3D5A] bg-[#1A2D4A]';
    }
  };

  const getNotificationLink = (notif) => {
    if (notif.quoteId) return '/admin/quote-requests';
    if (notif.inquiryId) return '/admin/inquiries';
    if (notif.orderId) return '/admin/orders';
    return '#';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors rounded-lg hover:bg-[#1A2D4A]"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1.5 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] shadow-2xl z-50 max-h-[500px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2A3D5A]">
              <h3 className="text-white font-semibold">Notifications</h3>
              <div className="flex gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear all
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#B0C4DE]">
                  <FaBell className="text-4xl mx-auto mb-3 opacity-30" />
                  <p>No notifications</p>
                  <p className="text-sm opacity-50">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    to={getNotificationLink(notif)}
                    onClick={() => {
                      markAsRead(notif.id);
                      setIsOpen(false);
                    }}
                    className={`block p-4 border-b border-[#2A3D5A] hover:bg-[#2A3D5A]/30 transition-all cursor-pointer ${
                      !notif.read ? 'bg-[#00D4FF]/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getTypeIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className={`text-sm font-medium ${notif.read ? 'text-[#B0C4DE]' : 'text-white'}`}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-[#00D4FF] rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-[#B0C4DE] line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-[#B0C4DE]/50 mt-1">{getTimeAgo(notif.createdAt)}</p>
                        {notif.quoteId && (
                          <span className="text-xs text-[#00D4FF] mt-1 inline-block">
                            View Quote Request →
                          </span>
                        )}
                        {notif.inquiryId && (
                          <span className="text-xs text-purple-400 mt-1 inline-block">
                            View Inquiry →
                          </span>
                        )}
                        {notif.orderId && (
                          <span className="text-xs text-orange-400 mt-1 inline-block">
                            View Order →
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2 border-t border-[#2A3D5A] text-center">
                <Link
                  to="/admin/notifications"
                  className="text-xs text-[#B0C4DE] hover:text-[#00D4FF] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}