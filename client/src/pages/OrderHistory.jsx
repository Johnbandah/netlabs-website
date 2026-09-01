import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaEye, 
  FaTimes, 
  FaSpinner,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaBox,
  FaFileInvoice
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API_URL from '../api/config';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sample orders with USD prices (converted from MWK)
  // MWK 135,949 → $79.97
  // MWK 33,983 → $19.99
  // MWK 76,449 → $44.97
  const sampleOrders = [
    {
      _id: 'ord_001',
      products: [
        { title: 'Packet Tracer Labs Bundle', price: 29.99, quantity: 1, category: 'Labs' },
        { title: 'Network Security Tutorials', price: 24.99, quantity: 2, category: 'Tutorials' }
      ],
      totalAmount: 79.97,
      status: 'delivered',
      paymentMethod: 'stripe',
      createdAt: '2026-08-28T14:30:00Z',
      deliveredAt: '2026-08-29T10:00:00Z'
    },
    {
      _id: 'ord_002',
      products: [
        { title: 'Networking Documentation Suite', price: 19.99, quantity: 1, category: 'Documentation' }
      ],
      totalAmount: 19.99,
      status: 'processing',
      paymentMethod: 'mobile_money',
      createdAt: '2026-08-30T09:15:00Z',
      deliveredAt: null
    },
    {
      _id: 'ord_003',
      products: [
        { title: 'Troubleshooting Guides', price: 14.99, quantity: 3, category: 'Guides' }
      ],
      totalAmount: 44.97,
      status: 'pending',
      paymentMethod: 'stripe',
      createdAt: '2026-09-01T11:00:00Z',
      deliveredAt: null
    }
  ];

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setOrders(sampleOrders);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-400" />;
      case 'processing': return <FaSpinner className="text-blue-400 animate-spin" />;
      case 'shipped': return <FaTruck className="text-purple-400" />;
      case 'delivered': return <FaCheckCircle className="text-green-400" />;
      case 'cancelled': return <FaTimes className="text-red-400" />;
      case 'completed': return <FaCheckCircle className="text-emerald-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] text-center">
          <p className="text-[#B0C4DE] text-lg mb-4">🔒 Please login to view your order history</p>
          <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="text-4xl text-[#00D4FF] animate-spin" />
          <p className="text-[#B0C4DE]">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#B0C4DE] hover:text-white transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#B0C4DE] text-sm">Order ID</p>
                  <p className="text-white font-medium">{selectedOrder._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#B0C4DE] text-sm">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)} {getStatusBadge(selectedOrder.status)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#B0C4DE] text-sm">Date</p>
                  <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[#B0C4DE] text-sm">Total</p>
                  <p className="text-[#00D4FF] font-bold text-xl">{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              <div className="border-t border-[#2A3D5A] pt-4">
                <p className="text-white font-semibold mb-3">Items</p>
                <div className="space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center bg-[#0A1628] p-3 rounded-lg">
                      <div>
                        <p className="text-white">{product.title}</p>
                        <p className="text-[#B0C4DE] text-sm">x{product.quantity}</p>
                      </div>
                      <p className="text-[#00D4FF] font-semibold">{formatCurrency(product.price * product.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#2A3D5A] pt-4">
                <div className="flex justify-between">
                  <p className="text-[#B0C4DE]">Payment Method</p>
                  <p className="text-white capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-[#B0C4DE]">Delivery</p>
                  <p className="text-white">{selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleDateString() : 'Not delivered yet'}</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-[#2A3D5A] text-white rounded-lg hover:bg-[#3A4D6A] transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">History</span>
          </h1>
          <p className="text-[#B0C4DE]">View all your purchases and track orders</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-[#00D4FF]">{orders.length}</p>
            <p className="text-xs text-[#B0C4DE]">Total Orders</p>
          </div>
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-green-400">
              {orders.filter(o => o.status === 'delivered' || o.status === 'completed').length}
            </p>
            <p className="text-xs text-[#B0C4DE]">Completed</p>
          </div>
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
            </p>
            <p className="text-xs text-[#B0C4DE]">Active</p>
          </div>
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-[#00D4FF]">
              {formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
            </p>
            <p className="text-xs text-[#B0C4DE]">Total Spent</p>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-[#1A2D4A] p-12 rounded-2xl border border-[#2A3D5A] text-center">
            <FaShoppingBag className="text-6xl text-[#B0C4DE]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Orders Yet</h3>
            <p className="text-[#B0C4DE] mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/store"
              className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <div className="flex items-center gap-3">
                      <FaFileInvoice className="text-[#00D4FF] text-xl" />
                      <div>
                        <p className="text-white font-medium">{order._id}</p>
                        <p className="text-[#B0C4DE] text-sm flex items-center gap-1">
                          <FaCalendarAlt className="text-[10px]" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <p className="text-[#B0C4DE] text-sm">Items</p>
                    <p className="text-white">{order.products.reduce((sum, p) => sum + p.quantity, 0)} products</p>
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <p className="text-[#B0C4DE] text-sm">Total</p>
                    <p className="text-[#00D4FF] font-bold">{formatCurrency(order.totalAmount)}</p>
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(order.status)} flex items-center gap-1 inline-flex`}>
                      {getStatusIcon(order.status)} {getStatusBadge(order.status)}
                    </span>
                  </div>

                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="px-4 py-2 bg-[#0A1628] text-[#00D4FF] rounded-lg hover:bg-[#2A3D5A] transition-all flex items-center gap-2"
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}