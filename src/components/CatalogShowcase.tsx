import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CATEGORY_CONFIG } from '../utils/categories';

interface CatalogShowcaseProps {
  searchValue: string;
}

export function CatalogShowcase({ searchValue }: CatalogShowcaseProps) {
  const catalogDescriptions = {
    'Models': 'Professional models for all industries',
    'PRODUCTION': 'Lifestyle talent and professionals',
    'Cast': 'Casting talent for all demographics',
    'Influencers': 'Digital content and social media experts',
    'Stylists': 'Creative styling professionals',
    'Photographers': 'Professional photography services'
  };

  const catalogImages = {
    'Models': 'https://images.unsplash.com/photo-1715541448446-3369e1cc0ee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBzdHVkaW98ZW58MXx8fHwxNzU2NjY3MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'PRODUCTION': 'https://images.unsplash.com/photo-1736580602037-5c1da2d7e388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjBzdHVkaW98ZW58MXx8fHwxNzU2NzA1OTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'Cast': 'https://images.unsplash.com/photo-1536744893946-206566e0b4fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBwaG90b2dyYXBoeSUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY2MDkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'Influencers': 'https://images.unsplash.com/photo-1662749409818-9ee02c0972da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN0aW5nJTIwZGlyZWN0b3IlMjBmaWxtfGVufDF8fHx8MTc1NjcwNTk5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'Stylists': 'https://images.unsplash.com/photo-1536744893946-206566e0b4fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBwaG90b2dyYXBoeSUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY2MDkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'Photographers': 'https://images.unsplash.com/photo-1736939666660-d4c776e0532c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMGhvc3Rlc3N8ZW58MXx8fHwxNzU2NzA2ODQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  };

  const catalogCards = Object.entries(CATEGORY_CONFIG).map(([key, value], index) => ({
    id: index + 1,
    title: value.title,
    description: catalogDescriptions[key as keyof typeof catalogDescriptions] || `Professional ${value.title.toLowerCase()} services`,
    categories: value.subcategories,
    image: catalogImages[key as keyof typeof catalogImages] || 'https://images.unsplash.com/photo-1715541448446-3369e1cc0ee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBzdHVkaW98ZW58MXx8fHwxNzU2NjY3MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }));

  const filteredCatalogs = catalogCards.filter(catalog => 
    searchValue === '' || 
    catalog.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    catalog.categories.some(cat => cat.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            PREMIUM TALENT<br />
            AGENCY
          </h1>
          <p className="text-base md:text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Discover exceptional talent across all our specialized catalogs
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCatalogs.map((catalog) => (
            <Card key={catalog.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={catalog.image}
                    alt={catalog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
                      {catalog.title}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-white mb-2">{catalog.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{catalog.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {catalog.categories.slice(0, 3).map((category) => (
                      <Badge 
                        key={category}
                        variant="outline" 
                        className="text-xs border-white/30 text-white/90 hover:border-yellow-400 hover:text-yellow-400"
                      >
                        {category}
                      </Badge>
                    ))}
                    {catalog.categories.length > 3 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs border-white/30 text-white/90"
                      >
                        +{catalog.categories.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCatalogs.length === 0 && (
          <div className="text-center text-white/70 py-16">
            <p>No catalogs found matching "{searchValue}"</p>
          </div>
        )}
      </div>
    </section>
  );
}