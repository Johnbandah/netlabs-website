import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaDownload, 
  FaFilePdf, 
  FaFileAlt, 
  FaVideo, 
  FaBook, 
  FaCheckCircle,
  FaClock,
  FaLock,
  FaSpinner,
  FaFileArchive,
  FaFile
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API_URL from '../api/config';

export default function MyDownloads() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [stats, setStats] = useState({
    totalDownloads: 0,
    totalPurchases: 0,
    totalOrders: 0
  });

  useEffect(() => {
    if (user) {
      fetchPurchases();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${API_URL}/api/downloads/user/${user.id}`);
      const data = await response.json();
      if (data.success) {
        if (data.data.length === 0) {
          // Sample purchases for demo if no real data
          setPurchases([
            {
              productId: '1',
              title: 'Packet Tracer Labs Bundle',
              category: 'Labs',
              purchaseDate: new Date().toISOString(),
              amount: 29.99,
              downloadUrl: '/api/downloads/file/1',
              fileName: 'Packet-Tracer-Labs.zip'
            },
            {
              productId: '2',
              title: 'Networking Documentation Suite',
              category: 'Documentation',
              purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              amount: 19.99,
              downloadUrl: '/api/downloads/file/2',
              fileName: 'Networking-Documentation.zip'
            }
          ]);
        } else {
          setPurchases(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      // Sample purchases for demo
      setPurchases([
        {
          productId: '1',
          title: 'Packet Tracer Labs Bundle',
          category: 'Labs',
          purchaseDate: new Date().toISOString(),
          amount: 29.99,
          downloadUrl: '/api/downloads/file/1',
          fileName: 'Packet-Tracer-Labs.zip'
        },
        {
          productId: '2',
          title: 'Networking Documentation Suite',
          category: 'Documentation',
          purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 19.99,
          downloadUrl: '/api/downloads/file/2',
          fileName: 'Networking-Documentation.zip'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/downloads/stats/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDownload = async (productId, title) => {
    setDownloading(productId);
    try {
      const url = `${API_URL}/api/downloads/file/${productId}?userId=${user.id}`;
      console.log('📥 Downloading from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Download failed');
      }
      
      // Get filename from headers
      const contentDisposition = response.headers.get('content-disposition');
      let fileName = `${title}.txt`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) fileName = match[1];
      }
      
      // Get the file content as text
      const text = await response.text();
      
      // Create blob and download
      const blob = new Blob([text], { type: 'text/plain' });
      const url_obj = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url_obj;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url_obj);
      
      alert(`✅ "${title}" downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      alert(`❌ Download failed: ${error.message}`);
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
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] shadow-xl max-w-md w-full text-center"
        >
          <FaLock className="text-5xl text-[#00D4FF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-[#B0C4DE] mb-6">Please login to view your downloads and purchased resources.</p>
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

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="text-4xl text-[#00D4FF] animate-spin" />
          <p className="text-[#B0C4DE]">Loading your purchases...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-[#B0C4DE]">Access all your purchased resources</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-[#00D4FF]">{purchases.length}</p>
            <p className="text-xs text-[#B0C4DE]">Purchases</p>
          </div>
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-green-400">{stats.totalDownloads}</p>
            <p className="text-xs text-[#B0C4DE]">Downloads</p>
          </div>
          <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
            <p className="text-2xl font-bold text-[#00D4FF]">{stats.totalOrders}</p>
            <p className="text-xs text-[#B0C4DE]">Orders</p>
          </div>
        </div>

        {purchases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A2D4A] p-12 rounded-2xl border border-[#2A3D5A] text-center"
          >
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Downloads Yet</h3>
            <p className="text-[#B0C4DE] mb-6">You haven't purchased any resources yet.</p>
            <Link
              to="/store"
              className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block"
            >
              Browse Store →
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purchases.map((purchase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A2D4A] p-6 rounded-2xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl p-3 bg-[#0A1628] rounded-xl">
                    {getIcon(purchase.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{purchase.title}</h3>
                    <p className="text-[#B0C4DE] text-sm">{purchase.category}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FaCheckCircle className="text-[10px]" />
                        Purchased
                      </span>
                      <span className="text-xs text-[#B0C4DE] flex items-center gap-1">
                        <FaClock className="text-[10px]" />
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-[#00D4FF] font-semibold">
                        {formatCurrency(purchase.amount)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(purchase.productId, purchase.title)}
                      disabled={downloading === purchase.productId}
                      className={`mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white text-sm font-semibold rounded-lg transition-all ${
                        downloading === purchase.productId 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:scale-105'
                      }`}
                    >
                      {downloading === purchase.productId ? (
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