import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaUniversity, FaHospital, FaHotel, FaHome } from 'react-icons/fa';

const projects = [
  {
    icon: <FaBuilding />,
    title: 'Riverstone Bank',
    location: 'Victoria Falls, Zimbabwe',
    description: 'Full enterprise deployment with router-on-a-stick inter-VLAN routing, DHCP pools, IoT integration, FTP/Email/AAA/Syslog servers.',
    technologies: ['VLAN', 'Router-on-a-Stick', 'DHCP', 'IoT', 'AAA', 'Syslog']
  },
  {
    icon: <FaUniversity />,
    title: 'Zambezi International University',
    location: 'Victoria Falls, Zimbabwe',
    description: 'Campus-wide VLANs for faculty, students, library, administration; wireless APs; full web platform suite.',
    technologies: ['Campus Network', 'VLAN', 'Wireless AP', 'Web Platform']
  },
  {
    icon: <FaHospital />,
    title: 'Victoria Falls International Medical Centre',
    location: 'Victoria Falls, Zimbabwe',
    description: 'VLAN isolation for medical equipment, IoT CCTV/motion detection, AAA/RADIUS authentication, Syslog logging.',
    technologies: ['VLAN Isolation', 'IoT CCTV', 'AAA/RADIUS', 'Syslog']
  },
  {
    icon: <FaHotel />,
    title: 'Central Park-view Hotel',
    location: 'Victoria Falls, Zimbabwe',
    description: 'Hospitality network with guest/staff VLANs, secure wireless, IoT restrictions, and professional documentation.',
    technologies: ['Guest VLAN', 'Staff VLAN', 'Secure Wireless', 'IoT Restrictions']
  },
  {
    icon: <FaHotel />,
    title: 'Elephant Sands Wilderness Lodge',
    location: 'Victoria Falls, Zimbabwe',
    description: 'Hospitality network with guest VLAN deployment, IoT restrictions, branded documentation, enterprise-grade connectivity.',
    technologies: ['Guest VLAN', 'IoT Restrictions', 'Enterprise Connectivity']
  },
  {
    icon: <FaHome />,
    title: 'Residential Network Projects',
    location: 'Victoria Falls, Zimbabwe',
    description: 'Parental-control VLANs, IoT device integration, DHCP configuration for smart home environments.',
    technologies: ['Parental Controls', 'IoT Integration', 'DHCP']
  }
];

export default function Projects() {
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
          <span className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase">Our Portfolio</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">Projects</span>
          </h1>
          <p className="text-[#B0C4DE] max-w-2xl mx-auto mt-4 text-lg">
            Real-world networking solutions delivered across diverse industries.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-[#1A2D4A] p-6 rounded-xl border border-[#2A3D5A] hover:border-[#00D4FF] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl text-[#00D4FF]">{project.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="text-[#00D4FF] text-sm mb-2">{project.location}</p>
                  <p className="text-[#B0C4DE] text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs bg-[#0A1628] text-[#00D4FF] px-2 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}