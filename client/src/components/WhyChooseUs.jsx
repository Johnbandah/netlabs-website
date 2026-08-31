import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const reasons = [
  'Real-World Expertise across multiple industries',
  'End-to-End Delivery from design to documentation',
  'Security-First Approach baked into every solution',
  'Professional Documentation ready for audits and compliance',
  'Scalable & Future-Ready architectures',
  'Online-First, Global Reach with African roots',
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Why Choose <span className="text-[#00D4FF]">NetLabs+</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} className="flex items-start gap-3 p-4 bg-[#1A2D4A] rounded-lg border border-[#2A3D5A] hover:border-[#00D4FF] transition-all">
              <FaCheckCircle className="text-[#00D4FF] text-xl mt-1 flex-shrink-0" />
              <span className="text-white text-sm">{reason}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}