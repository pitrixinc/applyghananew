// components/Home/Testimonial.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaQuoteLeft, 
  FaQuoteRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUserCircle,
  FaComment
} from "react-icons/fa";

const Testimonial = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  // Default data structure matching the admin editor
  const defaultData = {
    sectionTitle: "What Our Clients Say",
    sectionSubtitle: "We take pride in delivering top-notch services to our customers. Here's what they have to say about ApplyGhana.",
    badgeText: "Testimonials",
    testimonials: [
      {
        id: 1,
        name: "Robert",
        role: "CTO, Robert Consultancy",
        feedback: "ApplyGhana made the entire process so easy for me. Their team is efficient and highly professional.",
        image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80",
        rating: 5,
        date: "2024-01-15"
      },
      {
        id: 2,
        name: "Jeny Doe",
        role: "CEO, Jeny Consultancy",
        feedback: "A seamless experience from start to finish. I highly recommend ApplyGhana for all document processing needs.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=761&q=80",
        rating: 5,
        date: "2024-02-20"
      },
      {
        id: 3,
        name: "Mia Brown",
        role: "Marketing Manager, Stech",
        feedback: "The team was incredibly supportive and guided me through every step. Very trustworthy!",
        image: "https://images.unsplash.com/photo-1499470932971-a90681ce8530?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
        rating: 4,
        date: "2024-03-10"
      },
      {
        id: 4,
        name: "David Smith",
        role: "Founder, Smith Corp",
        feedback: "I was impressed with their efficiency. They handled my document processing smoothly and quickly.",
        image: "https://images.unsplash.com/photo-1488508872907-592763824245?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
        rating: 5,
        date: "2024-03-25"
      },
      {
        id: 5,
        name: "Linda Williams",
        role: "HR Manager, Global Inc.",
        feedback: "The best customer service experience I have had. Highly recommended!",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rating: 5,
        date: "2024-04-05"
      }
    ],
    settings: {
      autoPlay: true,
      autoPlaySpeed: 6000,
      showArrows: true,
      showDots: true,
      itemsPerView: {
        mobile: 1,
        tablet: 2,
        desktop: 3
      },
      cardStyle: "modern",
      showRatings: true,
      showDates: false
    },
    backgroundColor: "#ffffff",
    accentColor: "#10b981"
  };

  const sectionData = data || defaultData;
  const testimonials = sectionData.testimonials || defaultData.testimonials;
  const settings = sectionData.settings || defaultData.settings;

  // Helper function to render stars
  const renderStars = (rating) => {
    if (!settings.showRatings || !rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="w-4 h-4 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="w-4 h-4 text-yellow-400" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} className="w-4 h-4 text-gray-300" />);
    }
    return <div className="flex gap-1 mt-4">{stars}</div>;
  };

  // Get items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(settings.itemsPerView.desktop);
      } else if (width >= 768) {
        setItemsPerPage(settings.itemsPerView.tablet);
      } else {
        setItemsPerPage(settings.itemsPerView.mobile);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [settings.itemsPerView]);

  const totalSlides = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    resetAutoPlay();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    resetAutoPlay();
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetAutoPlay();
  };

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (settings.autoPlay && isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, settings.autoPlaySpeed);
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    if (settings.autoPlay && isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, settings.autoPlaySpeed);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [settings.autoPlay, settings.autoPlaySpeed, itemsPerPage, isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (settings.autoPlay) {
      setIsAutoPlaying(false);
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }
  };

  const handleMouseLeave = () => {
    if (settings.autoPlay) {
      setIsAutoPlaying(true);
      autoPlayRef.current = setInterval(nextSlide, settings.autoPlaySpeed);
    }
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  // Get card style classes
  const getCardStyle = () => {
    switch(settings.cardStyle) {
      case 'classic':
        return 'bg-gradient-to-br from-gray-50 to-white border border-gray-100';
      case 'minimal':
        return 'bg-white shadow-none border border-gray-200';
      default:
        return 'bg-white';
    }
  };

  return (
    <section 
      className="relative w-full py-16 overflow-hidden"
      style={{ backgroundColor: sectionData.backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Layout with Accent Color */}
      <div className="absolute inset-0 flex">
        <div className="w-3/4"></div>
        <div className="w-1/4" style={{ backgroundColor: sectionData.accentColor }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ backgroundColor: sectionData.accentColor }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full" style={{ backgroundColor: sectionData.accentColor }} />
      </div>

      {/* Testimonial Content */}
      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          {sectionData.badgeText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-6"
            >
              <FaComment className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{sectionData.badgeText}</span>
            </motion.div>
          )}

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            {sectionData.sectionTitle.split(' ').map((word, index) => 
              word.toLowerCase() === 'clients' ? (
                <span key={index} className="text-green-600">{word} </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionData.sectionSubtitle}
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`grid gap-8 ${
                itemsPerPage === 1 ? 'grid-cols-1' : 
                itemsPerPage === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {currentTestimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${getCardStyle()}`}>
                    {/* Quote Icon */}
                    <FaQuoteLeft className="w-8 h-8 mb-4 opacity-30" style={{ color: sectionData.accentColor }} />
                    
                    {/* Feedback */}
                    <p className="text-gray-600 italic leading-relaxed">“{testimonial.feedback}”</p>
                    <FaQuoteRight className="w-6 h-6 ml-auto mt-2 opacity-30" style={{ color: sectionData.accentColor }} />
                    
                    {/* Rating Stars */}
                    {renderStars(testimonial.rating)}
                    
                    {/* Author Info */}
                    <div className="flex items-center mt-6">
                      {testimonial.image ? (
                        <img 
                          className="w-14 h-14 rounded-full border-2 object-cover" 
                          style={{ borderColor: sectionData.accentColor }}
                          src={testimonial.image} 
                          alt={testimonial.name} 
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUserCircle className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        {settings.showDates && testimonial.date && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(testimonial.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {settings.showArrows && totalSlides > 1 && (
          <div className="mt-8 flex justify-center gap-6">
            <button 
              onClick={prevSlide} 
              className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition transform hover:scale-110 duration-300"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide} 
              className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition transform hover:scale-110 duration-300"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Dots Navigation */}
        {settings.showDots && totalSlides > 1 && (
          <div className="mt-6 flex justify-center space-x-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8' 
                    : 'w-3 hover:w-5'
                }`}
                style={{
                  backgroundColor: index === currentIndex ? sectionData.accentColor : '#d1d5db'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonial;