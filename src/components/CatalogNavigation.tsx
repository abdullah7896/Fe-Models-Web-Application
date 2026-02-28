import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CATEGORY_CONFIG } from '../utils/categories';

interface CatalogItem {
  name: string;
  subcategories: string[];
}

export function CatalogNavigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const catalogs: CatalogItem[] = Object.entries(CATEGORY_CONFIG).map(([key, value]) => ({
    name: key,
    subcategories: value.subcategories
  }));

  const handleMouseEnter = (catalogName: string) => {
    setActiveDropdown(catalogName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="relative z-20 bg-black/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-8 py-3 overflow-x-auto">
          {catalogs.map((catalog) => (
            <div
              key={catalog.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(catalog.name)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Main Category */}
              <div className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors cursor-pointer whitespace-nowrap px-3 py-2">
                <span className="text-sm font-medium">{catalog.name}</span>
                <ChevronDown className="w-3 h-3" />
              </div>

              {/* Dropdown Menu */}
              {activeDropdown === catalog.name && (
                <div className="absolute top-full left-0 mt-1 bg-black/90 backdrop-blur-sm rounded-md shadow-lg min-w-[200px] z-30">
                  <div className="py-2">
                    {catalog.subcategories.map((subcategory) => (
                      <a
                        key={subcategory}
                        href="#"
                        className="block px-4 py-2 text-sm text-white hover:text-yellow-400 hover:bg-white/5 transition-colors"
                      >
                        {subcategory}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}