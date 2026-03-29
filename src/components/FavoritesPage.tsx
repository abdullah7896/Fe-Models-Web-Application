import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, MapPin, Star, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { publicAnonKey, getBaseUrl } from '../utils/supabase/info';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './ui/pagination';

interface FavoritesPageProps {
  favorites: string[];
  toggleFavorite: (talentId: string) => void;
  onViewProfile: (talent: any) => void;
}

export function FavoritesPage({ favorites, toggleFavorite, onViewProfile }: FavoritesPageProps) {
  const [favoriteTalents, setFavoriteTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allApprovedApplications, setAllApprovedApplications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Fetch all approved applications on component mount
  useEffect(() => {
    fetchAllApprovedApplications();
  }, []);

  // Update favorite talents when favorites or applications change
  useEffect(() => {
    console.log('Favorites changed, updating talents for:', favorites);
    updateFavoriteTalents();
  }, [favorites, allApprovedApplications]);

  const fetchAllApprovedApplications = async () => {
    setLoading(true);

    try {
      // Fetch all approved models from public endpoint
      // Use fast SQL endpoint for better performance - request limit=500 to get all talents
      const response = await fetch(`${getBaseUrl()}/functions/v1/make-server-53cfc738/models/fast?limit=500`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched applications for favorites:', data);

      if (data.success && data.models) {
        // Data is already approved models from the backend
        setAllApprovedApplications(data.models);
      } else {
        console.log('No models found:', data);
        setAllApprovedApplications([]);
      }
    } catch (error) {
      console.error('Error fetching approved applications - Backend may not be running:', error);
      console.log('Please ensure the Supabase Edge Function is deployed.');
      setAllApprovedApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Utility function to extract first name from full name
  const getFirstName = (fullName: string): string => {
    if (!fullName || fullName.trim() === '') return '';
    const nameParts = fullName.trim().split(' ');
    return nameParts[0];
  };

  // Convert model to talent format for display
  const convertModelToTalent = (model: any) => {
    return {
      id: model.id,
      name: model.name,
      firstName: getFirstName(model.name),
      age: model.age || 'N/A',
      nationality: model.nationality || 'N/A',
      experience: 'Professional',
      specializations: ['Professional Services'],
      height: 'N/A',
      chest: 'N/A',
      waist: 'N/A',
      hips: 'N/A',
      location: model.location || 'N/A',
      rating: 5.0,
      image: model.signedImageUrls?.[0] || '',
      signedImageUrls: model.signedImageUrls || [],
      catalog: model.catalog,
      subcategory: model.subcategory,
      email: model.email,
      phone: '',
      gender: model.gender,
      instagramURL: model.instagramURL,
      showreelURL: model.showreelURL,
      signedCastingVideoUrl: model.signedCastingVideoUrl
    };
  };

  const updateFavoriteTalents = () => {
    if (favorites.length === 0) {
      setFavoriteTalents([]);
      setCurrentPage(1);
      return;
    }

    // Convert all approved models to talent format
    const allTalents = allApprovedApplications.map(convertModelToTalent);

    // Filter to only include favorited talents
    const filtered = allTalents.filter(talent => favorites.includes(talent.id));

    console.log('All talents:', allTalents.length);
    console.log('Filtered favorite talents:', filtered.length);
    console.log('Favorite IDs:', favorites);
    console.log('Sample favorite talent:', filtered[0]);

    setFavoriteTalents(filtered);
    setCurrentPage(1);
  };

  const generateWhatsAppMessage = () => {
    if (favoriteTalents.length === 0) return '';

    const talentList = favoriteTalents.map(talent =>
      `• ${talent.name} (${talent.catalog} - ${talent.subcategory})`
    ).join('\n');

    return `Hello! I'm interested in booking the following talents from Faizaan Events Models:\n\n${talentList}\n\nCould you please provide more details about availability and rates?\n\nThank you!`;
  };

  const handleBookNow = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/971545381138?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Pagination calculations
  const totalPages = Math.ceil(favoriteTalents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTalents = favoriteTalents.slice(startIndex, endIndex);
  const showPagination = favoriteTalents.length > itemsPerPage;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              size="icon"
              onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
              isActive={currentPage === i}
              className={`cursor-pointer ${currentPage === i ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-white hover:bg-white/10'}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            size="icon"
            onClick={(e) => { e.preventDefault(); handlePageChange(1); }}
            isActive={currentPage === 1}
            className={`cursor-pointer ${currentPage === 1 ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-white hover:bg-white/10'}`}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" className="text-white/60" />);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              size="icon"
              onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
              isActive={currentPage === i}
              className={`cursor-pointer ${currentPage === i ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-white hover:bg-white/10'}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" className="text-white/60" />);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            size="icon"
            onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}
            isActive={currentPage === totalPages}
            className={`cursor-pointer ${currentPage === totalPages ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-white hover:bg-white/10'}`}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-white/60">Loading favorites...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 sm:py-8 bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl text-white mb-2">My Favourites</h1>
              <p className="text-sm sm:text-base text-white/70">
                {favoriteTalents.length} {favoriteTalents.length === 1 ? 'talent' : 'talents'} saved
                {showPagination && ` (Page ${currentPage} of ${totalPages})`}
              </p>
            </div>
            {favoriteTalents.length > 0 && (
              <Button
                onClick={handleBookNow}
                className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2 focus:outline-none focus:ring-0 active:ring-0 w-full sm:w-auto text-sm"
                size="sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Book Now via WhatsApp</span>
                <span className="sm:hidden">Book via WhatsApp</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {favoriteTalents.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl text-white mb-2">No favourites yet</h3>
              <p className="text-sm sm:text-base text-white/60">
                Browse our talent and click the heart icon to add them to your favourites.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {paginatedTalents.map((talent) => (
                  <Card key={talent.id} className="bg-gray-900 border-white/10 overflow-hidden hover:border-yellow-500/50 transition-colors">
                    <div className="relative aspect-[3/4]">
                      <ImageWithFallback
                        src={talent.image}
                        alt={talent.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleFavorite(talent.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors focus:outline-none focus:ring-0 active:ring-0"
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </button>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg text-white">{talent.firstName || talent.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-white/60 ml-1">{talent.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-white/60 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {talent.location}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Category:</span>
                          <span className="text-white">{talent.catalog}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Age:</span>
                          <span className="text-white">{talent.age}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Nationality:</span>
                          <span className="text-white">{talent.nationality}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Experience:</span>
                          <span className="text-white">{talent.experience}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-white/60 mb-2">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {talent.specializations.slice(0, 3).map((spec: string, index: number) => (
                            <Badge key={index} className="text-xs bg-black border border-white/20 text-white">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black focus:outline-none focus:ring-0 active:ring-0"
                          onClick={() => onViewProfile(talent)}
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-3 border-white/20 text-white hover:bg-white/10 focus:outline-none focus:ring-0 active:ring-0"
                          onClick={() => toggleFavorite(talent.id)}
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {showPagination && (
                <div className="mt-8 sm:mt-12">
                  <Pagination>
                    <PaginationContent className="flex-wrap gap-1 sm:gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          size="default"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                          className={`cursor-pointer text-white hover:bg-white/10 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </PaginationItem>

                      {renderPaginationItems()}

                      <PaginationItem>
                        <PaginationNext
                          size="default"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                          className={`cursor-pointer text-white hover:bg-white/10 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* Book All Button */}
              <div className="mt-8 sm:mt-12 text-center">
                <Button
                  onClick={handleBookNow}
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg flex items-center gap-2 sm:gap-3 mx-auto focus:outline-none focus:ring-0 active:ring-0"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Book All {favoriteTalents.length} Talents via WhatsApp</span>
                  <span className="sm:hidden">Book {favoriteTalents.length} via WhatsApp</span>
                </Button>
                <p className="text-white/60 mt-2 sm:mt-3 text-xs sm:text-sm px-4">
                  This will open WhatsApp with a pre-filled message containing all your favourite talents
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}