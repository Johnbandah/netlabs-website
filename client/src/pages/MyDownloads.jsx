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
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function MyDownloads() {
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user || null;
  } catch (error) {
    console.warn('Auth not available in MyDownloads');
  }

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      // Sample purchases with USD prices (converted from MWK)
      // MWK 50,983 → $29.99
      // MWK 33,983 → $19.99
      const samplePurchases = [
        {
          productId: '1',
          title: 'Packet Tracer Labs Bundle',
          category: 'Labs',
          purchaseDate: new Date().toISOString(),
          amount: 29.99
        },
        {
          productId: '2',
          title: 'Networking Documentation Suite',
          category: 'Documentation',
          purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 19.99
        }
      ];
      setPurchases(samplePurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (productId, title) => {
    alert(`📥 Downloading: ${title}\n\nIn production, this would download the actual file from the server.`);
  };

  const getIcon = (category) => {
    switch(category) {
      case 'Labs': return <FaBook className="text-[#00D4FF]" />;
      case 'Documentation': return <FaFileAlt className="text-[#0066FF]" />;
      case 'Tutorials': return <FaVideo className="text-[#4A9BC7]" />;
      default: return <FaFilePdf className="text-[#B0C4DE]" />;
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
                      className="mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white text-sm font-semibold rounded-lg hover:scale-105 transition-all"
                    >
                      <FaDownload />
                      Download Now
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