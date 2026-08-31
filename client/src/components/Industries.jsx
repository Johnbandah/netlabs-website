import React from 'react';
import { motion } from 'framer-motion';
import { FaUniversity, FaHospital, FaHotel, FaHome, FaBuilding } from 'react-icons/fa';

const industries = [
  { name: 'Banking & Finance', icon: <FaBuilding />, color: 'from-green-400 to-emerald-500' },
  { name: 'Healthcare', icon: <FaHospital />, color: 'from-red-400 to-rose-500' },
  { name: 'Education', icon: <FaUniversity />, color: 'from-blue-400 to-indigo-500' },
  { name: 'Hospitality', icon: <FaHotel />, color: 'from-yellow-400 to-amber-500' },
  { name: 'Residential', icon: <FaHome />, color: 'from-purple-400 to-pink-500' },
];

export default function Industries() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0F1F3A] to-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase">Our Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Industries We <span className="text-[#00D4FF]">Serve</span></h2>
          <p className="text-[#B0C4DE] max-w-2xl mx-auto mt-4">Tailored networking solutions across diverse sectors.</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-8">
          {industries.map((industry, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} whileHover={{ scale: 1.1, rotate: 5 }} className="flex flex-col items-center p-6 bg-[#1A2D4A] rounded-xl w-32 border border-[#2A3D5A] hover:border-[#00D4FF] transition-all">
              <div className={`text-5xl mb-3 bg-gradient-to-br ${industry.color} p-3 rounded-full text-white`}>{industry.icon}</div>
              <span className="text-white text-sm text-center font-medium">{industry.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}