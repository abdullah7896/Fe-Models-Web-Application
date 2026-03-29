import { useState } from 'react';
import { ArrowLeft, Heart, Star, MapPin, User, Mail, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface SimpleProfilePageProps {
  favorites: string[];
  toggleFavorite: (talentId: string) => void;
}

export function SimpleProfilePage({ favorites, toggleFavorite }: SimpleProfilePageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  useParams<{ id: string; }>();

  // Try to get talent from location state, fallback to basic object if only ID (would need fetch in real app)
  const talent = location.state?.talent;

  // If no talent data, we should probably fetch it or show error. 
  // For now, if no talent, show not found.
  // In a real implementation, we would fetch from Supabase using the ID.

  if (!talent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Profile not found</h3>
          <p className="text-white/60 mb-4">The requested talent profile could not be found.</p>
          <Button onClick={() => navigate(-1)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const images = Array.isArray(talent?.signedImageUrls) ? talent.signedImageUrls : [];

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


  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
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
                  {images.map((image: string, index: number) => (
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
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {talent.location || 'Location not specified'}
                      </div>
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

              {/* Casting Video */}
              {talent?.signedCastingVideoUrl && (
                <Card className="bg-gray-900 border-white/10">
                  <CardContent className="p-4">
                    <h3 className="text-lg text-white mb-3">Casting Video</h3>
                    <div className="rounded-lg overflow-hidden border border-white/10">
                      <video 
                        src={talent.signedCastingVideoUrl} 
                        controls 
                        className="w-full h-auto aspect-video bg-black"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </CardContent>
                </Card>
              )}

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

                {/* <div className="grid grid-cols-1 gap-3">
                  {talent.showreelURL && (
                    <Button 
                      onClick={handleShowreel}
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10 focus:outline-none focus:ring-0 active:ring-0"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Showreel
                    </Button>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}