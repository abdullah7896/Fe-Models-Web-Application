import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../utils/categories';

export function SimpleNavigation() {
  const categories = CATEGORIES;
  const location = useLocation();
  const currentCategory = location.pathname.startsWith('/category/')
    ? decodeURIComponent(location.pathname.split('/category/')[1])
    : null;
  const isHomePage = location.pathname === '/';

  // If we are not on home and not on category page, maybe we shouldn't show this nav?
  // The original conditional was: if (currentPage !== 'home' && currentPage !== 'category') return null;
  // Let's replicate this check.
  if (!isHomePage && !currentCategory) {
    // Actually, we are manually placing this component in the routes where we want it in App.tsx.
    // So we don't strictly need this check if App.tsx controls visibility.
    // However, if it's used elsewhere, we can keep it safest.
    // But let's trust App.tsx placement for now.
  }

  return (
    <nav className={`relative z-10 border-b border-white/20 ${isHomePage
      ? 'bg-gradient-to-b from-black/30 via-black/20 to-transparent'
      : 'bg-gray-900'
      }`}>
      <div className="w-full">
        <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 xl:space-x-8 py-2 sm:py-3 md:py-4 px-2 sm:px-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
              className={`transition-colors whitespace-nowrap px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm font-medium rounded-md focus:outline-none focus:ring-0 active:ring-0 flex-shrink-0 ${isHomePage ? 'drop-shadow-lg' : ''
                } ${currentCategory === category
                  ? 'bg-yellow-500 text-black shadow-lg'
                  : `text-white hover:text-yellow-400 ${isHomePage
                    ? 'hover:bg-white/20 backdrop-blur-sm'
                    : 'hover:bg-white/10'
                  }`
                }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </nav >
  );
}