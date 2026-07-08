import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { publicAnonKey, getBaseUrl } from '../utils/supabase/info';
import { normalizeCategory } from '../utils/categories';

const FEATURED_COUNT = 8;

interface ShowcaseTalent {
  id: string;
  name: string;
  firstName: string;
  image: string;
  location: string;
  category: string;
  subcategory: string;
  profileState?: Record<string, unknown>;
}

function getFirstName(fullName: string): string {
  if (!fullName?.trim()) return '';
  return fullName.trim().split(' ')[0];
}

function modelToShowcase(model: Record<string, unknown>): ShowcaseTalent | null {
  const signedUrls = model.signedImageUrls as string[] | undefined;
  const image = signedUrls?.[0];
  if (!image) return null;

  const catalog = (model.catalog as string) || 'Models';
  const { category } = normalizeCategory(catalog, (model.subcategory as string) || '');

  return {
    id: model.id as string,
    name: (model.name as string) || 'Talent',
    firstName: getFirstName((model.name as string) || ''),
    image,
    location: (model.location as string) || 'Dubai, UAE',
    category: category || 'Models',
    subcategory: (model.subcategory as string) || '',
    profileState: {
      id: model.id,
      name: model.name,
      firstName: getFirstName((model.name as string) || ''),
      image,
      signedImageUrls: signedUrls || [],
      location: model.location || 'N/A',
      age: model.age || 'N/A',
      nationality: model.nationality || 'N/A',
      experience: 'Professional',
      catalog: (model.catalog as string)?.toUpperCase() || '',
      subcategory: model.subcategory,
      email: model.email,
      gender: model.gender,
      instagramURL: model.instagramURL,
      showreelURL: model.showreelURL,
      signedCastingVideoUrl: model.signedCastingVideoUrl,
      description: model.description,
      specializations: ['Professional Services'],
      rating: 5.0,
    },
  };
}

export function FeaturedTalentsSection() {
  const [talents, setTalents] = useState<ShowcaseTalent[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchFeatured() {
      try {
        const baseUrl = import.meta.env.DEV ? '' : getBaseUrl();
        const response = await fetch(
          `${baseUrl}/functions/v1/make-server-53cfc738/models/fast?limit=500`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        if (!data.success || !Array.isArray(data.models)) return;

        const live = data.models
          .map((m: Record<string, unknown>) => modelToShowcase(m))
          .filter(Boolean) as ShowcaseTalent[];

        if (cancelled) return;

        setTalents(live.slice(0, FEATURED_COUNT));
      } catch {
        if (!cancelled) setTalents([]);
      }
    }

    fetchFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="featured-talent" className="py-12 sm:py-16 lg:py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 sm:mb-5">
            <div className="flex items-center gap-2 sm:gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
              <span className="text-yellow-500 text-xs sm:text-sm tracking-widest uppercase">
                Featured Talent
              </span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Meet Our <span className="text-yellow-500">Top Models & Creatives</span>
          </h2>
          <p className="text-white/60 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
            A curated selection from our roster of professional models, actors, and creatives ready for your next campaign in Dubai and across the UAE.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {talents.slice(0, FEATURED_COUNT).map((talent, index) => (
            <motion.div
              key={talent.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <Link
                to={`/profile/${talent.id}`}
                state={{ talent: talent.profileState }}
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group-hover:border-yellow-500/50 transition-all duration-300 bg-white/5">
                  <ImageWithFallback
                    src={talent.image}
                    alt={talent.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                      {talent.firstName}
                    </h3>
                    <p className="text-yellow-500/90 text-xs truncate">{talent.subcategory}</p>
                    <div className="flex items-center gap-1 text-white/50 text-[10px] sm:text-xs mt-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{talent.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-8 sm:mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/category/Models">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold focus:outline-none focus:ring-0">
              Browse Full Roster
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
