import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../api/config';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications for demo
  const sampleNotifications = [
    {
      id: 1,
      title: 'Welcome to NetLabs+!',
      message: 'Thank you for joining our community. Start exploring our networking resources.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    },
    {
      id: 2,
      title: 'New Quote Request',
      message: 'John Doe has submitted a new quote request for Network Design.',
      type: 'quote',
      read: false,
      quoteId: '1',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 3,
      title: 'New Inquiry Received',
      message: 'Mercy Banda has sent a new inquiry about network security.',
      type: 'inquiry',
      read: true,
      inquiryId: '3',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    }
  ];

  // Check for new quote requests
  useEffect(() => {
    // Load saved notifications from localStorage
    const savedNotifications = localStorage.getItem('netlabs_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (e) {
        setNotifications(sampleNotifications);
        setUnreadCount(sampleNotifications.filter(n => !n.read).length);
      }
    } else {
      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter(n => !n.read).length);
    }

    // Check for new quote requests every 30 seconds
    const interval = setInterval(checkQuoteRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('netlabs_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const checkQuoteRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/quote-requests`);
      const data = await response.json();
      if (data.success) {
        const pending = data.data.filter(r => r.status === 'pending');
        const newCount = pending.length;
        
        // Add notifications for new pending requests
        pending.forEach(request => {
          // Check if notification already exists for this quote
          const exists = notifications.some(n => n.quoteId === request._id);
          if (!exists) {
            addNotification(
              `New Quote Request from ${request.name}`,
              `${request.message.substring(0, 100)}...`,
              'quote',
              request._id
            );
          }
        });
      }
    } catch (error) {
      console.error('Error checking quote requests:', error);
    }
  };

  const addNotification = (title, message, type = 'info', quoteId = null, inquiryId = null, orderId = null) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      title,
      message,
      type,
      quoteId,
      inquiryId,
      orderId,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getTimeAgo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};