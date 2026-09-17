import React, { useState, useEffect } from 'react';
import { 
  FaUpload, 
  FaTrash, 
  FaDownload, 
  FaEye, 
  FaEyeSlash,
  FaFile,
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../api/config';

export default function AdminDownloads() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General',
    price: 0
  });
  const [file, setFile] = useState(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Get auth token (adjust based on how your AuthContext stores it)
  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  // Fetch all downloads (admin)
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${API_URL}/api/downloads/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDownloads(data.data || []);
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

  // Upload file
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return showMessage('error', 'Please select a file');
    if (!form.title) return showMessage('error', 'Please enter a title');

    try {
      setUploading(true);
      const token = getToken();

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/downloads/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - browser does it for FormData
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'File uploaded successfully!');
        setForm({ title: '', description: '', category: 'General', price: 0 });
        setFile(null);
        setShowUploadModal(false);
        fetchDownloads();
      } else {
        showMessage('error', data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Delete download
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/downloads/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        showMessage('success', 'File deleted');
        fetchDownloads();
      } else {
        showMessage('error', data.message || 'Delete failed');
      }
    } catch (error) {
      showMessage('error', 'Failed to delete file');
    }
  };

  // Toggle active status
  const handleToggle = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/downloads/admin/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchDownloads();
      }
    } catch (error) {
      showMessage('error', 'Failed to update status');
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Downloads</h1>
          <p className="text-[#B0C4DE] text-sm mt-1">
            Upload and manage files for users to download
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all shadow-lg shadow-[#00D4FF]/20"
        >
          <FaUpload /> Upload File
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}
        >
          {message.type === 'success' ? <FaCheck /> : <FaTimes />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1A2D4A] rounded-xl p-4 border border-[#2A3D5A]">
          <div className="text-2xl font-bold text-white">{downloads.length}</div>
          <div className="text-xs text-[#B0C4DE]">Total Files</div>
        </div>
        <div className="bg-[#1A2D4A] rounded-xl p-4 border border-[#2A3D5A]">
          <div className="text-2xl font-bold text-green-400">
            {downloads.filter(d => d.isActive).length}
          </div>
          <div className="text-xs text-[#B0C4DE]">Active</div>
        </div>
        <div className="bg-[#1A2D4A] rounded-xl p-4 border border-[#2A3D5A]">
          <div className="text-2xl font-bold text-[#00D4FF]">
            {downloads.reduce((sum, d) => sum + (d.downloadCount || 0), 0)}
          </div>
          <div className="text-xs text-[#B0C4DE]">Total Downloads</div>
        </div>
      </div>

      {/* Downloads Table */}
      <div className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#B0C4DE]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00D4FF] mx-auto mb-3"></div>
            Loading downloads...
          </div>
        ) : downloads.length === 0 ? (
          <div className="p-12 text-center text-[#B0C4DE]">
            <FaFile className="text-5xl mx-auto mb-4 text-[#2A3D5A]" />
            <p className="text-lg mb-2">No downloads yet</p>
            <p className="text-sm mb-4">Upload your first file to get started</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-[#00D4FF]/20 text-[#00D4FF] rounded-lg hover:bg-[#00D4FF]/30 transition-colors"
            >
              Upload File
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0A1628]/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#B0C4DE]">File</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#B0C4DE]">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#B0C4DE]">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#B0C4DE]">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#B0C4DE]">Downloads</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#B0C4DE]">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#B0C4DE]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((d) => (
                  <tr key={d._id} className="border-t border-[#2A3D5A] hover:bg-[#0A1628]/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00D4FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaFile className="text-[#00D4FF]" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{d.title}</div>
                          <div className="text-xs text-[#B0C4DE] truncate max-w-xs">{d.fileName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#B0C4DE]">{d.category}</td>
                    <td className="px-4 py-3 text-sm text-[#B0C4DE]">{formatSize(d.fileSize)}</td>
                    <td className="px-4 py-3 text-sm">
                      {d.price === 0 ? (
                        <span className="text-green-400 font-medium">Free</span>
                      ) : (
                        <span className="text-[#00D4FF] font-medium">${d.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#B0C4DE]">{d.downloadCount || 0}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(d._id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          d.isActive
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        {d.isActive ? <FaEye /> : <FaEyeSlash />}
                        {d.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`${API_URL}/api/downloads/file/${d._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#00D4FF] hover:bg-[#00D4FF]/20 rounded-lg transition-colors"
                          title="Download"
                        >
                          <FaDownload />
                        </a>
                        <button
                          onClick={() => handleDelete(d._id, d.title)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1628] border border-[#1A2D4A] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#1A2D4A]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUpload className="text-[#00D4FF]" /> Upload New File
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#B0C4DE] hover:text-white text-xl transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-[#B0C4DE] mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Packet Tracer Labs Bundle"
                  className="w-full bg-[#1A2D4A] text-white rounded-lg px-4 py-2.5 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-[#B0C4DE] mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what's in this file..."
                  className="w-full bg-[#1A2D4A] text-white rounded-lg px-4 py-2.5 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#B0C4DE] mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#1A2D4A] text-white rounded-lg px-4 py-2.5 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
                  >
                    <option value="General">General</option>
                    <option value="Labs">Labs</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="Templates">Templates</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#B0C4DE] mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-[#1A2D4A] text-white rounded-lg px-4 py-2.5 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
                  />
                  <p className="text-xs text-[#4A6A8A] mt-1">Set to 0 for free</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#B0C4DE] mb-1.5">File *</label>
                <div className="border-2 border-dashed border-[#2A3D5A] hover:border-[#00D4FF]/50 rounded-lg p-6 text-center transition-colors">
                  <input
                    type="file"
                    required
                    id="file-upload"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FaUpload className="text-3xl text-[#00D4FF] mx-auto mb-2" />
                    {file ? (
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-xs text-[#B0C4DE] mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white">Click to select a file</p>
                        <p className="text-xs text-[#B0C4DE] mt-1">Max size: 100MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2.5 bg-[#1A2D4A] text-[#B0C4DE] rounded-lg hover:bg-[#2A3D5A] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white rounded-lg hover:scale-105 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}