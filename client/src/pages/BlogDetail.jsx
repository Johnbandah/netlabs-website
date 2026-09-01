import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaTag, FaEye, FaArrowLeft } from 'react-icons/fa';
import API_URL from '../api/config';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog/${slug}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      // Sample blog for demo
      setBlog({
        title: 'Understanding VLAN Segmentation',
        slug: 'understanding-vlan-segmentation',
        excerpt: 'Learn how VLAN segmentation can improve network security and performance',
        content: 'This is a detailed article about VLAN segmentation...',
        category: 'Networking',
        tags: ['VLAN', 'Network Security', 'Segmentation'],
        author: 'NetLabs+ Team',
        views: 45,
        createdAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] text-center">
          <p className="text-2xl text-[#B0C4DE]">📝 Article not found</p>
          <Link to="/blog" className="text-[#00D4FF] hover:underline mt-4 inline-block">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/blog" className="text-[#00D4FF] hover:text-[#00D4FF]/80 transition-all flex items-center gap-2 mb-6">
          <FaArrowLeft /> Back to Blog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] p-8"
        >
          {/* Category and Views */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm bg-[#00D4FF]/20 text-[#00D4FF] px-3 py-1 rounded-full">
              {blog.category}
            </span>
            <span className="text-sm text-[#B0C4DE] flex items-center gap-1">
              <FaEye className="text-[#00D4FF]" /> {blog.views} views
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{blog.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#B0C4DE] pb-6 border-b border-[#2A3D5A] mb-6">
            <span className="flex items-center gap-2">
              <FaUser className="text-[#00D4FF]" /> {blog.author}
            </span>
            <span className="flex items-center gap-2">
              <FaCalendar className="text-[#00D4FF]" /> {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <div className="flex gap-2">
              {blog.tags && blog.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-[#0A1628] text-[#B0C4DE] px-2 py-1 rounded-full flex items-center gap-1">
                  <FaTag className="text-[10px]" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-[#B0C4DE] text-lg leading-relaxed">{blog.content}</p>
            <p className="text-[#B0C4DE] text-lg leading-relaxed mt-4">
              This is a placeholder for the full article content. In production, this would be the complete blog post with rich text formatting.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}