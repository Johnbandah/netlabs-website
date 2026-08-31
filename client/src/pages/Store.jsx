import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaFileAlt, 
  FaVideo, 
  FaQuestionCircle, 
  FaShoppingCart, 
  FaDownload,
  FaPlus,
  FaMinus,
  FaUserPlus,
  FaLock,
  FaCheck
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API_URL from '../api/config';

const iconMap = {
  'Labs': <FaBook />,
  'Documentation': <FaFileAlt />,
  'Tutorials': <FaVideo />,
  'Guides': <FaQuestionCircle />
};

export default function Store() {
  const { user } = useAuth();
  const { addToCart, cartItems, getItemCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState(null);

  const categories = ['All', 'Labs', 'Documentation', 'Tutorials', 'Guides'];

  // Sample products with MWK prices
  const sampleProducts = [
    { _id: '1', title: 'Packet Tracer Labs Bundle', category: 'Labs', description: 'Complete collection of Packet Tracer labs for students and professionals.', price: 50983, features: ['Beginner to Advanced', 'Network Design', 'Configuration Labs'] },
    { _id: '2', title: 'Networking Documentation Suite', category: 'Documentation', description: 'Professional documentation templates and guides for network audits.', price: 33983, features: ['Audit Templates', 'Compliance Guides', 'Project Documentation'] },
    { _id: '3', title: 'Network Security Tutorials', category: 'Tutorials', description: 'Video tutorials covering network security fundamentals and configuration.', price: 42483, features: ['Security Fundamentals', 'AAA Configuration', 'Firewall Rules'] },
    { _id: '4', title: 'Troubleshooting Guides', category: 'Guides', description: 'Step-by-step guides for troubleshooting common network issues.', price: 25483, features: ['VLAN Troubleshooting', 'Routing Issues', 'Security Problems'] },
    { _id: '5', title: 'Enterprise Network Design', category: 'Labs', description: 'Advanced labs for enterprise network design and implementation.', price: 59483, features: ['Enterprise Design', 'VLAN Segmentation', 'Routing'] },
    { _id: '6', title: 'Network Security Documentation', category: 'Documentation', description: 'Comprehensive security documentation including policies and procedures.', price: 42483, features: ['Security Policies', 'Procedures', 'Audit Checklists'] },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setNotification(`"${product.title}" added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-green-500/90 text-white rounded-lg shadow-lg flex items-center gap-3"
        >
          <FaCheck />
          {notification}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase">Shop</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Networking <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Resources</span>
          </h1>
          <p className="text-[#B0C4DE] max-w-2xl mx-auto mt-4 text-lg">
            Downloadable labs, documentation, tutorials, and guides for networking professionals.
          </p>
        </motion.div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A2D4A] p-4 rounded-xl border border-[#00D4FF] mb-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-[#00D4FF] text-2xl" />
              <span className="text-white">{getItemCount()} item(s) in cart</span>
              <span className="text-[#00D4FF] font-bold">{formatCurrency(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
            </div>
            <Link
              to="/checkout"
              className="px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all"
            >
              Checkout
            </Link>
          </motion.div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white shadow-lg'
                  : 'bg-[#1A2D4A] text-[#B0C4DE] hover:border-[#00D4FF] border border-[#2A3D5A]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all duration-300 flex flex-col"
              >
                <div className="text-4xl text-[#00D4FF] mb-4">
                  {iconMap[product.category] || <FaBook />}
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">{product.title}</h3>
                  <span className="text-sm bg-[#0A1628] text-[#00D4FF] px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <p className="text-[#B0C4DE] text-sm mb-3 flex-grow">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features && product.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-xs bg-[#0A1628] text-[#B0C4DE] px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                  {product.features && product.features.length > 3 && (
                    <span className="text-xs text-[#B0C4DE]">+{product.features.length - 3} more</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2A3D5A]">
                  <div>
                    <span className="text-2xl font-bold text-[#00D4FF]">{formatCurrency(product.price)}</span>
                    <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                      <FaLock className="text-[10px]" />
                      Secure Download
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Login Banner */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              <FaUserPlus className="inline mr-2 text-[#00D4FF]" />
              Create Account to Purchase
            </h3>
            <p className="text-[#B0C4DE] mb-4">
              Sign up for free to access downloadable resources and manage your purchases.
            </p>
            <Link
              to="/register"
              className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block"
            >
              Sign Up Now
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}