import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BackgroundCarouselProps {
  children: React.ReactNode;
}

export function BackgroundCarousel({ children }: BackgroundCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const backgroundImages = [
    'https://images.squarespace-cdn.com/content/v1/641d83d6a57ac33e0437be66/bb8182c8-f0d2-4af4-91dd-5db186814d74/image-asset.jpeg?format=2500w',
    'https://images.squarespace-cdn.com/content/v1/641d83d6a57ac33e0437be66/63cf9758-3eac-4b0f-811a-f06f8c91a5a1/image-asset.jpeg?format=2500w',
    'https://images.squarespace-cdn.com/content/v1/5e8396aa6996a547ca279a67/fc502408-573b-48f9-8f1d-2112ef48d865/model-portfolio.jpg',
    'https://wallpapercat.com/w/full/8/6/5/1224722-2560x1600-desktop-hd-fashion-model-background.jpg'
  ];

  // Auto-rotate slides every 6 seconds for better viewing time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <ImageWithFallback
              src={image}
              alt={`Professional model agency photo ${index + 1}`}
              className="w-full h-full object-cover transform scale-105 transition-transform duration-[15000ms] ease-out"
            />
            <div className="absolute inset-0"></div>
            <div className="absolute inset-0"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-3 px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${index === currentSlide
                ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30'
                : 'bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`View slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}