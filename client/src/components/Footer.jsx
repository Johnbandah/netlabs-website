import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] border-t border-[#1A2D4A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">Net</span>
              <span className="text-[#00D4FF]">Labs</span>
              <span className="text-white">+</span>
            </h3>
            <p className="text-[#B0C4DE] text-sm">
              Network Security & Innovation Hub Technologies (Pvt) Ltd
            </p>
            <p className="text-[#B0C4DE] text-sm mt-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#00D4FF]" />
              Victoria Falls, Zimbabwe
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-[#B0C4DE] hover:text-[#00D4FF] text-sm transition-colors">Services</Link></li>
              <li><Link to="/projects" className="text-[#B0C4DE] hover:text-[#00D4FF] text-sm transition-colors">Projects</Link></li>
              <li><Link to="/store" className="text-[#B0C4DE] hover:text-[#00D4FF] text-sm transition-colors">Store</Link></li>
              <li><Link to="/contact" className="text-[#B0C4DE] hover:text-[#00D4FF] text-sm transition-colors">Contact</Link></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-[#B0C4DE] text-sm">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[#00D4FF]" />
                info.netlabsplus@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[#00D4FF]" />
                support@netlabsplus.store
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-[#00D4FF]" />
                +263 86772 11857
              </li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <motion.a
                href="https://facebook.com/netlabsplus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B0C4DE] hover:text-[#00D4FF] text-2xl transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FaFacebook />
              </motion.a>
              <motion.a
                href="https://instagram.com/netlabsplus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B0C4DE] hover:text-[#00D4FF] text-2xl transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                href="https://wa.me/2638677211857"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B0C4DE] hover:text-[#00D4FF] text-2xl transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FaWhatsapp />
              </motion.a>
            </div>
            <p className="text-[#B0C4DE] text-xs mt-4">
              Follow us for updates and networking tips
            </p>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-[#1A2D4A] mt-8 pt-8 text-center text-[#B0C4DE] text-sm"
        >
          <p>&copy; {new Date().getFullYear()} NetLabs+. All rights reserved.</p>
          <p className="mt-1 text-xs italic">
            "Every network we design, every lab we build, every student we support — a step toward a connected future."
          </p>
        </motion.div>
      </div>
    </footer>
  );
}