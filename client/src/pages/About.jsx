import React from 'react';
import { motion } from 'framer-motion';
import { FaNetworkWired, FaShieldAlt, FaGlobe, FaUsers, FaAward, FaRocket } from 'react-icons/fa';

export default function About() {
  const stats = [
    { number: '5+', label: 'Industries Served', icon: <FaNetworkWired className="text-4xl text-[#00D4FF]" /> },
    { number: '50+', label: 'Projects Delivered', icon: <FaShieldAlt className="text-4xl text-[#00D4FF]" /> },
    { number: '100%', label: 'Client Satisfaction', icon: <FaUsers className="text-4xl text-[#00D4FF]" /> },
    { number: 'Global', label: 'Reach', icon: <FaGlobe className="text-4xl text-[#00D4FF]" /> },
  ];

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#00D4FF] rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#0066FF] rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] rounded-full text-sm font-semibold mb-4">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">NetLabs+</span>
            </h1>
            <p className="text-xl text-[#B0C4DE] max-w-3xl mx-auto">
              Network Security & Innovation Hub Technologies (Pvt) Ltd
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-[#1A2D4A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">Who We Are</h2>
              <div className="space-y-4 text-[#B0C4DE] text-lg">
                <p>
                  NetLabs+ is a global online company operating as <span className="text-white font-semibold">Network Security & Innovation Hub Technologies (Pvt) Ltd</span>. 
                  It combines network design, digital infrastructure consulting, and an e-commerce store for networking resources.
                </p>
                <p>
                  Founded by <span className="text-[#00D4FF] font-semibold">Brilliant Praise Tshuma</span>, NetLabs+ empowers students, educators, organizations, 
                  enterprises, IT professionals, and cybersecurity specialists worldwide with affordable, practical, and secure solutions.
                </p>
                <p>
                  Operating primarily online, NetLabs+ serves clients across Africa and internationally, while being rooted in 
                  <span className="text-[#00D4FF] font-semibold"> Victoria Falls, Zimbabwe</span> — a place of inspiration and identity for the founder.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="text-white font-semibold">Global Reach</h3>
                <p className="text-[#B0C4DE] text-sm">Serving clients worldwide</p>
              </div>
              <div className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-white font-semibold">Security First</h3>
                <p className="text-[#B0C4DE] text-sm">Enterprise-grade security</p>
              </div>
              <div className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="text-white font-semibold">Innovation</h3>
                <p className="text-[#B0C4DE] text-sm">Cutting-edge solutions</p>
              </div>
              <div className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="text-white font-semibold">Trusted Partner</h3>
                <p className="text-[#B0C4DE] text-sm">Reliable & professional</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all"
            >
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-[#B0C4DE] text-lg">
                To democratize access to affordable, practical networking resources and services, 
                empowering learners, professionals, and cybersecurity engineers to confidently 
                build, test, and secure networks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all"
            >
              <div className="text-5xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-[#B0C4DE] text-lg">
                To become the leading global hub for Packet Tracer labs, documentation, and affordable 
                networking services — trusted by institutions, organizations, and individuals alike.
              </p>
              <p className="text-[#B0C4DE] text-lg mt-4">
                NetLabs+ also envisions establishing a dedicated <span className="text-[#00D4FF] font-semibold">Operations & Innovation Center</span> 
                to expand training, consulting, and education in secure networking.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#1A2D4A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Our Impact in Numbers</h2>
            <p className="text-[#B0C4DE] mt-2">Delivering excellence across the globe</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all text-center group"
              >
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-[#B0C4DE] text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#00D4FF]/10 to-[#0066FF]/10 border-y border-[#00D4FF]/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Network?</h2>
            <p className="text-[#B0C4DE] text-lg mb-8">
              Let's discuss how NetLabs+ can help you build a secure, scalable, and future-ready network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-[#00D4FF]/20"
              >
                Get Started
              </a>
              <a
                href="/services"
                className="px-8 py-3 border-2 border-[#00D4FF] text-[#00D4FF] font-semibold rounded-lg hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all"
              >
                Explore Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}