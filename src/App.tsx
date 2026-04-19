import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { BackgroundCarousel } from './components/BackgroundCarousel';
import { SimpleNavigation } from './components/SimpleNavigation';
import { NavigationWithDropdowns } from './components/NavigationWithDropdowns';
import { HomePage } from './components/HomePage';
import { CategoryPage } from './components/CategoryPage';
import { ApplyNowPage } from './components/ApplyNowPage';
import { FavoritesPage } from './components/FavoritesPage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { SimpleProfilePage } from './components/SimpleProfilePage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutUs } from './components/AboutUs';
import { ContactPage } from './components/ContactPage';
import { FAQPage } from './components/FAQPage';
import { Header } from './components/Header';

function AppContent() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const location = useLocation();

  const toggleFavorite = (talentId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(talentId)
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId];
      return newFavorites;
    });
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className={isHomePage ? "" : "min-h-screen bg-black"}>
      <Routes>
        <Route path="/" element={
          <BackgroundCarousel>
            <div className="min-h-screen">
              <HeaderWrapper favorites={favorites} />
              <NavigationWithDropdowns />
              <HomePage />
            </div>
          </BackgroundCarousel>
        } />

        <Route path="/admin" element={
          adminToken ? <AdminDashboard accessToken={adminToken} onLogout={handleAdminLogout} /> : <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
        } />

        <Route path="/category/:category" element={
          <div className="min-h-screen bg-black">
            <HeaderWrapper favorites={favorites} />
            <SimpleNavigation />
            <CategoryPage favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
        } />

        <Route path="/search" element={
          <div className="min-h-screen bg-black">
            <HeaderWrapper favorites={favorites} />
            <SearchResultsPage favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
        } />

        <Route path="/apply" element={
          <div className="min-h-screen bg-black">
            <HeaderWrapper favorites={favorites} />
            <ApplyNowPage />
          </div>
        } />

        <Route path="/favorites" element={
          <div className="min-h-screen bg-black">
            <HeaderWrapper favorites={favorites} />
            <FavoritesPage favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
        } />

        <Route path="/about" element={
          <div className="min-h-screen bg-black">
            <HeaderWrapper favorites={favorites} />
            <AboutUs />
          </div>
        } />

        <Route path="/contact" element={
          <div className="min-h-screen bg-black">
            <HeaderWrapper favorites={favorites} />
            <ContactPage />
          </div>
        } />

        <Route path="/faq" element={
          <div className="min-h-screen bg-black">
            <HeaderWrapper favorites={favorites} />
            <FAQPage />
          </div>
        } />

        <Route path="/profile/:id" element={
          <div className="min-h-screen bg-black">
            <HeaderWrapper favorites={favorites} />
            <SimpleProfilePage favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
        } />

      </Routes>
    </div>
  );
}

// Helper to avoid prop drilling header if possible, or just standard header
function HeaderWrapper({ favorites }: { favorites: string[] }) {
  return <Header favoritesCount={favorites.length} />;
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

