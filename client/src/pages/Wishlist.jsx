import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaTrash, 
  FaSpinner,
  FaBook,
  FaFileAlt,
  FaVideo,
  FaQuestionCircle,
  FaTimes
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

export default function Wishlist() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Sample wishlist items for demo
  const sampleWishlist = [
    {
      _id: '1',
      productId: 'prod_001',
      addedAt: '2026-08-30T10:00:00Z'
    },
    {
      _id: '2',
      productId: 'prod_003',
      addedAt: '2026-08-28T14:30:00Z'
    }
  ];

  // Sample products with USD prices (converted from MWK)
  // MWK 50,983 → $29.99
  // MWK 33,983 → $19.99
  // MWK 42,483 → $24.99
  // MWK 25,483 → $14.99
  const sampleProducts = [
    { _id: 'prod_001', title: 'Packet Tracer Labs Bundle', category: 'Labs', description: 'Complete collection of Packet Tracer labs for students and professionals.', price: 29.99, features: ['Beginner to Advanced', 'Network Design', 'Configuration Labs'] },
    { _id: 'prod_002', title: 'Networking Documentation Suite', category: 'Documentation', description: 'Professional documentation templates and guides for network audits.', price: 19.99, features: ['Audit Templates', 'Compliance Guides', 'Project Documentation'] },
    { _id: 'prod_003', title: 'Network Security Tutorials', category: 'Tutorials', description: 'Video tutorials covering network security fundamentals and configuration.', price: 24.99, features: ['Security Fundamentals', 'AAA Configuration', 'Firewall Rules'] },
    { _id: 'prod_004', title: 'Troubleshooting Guides', category: 'Guides', description: 'Step-by-step guides for troubleshooting common network issues.', price: 14.99, features: ['VLAN Troubleshooting', 'Routing Issues', 'Security Problems'] },
  ];

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const items = sampleWishlist.map(item => {
          const product = sampleProducts.find(p => p._id === item.productId);
          return {
            ...item,
            product: product || null
          };
        }).filter(item => item.product !== null);
        
        setWishlistItems(items);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromWishlist = (productId, title) => {
    setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
    showNotification(`"${title}" removed from wishlist`, 'success');
  };

  const addToCartHandler = (product) => {
    addToCart(product, 1);
    showNotification(`"${product.title}" added to cart!`, 'success');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] text-center">
          <p className="text-[#B0C4DE] text-lg mb-4">🔒 Please login to view your wishlist</p>
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
          <p className="text-[#B0C4DE]">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

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
          {notification.type === 'success' ? '✅' : '❌'} {notification.message}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Wishlist</span>
            </h1>
            <p className="text-[#B0C4DE]">Save your favorite products for later</p>
          </div>
          <Link
            to="/store"
            className="px-4 py-2 bg-[#1A2D4A] text-[#00D4FF] rounded-lg border border-[#00D4FF]/30 hover:bg-[#2A3D5A] transition-all"
          >
            Browse Store →
          </Link>
        </motion.div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="bg-[#1A2D4A] p-12 rounded-2xl border border-[#2A3D5A] text-center">
            <FaHeart className="text-6xl text-[#B0C4DE]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h3>
            <p className="text-[#B0C4DE] mb-6">Start adding products you love to your wishlist!</p>
            <Link
              to="/store"
              className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all p-6 relative group"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.productId, item.product.title)}
                  className="absolute top-3 right-3 text-[#B0C4DE] hover:text-red-400 transition-all"
                >
                  <FaTimes />
                </button>

                {/* Product Icon */}
                <div className="text-4xl text-[#00D4FF] mb-4">
                  {iconMap[item.product.category] || <FaBook />}
                </div>

                {/* Product Info */}
                <h3 className="text-xl font-semibold text-white mb-1">{item.product.title}</h3>
                <p className="text-[#B0C4DE] text-sm mb-2">{item.product.category}</p>
                <p className="text-[#B0C4DE] text-sm mb-3 line-clamp-2">{item.product.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.product.features && item.product.features.slice(0, 2).map((feature, i) => (
                    <span key={i} className="text-xs bg-[#0A1628] text-[#B0C4DE] px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                  {item.product.features && item.product.features.length > 2 && (
                    <span className="text-xs text-[#B0C4DE]">+{item.product.features.length - 2} more</span>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2A3D5A]">
                  <span className="text-2xl font-bold text-[#00D4FF]">{formatCurrency(item.product.price)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCartHandler(item.product)}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white rounded-lg hover:scale-105 transition-all text-sm"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId, item.product.title)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Wishlist Stats */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FaHeart className="text-[#00D4FF] text-xl" />
              <span className="text-white">{wishlistItems.length} items in your wishlist</span>
            </div>
            <button
              onClick={() => {
                setWishlistItems([]);
                showNotification('Wishlist cleared', 'success');
              }}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
            >
              Clear All
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}