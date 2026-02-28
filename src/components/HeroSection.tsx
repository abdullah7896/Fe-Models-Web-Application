import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeroSectionProps {
  backgroundImage: string;
}

export function HeroSection({ backgroundImage }: HeroSectionProps) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`
      }}
    >
      <div className="text-center text-white max-w-4xl px-6">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          PREMIUM TALENT<br />
          AGENCY
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Discover exceptional talent across models, lifestyle, cast,<br />
          influencers, stylists, and photographers
        </p>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full"
          >
            Explore Talent
          </Button>
          
          <Input
            type="text"
            placeholder="Search talent..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-white/90 text-black placeholder-gray-500 border-0 rounded-full px-6 py-3 w-full sm:w-64"
          />
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center space-x-2 mt-16">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>
    </section>
  );
}