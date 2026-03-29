import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, Users, Star, Sparkles, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

import { motion } from 'motion/react';

// Import client logos
import dongfengLogo from '../assets/00db159a556cbdc692cb670efe34943b586de999.png';
import bmwLogo from '../assets/91958f8b0edd170aa2f8d28975444e2107b6599d.png';
import shpperLogo from '../assets/45c0829021bb3813d8c292d23b60e4f4091644ee.png';

// Founder image
import founderImage from '../assets/IMG_8409.JPG.jpeg';

// Create array with all client logos
const clientLogos = [
  { id: 1, src: dongfengLogo, alt: 'Dongfeng' },
  { id: 2, src: bmwLogo, alt: 'BMW' },
  { id: 3, src: shpperLogo, alt: 'Shpper' },
  { id: 4, src: dongfengLogo, alt: 'Client 4' },
  { id: 5, src: bmwLogo, alt: 'Client 5' },
  { id: 6, src: shpperLogo, alt: 'Client 6' },
  { id: 7, src: dongfengLogo, alt: 'Client 7' },
  { id: 8, src: bmwLogo, alt: 'Client 8' },
  { id: 9, src: shpperLogo, alt: 'Client 9' },
  { id: 10, src: dongfengLogo, alt: 'Client 10' },
  { id: 11, src: bmwLogo, alt: 'Client 11' },
  { id: 12, src: shpperLogo, alt: 'Client 12' },
  { id: 13, src: dongfengLogo, alt: 'Client 13' },
  { id: 14, src: bmwLogo, alt: 'Client 14' },
  { id: 15, src: shpperLogo, alt: 'Client 15' },
  { id: 16, src: dongfengLogo, alt: 'Client 16' },
  { id: 17, src: bmwLogo, alt: 'Client 17' },
  { id: 18, src: shpperLogo, alt: 'Client 18' },
  { id: 19, src: dongfengLogo, alt: 'Client 19' },
  { id: 20, src: bmwLogo, alt: 'Client 20' },
];

export function AboutUs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);



  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % clientLogos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, clientLogos.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % clientLogos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + clientLogos.length) % clientLogos.length);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-40 left-20 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

          {/* Hero Section with Title */}
          <motion.div
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 text-sm tracking-widest uppercase">Discover Our Story</span>
              </div>
            </motion.div>
            <motion.h1
              className="text-yellow-500 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              About Faizaan Events
            </motion.h1>
            <motion.p
              className="text-white/60 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Where creativity meets excellence in event planning and talent management
            </motion.p>
          </motion.div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-24">
            {[
              { icon: Award, value: '12+', label: 'Years Experience' },
              { icon: Users, value: '500+', label: 'Talents Managed' },
              { icon: Star, value: '1000+', label: 'Events Delivered' },
              { icon: Sparkles, value: '50+', label: 'Brand Partners' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-yellow-500/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:transform hover:scale-105"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mb-4 mx-auto" />
                  <div className="text-center">
                    <div className="text-yellow-500 mb-2">{stat.value}</div>
                    <div className="text-white/60 text-sm sm:text-base">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Founder Section */}
          <motion.div
            className="mb-20 sm:mb-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Founder Image */}
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="relative max-w-lg mx-auto group">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden border-4 border-yellow-500/30 shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                    <img
                      src={founderImage}
                      alt="Faizan Saeed - Founder and Chairman"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative floating elements */}
                  <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-3xl -z-10 blur-xl"></div>
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-3xl -z-10 blur-xl"></div>

                  {/* Floating badge */}
                  <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md border border-yellow-500/30 rounded-2xl px-6 py-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-yellow-500 text-sm">12+ Years</p>
                        <p className="text-white/60 text-xs">Industry Leader</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Founder Content */}
              <motion.div
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="space-y-6">
                  <div>
                    <div className="inline-block mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2">
                      <span className="text-yellow-500 text-xs tracking-widest uppercase">Our Founder</span>
                    </div>
                    <h2 className="text-yellow-500 mb-3">
                      Faizan Saeed
                    </h2>
                    <p className="text-yellow-500/80 text-xl sm:text-2xl italic mb-2">
                      Founder and Chairman
                    </p>
                    <p className="text-white/50 text-lg">
                      Faizaan Events & Femodels
                    </p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-yellow-500/50 via-yellow-500/20 to-transparent"></div>

                  <div className="space-y-5 text-white/70 leading-relaxed text-base sm:text-lg">
                    <p>
                      Welcome to Faizaan Events! Faizan Saeed, the founder and chairman of this dynamic company. With over <span className="text-yellow-500">12 years of experience</span>, he is passionate about transforming the event planning and modeling industry.
                    </p>

                    <p>
                      He believes in innovation and constantly challenging the norm. His hands-on leadership style combines a commitment to excellence with a belief in perseverance. He strive to inspire his team, creating an environment that fosters <span className="text-yellow-500">accountability, creativity, and growth</span>.
                    </p>

                    <p>
                      Under his guidance, Faizaan Events has evolved into one of the most trusted names in the region, built on the pillars of <span className="text-yellow-500">trust, integrity, and progress</span>. Thank you for visiting our website, and we look forward to creating unforgettable experiences together!
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div
            className="mb-20 sm:mb-28"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 text-sm tracking-widest uppercase">Why Choose Us</span>
                </div>
              </div>
              <h2 className="text-yellow-500 mb-4">
                What Sets Us Apart
              </h2>
              <p className="text-white/60 max-w-3xl mx-auto text-lg">
                Delivering excellence through innovation, expertise, and unwavering commitment to our clients
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: 'Diverse Talent Portfolio',
                  description: 'Access to an extensive roster of professional models, influencers, stylists, and photographers across multiple categories including fashion, lifestyle, Arabic, Emirati, and more.',
                  icon: '👥'
                },
                {
                  title: 'Industry Expertise',
                  description: 'With over 12 years in the industry, we bring unparalleled knowledge and connections to ensure your event or campaign exceeds expectations.',
                  icon: '🎯'
                },
                {
                  title: 'End-to-End Solutions',
                  description: 'From talent booking and event planning to production and execution, we provide comprehensive services tailored to your specific needs.',
                  icon: '⚡'
                },
                {
                  title: 'Quality Assurance',
                  description: 'Every talent in our roster is carefully vetted and professionally managed to guarantee the highest standards of professionalism and performance.',
                  icon: '✨'
                },
                {
                  title: 'Regional Leadership',
                  description: 'Recognized as one of the most trusted names in the region, serving prestigious brands and delivering exceptional results consistently.',
                  icon: '🏆'
                },
                {
                  title: 'Personalized Service',
                  description: 'We understand that every client is unique. Our dedicated team works closely with you to create customized solutions that align with your vision.',
                  icon: '💎'
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-yellow-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-yellow-500 text-xl mb-3">{feature.title}</h3>
                    <p className="text-white/60 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Our Services Section */}
          <motion.div
            className="mb-20 sm:mb-28"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 text-sm tracking-widest uppercase">Our Services</span>
                </div>
              </div>
              <h2 className="text-yellow-500 mb-4">
                Comprehensive Talent & Event Solutions
              </h2>
              <p className="text-white/60 max-w-3xl mx-auto text-lg">
                Professional services designed to elevate your brand and create memorable experiences
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Model & Talent Management',
                  items: ['Professional Models (Men, Women, Kids, Old)', 'Actors & Performers', 'Fitness & GCC Nationals', 'Social Media Influencers', 'Content Creators & YouTubers']
                },
                {
                  title: 'Event Planning & Production',
                  items: ['Corporate Events & Conferences', 'Fashion Shows & Runway Events', 'Product Launches', 'Brand Activations', 'Private & VIP Events']
                },
                {
                  title: 'Production Services',
                  items: ['VFX & Video Editing', 'Professional Photography & Videography', 'DOP Services', 'Studio Rentals & Equipment', 'Post-Production']
                },
                {
                  title: 'Creative & Artistic Services',
                  items: ['MUA & Hairstylists', 'Wardrobe & Fashion Stylists', 'Heena Artists', 'Set Designers', 'Creative Direction']
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-yellow-500/30 transition-all duration-300"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ borderColor: 'rgba(234, 179, 8, 0.5)' }}
                >
                  <h3 className="text-yellow-500 text-xl mb-6">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Clients Section */}
          <motion.div
            className="mb-20 sm:mb-28 border-t border-white/10 pt-16 sm:pt-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 text-sm tracking-widest uppercase">Trusted By</span>
                </div>
              </div>
              <h2 className="text-yellow-500 mb-4">
                Our Prestigious Clients
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">
                Partnering with leading brands and organizations across the region
              </p>
            </div>

            {/* Clients Carousel */}
            <div
              className="relative overflow-hidden bg-white/5 border border-white/10 rounded-3xl py-8"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Navigation Buttons - Desktop */}
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-yellow-500/30 shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-yellow-500/30 shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Carousel Track */}
              <div className="px-12 md:px-20">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out gap-4"
                    style={{
                      transform: `translateX(-${currentSlide * (100 / 6)}%)`,
                    }}
                  >
                    {[...clientLogos, ...clientLogos].map((client, index) => (
                      <div
                        key={`${client.id}-${index}`}
                        className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2"
                      >
                        <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-6 flex items-center justify-center h-32 border border-white/10 hover:border-yellow-500/30 group">
                          <img
                            src={client.src}
                            alt={client.alt}
                            className="max-w-full max-h-full object-contain transition-all duration-300 transform group-hover:scale-110"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Dots - Mobile */}
              <div className="flex md:hidden justify-center gap-2 mt-6">
                {clientLogos.slice(0, 10).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide % 10
                      ? 'bg-yellow-500 w-8'
                      : 'bg-white/30 hover:bg-white/50 w-2'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mission Statement - Enhanced */}
          <motion.div
            className="mb-20 sm:mb-28"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/30 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
              <div className="relative text-center max-w-4xl mx-auto">
                <div className="inline-block mb-6">
                  <div className="flex items-center gap-3 bg-yellow-500/20 border border-yellow-500/40 rounded-full px-6 py-3 backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-500 text-sm tracking-widest uppercase">Our Mission</span>
                  </div>
                </div>
                <h3 className="text-yellow-500 mb-6 text-3xl sm:text-4xl">
                  Driven by Excellence
                </h3>
                <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-8">
                  To provide exceptional event planning and modeling services that exceed expectations, foster creativity, and create unforgettable experiences through innovation, integrity, and unwavering commitment to excellence.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  {['Innovation', 'Integrity', 'Excellence', 'Creativity'].map((value, index) => (
                    <div key={index} className="bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-2 text-yellow-500">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer - Only for About Us page */}
        <footer className="bg-gradient-to-b from-transparent to-black/50 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

              {/* Company Info */}
              <div className="lg:col-span-2">
                <h3 className="text-yellow-500 mb-4">Faizaan Events & Femodels</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  Leading talent agency and event management company in the region, delivering exceptional experiences for over 12 years.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { Icon: Instagram, href: '#' },
                    { Icon: Facebook, href: '#' },
                    { Icon: Linkedin, href: '#' },
                    { Icon: Twitter, href: '#' },
                  ].map(({ Icon, href }, index) => (
                    <a
                      key={index}
                      href={href}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 flex items-center justify-center text-white/60 hover:text-yellow-500 transition-all duration-300"
                      aria-label="Social media link"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-yellow-500 mb-4">Contact Us</h4>
                <div className="space-y-4">
                  <a
                    href="mailto:Faizaansevents@gmail.com"
                    className="flex items-start gap-3 text-white/60 hover:text-yellow-500 transition-colors group"
                  >
                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <span className="text-sm break-all">Faizaansevents@gmail.com</span>
                  </a>
                  <a
                    href="mailto:Info@femodels.com"
                    className="flex items-start gap-3 text-white/60 hover:text-yellow-500 transition-colors group"
                  >
                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <span className="text-sm break-all">Info@femodels.com</span>
                  </a>
                  <div className="flex items-start gap-3 text-white/60">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <span className="text-sm">Dubai, United Arab Emirates</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-yellow-500 mb-4">Quick Links</h4>
                <div className="space-y-3">
                  {[
                    'Models',
                    'Production/Lifestyle',
                    'Cast',
                    'Influencers',
                    'Stylists',
                    'Photographers',
                  ].map((link, index) => (
                    <div key={index} className="text-white/60 hover:text-yellow-500 transition-colors text-sm cursor-pointer">
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
                <p>© 2024 Faizaan Events & Femodels. All rights reserved.</p>
                <div className="flex gap-6">
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
