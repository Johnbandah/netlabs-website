import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaDownload, 
  FaFileAlt, 
  FaVideo, 
  FaBook, 
  FaCheckCircle,
  FaClock,
  FaLock,
  FaSpinner,
  FaFile,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API_URL from '../api/config';

export default function MyDownloads() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Fetch available downloads
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/downloads/available`);
      const data = await response.json();

      if (data.success) {
        setDownloads(data.data || []);
        setFiltered(data.data || []);
      } else {
        showMessage('error', data.message || 'Failed to load downloads');
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
      showMessage('error', 'Failed to load downloads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  // Filter by search + category
  useEffect(() => {
    let result = downloads;

    if (selectedCategory !== 'All') {
      result = result.filter(d => d.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(result);
  }, [searchTerm, selectedCategory, downloads]);

  // Download handler
  const handleDownload = async (id, fileName, title) => {
    setDownloading(id);
    try {
      const url = `${API_URL}/api/downloads/file/${id}`;
      console.log('📥 Downloading from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        let errorMsg = 'Download failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      // Read as blob (works for any file type — zip, pdf, png, etc.)
      const blob = await response.blob();

      // Try to get filename from headers
      let finalName = fileName || 'download';
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) finalName = match[1];
      }

      // Trigger download
      const objUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objUrl;
      link.download = finalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objUrl);

      showMessage('success', `✅ "${title}" downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      showMessage('error', `❌ ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const getIcon = (category) => {
    switch(category) {
      case 'Labs': return <FaBook className="text-[#00D4FF]" />;
      case 'Documentation': return <FaFileAlt className="text-[#0066FF]" />;
      case 'Tutorials': return <FaVideo className="text-[#4A9BC7]" />;
      default: return <FaFile className="text-[#B0C4DE]" />;
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // If not logged in
  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] shadow-xl max-w-md w-full text-center"
        >
          <FaLock className="text-5xl text-[#00D4FF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-[#B0C4DE] mb-6">Please login to view your downloads.</p>
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block"
          >
            Login Now
          </Link>
        </motion.div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="text-4xl text-[#00D4FF] animate-spin" />
          <p className="text-[#B0C4DE]">Loading your downloads...</p>
        </div>
      </div>
    );
  }

  const categories = ['All', ...new Set(downloads.map(d => d.category).filter(Boolean))];

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Downloads</span>
          </h1>
          <p className="text-[#B0C4DE]">Access all available resources</p>
        </motion.div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}
          >
            <span>{message.text}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-[#00D4FF]">{downloads.length}</p>
            <p className="text-xs text-[#B0C4DE]">Available Files</p>
          </div>
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-green-400">
              {downloads.filter(d => d.price === 0).length}
            </p>
            <p className="text-xs text-[#B0C4DE]">Free Downloads</p>
          </div>
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-[#00D4FF]">{categories.length - 1}</p>
            <p className="text-xs text-[#B0C4DE]">Categories</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-[#1A2D4A] rounded-xl p-4 border border-[#2A3D5A] mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6A8A]" />
              <input
                type="text"
                placeholder="Search downloads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0A1628] text-white rounded-lg pl-10 pr-4 py-2.5 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#B0C4DE]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#0A1628] text-white rounded-lg px-4 py-2.5 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A2D4A] p-12 rounded-2xl border border-[#2A3D5A] text-center"
          >
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {downloads.length === 0 ? 'No Downloads Yet' : 'No Results Found'}
            </h3>
            <p className="text-[#B0C4DE] mb-6">
              {downloads.length === 0
                ? 'Check back later — the admin will upload files soon.'
                : 'Try a different search term or category.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((download, index) => (
              <motion.div
                key={download._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1A2D4A] p-6 rounded-2xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl p-3 bg-[#0A1628] rounded-xl">
                    {getIcon(download.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{download.title}</h3>
                    {download.description && (
                      <p className="text-[#B0C4DE] text-sm mt-1 line-clamp-2">{download.description}</p>
                    )}
                    <p className="text-[#B0C4DE] text-xs mt-1">{download.category}</p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {download.price === 0 ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaCheckCircle className="text-[10px]" />
                          Free
                        </span>
                      ) : (
                        <span className="text-xs bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-0.5 rounded-full">
                          ${download.price}
                        </span>
                      )}
                      <span className="text-xs text-[#B0C4DE] flex items-center gap-1">
                        <FaClock className="text-[10px]" />
                        {formatSize(download.fileSize)}
                      </span>
                      <span className="text-xs text-[#B0C4DE]">
                        {download.downloadCount || 0} downloads
                      </span>
                    </div>

                    <button
                      onClick={() => handleDownload(download._id, download.fileName, download.title)}
                      disabled={downloading === download._id}
                      className={`mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white text-sm font-semibold rounded-lg transition-all ${
                        downloading === download._id
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-105'
                      }`}
                    >
                      {downloading === download._id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FaDownload />
                          Download Now
                        </>
                      )}
                    </button>
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