import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaImage,
  FaTag,
  FaCalendar,
  FaClock,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaSave
} from 'react-icons/fa';
import API_URL from '../../api/config';

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    scheduled: 0,
    totalViews: 0
  });
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    tags: [],
    featuredImage: '',
    author: 'NetLabs+ Team',
    status: 'draft',
    scheduledFor: ''
  });
  const [tagInput, setTagInput] = useState('');

  const categories = ['Networking', 'Security', 'Technology', 'Tutorial', 'News', 'Case Study'];
  const statuses = ['draft', 'published', 'scheduled'];

  // Sample blogs for demo
  const sampleBlogs = [
    {
      _id: '1',
      title: 'Understanding VLAN Segmentation',
      slug: 'understanding-vlan-segmentation',
      excerpt: 'Learn how VLAN segmentation can improve network security and performance',
      content: 'Detailed article about VLAN segmentation...',
      category: 'Networking',
      tags: ['VLAN', 'Network Security', 'Segmentation'],
      author: 'NetLabs+ Team',
      views: 45,
      status: 'published',
      publishedAt: '2026-08-28T10:00:00Z',
      createdAt: '2026-08-28T08:00:00Z'
    },
    {
      _id: '2',
      title: 'Cisco vs Huawei: Which is Better?',
      slug: 'cisco-vs-huawei',
      excerpt: 'A comprehensive comparison of Cisco and Huawei networking solutions',
      content: 'Detailed comparison article...',
      category: 'Technology',
      tags: ['Cisco', 'Huawei', 'Comparison'],
      author: 'NetLabs+ Team',
      views: 32,
      status: 'published',
      publishedAt: '2026-08-25T14:30:00Z',
      createdAt: '2026-08-25T12:00:00Z'
    },
    {
      _id: '3',
      title: 'Network Security Best Practices 2026',
      slug: 'network-security-best-practices-2026',
      excerpt: 'Top network security practices for modern enterprises',
      content: 'Security best practices article...',
      category: 'Security',
      tags: ['Security', 'Best Practices', 'Enterprise'],
      author: 'NetLabs+ Team',
      views: 18,
      status: 'draft',
      createdAt: '2026-08-30T09:00:00Z'
    }
  ];

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setBlogs(sampleBlogs);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setTimeout(() => {
        setStats({
          total: sampleBlogs.length,
          published: sampleBlogs.filter(b => b.status === 'published').length,
          drafts: sampleBlogs.filter(b => b.status === 'draft').length,
          scheduled: sampleBlogs.filter(b => b.status === 'scheduled').length,
          totalViews: sampleBlogs.reduce((sum, b) => sum + b.views, 0)
        });
      }, 300);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddBlog = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Technology',
      tags: [],
      featuredImage: '',
      author: 'NetLabs+ Team',
      status: 'draft',
      scheduledFor: ''
    });
    setTagInput('');
    setShowModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags || [],
      featuredImage: blog.featuredImage || '',
      author: blog.author,
      status: blog.status,
      scheduledFor: blog.scheduledFor ? blog.scheduledFor.split('T')[0] : ''
    });
    setTagInput('');
    setShowModal(true);
  };

  const handleDeleteBlog = (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setBlogs(blogs.filter(b => b._id !== id));
    showNotification(`"${title}" deleted successfully!`, 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const blogData = {
      ...formData,
      _id: editingBlog?._id || 'blog_' + Date.now(),
      createdAt: editingBlog?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingBlog) {
      setBlogs(blogs.map(b => b._id === editingBlog._id ? blogData : b));
      showNotification(`"${blogData.title}" updated successfully!`, 'success');
    } else {
      setBlogs([blogData, ...blogs]);
      showNotification(`"${blogData.title}" created successfully!`, 'success');
    }

    setShowModal(false);
    setEditingBlog(null);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tagToRemove)
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
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
        <p className="text-[#B0C4DE]">Loading blog posts...</p>
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
              className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
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
                  <label className="text-white block mb-2 text-sm font-medium">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Excerpt *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows="2"
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Brief summary of the blog post"
                    required
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows="6"
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Write your blog content here..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.status === 'scheduled' && (
                  <div>
                    <label className="text-white block mb-2 text-sm font-medium">Schedule Date</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledFor}
                      onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                      className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1 p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-[#00D4FF] text-[#0A1628] rounded-lg hover:bg-[#00B4D8] transition-all font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 bg-[#0A1628] text-[#00D4FF] px-3 py-1 rounded-full text-sm border border-[#00D4FF]/20"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-[#B0C4DE] hover:text-red-400 transition-colors ml-1"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Featured Image URL</label>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter image URL (optional)"
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Author name"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-[#2A3D5A]">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    {editingBlog ? 'Update Blog' : 'Create Blog'}
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
            Blog Management
          </motion.h1>
          <motion.p 
            className="text-[#B0C4DE]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Create and manage blog posts ({filteredBlogs.length} posts)
          </motion.p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddBlog}
          className="px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:shadow-lg shadow-[#00D4FF]/20 transition-all flex items-center gap-2"
        >
          <FaPlus />
          New Post
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
      >
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#00D4FF]">{stats.total}</p>
          <p className="text-xs text-[#B0C4DE]">Total Posts</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-green-400">{stats.published}</p>
          <p className="text-xs text-[#B0C4DE]">Published</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.drafts}</p>
          <p className="text-xs text-[#B0C4DE]">Drafts</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.scheduled}</p>
          <p className="text-xs text-[#B0C4DE]">Scheduled</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#00D4FF]">{stats.totalViews}</p>
          <p className="text-xs text-[#B0C4DE]">Total Views</p>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'published', 'draft', 'scheduled'].map((status) => (
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
      </motion.div>

      {/* Blog Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3D5A]">
              <AnimatePresence>
                {filteredBlogs.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="5" className="px-6 py-12 text-center text-[#B0C4DE]">
                      <FaImage className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No blog posts found</p>
                      <p className="text-sm opacity-50 mt-1">Try adjusting your search or filters</p>
                    </td>
                  </motion.tr>
                ) : (
                  filteredBlogs.map((blog, index) => (
                    <motion.tr
                      key={blog._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="hover:bg-[#2A3D5A]/50 transition-colors group"
                      whileHover={{ backgroundColor: 'rgba(42, 61, 90, 0.3)' }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{blog.title}</div>
                          <div className="text-[#B0C4DE] text-sm line-clamp-1">{blog.excerpt}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#0A1628] text-[#00D4FF] text-xs rounded-full border border-[#00D4FF]/20">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#B0C4DE] text-sm">
                        {blog.views} views
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-500/10"
                            title="Edit blog"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog._id, blog.title)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                            title="Delete blog"
                          >
                            <FaTrash />
                          </button>
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
          <span>Showing {filteredBlogs.length} of {blogs.length} posts</span>
          <span>Total: {blogs.length}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}