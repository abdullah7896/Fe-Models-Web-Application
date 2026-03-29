import { useState, useEffect } from 'react';
import { Search, Grid, List, Heart, Star, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { publicAnonKey, getBaseUrl } from '../utils/supabase/info';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from './ui/pagination';

interface SearchResultsPageProps {
  favorites: string[];
  toggleFavorite: (talentId: string) => void;
}

export function SearchResultsPage({ favorites, toggleFavorite }: SearchResultsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValue = searchParams.get('q') || '';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [approvedApplications, setApprovedApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const setSearchValue = (value: string) => {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  // Fetch approved applications on component mount
  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  const fetchApprovedApplications = async () => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.models) {
        setApprovedApplications(data.models);
      } else {
        setApprovedApplications([]);
      }
    } catch (error) {
      console.error('Error fetching approved applications:', error);
      setApprovedApplications([]);
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
      image: model.signedImageUrls?.[0] || '',
      signedImageUrls: model.signedImageUrls || [],
      categories: [model.subcategory],
      location: model.location || 'N/A',
      status: model.status || 'Available',
      age: model.age || 'N/A',
      nationality: model.nationality || 'N/A',
      experience: 'Professional',
      specializations: ['Professional Services'],
      rating: 5.0,
      mainCategory: model.catalog,
      catalog: model.catalog,
      subcategory: model.subcategory,
      email: model.email,
      gender: model.gender,
      instagram: model.instagramURL,
      showreel: model.showreelURL,
      signedCastingVideoUrl: model.signedCastingVideoUrl,
      description: model.description
    };
  };

  const allTalents = approvedApplications.map(convertModelToTalent);

  const filteredTalents = allTalents.filter(talent => {
    if (searchValue === '') return true;

    const searchTerm = searchValue.toLowerCase();
    return (
      talent.name.toLowerCase().includes(searchTerm) ||
      talent.location.toLowerCase().includes(searchTerm) ||
      talent.nationality.toLowerCase().includes(searchTerm) ||
      talent.mainCategory?.toLowerCase().includes(searchTerm) ||
      talent.categories.some((cat: string) => cat?.toLowerCase().includes(searchTerm)) ||
      talent.specializations.some((spec: string) => spec?.toLowerCase().includes(searchTerm))
    );
  });

  const totalPages = Math.ceil(filteredTalents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTalents = filteredTalents.slice(startIndex, endIndex);
  const showPagination = filteredTalents.length > itemsPerPage;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

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
      // Simple pagination for now
      items.push(<PaginationItem key={1}><PaginationLink size="icon" onClick={() => handlePageChange(1)} isActive={currentPage === 1}>1</PaginationLink></PaginationItem>);
      items.push(<PaginationItem key={totalPages}><PaginationLink size="icon" onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>{totalPages}</PaginationLink></PaginationItem>);
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Search Header */}
      <div className="px-4 sm:px-6 py-4 bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl text-white mb-1">Search Results</h1>
              <p className="text-sm sm:text-base text-white/70 truncate">
                {searchValue ? `Results for "${searchValue}"` : 'All talent'}
              </p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button size="icon" variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
              <Button size="icon" variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="relative max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search talent, location, skills..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-800 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm sm:text-base text-white/60">
            {loading ? 'Loading...' : `${filteredTalents.length} ${filteredTalents.length === 1 ? 'result' : 'results'} found`}
            {searchValue && ` for "${searchValue}"`}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-white/60">Loading talent...</p>
            </div>
          ) : filteredTalents.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl text-white mb-2">No results found</h3>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
                {paginatedTalents.map((talent) => (
                  <Card key={talent.id} className={`bg-gray-900 border-white/10 overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                      <div className={`relative ${viewMode === 'list' ? 'h-full' : 'aspect-[3/4]'}`}>
                        <ImageWithFallback src={talent.image} alt={talent.name} className="w-full h-full object-cover" />
                        <button onClick={() => toggleFavorite(talent.id)} className="absolute top-3 right-3 p-2 rounded-full bg-black/50">
                          <Heart className={`w-4 h-4 ${favorites.includes(talent.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </button>
                      </div>
                    </div>

                    <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg text-white">{talent.firstName}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-white/60 ml-1">{talent.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-white/60 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {talent.location}
                      </div>

                      <div className="space-y-2 mb-3">
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
                        <Link to={`/profile/${talent.id}`} state={{ talent }} className="flex-1">
                          <Button size="sm" className="w-full bg-yellow-500 text-black hover:bg-yellow-600">View Profile</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {showPagination && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          size="default"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? 'opacity-50 pointer-events-none text-white' : 'cursor-pointer text-white hover:bg-white/10'}
                        />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          size="default"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? 'opacity-50 pointer-events-none text-white' : 'cursor-pointer text-white hover:bg-white/10'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}