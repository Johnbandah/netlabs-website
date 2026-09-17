import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const mainNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/store', label: 'Store' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const userLinks = [
    { href: '/my-downloads', label: 'Downloads' },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="fixed top-0 w-full bg-[#0A1628]/95 backdrop-blur-md z-50 border-b border-[#1A2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 group py-1 text-sm"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {user && (
              <>
                {userLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="relative text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 group py-1 text-sm"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4FF] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="relative text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors duration-300 group py-1 text-sm font-medium"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          {/* Right Side - Auth & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-[#00D4FF] text-sm font-medium hover:text-[#00D4FF]/80 transition-colors"
                >
                  {user.name}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className="text-[#B0C4DE] hover:text-red-400 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-[#B0C4DE] hover:text-[#00D4FF] transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-[#00D4FF]/20 text-[#00D4FF] rounded-lg hover:bg-[#00D4FF]/30 transition-all text-sm font-medium border border-[#00D4FF]/30"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              to="/quote-request"
              className="px-5 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00D4FF]/20 hover:shadow-[#00D4FF]/40 text-sm whitespace-nowrap"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white text-2xl hover:text-[#00D4FF] transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-[#1A2D4A] space-y-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block py-2.5 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 pl-3 border-l-2 border-transparent hover:border-[#00D4FF] text-sm"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                {userLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block py-2.5 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 pl-3 border-l-2 border-transparent hover:border-[#00D4FF] text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="block py-2.5 text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors duration-300 pl-3 border-l-2 border-transparent hover:border-[#00D4FF] text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}

            <div className="border-t border-[#2A3D5A] my-2"></div>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2.5 text-[#00D4FF] text-sm font-medium pl-3"
                  onClick={() => setIsOpen(false)}
                >
                  {user.name}
                </Link>
                <Link
                  to="/change-password"
                  className="block py-2.5 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 pl-3 border-l-2 border-transparent hover:border-[#00D4FF] text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Change Password
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    window.location.href = '/';
                  }}
                  className="block w-full text-left py-2.5 text-red-400 hover:text-red-300 transition-colors duration-300 pl-3 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2.5 text-[#B0C4DE] hover:text-[#00D4FF] transition-colors duration-300 pl-3 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2.5 text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors duration-300 pl-3 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link
              to="/quote-request"
              className="block mt-3 mx-3 px-4 py-2.5 text-center bg-gradient-to-r from-[#00D4FF] to-[#0066FF] rounded-lg text-white font-semibold hover:scale-105 transition-transform duration-300"
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