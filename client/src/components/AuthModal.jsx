import React, { useState, useEffect } from 'react';

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { 
      id: 1, 
      title: 'Cisco Network Solutions', 
      description: 'Enterprise-grade routing and switching',
      bg: 'from-blue-600 to-cyan-500',
      icon: '🌐'
    },
    { 
      id: 2, 
      title: 'Network Security', 
      description: 'Protect your infrastructure with Cisco security',
      bg: 'from-purple-600 to-pink-500',
      icon: '🔒'
    },
    { 
      id: 3, 
      title: 'Wireless Connectivity', 
      description: 'Seamless Cisco wireless solutions',
      bg: 'from-green-600 to-teal-500',
      icon: '📶'
    },
    { 
      id: 4, 
      title: 'Data Center Solutions', 
      description: 'Cisco data center and cloud networking',
      bg: 'from-orange-600 to-red-500',
      icon: '☁️'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-4">Our Network Solutions</h2>
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } bg-gradient-to-r ${slide.bg}`}
          >
            <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
              <div className="text-6xl mb-4">{slide.icon}</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">{slide.title}</h2>
              <p className="text-xl md:text-2xl text-white/90">{slide.description}</p>
              <div className="mt-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                Cisco Powered Network
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={() => goToSlide((currentIndex - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
        >
          ◀
        </button>
        <button
          onClick={() => goToSlide((currentIndex + 1) % slides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
        >
          ▶
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentIndex ? 'w-10 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded-full text-white text-sm z-10 backdrop-blur-sm">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}