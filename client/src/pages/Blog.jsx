import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaTag, FaEye, FaArrowRight } from 'react-icons/fa';
import API_URL from '../api/config';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Networking', 'Security', 'Technology', 'Tutorial', 'News'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Sample blogs for demo
      setBlogs([
        {
          _id: '1',
          title: 'Understanding VLAN Segmentation',
          slug: 'understanding-vlan-segmentation',
          excerpt: 'Learn how VLAN segmentation can improve network security and performance',
          category: 'Networking',
          tags: ['VLAN', 'Network Security', 'Segmentation'],
          author: 'NetLabs+ Team',
          views: 45,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Cisco vs Huawei: Which is Better?',
          slug: 'cisco-vs-huawei',
          excerpt: 'A comprehensive comparison of Cisco and Huawei networking solutions',
          category: 'Technology',
          tags: ['Cisco', 'Huawei', 'Comparison'],
          author: 'NetLabs+ Team',
          views: 32,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase">Blog</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Articles</span>
          </h1>
          <p className="text-[#B0C4DE] max-w-2xl mx-auto mt-4">
            Stay updated with the latest in networking, security, and technology.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white'
                    : 'bg-[#1A2D4A] text-[#B0C4DE] hover:border-[#00D4FF] border border-[#2A3D5A]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12 text-[#B0C4DE]">
            <p className="text-2xl">📝 No articles found</p>
            <p className="mt-2">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-1 rounded-full">
                      {blog.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#B0C4DE]">
                      <FaEye className="text-[10px]" />
                      {blog.views}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#00D4FF] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-[#B0C4DE] text-sm mt-2 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {blog.tags && blog.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs bg-[#0A1628] text-[#B0C4DE] px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2A3D5A]">
                    <div className="flex items-center gap-2 text-xs text-[#B0C4DE]">
                      <FaUser className="text-[#00D4FF]" />
                      <span>{blog.author}</span>
                      <span className="w-1 h-1 bg-[#2A3D5A] rounded-full"></span>
                      <FaCalendar className="text-[#00D4FF]" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="text-[#00D4FF] hover:text-[#00D4FF]/80 transition-all text-sm flex items-center gap-1 group-hover:gap-2"
                    >
                      Read <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}