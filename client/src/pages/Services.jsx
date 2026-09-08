import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaNetworkWired, 
  FaShieldAlt, 
  FaServer, 
  FaWifi, 
  FaHandshake, 
  FaClipboardCheck,
  FaShoppingCart,
  FaTimes,
  FaArrowRight,
  FaCheckCircle,
  FaBuilding
} from 'react-icons/fa';

// Service data with all details
const services = [
  {
    icon: <FaNetworkWired />,
    title: 'Network Design & Implementation',
    description: 'Enterprise, campus, hospital, banking, hotel, lodge, office, and home networks. End-to-end VLAN-segmented, ACL-enforced architectures.',
    features: ['VLAN Segmentation', 'ACL Enforcement', 'Inter-VLAN Routing', 'Trunking'],
    detailedDescription: 'We design and implement robust network architectures tailored to your specific needs. Our solutions include comprehensive VLAN segmentation, access control lists (ACLs), inter-VLAN routing, and trunking configurations. We work with Cisco equipment to ensure enterprise-grade reliability and security.',
    benefits: [
      'Improved network performance and scalability',
      'Enhanced security through VLAN segmentation',
      'Reduced broadcast domains and network congestion',
      'Simplified network management and troubleshooting'
    ],
    useCases: [
      'Campus networks for universities and schools',
      'Enterprise networks for corporate offices',
      'Hospital networks for healthcare facilities',
      'Banking networks for financial institutions'
    ],
    technologies: ['Cisco Routers', 'Cisco Switches', 'VLAN', 'ACL', 'Inter-VLAN Routing'],
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Network Security & Access Control',
    description: 'AAA/RADIUS/TACACS+ integration, Syslog monitoring, firewall rule sets, and IoT access restrictions.',
    features: ['AAA Integration', 'Syslog Monitoring', 'Firewall Rules', 'IoT Security'],
    detailedDescription: 'We implement comprehensive network security solutions including AAA/RADIUS/TACACS+ integration for authentication, authorization, and accounting. Our security services include Syslog monitoring for real-time threat detection, firewall rule configuration, and IoT access restrictions.',
    benefits: [
      'Enhanced network security posture',
      'Centralized user authentication and authorization',
      'Real-time threat monitoring and alerting',
      'Compliance with security standards and regulations'
    ],
    useCases: [
      'Enterprise security for corporate networks',
      'Healthcare compliance (HIPAA)',
      'Banking and financial security',
      'IoT device security and access control'
    ],
    technologies: ['AAA', 'RADIUS', 'TACACS+', 'Syslog', 'Firewall', 'IoT Security'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop'
  },
  {
    icon: <FaServer />,
    title: 'Server Services',
    description: 'DHCP, DNS, HTTP/HTTPS, FTP, Email (SMTP/IMAP/POP3), AAA, Syslog, and IoT Processing server deployment.',
    features: ['DHCP/DNS', 'Web Hosting', 'Email Servers', 'IoT Processing'],
    detailedDescription: 'We provide comprehensive server services including DHCP and DNS configuration, web hosting (HTTP/HTTPS), FTP servers, email services (SMTP/IMAP/POP3), AAA servers, Syslog servers, and IoT processing servers.',
    benefits: [
      'Reliable and scalable server infrastructure',
      'Centralized network services management',
      'High availability and redundancy',
      'Improved network performance and efficiency'
    ],
    useCases: [
      'Enterprise server deployment',
      'Campus network services',
      'Hospital server infrastructure',
      'Cloud and hybrid server solutions'
    ],
    technologies: ['DHCP', 'DNS', 'HTTP/HTTPS', 'FTP', 'Email Servers', 'AAA', 'Syslog'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'
  },
  {
    icon: <FaWifi />,
    title: 'Wireless Network Solutions',
    description: 'Secure SSID deployment with WPA2/WPA3 encryption, VLAN-mapped access points for enterprise-grade connectivity.',
    features: ['WPA2/WPA3 Encryption', 'VLAN Mapping', 'Secure SSID', 'Enterprise Coverage'],
    detailedDescription: 'We design and deploy secure wireless networks with WPA2/WPA3 encryption, VLAN-mapped access points, and enterprise-grade coverage.',
    benefits: [
      'Enterprise-grade wireless coverage',
      'Enhanced security with WPA2/WPA3 encryption',
      'VLAN-based traffic isolation',
      'Seamless roaming and connectivity'
    ],
    useCases: [
      'Campus-wide wireless networks',
      'Hospital wireless infrastructure',
      'Hotel and hospitality wireless',
      'Corporate office wireless'
    ],
    technologies: ['WPA2/WPA3', 'VLAN Mapping', 'Cisco Wireless', 'Access Points', 'Wireless Controllers'],
    image: 'https://images.unsplash.com/photo-1563770551460-e76e577bc0be?w=800&h=400&fit=crop'
  },
  {
    icon: <FaHandshake />,
    title: 'Consulting & Custom Labs',
    description: 'Affordable, project-specific design, documentation, and training services for students, professionals, and organizations.',
    features: ['Custom Design', 'Documentation', 'Training', 'Project Planning'],
    detailedDescription: 'We offer consulting services and custom lab design for students, professionals, and organizations including project-specific network design, comprehensive documentation, hands-on training, and project planning.',
    benefits: [
      'Expert guidance for network projects',
      'Custom-designed labs for specific learning needs',
      'Professional documentation for audits and compliance',
      'Hands-on training with real-world scenarios'
    ],
    useCases: [
      'Student training and certification preparation',
      'Professional development for IT staff',
      'Custom lab design for educational institutions',
      'Project planning and consultation'
    ],
    technologies: ['Cisco Packet Tracer', 'Network Design', 'Documentation', 'Training Materials'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop'
  },
  {
    icon: <FaClipboardCheck />,
    title: 'Onsite Surveys & Demonstrations',
    description: 'Travel to organizations and institutions for tailored solutions and expertise demonstration.',
    features: ['Site Surveys', 'Expert Demonstrations', 'Tailored Solutions', 'Onsite Training'],
    detailedDescription: 'We provide onsite surveys and demonstrations for organizations and institutions. Our experts travel to your location to conduct site surveys, demonstrate tailored solutions, and provide onsite training.',
    benefits: [
      'Hands-on expert guidance at your location',
      'Custom solutions tailored to your specific needs',
      'Real-time demonstrations and troubleshooting',
      'Onsite training for your team'
    ],
    useCases: [
      'Hospital network surveys and demonstrations',
      'Banking institution site assessments',
      'Educational institution training and demos',
      'Corporate office network evaluations'
    ],
    technologies: ['Site Surveys', 'Network Assessment', 'Demonstrations', 'Onsite Training'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop'
  },
  {
    icon: <FaShoppingCart />,
    title: 'E-Commerce Store',
    description: 'Marketplace for downloadable labs, documentation, tutorials, and troubleshooting guides for networking professionals.',
    features: ['Downloadable Labs', 'Documentation', 'Tutorials', 'Guides'],
    detailedDescription: 'Our e-commerce store provides a marketplace for downloadable networking resources including labs, documentation, tutorials, and troubleshooting guides.',
    benefits: [
      'Instant access to networking resources',
      'Affordable and practical learning materials',
      'Regular updates and new content',
      'High-quality, professional documentation'
    ],
    useCases: [
      'Student learning and certification preparation',
      'Professional development and skill building',
      'Educational institution resources',
      'Corporate training materials'
    ],
    technologies: ['Digital Downloads', 'Documentation', 'Video Tutorials', 'Lab Files'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setSelectedService(null), 300);
  };

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
              className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all duration-300 cursor-pointer group"
              onClick={() => openModal(service)}
            >
              <div className="text-4xl text-[#00D4FF] mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-[#B0C4DE] text-sm mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, i) => (
                  <span key={i} className="text-xs bg-[#0A1628] text-[#00D4FF] px-2 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-[#00D4FF] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <FaArrowRight className="text-xs" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {showModal && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1A2D4A] rounded-2xl border border-[#2A3D5A] max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 text-[#B0C4DE] hover:text-white transition-colors bg-[#0A1628] p-2 rounded-full"
              >
                <FaTimes className="text-xl" />
              </button>

              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl text-[#00D4FF] p-3 bg-[#0A1628] rounded-xl flex-shrink-0">
                    {selectedService.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedService.title}</h2>
                    <p className="text-[#B0C4DE] mt-1">{selectedService.description}</p>
                  </div>
                </div>

                {/* Image */}
                <div className="mb-6 rounded-xl overflow-hidden">
                  <img 
                    src={selectedService.image} 
                    alt={selectedService.title}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Detailed Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                  <p className="text-[#B0C4DE] leading-relaxed">{selectedService.detailedDescription}</p>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Key Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedService.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 bg-[#0A1628] p-3 rounded-lg">
                        <FaCheckCircle className="text-[#00D4FF] mt-0.5 flex-shrink-0" />
                        <span className="text-[#B0C4DE] text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Use Cases</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedService.useCases.map((useCase, i) => (
                      <div key={i} className="flex items-start gap-2 bg-[#0A1628] p-3 rounded-lg">
                        <FaBuilding className="text-[#00D4FF] mt-0.5 flex-shrink-0" />
                        <span className="text-[#B0C4DE] text-sm">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-[#00D4FF]/10 text-[#00D4FF] rounded-full text-sm border border-[#00D4FF]/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-[#2A3D5A]">
                  <a
                    href="/quote-request"
                    className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Get a Quote <FaArrowRight />
                  </a>
                  <a
                    href="/contact"
                    className="px-6 py-3 border-2 border-[#00D4FF] text-[#00D4FF] font-semibold rounded-lg hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all"
                  >
                    Contact Us
                  </a>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-[#2A3D5A] text-white font-semibold rounded-lg hover:bg-[#3A4D6A] transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}