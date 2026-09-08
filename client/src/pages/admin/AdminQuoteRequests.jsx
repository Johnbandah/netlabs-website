import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaSpinner,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';
import API_URL from '../../api/config';

export default function AdminQuoteRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/quote-requests`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        console.error('Failed to fetch quote requests:', data.message);
        // Fallback to sample data
        setRequests([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@hospital.com',
            phone: '+263 77 123 4567',
            company: 'Victoria Falls Hospital',
            serviceType: 'Network Design & Implementation',
            industry: 'Healthcare',
            message: 'We need a complete network infrastructure upgrade for our hospital. This includes VLAN segmentation, wireless deployment, and security implementation.',
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      // Fallback to sample data
      setRequests([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@hospital.com',
          phone: '+263 77 123 4567',
          company: 'Victoria Falls Hospital',
          serviceType: 'Network Design & Implementation',
          industry: 'Healthcare',
          message: 'We need a complete network infrastructure upgrade for our hospital.',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/api/quote-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setRequests(requests.map(r => 
          r._id === id ? { ...r, status } : r
        ));
        showNotification(`Quote request ${status}!`, 'success');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('Error updating status', 'error');
    }
  };

  const deleteRequest = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the quote request from "${name}"?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/quote-requests/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setRequests(requests.filter(r => r._id !== id));
        showNotification(`Quote request from "${name}" deleted!`, 'success');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      showNotification('Error deleting request', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'reviewing': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-400" />;
      case 'reviewing': return <FaSpinner className="text-blue-400 animate-spin" />;
      case 'approved': return <FaCheckCircle className="text-green-400" />;
      case 'declined': return <FaTimesCircle className="text-red-400" />;
      default: return null;
    }
  };

  const filteredRequests = requests.filter(request =>
    request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FaSpinner className="text-4xl text-[#00D4FF] animate-spin" />
        <p className="text-[#B0C4DE]">Loading quote requests...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Notification */}
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Quote Requests</h1>
          <p className="text-[#B0C4DE]">Manage customer quote requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#00D4FF]">{requests.length}</p>
          <p className="text-xs text-[#B0C4DE]">Total Requests</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {requests.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-xs text-[#B0C4DE]">Pending</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-blue-400">
            {requests.filter(r => r.status === 'reviewing').length}
          </p>
          <p className="text-xs text-[#B0C4DE]">Reviewing</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-green-400">
            {requests.filter(r => r.status === 'approved').length}
          </p>
          <p className="text-xs text-[#B0C4DE]">Approved</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
        />
      </div>

      {/* Requests Table */}
      <div className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A1628] border-b border-[#2A3D5A]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3D5A]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#B0C4DE]">
                    <p>No quote requests found</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-[#2A3D5A]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{request.name}</div>
                        <div className="text-[#B0C4DE] text-sm">{request.email}</div>
                        {request.company && (
                          <div className="text-[#B0C4DE] text-xs">{request.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#B0C4DE] text-sm line-clamp-2 max-w-xs">
                        {request.message}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(request.status)} inline-flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#B0C4DE] text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="p-2 bg-[#0A1628] text-[#00D4FF] rounded-lg hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all border border-[#00D4FF]/30"
                          title="View Details"
                        >
                          <FaEye />
                        </button>

                        {/* Mark as Reviewing */}
                        {request.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(request._id, 'reviewing')}
                            className="p-2 bg-[#0A1628] text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all border border-blue-400/30"
                            title="Mark as Reviewing"
                          >
                            <FaSpinner />
                          </button>
                        )}

                        {/* Approve */}
                        {request.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus(request._id, 'approved')}
                            className="p-2 bg-[#0A1628] text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all border border-green-400/30"
                            title="Approve Quote"
                          >
                            <FaCheck />
                          </button>
                        )}

                        {/* Decline */}
                        {request.status !== 'declined' && (
                          <button
                            onClick={() => updateStatus(request._id, 'declined')}
                            className="p-2 bg-[#0A1628] text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-400/30"
                            title="Decline Quote"
                          >
                            <FaTimes />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => deleteRequest(request._id, request.name)}
                          className="p-2 bg-[#0A1628] text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-400/30"
                          title="Delete Request"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Quote Request Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#B0C4DE] hover:text-white transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#B0C4DE] text-sm">Name</p>
                  <p className="text-white font-medium">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-[#B0C4DE] text-sm">Email</p>
                  <p className="text-white">{selectedRequest.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#B0C4DE] text-sm">Phone</p>
                  <p className="text-white">{selectedRequest.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[#B0C4DE] text-sm">Company</p>
                  <p className="text-white">{selectedRequest.company || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <p className="text-[#B0C4DE] text-sm">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedRequest.status)} inline-flex items-center gap-1`}>
                  {getStatusIcon(selectedRequest.status)}
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-[#B0C4DE] text-sm">Message</p>
                <p className="text-white bg-[#0A1628] p-3 rounded-lg">{selectedRequest.message}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#2A3D5A]">
                {selectedRequest.status === 'pending' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedRequest._id, 'reviewing');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <FaSpinner /> Mark Reviewing
                  </button>
                )}
                {selectedRequest.status !== 'approved' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedRequest._id, 'approved');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <FaCheck /> Approve Quote
                  </button>
                )}
                {selectedRequest.status !== 'declined' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedRequest._id, 'declined');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <FaTimes /> Decline Quote
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteRequest(selectedRequest._id, selectedRequest.name);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <FaTrash /> Delete Request
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#2A3D5A] text-white rounded-lg hover:bg-[#3A4D6A] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}