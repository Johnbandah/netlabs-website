import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group pr-6 border-r border-[#1A2D4A]/50">
      {/* Logo Icon */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF] to-[#0066FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#00D4FF]/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
          <img 
            src="/logo.png" 
            alt="NetLabs+" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-white group-hover:text-[#00D4FF] transition-colors duration-300">
            Net
          </span>
          <span className="text-2xl font-bold text-[#00D4FF] group-hover:text-white transition-colors duration-300">
            Labs
          </span>
          <span className="text-2xl font-bold text-white group-hover:text-[#00D4FF] transition-colors duration-300">
            +
          </span>
        </div>
        <div className="text-[8px] tracking-[0.3em] text-[#B0C4DE] font-medium uppercase">
          Office of Network Security
        </div>
      </div>
    </Link>
  );
}