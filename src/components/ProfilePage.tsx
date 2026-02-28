import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Star, User, Mail, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProfilePageProps {
  talentId: string | null;
  onBack: () => void;
  favorites: string[];
  toggleFavorite: (talentId: string) => void;
}

export function ProfilePage({ talentId, onBack, favorites, toggleFavorite }: ProfilePageProps) {
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  useEffect(() => {
    if (talentId) {
      fetchTalentProfile();

      // Fallback timeout - if still loading after 15 seconds, force stop
      const fallbackTimeout = setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError('Loading took too long. Please try again.');
        }
      }, 15000);

      return () => clearTimeout(fallbackTimeout);
    } else {
      setLoading(false);
    }
  }, [talentId]);

  // Reset selected image index when talent changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [talent]);

  const fetchTalentProfile = async () => {
    if (!talentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use shorter timeout and race with a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000); // 5 second timeout
      });

      // Use fast SQL endpoint for better performance
      const fetchPromise = fetch(`https://${projectId}.supabase.co/functions/v1/make-server-53cfc738/models/fast`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched profile response:', data);

      if (data.success && data.models) {
        // Find the specific talent by ID
        const foundTalent = data.models.find((model: any) => model.id === talentId);
        if (foundTalent) {
          setTalent(foundTalent);
          setError(null);
        } else {
          console.error('Talent not found with ID:', talentId);
          setError('Profile not found');
          setTalent(null);
        }
      } else {
        console.log('No models found:', data);
        setError('No data available');
        setTalent(null);
      }
    } catch (error) {
      console.error('Error fetching talent profile:', error);
      if (error instanceof Error && error.message === 'Request timeout') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError('Failed to load profile. Please try again.');
      }

      // Create a fallback mock profile to prevent complete failure
      const mockTalent = {
        id: talentId,
        name: 'Profile Loading...',
        location: 'Location not available',
        age: 'N/A',
        gender: 'N/A',
        nationality: 'N/A',
        catalog: 'MODELS',
        subcategory: 'General',
        status: 'Available',
        email: '',
        signedImageUrls: [],
        instagramURL: '',
        showreelURL: '',
        description: 'Profile information is temporarily unavailable. Please try again later.'
      };
      setTalent(mockTalent);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${talent?.name} - Profile`,
        text: `Check out ${talent?.name}'s profile on Faizaan Events Models`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handleContact = () => {
    if (talent?.name) {
      const message = `Hello! I'm interested in booking ${talent.name} from Faizaan Events Models.\n\nCatalog: ${talent.catalog}\nCategory: ${talent.subcategory}\n\nCould you please provide availability and rates?\n\nThank you!`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/971545381138?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!talent && !loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">
            {error ? 'Error Loading Profile' : 'Profile not found'}
          </h3>
          <p className="text-white/60 mb-4">
            {error || 'The requested talent profile could not be found.'}
          </p>
          <div className="space-y-2">
            <Button onClick={onBack} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Go Back
            </Button>
            {error && retryCount < maxRetries && (
              <Button
                onClick={() => {
                  setError(null);
                  setRetryCount(prev => prev + 1);
                  if (talentId) {
                    fetchTalentProfile();
                  }
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Try Again ({maxRetries - retryCount} attempts left)
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(talent?.signedImageUrls) ? talent.signedImageUrls : [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors focus:outline-none focus:ring-0 active:ring-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-0 active:ring-0"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleFavorite(talent.id)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-0 active:ring-0"
            >
              <Heart
                className={`w-5 h-5 ${favorites.includes(talent.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-900">
                {images.length > 0 ? (
                  <ImageWithFallback
                    src={images[selectedImageIndex] || images[0]}
                    alt={talent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors focus:outline-none focus:ring-0 active:ring-0 ${selectedImageIndex === index ? 'border-yellow-500' : 'border-white/20 hover:border-white/40'
                        }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${talent.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl text-white mb-2">{talent.name}</h1>
                    <div className="flex items-center space-x-4 text-white/60">
                      {/* <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {talent.location || 'Location not specified'}
                      </div> */}
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    {talent.status || 'Available'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                    {talent.catalog}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {talent.subcategory}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-900 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Age</span>
                      <span className="text-white">{talent.age || 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Gender</span>
                      <span className="text-white">{talent.gender || 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Nationality</span>
                      <span className="text-white">{talent.nationality || 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Experience</span>
                      <span className="text-white">Professional</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bio/Description */}
              {talent.description && (
                <Card className="bg-gray-900 border-white/10">
                  <CardContent className="p-4">
                    <h3 className="text-lg text-white mb-2">About</h3>
                    <p className="text-white/70 leading-relaxed">{talent.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills/Specializations */}
              <Card className="bg-gray-900 border-white/10">
                <CardContent className="p-4">
                  <h3 className="text-lg text-white mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-white/10 text-white">
                      {talent.subcategory}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white">
                      Professional Services
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleContact}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black focus:outline-none focus:ring-0 active:ring-0"
                  disabled={!talent.email}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact for Booking
                </Button>



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}