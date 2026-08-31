import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEye, 
  FaCheck, 
  FaReply, 
  FaTrash,
  FaSearch,
  FaSpinner,
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaTimes,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import API_URL from '../../api/config';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [notification, setNotification] = useState(null);

  // Sample inquiries data
  const sampleInquiries = [
    { 
      _id: '1', 
      name: 'John Doe', 
      email: 'john@test.com', 
      subject: 'Network Setup Inquiry', 
      message: 'Need help with setting up a campus network with VLAN segmentation.', 
      status: 'new', 
      createdAt: '2024-08-31T10:30:00Z' 
    },
    { 
      _id: '2', 
      name: 'Jane Smith', 
      email: 'jane@test.com', 
      subject: 'Security Consultation', 
      message: 'Looking for network security audit and firewall configuration.', 
      status: 'read', 
      createdAt: '2024-08-30T14:20:00Z' 
    },
    { 
      _id: '3', 
      name: 'Mike Johnson', 
      email: 'mike@test.com', 
      subject: 'Wireless Network Design', 
      message: 'Need help designing a secure wireless network for a hotel.', 
      status: 'replied', 
      createdAt: '2024-08-29T09:15:00Z' 
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setInquiries(sampleInquiries);
      setSelectedInquiry(sampleInquiries[0]);
      setLoading(false);
    }, 800);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateStatus = (id, status) => {
    setInquiries(inquiries.map(i => 
      i._id === id ? { ...i, status } : i
    ));
    if (selectedInquiry?._id === id) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
    showNotification(`Inquiry marked as ${status}!`, 'success');
  };

  const deleteInquiry = (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    const updated = inquiries.filter(i => i._id !== id);
    setInquiries(updated);
    if (selectedInquiry?._id === id) {
      setSelectedInquiry(updated.length > 0 ? updated[0] : null);
    }
    showNotification('Inquiry deleted successfully!', 'success');
  };

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'read': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'new': return <FaClock className="text-yellow-400" />;
      case 'read': return <FaEye className="text-blue-400" />;
      case 'replied': return <FaCheckCircle className="text-green-400" />;
      default: return null;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-4xl text-[#00D4FF]" />
        </motion.div>
        <p className="text-[#B0C4DE]">Loading inquiries...</p>
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Inquiries
          </motion.h1>
          <motion.p 
            className="text-[#B0C4DE]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Manage customer inquiries and messages ({filteredInquiries.length} inquiries)
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">
            🆕 New: {inquiries.filter(i => i.status === 'new').length}
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
            👁️ Read: {inquiries.filter(i => i.status === 'read').length}
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
            ✅ Replied: {inquiries.filter(i => i.status === 'replied').length}
          </span>
        </motion.div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative mb-6"
      >
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
        <input
          type="text"
          placeholder="Search inquiries by name, email, subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
        />
      </motion.div>

      {/* Inquiries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] overflow-hidden max-h-[600px] overflow-y-auto"
        >
          <AnimatePresence>
            {filteredInquiries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center text-[#B0C4DE]"
              >
                <FaEnvelope className="text-4xl mx-auto mb-3 opacity-50" />
                <p>No inquiries found</p>
                <p className="text-sm opacity-50 mt-1">Try adjusting your search</p>
              </motion.div>
            ) : (
              filteredInquiries.map((inquiry, index) => (
                <motion.div
                  key={inquiry._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`p-4 cursor-pointer transition-all relative ${
                    selectedInquiry?._id === inquiry._id 
                      ? 'bg-[#2A3D5A]/50 border-l-4 border-[#00D4FF]' 
                      : 'hover:bg-[#2A3D5A]/30 border-l-4 border-transparent'
                  } ${index !== filteredInquiries.length - 1 ? 'border-b border-[#2A3D5A]' : ''}`}
                  onClick={() => setSelectedInquiry(inquiry)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <motion.h3 
                          className="text-white font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          {inquiry.name}
                        </motion.h3>
                        <motion.span 
                          className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(inquiry.status)} flex items-center gap-1`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status}
                        </motion.span>
                      </div>
                      <p className="text-[#B0C4DE] text-sm truncate">{inquiry.email}</p>
                      <p className="text-[#B0C4DE] text-sm mt-1 truncate font-medium">{inquiry.subject}</p>
                      <p className="text-[#B0C4DE] text-sm mt-1 line-clamp-2">{inquiry.message}</p>
                      <p className="text-[#B0C4DE] text-xs mt-2 flex items-center gap-1">
                        <FaCalendar className="text-[#00D4FF]" />
                        {new Date(inquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedInquiry?._id === inquiry._id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-[#00D4FF] ml-2"
                      >
                        <FaCheck />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Inquiry Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] p-6"
        >
          <AnimatePresence mode="wait">
            {selectedInquiry ? (
              <motion.div
                key={selectedInquiry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">Inquiry Details</h3>
                  <motion.span 
                    className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedInquiry.status)}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {selectedInquiry.status}
                  </motion.span>
                </div>
                
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-3 bg-[#0A1628] rounded-lg"
                  >
                    <p className="text-[#B0C4DE] text-xs uppercase tracking-wider">Name</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <FaUser className="text-[#00D4FF]" />
                      {selectedInquiry.name}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-3 bg-[#0A1628] rounded-lg"
                  >
                    <p className="text-[#B0C4DE] text-xs uppercase tracking-wider">Email</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <FaEnvelope className="text-[#00D4FF]" />
                      {selectedInquiry.email}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-3 bg-[#0A1628] rounded-lg"
                  >
                    <p className="text-[#B0C4DE] text-xs uppercase tracking-wider">Subject</p>
                    <p className="text-white font-medium">{selectedInquiry.subject}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="p-3 bg-[#0A1628] rounded-lg"
                  >
                    <p className="text-[#B0C4DE] text-xs uppercase tracking-wider">Message</p>
                    <p className="text-white">{selectedInquiry.message}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-3 bg-[#0A1628] rounded-lg"
                  >
                    <p className="text-[#B0C4DE] text-xs uppercase tracking-wider">Received</p>
                    <p className="text-white flex items-center gap-2">
                      <FaCalendar className="text-[#00D4FF]" />
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                  </motion.div>

                  <motion.div 
                    className="flex flex-wrap gap-2 pt-4 border-t border-[#2A3D5A]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    {selectedInquiry.status === 'new' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateStatus(selectedInquiry._id, 'read')}
                        className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <FaEye /> Mark Read
                      </motion.button>
                    )}
                    {selectedInquiry.status === 'read' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateStatus(selectedInquiry._id, 'replied')}
                        className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <FaReply /> Mark Replied
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteInquiry(selectedInquiry._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[#B0C4DE] py-12"
              >
                <FaEnvelope className="text-5xl mx-auto mb-4 opacity-30" />
                <p className="text-lg">Select an inquiry</p>
                <p className="text-sm opacity-50">Click on any inquiry to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}