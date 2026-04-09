import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export function HomePage() {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 min-h-[calc(100vh-200px)]">
      <div className="text-center text-white max-w-4xl w-full">
        {/* Main Heading - SEO H1 */}
        <motion.h1
          className="text-5xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-5xl mb-4 sm:mb-6 leading-tight drop-shadow-2xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Top Modeling Agency in Dubai for Elite Talent
        </motion.h1>

        {/* Subtitle - SEO Paragraph */}
        <motion.p
          className="text-xs sm:text-sm md:text-base text-white/80 max-w-2xl mx-auto drop-shadow-lg px-4 leading-relaxed mb-8 sm:mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          As a trusted model agency in UAE, we represent exceptional talent across fashion, commercial, and digital industries. Recognised among the top modeling companies in Dubai, our agency connects professional models, actors, social media influencers, and creative artists with premium brands and global opportunities. With a strong presence as a leading modeling agency in Dubai, we deliver high-quality production support and talent solutions tailored to modern industry demands.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link to="/category/MODEL" className="w-full sm:w-auto">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 sm:px-8 py-2.5 sm:py-3 text-sm w-full focus:outline-none focus:ring-0 active:ring-0"
            >
              Explore Talent
            </Button>
          </Link>

          <Input
            type="text"
            placeholder="Search by name, category, location..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-white text-black placeholder-gray-500 border-0 px-3 sm:px-4 py-2.5 sm:py-3 w-full sm:w-64 focus:outline-none focus:ring-0 text-sm"
          />
        </motion.div>
      </div>
    </div>
  );
}
