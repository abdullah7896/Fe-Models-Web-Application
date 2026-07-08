import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Award, Users, Star, Sparkles, Camera, Clapperboard, Palette,
  Share2, Music, UserCheck, ArrowRight, Mail, Phone, MapPin,
  Instagram, Facebook, Music2, Zap, Shield, Globe
} from 'lucide-react';
import { CATEGORY_CONFIG } from '../utils/categories';
import { FeaturedTalentsSection } from './FeaturedTalentsSection';

import dongfengLogo from '../assets/00db159a556cbdc692cb670efe34943b586de999.png';
import bmwLogo from '../assets/91958f8b0edd170aa2f8d28975444e2107b6599d.png';
import shpperLogo from '../assets/45c0829021bb3813d8c292d23b60e4f4091644ee.png';

// ─── Shared layout primitives (matches AboutUs / Contact aesthetic) ───

const SECTION_PY = 'py-12 sm:py-16 lg:py-20';
const CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
const CARD_BASE =
  'group relative bg-white/5 border border-white/10 hover:border-yellow-500/50 rounded-2xl transition-all duration-300';
const CARD_GLOW =
  'absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300';

function SectionBadge({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="inline-block mb-4 sm:mb-5">
      <div className="flex items-center gap-2 sm:gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
        <span className="text-yellow-500 text-xs sm:text-sm tracking-widest uppercase">{label}</span>
      </div>
    </div>
  );
}

function SectionHeader({
  badgeIcon,
  badge,
  title,
  titleAccent,
  description,
  delay = 0,
}: {
  badgeIcon: LucideIcon;
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="text-center mb-10 sm:mb-14 lg:mb-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay }}
    >
      <SectionBadge icon={badgeIcon} label={badge} />
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 leading-tight px-1">
        {title}{' '}
        <span className="text-yellow-500">{titleAccent}</span>
      </h2>
      <p className="text-white/60 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed px-1">
        {description}
      </p>
    </motion.div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────

const categoryShowcaseData = [
  {
    key: 'Models',
    icon: UserCheck,
    tagline: 'Professional fashion & commercial models in Dubai',
    description:
      'Access our diverse roster of elite male, female, kids, mature and fitness models for fashion shows, commercial shoots, and brand campaigns across the UAE.',
  },
  {
    key: 'Production',
    icon: Camera,
    tagline: 'Full-service production crew in UAE',
    description:
      'Professional DOP, photographers, videographers, VFX editors, drone operators, and complete equipment rental for your next production in Dubai.',
  },
  {
    key: 'Actor',
    icon: Clapperboard,
    tagline: 'Talented actors for film, TV & commercials',
    description:
      'Skilled male, female, child, teen, and mature actors including GCC nationals for television, film, commercial, and corporate video productions.',
  },
  {
    key: 'Social Media',
    icon: Share2,
    tagline: 'Influencers & content creators in Dubai',
    description:
      "Connect with top content creators, YouTubers, TikTokers, and social media influencers to amplify your brand's reach across the Middle East.",
  },
  {
    key: 'Creative Artist',
    icon: Palette,
    tagline: 'Makeup, hair & styling professionals',
    description:
      'Expert makeup artists, hair stylists, wardrobe stylists, and set designers to bring your creative vision to life with flawless execution.',
  },
  {
    key: 'MIX TALENTS',
    icon: Music,
    tagline: 'Entertainers, hosts & performers',
    description:
      'Dynamic hostesses, promoters, comedians, bouncers, dancers, and musicians for events, activations, and entertainment across Dubai & UAE.',
  },
];

const statsData = [
  { icon: Award, value: '12+', label: 'Years of Excellence' },
  { icon: Users, value: '500+', label: 'Talents Managed' },
  { icon: Star, value: '1000+', label: 'Events Delivered' },
  { icon: Sparkles, value: '50+', label: 'Brand Partners' },
];

const whyChooseData = [
  {
    icon: Globe,
    title: 'Diverse Talent Portfolio',
    description:
      "Access over 500 professional models, influencers, actors, and creative artists representing every ethnicity, body type, and specialization — perfectly matching Dubai's multicultural market.",
  },
  {
    icon: Shield,
    title: 'Industry Expertise Since 2009',
    description:
      'With 12+ years in the UAE market, our casting directors and talent managers bring unmatched knowledge of regional brand requirements, cultural nuances, and production logistics.',
  },
  {
    icon: Zap,
    title: '24-Hour Response & Booking',
    description:
      'Submit your casting brief and receive curated talent selections with full portfolios, availability, and rates within one business day — with same-day priority for urgent campaigns.',
  },
];

const servicesData = [
  {
    title: 'Model & Talent Management',
    icon: UserCheck,
    items: [
      'Professional Models (Men, Women, Kids, Mature)',
      'Actors & Performers for Film & TV',
      'Fitness Models & GCC Nationals',
      'Social Media Influencers & Creators',
    ],
  },
  {
    title: 'Event Planning & Production',
    icon: Clapperboard,
    items: [
      'Corporate Events & Conferences',
      'Fashion Shows & Runway Events',
      'Product Launches & Brand Activations',
      'Private & VIP Events in Dubai',
    ],
  },
  {
    title: 'Production Services',
    icon: Camera,
    items: [
      'Professional Photography & Videography',
      'VFX, Post-Production & Video Editing',
      'DOP Services & Drone Operations',
      'Studio & Equipment Rental',
    ],
  },
  {
    title: 'Creative & Artistic Services',
    icon: Palette,
    items: [
      'MUA & Professional Hairstylists',
      'Wardrobe & Fashion Stylists',
      'Set Designers & Art Directors',
      'Creative Direction & Consulting',
    ],
  },
];

const clientLogos = [
  { id: 1, src: dongfengLogo, alt: 'Dongfeng' },
  { id: 2, src: bmwLogo, alt: 'BMW' },
  { id: 3, src: shpperLogo, alt: 'Shpper' },
  { id: 4, src: dongfengLogo, alt: 'Client 4' },
  { id: 5, src: bmwLogo, alt: 'Client 5' },
  { id: 6, src: shpperLogo, alt: 'Client 6' },
  { id: 7, src: dongfengLogo, alt: 'Client 7' },
  { id: 8, src: bmwLogo, alt: 'Client 8' },
];

const quickLinks = [
  { label: 'Models', path: '/category/Models' },
  { label: 'Actors', path: '/category/Actor' },
  { label: 'Production', path: '/category/Production' },
  { label: 'Social Media', path: '/category/Social%20Media' },
  { label: 'About Us', path: '/about' },
  { label: 'Apply Now', path: '/apply' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
];

const socialLinks = [
  { Icon: Instagram, href: 'https://www.instagram.com/femodels/', label: 'Instagram' },
  { Icon: Facebook, href: 'https://www.facebook.com/FEModelsAgency', label: 'Facebook' },
  { Icon: Music2, href: 'https://www.tiktok.com/@femodels_dubai', label: 'TikTok' },
];

// =====================================================================
// Component
// =====================================================================

export function HomePageSections() {
  return (
    <div className="relative bg-black text-white">
      {/* Fade hero imagery into solid sections */}
      <div
        className="absolute top-0 left-0 right-0 h-20 sm:h-28 lg:h-32 bg-gradient-to-b from-black/0 via-black/80 to-black pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Ambient orbs — scoped to this block, not fixed viewport */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute -top-10 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 left-4 sm:left-20 w-40 sm:w-80 h-40 sm:h-80 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="relative z-10">
        <FeaturedTalentsSection />

        {/* ─── Talent Categories ─────────────────────────────────── */}
        <section id="talent-categories" className={`${SECTION_PY} border-t border-white/10`}>
          <div className={CONTAINER}>
            <SectionHeader
              badgeIcon={Users}
              badge="Our Talent"
              title="Explore Our"
              titleAccent="Talent Categories"
              description="As a premier model agency in Dubai, FEModels represents exceptional talent across six specialized categories — connecting brands with the perfect faces and skills for every campaign."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {categoryShowcaseData.map((cat, index) => {
                const Icon = cat.icon;
                const config = CATEGORY_CONFIG[cat.key as keyof typeof CATEGORY_CONFIG];
                return (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link
                      to={`/category/${encodeURIComponent(cat.key)}`}
                      className={`${CARD_BASE} block p-5 sm:p-6 lg:p-8 h-full hover:transform hover:scale-[1.02]`}
                    >
                      <div className={CARD_GLOW} />

                      <div className="relative">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors duration-300">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-yellow-500 transition-colors duration-300">
                              {cat.key}
                            </h3>
                            <p className="text-yellow-500/80 text-xs sm:text-sm leading-snug mt-0.5">
                              {cat.tagline}
                            </p>
                          </div>
                        </div>

                        <p className="text-white/60 text-sm leading-relaxed mb-4 sm:mb-5">
                          {cat.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                          {config.subcategories.slice(0, 4).map((sub) => (
                            <span
                              key={sub}
                              className="text-[10px] sm:text-[11px] tracking-wide text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1"
                            >
                              {sub}
                            </span>
                          ))}
                          {config.subcategories.length > 4 && (
                            <span className="text-[10px] sm:text-[11px] tracking-wide text-white/40 bg-white/5 border border-white/10 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1">
                              +{config.subcategories.length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                          <span>View Talent</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Statistics ────────────────────────────────────────── */}
        <section id="agency-stats" className={`${SECTION_PY} border-t border-white/10`}>
          <div className={CONTAINER}>
            <motion.div
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                Trusted by <span className="text-yellow-500">Leading Brands</span> Across the UAE
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-1">
                Numbers that reflect our commitment to excellence in talent management and event production in Dubai.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`${CARD_BASE} p-4 sm:p-6 lg:p-8 hover:transform hover:scale-105`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={CARD_GLOW} />
                  <div className="relative text-center">
                    <stat.icon className="w-7 h-7 sm:w-8 sm:h-10 text-yellow-500 mb-3 sm:mb-4 mx-auto" />
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-1 sm:mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/60 text-xs sm:text-sm lg:text-base leading-snug">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why Choose Us ─────────────────────────────────────── */}
        <section id="why-choose-us" className={`${SECTION_PY} border-t border-white/10`}>
          <div className={CONTAINER}>
            <SectionHeader
              badgeIcon={Star}
              badge="Why Choose Us"
              title="Why"
              titleAccent="FEModels is Dubai's Preferred Agency"
              description="As one of the top modeling companies in Dubai, we combine deep industry expertise with personalized service to deliver outstanding results for every client and talent."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {whyChooseData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    className={`${CARD_BASE} p-6 sm:p-8 lg:p-10`}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className={CARD_GLOW} />
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-yellow-500/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-yellow-500 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Services ──────────────────────────────────────────── */}
        <section id="our-services" className={`${SECTION_PY} border-t border-white/10`}>
          <div className={CONTAINER}>
            <SectionHeader
              badgeIcon={Sparkles}
              badge="Our Services"
              title="Comprehensive"
              titleAccent="Talent & Event Solutions"
              description="From model management and casting to full-scale event production, FEModels delivers end-to-end professional services designed to elevate your brand in the UAE market."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {servicesData.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    className={`${CARD_BASE} p-6 sm:p-8`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-yellow-500" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-yellow-500 leading-snug pt-1">
                        {service.title}
                      </h3>
                    </div>
                    <ul className="space-y-2.5 sm:space-y-3">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-white/70 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="mt-8 sm:mt-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                <Link to="/apply" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold focus:outline-none focus:ring-0">
                    Apply as Talent
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-yellow-500/50 px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold focus:outline-none focus:ring-0">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Client Logos ──────────────────────────────────────── */}
        <section id="our-clients" className={`${SECTION_PY} border-t border-white/10`}>
          <div className={CONTAINER}>
            <SectionHeader
              badgeIcon={Award}
              badge="Trusted By"
              title="Partnering with"
              titleAccent="Leading Brands"
              description="Trusted by prestigious brands and organizations across the Middle East for exceptional talent and event solutions."
            />

            <motion.div
              className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl py-6 sm:py-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

              <div className="homepage-marquee">
                <div className="homepage-marquee-track">
                  {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                    <div key={`${client.id}-${index}`} className="client-logo-slot">
                      <div className="client-logo-frame">
                        <img
                          src={client.src}
                          alt={client.alt}
                          className="client-logo-img"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA Banner ─────────────────────────────────────────── */}
        <section id="cta-banner" className={`${SECTION_PY} border-t border-white/10`}>
          <div className={CONTAINER}>
            <motion.div
              className="relative bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 xl:p-20 overflow-hidden text-center"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 sm:w-72 h-40 sm:h-72 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  Ready to Work with Dubai&apos;s{' '}
                  <span className="text-yellow-500">Premier Talent Agency?</span>
                </h2>
                <p className="text-white/70 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-1">
                  Whether you&apos;re a brand seeking exceptional talent for your next campaign or an aspiring model ready to launch your career, FEModels is here to make it happen.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                  <Link to="/apply" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black px-8 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-semibold focus:outline-none focus:ring-0 shadow-lg shadow-yellow-500/20">
                      Apply Now
                    </Button>
                  </Link>
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-yellow-500/50 px-8 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-semibold focus:outline-none focus:ring-0">
                      Book a Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Footer ─────────────────────────────────────────────── */}
        <footer className="bg-gradient-to-b from-transparent to-black/50 border-t border-white/10">
          <div className={`${CONTAINER} py-10 sm:py-12 lg:py-16`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10 sm:mb-12">
              <div className="sm:col-span-2">
                <h3 className="text-yellow-500 text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                  Faizaan Events & FEModels
                </h3>
                <p className="text-white/60 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Dubai&apos;s leading talent agency and event management company, delivering exceptional experiences and professional model management for over 12 years across the UAE.
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 flex items-center justify-center text-white/60 hover:text-yellow-500 transition-all duration-300"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-yellow-500 font-bold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h4>
                <div className="space-y-3 sm:space-y-4">
                  <a
                    href="mailto:info@femodels.com"
                    className="flex items-start gap-3 text-white/60 hover:text-yellow-500 transition-colors"
                  >
                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <span className="text-sm break-all">info@femodels.com</span>
                  </a>
                  <a
                    href="mailto:Faizaansevents@gmail.com"
                    className="flex items-start gap-3 text-white/60 hover:text-yellow-500 transition-colors"
                  >
                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <span className="text-sm break-all">Faizaansevents@gmail.com</span>
                  </a>
                  <a
                    href="tel:+971545381138"
                    className="flex items-start gap-3 text-white/60 hover:text-yellow-500 transition-colors"
                  >
                    <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <span className="text-sm">+971 54 538 1138</span>
                  </a>
                  <div className="flex items-start gap-3 text-white/60">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <span className="text-sm">Dubai, United Arab Emirates</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-yellow-500 font-bold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      className="text-white/60 hover:text-yellow-500 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 sm:pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/40 text-center sm:text-left">
                <p>© {new Date().getFullYear()} Faizaan Events & FEModels. All rights reserved.</p>
                <div className="flex gap-4 sm:gap-6">
                  <span className="hover:text-yellow-500 transition-colors cursor-pointer">Privacy Policy</span>
                  <span className="hover:text-yellow-500 transition-colors cursor-pointer">Terms of Service</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
