import { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import logo from '../assets/models.png';


interface HeaderProps {
  favoritesCount?: number;
}

export function Header({ favoritesCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-40   text-white px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="FE Models" className="h-10 sm:h-12 w-auto object-contain" style={{ width: '100px', height: '100px' }} />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" style={{ gap: '30px' }}>
          <Link to="/" className="text-sm font-medium hover:text-yellow-400 transition-colors">HOME</Link>
          <Link to="/about" className="text-sm font-medium hover:text-yellow-400 transition-colors">ABOUT US</Link>
          <Link to="/apply" className="text-sm font-medium hover:text-yellow-400 transition-colors">APPLY NOW</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-yellow-400 transition-colors">CONTACT</Link>
          <Link to="/faq" className="text-sm font-medium hover:text-yellow-400 transition-colors">FAQ</Link>

          <Link to="/favorites" className="flex items-center space-x-2 hover:text-yellow-400 transition-colors cursor-pointer">
            <div className="relative">
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">FAVOURITES</span>
          </Link>

          <Link to="/admin" className="text-sm font-medium hover:text-yellow-400 transition-colors">ADMIN</Link>
        </nav>

        {/* Mobile menu button */}
        <Button variant="outline" size="sm" className="md:hidden bg-white/10 border-white/20 text-white" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-4 h-4" />
        </Button>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden text-left">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed top-0 right-0 h-full w-64 max-w-full bg-black/95 backdrop-blur-md border-l border-white/20 shadow-2xl p-4">
              <div className="flex items-center justify-between mb-6">
                <span className="text-yellow-400 font-medium">Menu</span>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col space-y-4">


                <Link to="/" className="text-white hover:text-yellow-400 py-2 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
                <Link to="/about" className="text-white hover:text-yellow-400 py-2 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>ABOUT US</Link>
                <Link to="/apply" className="text-white hover:text-yellow-400 py-2 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>APPLY NOW</Link>
                <Link to="/contact" className="text-white hover:text-yellow-400 py-2 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>
                <Link to="/faq" className="text-white hover:text-yellow-400 py-2 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                <Link to="/favorites" className="text-white hover:text-yellow-400 py-2 border-b border-white/10 flex justify-between items-center" onClick={() => setMobileMenuOpen(false)}>
                  <span>FAVOURITES</span>
                  {favoritesCount > 0 && <span className="bg-yellow-500 text-black text-xs px-2 rounded-full">{favoritesCount}</span>}
                </Link>
                <Link to="/admin" className="text-white hover:text-yellow-400 py-2" onClick={() => setMobileMenuOpen(false)}>ADMIN</Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
