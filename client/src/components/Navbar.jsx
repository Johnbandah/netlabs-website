import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/store', label: 'Store' },
    { href: '/my-downloads', label: '📥 Downloads' },
    { href: '/contact', label: 'Contact' },
  ];

  // Show Admin link only for admin users
  const isAdmin = user?.role === 'admin';
  if (user && isAdmin) {
    navLinks.push({ href: '/admin', label: '🔐 Admin' });
  }

  return (
    <nav className="fixed top-0 w-full bg-[#0A1628]/95 backdrop-blur-md z-50 border-b border-[#1A2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold">
              <span className="text-white group-hover:text-[#00D4FF] transition-colors duration-300">Net</span>
              <span className="text-[#00D4FF] group-hover:text-white transition-colors duration-300">Labs</span>
              <span className="text-white group-hover:text-[#00D4FF] transition-colors duration-300">+</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 group py-1"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            
            {/* User Info */}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="relative text-[#00D4FF] text-sm font-medium border-l border-[#2A3D5A] pl-4 hover:text-[#00D4FF]/80 transition-colors duration-300 group py-1"
                >
                  👋 {user.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4FF] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className="relative text-[#B0C4DE] hover:text-red-400 transition-colors duration-300 group py-1"
                >
                  Logout
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="relative text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 group py-1"
                >
                  Login
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4FF] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/register"
                  className="relative text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 group py-1"
                >
                  Sign Up
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4FF] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00D4FF]/20 hover:shadow-[#00D4FF]/40"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl hover:text-[#00D4FF] transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-[#1A2D4A] space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block py-2.5 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 pl-3 border-l-2 border-transparent hover:border-[#00D4FF]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2.5 text-[#00D4FF] text-sm font-medium border-t border-[#2A3D5A] pt-3 pl-3 border-l-2 border-transparent hover:border-[#00D4FF] transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  👋 {user.name}
                </Link>
                <button
                  onClick={() => { 
                    logout(); 
                    setIsOpen(false);
                    window.location.href = '/';
                  }}
                  className="block w-full text-left py-2.5 text-red-400 hover:text-red-300 transition-colors duration-300 pl-3 border-l-2 border-transparent hover:border-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2.5 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 pl-3 border-l-2 border-transparent hover:border-[#00D4FF]"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2.5 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 pl-3 border-l-2 border-transparent hover:border-[#00D4FF]"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <Link
              to="/contact"
              className="block mt-3 px-4 py-2.5 text-center bg-gradient-to-r from-[#00D4FF] to-[#0066FF] rounded-lg text-white font-semibold hover:scale-105 transition-transform duration-300"
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}