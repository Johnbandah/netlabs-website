import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  FaBox, 
  FaEnvelope, 
  FaChartBar, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChartLine
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/admin/analytics', icon: <FaChartLine />, label: 'Analytics' },
    { path: '/admin/products', icon: <FaBox />, label: 'Products' },
    { path: '/admin/inquiries', icon: <FaEnvelope />, label: 'Inquiries' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 text-white text-2xl bg-[#1A2D4A] p-2 rounded-lg"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#1A2D4A] border-r border-[#2A3D5A] transition-transform duration-300 z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-[#2A3D5A]">
          <h2 className="text-2xl font-bold">
            <span className="text-white">Net</span>
            <span className="text-[#00D4FF]">Labs</span>
            <span className="text-white">+</span>
            <span className="text-xs text-[#B0C4DE] ml-2">Admin</span>
          </h2>
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

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all mt-4 border-t border-[#2A3D5A] pt-4"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A3D5A]">
          <p className="text-xs text-[#B0C4DE] text-center">
            NetLabs+ Admin v1.0
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