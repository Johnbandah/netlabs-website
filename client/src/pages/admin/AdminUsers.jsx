import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaUserCheck, 
  FaUserTimes,
  FaUserSlash,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaUserCog,
  FaShieldAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt
} from 'react-icons/fa';
import API_URL from '../../api/config';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        console.error('Failed to fetch users:', data.message);
        // Fallback to sample data if API fails
        setUsers(getSampleUsers());
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers(getSampleUsers());
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/stats/summary`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Calculate stats from users
      calculateStats(users);
    }
  };

  const calculateStats = (userList) => {
    setStats({
      totalUsers: userList.length,
      activeUsers: userList.filter(u => u.status === 'active').length,
      inactiveUsers: userList.filter(u => u.status === 'inactive').length,
      suspendedUsers: userList.filter(u => u.status === 'suspended').length,
      adminUsers: userList.filter(u => u.role === 'admin').length,
      regularUsers: userList.filter(u => u.role === 'user').length
    });
  };

  // Sample data as fallback
  const getSampleUsers = () => {
    return [
      { 
        _id: '1', 
        name: 'Mercy Banda', 
        email: 'mercybanda@gmail.com', 
        role: 'user', 
        status: 'active',
        phone: '+265 888 123 456',
        address: 'Lilongwe, Malawi',
        createdAt: '2026-08-30T10:00:00Z',
        lastLogin: '2026-08-31T14:30:00Z',
        purchases: 12
      },
      { 
        _id: '2', 
        name: 'John Doe', 
        email: 'john@test.com', 
        role: 'user', 
        status: 'active',
        phone: '+265 888 789 012',
        address: 'Blantyre, Malawi',
        createdAt: '2026-08-28T08:15:00Z',
        lastLogin: '2026-08-30T09:45:00Z',
        purchases: 5
      },
      { 
        _id: '3', 
        name: 'Administrator', 
        email: 'admin@netlabs.com', 
        role: 'admin', 
        status: 'active',
        phone: '+263 86772 11857',
        address: 'Victoria Falls, Zimbabwe',
        createdAt: '2026-08-01T00:00:00Z',
        lastLogin: '2026-08-31T16:00:00Z',
        purchases: 0
      }
    ];
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        // Remove user from state
        const updatedUsers = users.filter(u => u._id !== id);
        setUsers(updatedUsers);
        calculateStats(updatedUsers);
        showNotification(`User "${name}" deleted successfully!`, 'success');
      } else {
        showNotification('Failed to delete user', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Error deleting user', 'error');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        const updatedUsers = users.map(u => u._id === id ? { ...u, status } : u);
        setUsers(updatedUsers);
        calculateStats(updatedUsers);
        showNotification(`User status updated to ${status}!`, 'success');
      } else {
        showNotification('Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('Error updating status', 'error');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUser)
      });
      const data = await response.json();
      if (data.success) {
        const updatedUsers = users.map(u => u._id === selectedUser._id ? selectedUser : u);
        setUsers(updatedUsers);
        calculateStats(updatedUsers);
        setShowEditModal(false);
        showNotification(`User "${selectedUser.name}" updated successfully!`, 'success');
      } else {
        showNotification('Failed to update user', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Error updating user', 'error');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <FaShieldAlt className="text-[#00D4FF]" /> : <FaUser className="text-[#B0C4DE]" />;
  };

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
        <p className="text-[#B0C4DE]">Loading users...</p>
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
            User Management
          </motion.h1>
          <motion.p 
            className="text-[#B0C4DE]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Manage system users and permissions ({filteredUsers.length} users)
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#00D4FF]">{stats.totalUsers}</p>
          <p className="text-xs text-[#B0C4DE]">Total Users</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-green-400">{stats.activeUsers}</p>
          <p className="text-xs text-[#B0C4DE]">Active</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.inactiveUsers}</p>
          <p className="text-xs text-[#B0C4DE]">Inactive</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-red-400">{stats.suspendedUsers}</p>
          <p className="text-xs text-[#B0C4DE]">Suspended</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#00D4FF]">{stats.adminUsers}</p>
          <p className="text-xs text-[#B0C4DE]">Admins</p>
        </div>
        <div className="bg-[#1A2D4A] p-4 rounded-xl border border-[#2A3D5A] text-center">
          <p className="text-2xl font-bold text-[#B0C4DE]">{stats.regularUsers}</p>
          <p className="text-xs text-[#B0C4DE]">Regular</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mb-6"
      >
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4DE]" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-[#1A2D4A] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
        />
      </motion.div>

      {/* Users Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B0C4DE] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3D5A]">
              <AnimatePresence>
                {filteredUsers.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="5" className="px-6 py-12 text-center text-[#B0C4DE]">
                      <FaUsers className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No users found</p>
                      <p className="text-sm opacity-50 mt-1">Try adjusting your search</p>
                    </td>
                  </motion.tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="hover:bg-[#2A3D5A]/50 transition-colors group"
                      whileHover={{ backgroundColor: 'rgba(42, 61, 90, 0.3)' }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#00D4FF]/20 to-[#0066FF]/20 rounded-full flex items-center justify-center text-[#00D4FF] font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-[#B0C4DE] text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30' 
                            : 'bg-[#2A3D5A] text-[#B0C4DE]'
                        }`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#B0C4DE] text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded-lg hover:bg-blue-500/10"
                            title="Edit user"
                          >
                            <FaEdit />
                          </button>
                          {user.status !== 'active' && (
                            <button
                              onClick={() => handleUpdateStatus(user._id, 'active')}
                              className="text-green-400 hover:text-green-300 transition-colors p-1.5 rounded-lg hover:bg-green-500/10"
                              title="Activate user"
                            >
                              <FaUserCheck />
                            </button>
                          )}
                          {user.status !== 'inactive' && user.status !== 'suspended' && (
                            <button
                              onClick={() => handleUpdateStatus(user._id, 'inactive')}
                              className="text-yellow-400 hover:text-yellow-300 transition-colors p-1.5 rounded-lg hover:bg-yellow-500/10"
                              title="Deactivate user"
                            >
                              <FaUserTimes />
                            </button>
                          )}
                          {user.status !== 'suspended' && (
                            <button
                              onClick={() => handleUpdateStatus(user._id, 'suspended')}
                              className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                              title="Suspend user"
                            >
                              <FaUserSlash />
                            </button>
                          )}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                              title="Delete user"
                            >
                              <FaTrash />
                            </button>
                          )}
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
          <span>Showing {filteredUsers.length} of {users.length} users</span>
          <span>Total: {users.length}</span>
        </motion.div>
      </motion.div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
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
              className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit User</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-[#B0C4DE] hover:text-white transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    value={selectedUser.phone || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Address</label>
                  <input
                    type="text"
                    value={selectedUser.address || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, address: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-white block mb-2 text-sm font-medium">Status</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                    className="w-full p-3 rounded-lg bg-[#0A1628] text-white border border-[#2A3D5A] focus:border-[#00D4FF] outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4 border-t border-[#2A3D5A]">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <FaCheck />
                    Update User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
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
    </div>
  );
}