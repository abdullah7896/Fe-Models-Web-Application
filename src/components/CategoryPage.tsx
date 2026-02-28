import React, { useState, useEffect } from 'react';
import { Search, Grid, List, User, Heart, Star, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { publicAnonKey, getBaseUrl } from '../utils/supabase/info';
import { CATEGORY_CONFIG, normalizeCategory } from '../utils/categories';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './ui/pagination';

interface CategoryPageProps {
  favorites: string[];
  toggleFavorite: (talentId: string) => void;
}

export function CategoryPage({ favorites, toggleFavorite }: CategoryPageProps) {
  const { category: routeCategory } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const routeSubcategory = searchParams.get('subcategory');
  // Use route parameter 'q' for search value
  const routeSearchValue = searchParams.get('q') || '';

  // Only normalize category, keep subcategory as-is from URL (don't let normalizeCategory set a default)
  const { category: normalizedCategory } = normalizeCategory(routeCategory || '', '');
  // Use the actual URL subcategory - null/empty means "All"
  const normalizedSubcategory = routeSubcategory || '';

  const [searchValue, setSearchValue] = useState(routeSearchValue);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [approvedApplications, setApprovedApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Sync state with URL search param
  useEffect(() => {
    setSearchValue(routeSearchValue);
  }, [routeSearchValue]);

  // Update selected subcategory when param changes
  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSubcategory]);

  // Fetch approved applications when category or subcategory changes
  useEffect(() => {
    fetchApprovedApplications();
  }, [normalizedCategory, normalizedSubcategory]);

  const fetchApprovedApplications = async () => {
    setLoading(true);

    if (!normalizedCategory) {
      setLoading(false);
      return;
    }

    try {
      // Use proxy URL for better connectivity
      const baseUrl = import.meta.env.DEV ? '' : getBaseUrl();

      // Use fast SQL endpoint for better performance
      // Request all talents (limit=500) and filter client-side for flexibility
      const response = await fetch(`${baseUrl}/functions/v1/make-server-53cfc738/models/fast?limit=500`, {
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

  const categoryConfigs = CATEGORY_CONFIG;
  const currentCategory = categoryConfigs[normalizedCategory as keyof typeof categoryConfigs] || { title: normalizedCategory, subcategories: [] };

  const getFirstName = (fullName: string): string => {
    if (!fullName || fullName.trim() === '') return '';
    const nameParts = fullName.trim().split(' ');
    return nameParts[0];
  };

  const convertModelToTalent = (model: any) => {
    return {
      id: model.id,
      name: model.name,
      firstName: getFirstName(model.name),
      image: model.signedImageUrls?.[0] || '',
      signedImageUrls: model.signedImageUrls || [],
      categories: [model.subcategory, model.catalog],
      location: model.location || 'N/A',
      status: model.status || 'Available',
      age: model.age || 'N/A',
      nationality: model.nationality || 'N/A',
      experience: 'Professional',
      specializations: ['Professional Services'],
      rating: 5.0,
      catalog: model.catalog?.toUpperCase() || '',
      subcategory: model.subcategory,
      email: model.email,
      gender: model.gender,
      instagramURL: model.instagramURL,
      showreelURL: model.showreelURL,
      description: model.description
    };
  };

  const filteredModels = approvedApplications.filter(model => {
    const talent = convertModelToTalent(model);
    const { category: normalizedModelCategory } = normalizeCategory(model.catalog || '', model.subcategory || '');
    
    // Case-insensitive category comparison
    const matchesCategory = normalizedModelCategory.toLowerCase() === normalizedCategory.toLowerCase();

    // When normalizedSubcategory is empty ("All" selected), show all models in this category
    const matchesSubcategory = !normalizedSubcategory ||
      (talent.subcategory && talent.subcategory.toLowerCase() === normalizedSubcategory.toLowerCase()) ||
      (model.subcategory && model.subcategory.toLowerCase() === normalizedSubcategory.toLowerCase());

    const matchesSearch = searchValue === '' ||
      talent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (talent.location && talent.location.toLowerCase().includes(searchValue.toLowerCase())) ||
      (talent.nationality && talent.nationality.toLowerCase().includes(searchValue.toLowerCase()));

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const filteredTalents = filteredModels.map(convertModelToTalent);

  const totalPages = Math.ceil(filteredTalents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTalents = filteredTalents.slice(startIndex, endIndex);
  const showPagination = filteredTalents.length > itemsPerPage;

  useEffect(() => {
    setCurrentPage(1);
  }, [routeSearchValue, normalizedSubcategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(searchParams);
      if (searchValue.trim()) {
        params.set('q', searchValue);
      } else {
        params.delete('q');
      }
      setSearchParams(params);
    }
  };

  const handleSubcategoryClick = (sub: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (sub) {
      params.set('subcategory', sub);
    } else {
      params.delete('subcategory');
    }
    setSearchParams(params);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink size="icon" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i} className={currentPage === i ? 'bg-yellow-500 text-black' : 'text-white'}>{i}</PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Minimal pagination
      items.push(<PaginationItem key={1}><PaginationLink size="icon" onClick={() => handlePageChange(1)} isActive={currentPage === 1}>1</PaginationLink></PaginationItem>);
      if (currentPage > 3) items.push(<PaginationEllipsis key="e1" />);
      if (currentPage > 1 && currentPage < totalPages) items.push(<PaginationItem key={currentPage}><PaginationLink size="icon" isActive>{currentPage}</PaginationLink></PaginationItem>);
      if (currentPage < totalPages - 2) items.push(<PaginationEllipsis key="e2" />);
      items.push(<PaginationItem key={totalPages}><PaginationLink size="icon" onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>{totalPages}</PaginationLink></PaginationItem>);
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-white/60">
              <Link to="/" className="text-white hover:text-yellow-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-yellow-400">{currentCategory.title}</span>
              {normalizedSubcategory && (
                <>
                  <span>/</span>
                  <span className="text-yellow-400">{normalizedSubcategory}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8 bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="min-w-0 flex-1 flex items-center gap-4">
              <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="flex-shrink-0 border-yellow-500 text-white bg-white/10 hover:bg-white/20 hover:border-yellow-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl text-white mb-2 truncate">
                  {normalizedSubcategory || currentCategory.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-white/70">
                  {loading ? 'Loading talent...' : `${filteredTalents.length} talents available`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button size="icon" variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
              <Button size="icon" variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative max-w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search talent..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {currentCategory.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSubcategoryClick(null)}
                className={`px-3 sm:px-4 py-2 rounded-full text-sm transition-colors ${!normalizedSubcategory ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}
              >
                All
              </button>
              {currentCategory.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubcategoryClick(sub)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm transition-colors ${normalizedSubcategory === sub ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
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
            <div className="text-center py-12"><User className="w-16 h-16 text-white/20 mx-auto" /><h3 className="text-white mt-4">No talent found</h3></div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
                {paginatedTalents.map((talent, index) => (
                  <motion.div key={talent.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                    <Card className={`bg-gray-900 border-white/10 overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                      <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                        <div className={`relative ${viewMode === 'list' ? 'h-full' : 'aspect-[3/4]'}`}>
                          <ImageWithFallback src={talent.image} alt={talent.name} className="w-full h-full object-cover" />
                          <button onClick={() => toggleFavorite(talent.id)} className="absolute top-2 right-2 p-2 rounded-full bg-black/50">
                            <Heart className={`w-4 h-4 ${favorites.includes(talent.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                          </button>
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1">
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

                        <div className="flex gap-2 mt-4">
                          <Link to={`/profile/${talent.id}`} state={{ talent }} className="flex-1">
                            <Button size="sm" className="w-full bg-yellow-500 text-black hover:bg-yellow-600">View Profile</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
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