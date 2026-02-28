import React from 'react';

export function Navigation() {
  const categories = [
    'MODELS',
    'LIFESTYLE', 
    'CAST',
    'INFLUENCERS',
    'STYLISTS',
    'PHOTOGRAPHERS'
  ];

  return (
    <nav className="bg-black/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto">
          {categories.map((category) => (
            <a
              key={category}
              href="#"
              className="text-white hover:text-yellow-400 transition-colors whitespace-nowrap px-4 py-2 text-sm font-medium"
            >
              {category}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}