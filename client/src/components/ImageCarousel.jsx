import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Higher quality images with better URLs
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=600&fit=crop&q=80',
    title: 'Cisco Network Infrastructure',
    description: 'Enterprise-grade routing and switching solutions',
    tag: 'Routing & Switching'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80',
    title: 'Network Security Solutions',
    description: 'Protecting your network with Cisco security technologies',
    tag: 'Security'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1563770551460-e76e577bc0be?w=1200&h=600&fit=crop&q=80',
    title: 'Wireless Networking',
    description: 'Cisco wireless solutions for seamless connectivity',
    tag: 'Wireless'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80',
    title: 'Network Monitoring',
    description: 'Real-time monitoring with Cisco technologies',
    tag: 'Monitoring'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop&q=80',
    title: 'Data Center Solutions',
    description: 'Cisco data center and cloud networking',
    tag: 'Data Center'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop&q=80',
    title: 'Cybersecurity',
    description: 'Cisco security solutions for modern threats',
    tag: 'Security'
  }
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const currentSlide = slides[currentIndex];
  const isImageLoaded = loadedImages[currentIndex];

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with loading state */}
          <div className="absolute inset-0 bg-[#0A1628]">
            <img 
              src={currentSlide.image} 
              alt={currentSlide.title}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(currentIndex)}
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-3 py-1 bg-[#00D4FF]/20 text-[#00D4FF] rounded-full text-sm font-semibold mb-3 backdrop-blur-sm border border-[#00D4FF]/30">
                Cisco {currentSlide.tag}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {currentSlide.title}
              </h2>
              <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg">
                {currentSlide.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Learn More →
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 backdrop-blur-sm z-20"
      >
        <FaArrowLeft className="text-xl" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 backdrop-blur-sm z-20"
      >
        <FaArrowRight className="text-xl" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 h-2 bg-[#00D4FF] rounded-full' 
                : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm backdrop-blur-sm z-20">
        {currentIndex + 1} / {slides.length}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute bottom-4 right-4 bg-black/50 px-2 py-1 rounded-full text-white text-xs backdrop-blur-sm z-20">
        {isPaused ? '⏸️ Paused' : '▶️ Auto'}
      </div>
    </div>
  );
}