// components/Home/Hero.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineAcademicCap, 
  HiOutlineGlobeAlt, 
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineArrowLongRight,
  HiOutlinePlayCircle,
  HiOutlineUserGroup,
  HiOutlineBuildingLibrary
} from 'react-icons/hi2';
import { 
  PiGraduationCapLight, 
  PiBookOpenTextLight,
  PiMapPinLineLight 
} from 'react-icons/pi';
import { 
  TbSchool, 
  TbCertificate,
  TbWorld 
} from 'react-icons/tb';
import { FaUniversity, FaChartLine, FaCheckCircle } from 'react-icons/fa';

export default function HeroSection({ data }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Default data structure matching the admin editor
  const defaultData = {
    badgeText: "Ghana's Premier Educational Consult",
    titleLine1: "Shape Your Global",
    titleLine2: "Educational Journey",
    description: "Empowering Ghanaian students to achieve academic excellence abroad. With 15+ years of experience, we've guided thousands to top universities worldwide, ensuring every step of your journey is seamless.",
    primaryCtaText: "Explore Programs",
    primaryCtaLink: "/services",
    secondaryCtaText: "Watch Success Stories",
    secondaryCtaLink: "/about",
    stats: [
      { icon: "university", value: "50+", label: "Partner Universities", color: "from-emerald-500 to-green-500" },
      { icon: "school", value: "5,000+", label: "Students Placed", color: "from-green-500 to-emerald-600" },
      { icon: "globe", value: "15+", label: "Countries", color: "from-emerald-600 to-green-500" },
      { icon: "chart", value: "98%", label: "Success Rate", color: "from-green-600 to-emerald-500" }
    ],
    slides: [
      {
        id: 1,
        image: "https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?auto=compress&cs=tinysrgb&w=1920",
        alt: "Modern university campus with students",
        overlayTitle: "University of Ghana",
        overlaySubtitle: "Leading the way in African higher education"
      },
      {
        id: 2,
        image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1920",
        alt: "Graduation ceremony with caps thrown in air",
        overlayTitle: "Graduation Ceremony",
        overlaySubtitle: "Celebrating academic excellence"
      },
      {
        id: 3,
        image: "https://images.pexels.com/photos/207732/pexels-photo-207732.jpeg?auto=compress&cs=tinysrgb&w=1920",
        alt: "Students studying in modern library",
        overlayTitle: "Modern Library",
        overlaySubtitle: "State-of-the-art facilities"
      },
      {
        id: 4,
        image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1920",
        alt: "International students discussing",
        overlayTitle: "Global Community",
        overlaySubtitle: "Students from 15+ countries"
      }
    ],
    floatingCards: [
      { icon: "globe", title: "Global Network", value: "15+ Countries", color: "green" },
      { icon: "graduation", title: "Scholarships", value: "$2M+ Awarded", color: "emerald" }
    ],
    trustBadges: [
      { icon: "users", text: "Trusted by 5000+ students" },
      { icon: "location", text: "Offices in Accra & London" }
    ]
  };

  const heroData = data || defaultData;

  // Auto-rotate slides
  useEffect(() => {
    if (heroData.slides && heroData.slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [heroData.slides]);

  // Helper function to render stat icon
  const renderStatIcon = (iconType, className) => {
    switch(iconType) {
      case 'university':
        return <FaUniversity className={className} />;
      case 'school':
        return <TbSchool className={className} />;
      case 'globe':
        return <HiOutlineGlobeAlt className={className} />;
      case 'chart':
        return <FaChartLine className={className} />;
      default:
        return <HiOutlineAcademicCap className={className} />;
    }
  };

  // Helper function to render floating card icon
  const renderFloatingIcon = (iconType, color, className) => {
    switch(iconType) {
      case 'globe':
        return <TbWorld className={className} />;
      case 'graduation':
        return <PiGraduationCapLight className={className} />;
      default:
        return <HiOutlineGlobeAlt className={className} />;
    }
  };

  // Helper function to render trust badge icon
  const renderTrustIcon = (iconType) => {
    switch(iconType) {
      case 'users':
        return <HiOutlineUserGroup className="w-4 h-4" />;
      case 'location':
        return <PiMapPinLineLight className="w-4 h-4" />;
      default:
        return <FaCheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-green-100 to-green-200">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 80, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-emerald-200/30 to-green-200/20 rounded-full blur-3xl"
        />

        {/* Animated Lines */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: 8,
                delay: i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute h-px w-64 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
              style={{ top: `${30 + i * 20}%` }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 lg:py-0">
          
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Premium Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-8"
            >
              <HiOutlineSparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{heroData.badgeText}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
            >
              <span className="block">{heroData.titleLine1}</span>
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {heroData.titleLine2}
                </span>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl"
            >
              {heroData.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href={heroData.primaryCtaLink} className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl overflow-hidden shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5">
                <span className="relative z-10 flex items-center gap-2">
                  {heroData.primaryCtaText}
                  <HiOutlineArrowLongRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link href={heroData.secondaryCtaLink} className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                <HiOutlinePlayCircle className="w-5 h-5" />
                {heroData.secondaryCtaText}
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {heroData.stats && heroData.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="group relative p-4 bg-white rounded-2xl border border-gray-100 hover:border-green-200 transition-all duration-300"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Icon with Gradient */}
                  <div className={`relative w-10 h-10 mb-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center text-white`}>
                    {renderStatIcon(stat.icon, "w-5 h-5")}
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-tight">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex items-center gap-6 text-sm text-gray-500"
            >
              {heroData.trustBadges && heroData.trustBadges.map((badge, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  {renderTrustIcon(badge.icon)}
                  {badge.text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Image Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px]"
          >
            {/* Image Slider Container */}
            <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient Overlay for Better Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              
              {/* Images */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {heroData.slides && heroData.slides[currentSlide] && (
                    <img
                      src={heroData.slides[currentSlide].image}
                      alt={heroData.slides[currentSlide].alt}
                      className="w-full h-full object-cover"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Slide Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
                <motion.div
                  key={`content-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm font-medium text-green-300 mb-2">FEATURED PARTNER</p>
                  <h3 className="text-2xl font-bold mb-1">{heroData.slides?.[currentSlide]?.overlayTitle}</h3>
                  <p className="text-sm text-gray-200">{heroData.slides?.[currentSlide]?.overlaySubtitle}</p>
                </motion.div>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                {heroData.slides && heroData.slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-8 bg-green-500' 
                        : 'w-4 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative Elements around Slider */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-green-200 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-emerald-200 rounded-full -z-10" />
            
            {/* Floating Cards */}
            {heroData.floatingCards && heroData.floatingCards.map((card, idx) => (
              <motion.div 
                key={idx}
                animate={{ y: idx === 0 ? [0, -10, 0] : [0, 10, 0] }}
                transition={{ duration: idx === 0 ? 4 : 5, repeat: Infinity }}
                className={`absolute ${idx === 0 ? '-left-8 top-1/4' : '-right-8 bottom-1/4'} bg-white rounded-2xl p-4 shadow-xl hidden lg:block`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${card.color}-100 rounded-xl flex items-center justify-center`}>
                    {renderFloatingIcon(card.icon, card.color, `w-5 h-5 text-${card.color}-600`)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{card.title}</div>
                    <div className="text-xs text-gray-500">{card.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 55C840 60 960 60 1080 50C1200 40 1320 20 1380 10L1440 0V120H0Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-green-500 rounded-full mt-1 animate-pulse" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}