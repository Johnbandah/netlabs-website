import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaNetworkWired, 
  FaShieldAlt, 
  FaServer, 
  FaWifi, 
  FaHandshake, 
  FaClipboardCheck,
  FaShoppingCart
} from 'react-icons/fa';

const services = [
  {
    icon: <FaNetworkWired />,
    title: 'Network Design & Implementation',
    description: 'Enterprise, campus, hospital, banking, hotel, lodge, office, and home networks. End-to-end VLAN-segmented, ACL-enforced architectures.',
    features: ['VLAN Segmentation', 'ACL Enforcement', 'Inter-VLAN Routing', 'Trunking']
  },
  {
    icon: <FaShieldAlt />,
    title: 'Network Security & Access Control',
    description: 'AAA/RADIUS/TACACS+ integration, Syslog monitoring, firewall rule sets, and IoT access restrictions.',
    features: ['AAA Integration', 'Syslog Monitoring', 'Firewall Rules', 'IoT Security']
  },
  {
    icon: <FaServer />,
    title: 'Server Services',
    description: 'DHCP, DNS, HTTP/HTTPS, FTP, Email (SMTP/IMAP/POP3), AAA, Syslog, and IoT Processing server deployment.',
    features: ['DHCP/DNS', 'Web Hosting', 'Email Servers', 'IoT Processing']
  },
  {
    icon: <FaWifi />,
    title: 'Wireless Network Solutions',
    description: 'Secure SSID deployment with WPA2/WPA3 encryption, VLAN-mapped access points for enterprise-grade connectivity.',
    features: ['WPA2/WPA3 Encryption', 'VLAN Mapping', 'Secure SSID', 'Enterprise Coverage']
  },
  {
    icon: <FaHandshake />,
    title: 'Consulting & Custom Labs',
    description: 'Affordable, project-specific design, documentation, and training services for students, professionals, and organizations.',
    features: ['Custom Design', 'Documentation', 'Training', 'Project Planning']
  },
  {
    icon: <FaClipboardCheck />,
    title: 'Onsite Surveys & Demonstrations',
    description: 'Travel to organizations and institutions for tailored solutions and expertise demonstration.',
    features: ['Site Surveys', 'Expert Demonstrations', 'Tailored Solutions', 'Onsite Training']
  },
  {
    icon: <FaShoppingCart />,
    title: 'E-Commerce Store',
    description: 'Marketplace for downloadable labs, documentation, tutorials, and troubleshooting guides for networking professionals.',
    features: ['Downloadable Labs', 'Documentation', 'Tutorials', 'Guides']
  }
];

export default function Services() {
  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase">What We Offer</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Services</span>
          </h1>
          <p className="text-[#B0C4DE] max-w-2xl mx-auto mt-4 text-lg">
            End-to-end networking solutions tailored to your needs — from design to deployment.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all duration-300"
            >
              <div className="text-4xl text-[#00D4FF] mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-[#B0C4DE] text-sm mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, i) => (
                  <span key={i} className="text-xs bg-[#0A1628] text-[#00D4FF] px-2 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}