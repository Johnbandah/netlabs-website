import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaBox, 
  FaDownload,
  FaUserCog,
  FaSignOutAlt,
  FaShoppingBag,
  FaCreditCard,
  FaHeadset,
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
  FaLock,
  FaHeart
} from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

export default function UserLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] text-center">
          <p className="text-[#B0C4DE] text-lg mb-4">🔒 Please login to view this page</p>
          <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/store', icon: <FaStore />, label: 'Browse Store' },
    { path: '/my-downloads', icon: <FaDownload />, label: 'My Downloads' },
    { path: '/orders', icon: <FaCreditCard />, label: 'Purchase History' },
    { path: '/profile', icon: <FaUserCog />, label: 'My Profile' },
    { path: '/change-password', icon: <FaLock />, label: 'Change Password' },
    { path: '/wishlist', icon: <FaHeart />, label: 'Wishlist' },
    { path: '/contact', icon: <FaHeadset />, label: 'Support' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pt-16 min-h-screen bg-[#0A1628]">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 text-white text-2xl bg-[#1A2D4A] p-2 rounded-lg"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#1A2D4A] border-r border-[#2A3D5A] transition-transform duration-300 z-40 pt-16 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* User Profile */}
        <div className="p-4 border-b border-[#2A3D5A]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] rounded-xl flex items-center justify-center text-xl text-white font-bold">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{user.name}</p>
              <p className="text-[#B0C4DE] text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white'
                  : 'text-[#B0C4DE] hover:bg-[#2A3D5A] hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">✓</span>
              )}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all mt-4 border-t border-[#2A3D5A] pt-4"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A3D5A]">
          <p className="text-xs text-[#B0C4DE] text-center">
            NetLabs+ User v1.0
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}