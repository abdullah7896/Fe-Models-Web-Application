import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORY_CONFIG } from '../utils/categories';

export function NavigationWithDropdowns() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const currentCategory = location.pathname.startsWith('/category/') ? decodeURIComponent(location.pathname.split('/category/')[1]) : null;

  const categoryData = CATEGORY_CONFIG;
  const categories = Object.keys(categoryData);

  const calculateDropdownPosition = (category: string) => {
    const button = buttonRefs.current[category];
    if (button) {
      const rect = button.getBoundingClientRect();
      const dropdownWidth = 256;
      const viewportWidth = window.innerWidth;
      let left = rect.left;

      if (rect.left + dropdownWidth > viewportWidth - 16) {
        left = rect.right - dropdownWidth;
      } else if (categories.indexOf(category) === 0) {
        left = rect.left;
      } else {
        left = rect.left + (rect.width / 2) - (dropdownWidth / 2);
        left = Math.max(16, left);
      }

      return { top: rect.bottom + 2, left: left };
    }
    return null;
  };

  const handleCategoryMouseEnter = (category: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const position = calculateDropdownPosition(category);
    if (position) {
      setDropdownPosition(position);
      setOpenDropdown(category);
    }
  };

  const handleCategoryMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setDropdownPosition(null);
    }, 200);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    setOpenDropdown(null);
    setDropdownPosition(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-30 bg-black/90 backdrop-blur-lg border-b border-white/20 shadow-lg sticky-nav">
        <div className="w-full">
          <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 xl:space-x-8 py-2 sm:py-3 md:py-4 px-2 sm:px-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <div
                key={category}
                className="relative group flex-shrink-0"
                onMouseEnter={() => handleCategoryMouseEnter(category)}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <Link
                  to={`/category/${encodeURIComponent(category)}`}
                  className={`transition-colors whitespace-nowrap px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm font-medium rounded-md drop-shadow-lg focus:outline-none focus:ring-0 active:ring-0 no-blue-focus flex items-center gap-1 ${currentCategory === category
                    ? 'bg-yellow-500 text-black shadow-lg'
                    : 'text-white hover:text-yellow-400 hover:bg-white/20 backdrop-blur-sm'
                    }`}
                >
                  <span className="truncate max-w-[60px] sm:max-w-[80px] md:max-w-none">{category}</span>
                  <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 transition-transform ${openDropdown === category ? 'rotate-180' : ''}`} />
                </Link>
                <div ref={(el) => (buttonRefs.current[category] = el as unknown as HTMLButtonElement)} className="absolute inset-0 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </nav >

      {/* Dropdown Menu */}
      {
        openDropdown && dropdownPosition && (
          <div
            className="fixed w-56 sm:w-64 bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-[200] animate-in fade-in-0 zoom-in-95 duration-150"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${Math.max(8, Math.min(dropdownPosition.left, window.innerWidth - (window.innerWidth < 640 ? 232 : 264)))}px`,
              maxHeight: 'calc(100vh - 200px)',
              minWidth: 'max-content'
            }}
          >
            <div className="py-2">
              <div className="px-3 sm:px-4 py-2 border-b border-white/10">
                <h3 className="text-sm text-yellow-400 font-medium truncate">{openDropdown}</h3>
              </div>
              <div className="max-h-60 sm:max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20">
                {categoryData[openDropdown as keyof typeof categoryData].subcategories.map((subcategory) => (
                  <Link
                    key={subcategory}
                    to={`/category/${encodeURIComponent(openDropdown)}?subcategory=${encodeURIComponent(subcategory)}`}
                    onClick={() => {
                      setOpenDropdown(null);
                      setDropdownPosition(null);
                    }}
                    className="block w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white hover:bg-white/10 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-0 active:ring-0 no-blue-focus border-b border-white/5 last:border-b-0"
                  >
                    <span className="block truncate">{subcategory}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}