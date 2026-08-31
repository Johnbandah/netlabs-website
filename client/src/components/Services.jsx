import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaNetworkWired, 
  FaShieldAlt, 
  FaServer, 
  FaWifi, 
  FaHandshake, 
  FaClipboardCheck 
} from 'react-icons/fa';

const services = [
  {
    icon: <FaNetworkWired />,
    title: 'Network Design & Implementation',
    description: 'Enterprise, campus, hospital, banking, and hospitality networks with VLAN segmentation and ACL enforcement.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Network Security & Access Control',
    description: 'AAA/RADIUS/TACACS+ integration, Syslog monitoring, firewall rule sets, and IoT access restrictions.',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: <FaServer />,
    title: 'Server Services',
    description: 'DHCP, DNS, HTTP/HTTPS, FTP, Email (SMTP/IMAP/POP3), AAA, Syslog, and IoT Processing server deployment.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: <FaWifi />,
    title: 'Wireless Network Solutions',
    description: 'Secure SSID deployment with WPA2/WPA3 encryption and VLAN-mapped access points.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <FaHandshake />,
    title: 'Consulting & Custom Labs',
    description: 'Affordable, project-specific design, documentation, and training services.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: <FaClipboardCheck />,
    title: 'Onsite Surveys & Demonstrations',
    description: 'Travel to organizations and institutions for tailored solutions and expertise demonstration.',
    color: 'from-rose-500 to-red-500'
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A1628] to-[#0F1F3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Services</span>
          </h2>
          <p className="text-[#B0C4DE] max-w-2xl mx-auto mt-4">
            End-to-end networking solutions tailored to your needs — from design to deployment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${service.color}`}></div>
              <div className="text-4xl text-[#00D4FF] mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-[#B0C4DE] text-sm">{service.description}</p>
              <motion.a
                href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-block mt-4 text-[#00D4FF] font-medium hover:underline text-sm"
                whileHover={{ x: 5 }}
              >
                Learn More →
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}