import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSpinner,
  FaBoxOpen,
  FaTimes,
  FaCheck,
  FaSave,
  FaTimesCircle
} from 'react-icons/fa';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Labs',
    description: '',
    price: '',
    features: []
  });
  const [featureInput, setFeatureInput] = useState('');

  const categories = ['All', 'Labs', 'Documentation', 'Tutorials', 'Guides'];

  // Sample products with USD prices
  const sampleProducts = [
    { _id: '1', title: 'Packet Tracer Labs Bundle', category: 'Labs', description: 'Complete collection of Packet Tracer labs for students', price: 29.99, features: ['Beginner to Advanced', 'Network Design', 'Configuration Labs'] },
    { _id: '2', title: 'Networking Documentation Suite', category: 'Documentation', description: 'Professional documentation templates', price: 19.99, features: ['Audit Templates', 'Compliance Guides'] },
    { _id: '3', title: 'Network Security Tutorials', category: 'Tutorials', description: 'Video tutorials covering network security', price: 24.99, features: ['Security Fundamentals', 'AAA Configuration'] },
    { _id: '4', title: 'Troubleshooting Guides', category: 'Guides', description: 'Step-by-step troubleshooting guides', price: 14.99, features: ['VLAN Troubleshooting', 'Routing Issues'] },
    { _id: '5', title: 'Enterprise Network Design', category: 'Labs', description: 'Advanced labs for enterprise design', price: 34.99, features: ['Enterprise Design', 'VLAN Segmentation'] },
    { _id: '6', title: 'Network Security Documentation', category: 'Documentation', description: 'Comprehensive security documentation', price: 24.99, features: ['Security Policies', 'Audit Checklists'] },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setProducts(sampleProducts);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      category: 'Labs',
      description: '',
      price: '',
      features: []
    });
    setFeatureInput('');
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      features: product.features || []
    });
    setFeatureInput('');
    setShowModal(true);
  };

  const handleDeleteProduct = (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setProducts(products.filter(p => p._id !== id));
    showNotification(`"${title}" deleted successfully!`, 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      _id: editingProduct?._id || 'prod_' + Date.now()
    };

    if (editingProduct) {
      setProducts(products.map(p => p._id === editingProduct._id ? productData : p));
      showNotification(`"${productData.title}" updated successfully!`, 'success');
    } else {
      setProducts([...products, productData]);
      showNotification(`"${productData.title}" added successfully!`, 'success');
    }

    setShowModal(false);
    setEditingProduct(null);
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (featureToRemove) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== featureToRemove)
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
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
        <p className="text-[#B0C4DE]">Loading products...</p>
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
            {notification.type === 'success' ? <FaCheck /> : <FaTimesCircle />}
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
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#B0C4DE] hover:text-white transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Product Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Price (USD) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter price in USD"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Features</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      className="flex-1 p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                      placeholder="Add a feature"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-[#00D4FF] text-[#0A1628] rounded-lg hover:bg-[#00B4D8] transition-all font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 bg-[#0A1628] text-[#00D4FF] px-3 py-1 rounded-full text-sm border border-[#00D4FF]/20"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-[#B0C4DE] hover:text-red-400 transition-colors ml-1"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-[#2A3D5A]">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    {editingProduct ? 'Update Product' : 'Add Product'}
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
            Products
          </motion.h1>
          <motion.p 
            className="text-[#B0C4DE]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Manage your product inventory ({filteredProducts.length} products)
          </motion.p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddProduct}
          className="px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:shadow-lg shadow-[#00D4FF]/20 transition-all flex items-center gap-2"
        >
          <FaPlus />
          Add Product
        </motion.button>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                filterCategory === category
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white'
                  : 'bg-[#1A2D4A] text-[#B0C4DE] hover:bg-[#2A3D5A]'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A1628] border-b border-[#2A3D5A]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Price (USD)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3D5A]">
              <AnimatePresence>
                {filteredProducts.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="4" className="px-6 py-12 text-center text-[#B0C4DE]">
                      <FaBoxOpen className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No products found</p>
                      <p className="text-sm opacity-50 mt-1">Try adjusting your search or filters</p>
                    </td>
                  </motion.tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="hover:bg-[#2A3D5A]/50 transition-colors group"
                      whileHover={{ backgroundColor: 'rgba(42, 61, 90, 0.3)' }}
                    >
                      <td className="px-6 py-4">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="text-white font-medium">{product.title}</div>
                          <div className="text-[#B0C4DE] text-sm line-clamp-1">{product.description}</div>
                        </motion.div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.span 
                          className="px-2 py-1 bg-[#0A1628] text-[#00D4FF] text-xs rounded-full border border-[#00D4FF]/20"
                          whileHover={{ scale: 1.1 }}
                        >
                          {product.category}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {formatCurrency(product.price)}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-500/10"
                            title="Edit product"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteProduct(product._id, product.title)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                            title="Delete product"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-3 bg-[#0A1628]/50 border-t border-[#2A3D5A] flex justify-between text-sm text-[#B0C4DE]"
        >
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span>Total: {products.length}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}