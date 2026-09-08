import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaSpinner,
  FaCheck,
  FaTimes,
  FaClock,
  FaTruck,
  FaBox,
  FaCheckCircle,
  FaPrint,
  FaDownload,
  FaFilter,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave
} from 'react-icons/fa';
import API_URL from '../../api/config';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    completed: 0,
    totalRevenue: 0
  });

  // Sample orders data
  const sampleOrders = [
    {
      _id: 'ORD-001',
      userEmail: 'john@hospital.com',
      userName: 'John Doe',
      products: [
        { title: 'Packet Tracer Labs Bundle', price: 29.99, quantity: 1, category: 'Labs' },
        { title: 'Network Security Tutorials', price: 24.99, quantity: 2, category: 'Tutorials' }
      ],
      totalAmount: 79.97,
      status: 'delivered',
      paymentMethod: 'stripe',
      createdAt: '2026-09-05T10:30:00Z',
      deliveredAt: '2026-09-06T14:20:00Z',
      shippingAddress: '123 Main St, Harare, Zimbabwe'
    },
    {
      _id: 'ORD-002',
      userEmail: 'jane@university.edu',
      userName: 'Jane Smith',
      products: [
        { title: 'Networking Documentation Suite', price: 19.99, quantity: 1, category: 'Documentation' }
      ],
      totalAmount: 19.99,
      status: 'processing',
      paymentMethod: 'mobile_money',
      createdAt: '2026-09-06T09:15:00Z',
      deliveredAt: null,
      shippingAddress: '456 Campus Rd, Blantyre, Malawi'
    },
    {
      _id: 'ORD-003',
      userEmail: 'mike@company.com',
      userName: 'Mike Johnson',
      products: [
        { title: 'Troubleshooting Guides', price: 14.99, quantity: 3, category: 'Guides' },
        { title: 'Enterprise Network Design', price: 34.99, quantity: 1, category: 'Labs' }
      ],
      totalAmount: 79.96,
      status: 'pending',
      paymentMethod: 'stripe',
      createdAt: '2026-09-07T11:00:00Z',
      deliveredAt: null,
      shippingAddress: '789 Office Park, Lilongwe, Malawi'
    },
    {
      _id: 'ORD-004',
      userEmail: 'sarah@tech.com',
      userName: 'Sarah Williams',
      products: [
        { title: 'Network Security Tutorials', price: 24.99, quantity: 1, category: 'Tutorials' },
        { title: 'Networking Documentation Suite', price: 19.99, quantity: 1, category: 'Documentation' }
      ],
      totalAmount: 44.98,
      status: 'shipped',
      paymentMethod: 'stripe',
      createdAt: '2026-09-04T16:45:00Z',
      deliveredAt: null,
      shippingAddress: '321 Tech Park, Lusaka, Zambia'
    },
    {
      _id: 'ORD-005',
      userEmail: 'admin@netlabs.com',
      userName: 'Admin User',
      products: [
        { title: 'Packet Tracer Labs Bundle', price: 29.99, quantity: 1, category: 'Labs' }
      ],
      totalAmount: 29.99,
      status: 'completed',
      paymentMethod: 'stripe',
      createdAt: '2026-09-01T08:00:00Z',
      deliveredAt: '2026-09-02T10:00:00Z',
      shippingAddress: 'Victoria Falls, Zimbabwe'
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setOrders(sampleOrders);
        calculateStats(sampleOrders);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const calculateStats = (orderList) => {
    const statsData = {
      total: orderList.length,
      pending: orderList.filter(o => o.status === 'pending').length,
      processing: orderList.filter(o => o.status === 'processing').length,
      shipped: orderList.filter(o => o.status === 'shipped').length,
      delivered: orderList.filter(o => o.status === 'delivered').length,
      cancelled: orderList.filter(o => o.status === 'cancelled').length,
      completed: orderList.filter(o => o.status === 'completed').length,
      totalRevenue: orderList.reduce((sum, o) => sum + o.totalAmount, 0)
    };
    setStats(statsData);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateStatus = (id, status) => {
    const updatedOrders = orders.map(o => 
      o._id === id ? { ...o, status } : o
    );
    setOrders(updatedOrders);
    calculateStats(updatedOrders);
    showNotification(`Order ${id} status updated to ${status}!`, 'success');
  };

  const deleteOrder = (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    const updatedOrders = orders.filter(o => o._id !== id);
    setOrders(updatedOrders);
    calculateStats(updatedOrders);
    showNotification('Order deleted successfully!', 'success');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-400" />;
      case 'processing': return <FaSpinner className="text-blue-400 animate-spin" />;
      case 'shipped': return <FaTruck className="text-purple-400" />;
      case 'delivered': return <FaBox className="text-green-400" />;
      case 'completed': return <FaCheckCircle className="text-emerald-400" />;
      case 'cancelled': return <FaTimes className="text-red-400" />;
      default: return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FaSpinner className="text-4xl text-[#00D4FF] animate-spin" />
        <p className="text-[#B0C4DE]">Loading orders...</p>
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Order Management</h1>
          <p className="text-[#B0C4DE]">Manage customer orders and track deliveries</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#1A2D4A] text-[#B0C4DE] rounded-lg border border-[#2A3D5A] hover:border-[#00D4FF] transition-all flex items-center gap-2">
            <FaDownload /> Export
          </button>
          <button className="px-4 py-2 bg-[#1A2D4A] text-[#B0C4DE] rounded-lg border border-[#2A3D5A] hover:border-[#00D4FF] transition-all flex items-center gap-2">
            <FaPrint /> Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <div className="bg-[#1A2D4A] p-3 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-xl font-bold text-[#00D4FF]">{stats.total}</p>
          <p className="text-xs text-[#B0C4DE]">Total</p>
        </div>
        <div className="bg-[#1A2D4A] p-3 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-xl font-bold text-yellow-400">{stats.pending}</p>
          <p className="text-xs text-[#B0C4DE]">Pending</p>
        </div>
        <div className="bg-[#1A2D4A] p-3 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-xl font-bold text-blue-400">{stats.processing}</p>
          <p className="text-xs text-[#B0C4DE]">Processing</p>
        </div>
        <div className="bg-[#1A2D4A] p-3 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-xl font-bold text-purple-400">{stats.shipped}</p>
          <p className="text-xs text-[#B0C4DE]">Shipped</p>
        </div>
        <div className="bg-[#1A2D4A] p-3 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-xl font-bold text-green-400">{stats.delivered}</p>
          <p className="text-xs text-[#B0C4DE]">Delivered</p>
        </div>
        <div className="bg-[#1A2D4A] p-3 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-xl font-bold text-emerald-400">{stats.completed}</p>
          <p className="text-xs text-[#B0C4DE]">Completed</p>
        </div>
        <div className="bg-[#1A2D4A] p-3 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-xl font-bold text-[#00D4FF]">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-[#B0C4DE]">Revenue</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'].map((status) => (
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

      {/* Orders Table */}
      <div className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A1628] border-b border-[#2A3D5A]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3D5A]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#B0C4DE]">
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#2A3D5A]/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-[#00D4FF] font-mono text-sm">{order._id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{order.userName}</div>
                        <div className="text-[#B0C4DE] text-xs">{order.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#B0C4DE] text-sm">
                        {order.products.reduce((sum, p) => sum + p.quantity, 0)} items
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(order.status)} inline-flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#B0C4DE] text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="p-2 bg-[#0A1628] text-[#00D4FF] rounded-lg hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <select
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="p-2 bg-[#0A1628] text-[#B0C4DE] rounded-lg border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all text-sm"
                            defaultValue={order.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                          </select>
                        )}
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="p-2 bg-[#0A1628] text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Order"
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

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0A1628]/50 border-t border-[#2A3D5A] flex justify-between text-sm text-[#B0C4DE]">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <span>Total Revenue: {formatCurrency(stats.totalRevenue)}</span>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
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
              className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#B0C4DE] hover:text-white transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#B0C4DE] text-sm">Order ID</p>
                    <p className="text-white font-mono">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-[#B0C4DE] text-sm">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedOrder.status)} inline-flex items-center gap-1`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t border-[#2A3D5A] pt-4">
                  <h3 className="text-white font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#B0C4DE] text-sm">Name</p>
                      <p className="text-white">{selectedOrder.userName}</p>
                    </div>
                    <div>
                      <p className="text-[#B0C4DE] text-sm">Email</p>
                      <p className="text-white">{selectedOrder.userEmail}</p>
                    </div>
                  </div>
                  {selectedOrder.shippingAddress && (
                    <div className="mt-2">
                      <p className="text-[#B0C4DE] text-sm">Shipping Address</p>
                      <p className="text-white">{selectedOrder.shippingAddress}</p>
                    </div>
                  )}
                </div>

                {/* Products */}
                <div className="border-t border-[#2A3D5A] pt-4">
                  <h3 className="text-white font-semibold mb-3">Products</h3>
                  <div className="space-y-2">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center bg-[#0A1628] p-3 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{product.title}</p>
                          <p className="text-[#B0C4DE] text-sm">x{product.quantity} - {product.category}</p>
                        </div>
                        <p className="text-[#00D4FF] font-semibold">{formatCurrency(product.price * product.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-3 border-t border-[#2A3D5A]">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-[#00D4FF] font-bold text-xl">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="border-t border-[#2A3D5A] pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#B0C4DE] text-sm">Payment Method</p>
                      <p className="text-white capitalize">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[#B0C4DE] text-sm">Order Date</p>
                      <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {selectedOrder.deliveredAt && (
                    <div className="mt-2">
                      <p className="text-[#B0C4DE] text-sm">Delivered Date</p>
                      <p className="text-white">{new Date(selectedOrder.deliveredAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#2A3D5A]">
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                    <>
                      <select
                        onChange={(e) => {
                          updateStatus(selectedOrder._id, e.target.value);
                          setShowModal(false);
                        }}
                        className="flex-1 p-2 bg-[#0A1628] text-white rounded-lg border border-[#2A3D5A] focus:border-[#00D4FF] outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => {
                          updateStatus(selectedOrder._id, 'cancelled');
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-[#2A3D5A] text-white rounded-lg hover:bg-[#3A4D6A] transition-all"
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