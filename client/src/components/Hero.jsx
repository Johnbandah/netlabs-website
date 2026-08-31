import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShieldAlt, FaNetworkWired, FaGlobe } from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628]">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#00D4FF] rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#0066FF] rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00D4FF]/20 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#1A2D4A] px-4 py-2 rounded-full border border-[#00D4FF]/30 mb-8"
        >
          <span className="w-2 h-2 bg-[#00D4FF] rounded-full animate-ping"></span>
          <span className="text-[#00D4FF] text-sm font-medium">Global Network Security & Innovation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Secure Networks. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Practical Solutions.</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00D4FF]">Connected Future.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-[#B0C4DE] max-w-3xl mx-auto mb-10"
        >
          Global online networking and cybersecurity solutions — empowering students, professionals, and enterprises with affordable, practical, and secure networks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="/services"
            className="group px-8 py-4 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Services <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="/contact"
            className="px-8 py-4 border-2 border-[#00D4FF] text-[#00D4FF] font-semibold rounded-lg hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get a Quote
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-[#1A2D4A]/50 backdrop-blur-sm p-4 rounded-xl border border-[#00D4FF]/20">
            <div className="text-3xl font-bold text-[#00D4FF]">5+</div>
            <div className="text-sm text-[#B0C4DE]">Industries Served</div>
          </div>
          <div className="bg-[#1A2D4A]/50 backdrop-blur-sm p-4 rounded-xl border border-[#00D4FF]/20">
            <div className="text-3xl font-bold text-[#00D4FF]">50+</div>
            <div className="text-sm text-[#B0C4DE]">Projects Delivered</div>
          </div>
          <div className="bg-[#1A2D4A]/50 backdrop-blur-sm p-4 rounded-xl border border-[#00D4FF]/20">
            <div className="text-3xl font-bold text-[#00D4FF]">100%</div>
            <div className="text-sm text-[#B0C4DE]">Client Satisfaction</div>
          </div>
        </motion.div>

        {/* Floating Icons */}
        <motion.div
          className="absolute top-1/4 left-10 hidden lg:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaShieldAlt className="text-4xl text-[#00D4FF]/30" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-10 hidden lg:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FaNetworkWired className="text-4xl text-[#0066FF]/30" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-20 hidden lg:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <FaGlobe className="text-4xl text-[#00D4FF]/20" />
        </motion.div>
      </div>
    </section>
  );
}