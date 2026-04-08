// components/Home/CTA.js
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaHeart, 
  FaHandHoldingHeart, 
  FaRocket, 
  FaLightbulb, 
  FaStar, 
  FaBullhorn,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';

const CTA = ({ data }) => {
  const router = useRouter();

  // Default data structure matching the admin editor
  const defaultData = {
    layout: "split",
    title: "Fuel Dreams: Empower Tomorrow with Your Contribution Today",
    subtitle: "Join us in transforming ideas into reality. Support innovative projects and make a difference. Every contribution brings us closer to a brighter future. Empower change, one pledge at a time.",
    buttonText: "Get Started Today",
    buttonLink: "/contact-us",
    buttonVariant: "outline",
    leftImage: "https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&auto=format&fit=crop&w=654&q=80",
    rightImage: "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    backgroundColor: "#10b981",
    textColor: "#ffffff",
    accentColor: "#ffffff",
    showBadge: true,
    badgeText: "Limited Time Offer",
    badgeIcon: "heart",
    animated: true,
    features: [
      { text: "100% Satisfaction Guaranteed", icon: "check" },
      { text: "Expert Support Team", icon: "clock" },
      { text: "Fast Processing", icon: "calendar" }
    ]
  };

  const sectionData = data || defaultData;

  // Helper function to render badge icon
  const renderBadgeIcon = () => {
    switch(sectionData.badgeIcon) {
      case 'heart':
        return <FaHeart className="w-4 h-4" />;
      case 'hand':
        return <FaHandHoldingHeart className="w-4 h-4" />;
      case 'rocket':
        return <FaRocket className="w-4 h-4" />;
      case 'lightbulb':
        return <FaLightbulb className="w-4 h-4" />;
      case 'star':
        return <FaStar className="w-4 h-4" />;
      default:
        return <FaBullhorn className="w-4 h-4" />;
    }
  };

  // Helper function to render feature icon
  const renderFeatureIcon = (iconType) => {
    switch(iconType) {
      case 'check':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'clock':
        return <FaClock className="w-4 h-4" />;
      case 'calendar':
        return <FaCalendarAlt className="w-4 h-4" />;
      default:
        return <FaCheckCircle className="w-4 h-4" />;
    }
  };

  // Helper function to get button styles
  const getButtonStyles = () => {
    switch(sectionData.buttonVariant) {
      case 'solid':
        return {
          backgroundColor: sectionData.accentColor,
          color: sectionData.backgroundColor,
          border: 'none'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: sectionData.accentColor,
          border: `2px solid ${sectionData.accentColor}`
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${sectionData.backgroundColor}, ${sectionData.accentColor})`,
          color: sectionData.textColor,
          border: 'none'
        };
      default:
        return {
          backgroundColor: sectionData.accentColor,
          color: sectionData.backgroundColor,
          border: 'none'
        };
    }
  };

  // Split Layout (Original Design Enhanced)
  if (sectionData.layout === 'split') {
    return (
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        {sectionData.animated && (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
              style={{ backgroundColor: sectionData.accentColor }}
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
              style={{ backgroundColor: sectionData.accentColor }}
            />
          </>
        )}

        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{ backgroundColor: sectionData.backgroundColor }}
            >
              {/* Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{ 
                  backgroundImage: `radial-gradient(circle at 2px 2px, ${sectionData.accentColor} 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}
              />

              <div className="relative z-10 p-8 md:p-12 lg:px-16 lg:py-20">
                <div className="mx-auto max-w-xl text-center">
                  {/* Badge */}
                  {sectionData.showBadge && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                      style={{ backgroundColor: `${sectionData.accentColor}20`, color: sectionData.accentColor }}
                    >
                      {renderBadgeIcon()}
                      <span className="text-sm font-semibold">{sectionData.badgeText}</span>
                    </motion.div>
                  )}

                  {/* Title */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold md:text-3xl lg:text-4xl leading-tight"
                    style={{ color: sectionData.textColor }}
                  >
                    {sectionData.title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-sm md:text-base leading-relaxed"
                    style={{ color: `${sectionData.textColor}cc` }}
                  >
                    {sectionData.subtitle}
                  </motion.p>

                  {/* Features List */}
                  {sectionData.features && sectionData.features.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="mt-6 flex flex-wrap justify-center gap-4"
                    >
                      {sectionData.features.map((feature, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 text-xs md:text-sm"
                          style={{ color: `${sectionData.textColor}cc` }}
                        >
                          {renderFeatureIcon(feature.icon)}
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Button */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 md:mt-8"
                  >
                    <Link
                      href={sectionData.buttonLink}
                      className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3 text-sm md:text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
                      style={getButtonStyles()}
                    >
                      {sectionData.buttonText}
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Images Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2"
            >
              {sectionData.leftImage && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-48 sm:h-56 md:h-full overflow-hidden rounded-2xl shadow-xl group"
                >
                  <img
                    alt="CTA visual 1"
                    src={sectionData.leftImage}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              )}
              {sectionData.rightImage && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-48 sm:h-56 md:h-full overflow-hidden rounded-2xl shadow-xl group"
                >
                  <img
                    alt="CTA visual 2"
                    src={sectionData.rightImage}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Centered Layout
  if (sectionData.layout === 'centered') {
    return (
      <section 
        className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
        style={{ backgroundColor: sectionData.backgroundColor }}
      >
        {/* Background Image Overlay */}
        {sectionData.leftImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${sectionData.leftImage})` }}
          />
        )}
        
        {/* Animated Background Elements */}
        {sectionData.animated && (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-20"
              style={{ backgroundColor: sectionData.accentColor }}
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, -180, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-10"
              style={{ backgroundColor: sectionData.accentColor }}
            />
          </>
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          {sectionData.showBadge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: `${sectionData.accentColor}20`, color: sectionData.accentColor }}
            >
              {renderBadgeIcon()}
              <span className="text-sm font-semibold">{sectionData.badgeText}</span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            style={{ color: sectionData.textColor }}
          >
            {sectionData.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg mb-6 max-w-2xl mx-auto"
            style={{ color: `${sectionData.textColor}cc` }}
          >
            {sectionData.subtitle}
          </motion.p>

          {/* Features */}
          {sectionData.features && sectionData.features.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {sectionData.features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm"
                  style={{ backgroundColor: `${sectionData.accentColor}15`, color: sectionData.accentColor }}
                >
                  {renderFeatureIcon(feature.icon)}
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href={sectionData.buttonLink}
              className="inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
              style={getButtonStyles()}
            >
              {sectionData.buttonText}
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  // Compact Layout
  return (
    <section 
      className="relative py-12 md:py-16 overflow-hidden"
      style={{ backgroundColor: sectionData.backgroundColor }}
    >
      {/* Animated Background */}
      {sectionData.animated && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-5"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${sectionData.accentColor} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {sectionData.showBadge && (
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs"
                style={{ backgroundColor: `${sectionData.accentColor}20`, color: sectionData.accentColor }}
              >
                {renderBadgeIcon()}
                <span className="font-semibold">{sectionData.badgeText}</span>
              </div>
            )}
            <h3 className="text-xl md:text-2xl font-bold" style={{ color: sectionData.textColor }}>
              {sectionData.title}
            </h3>
            <p className="text-sm mt-2 max-w-2xl" style={{ color: `${sectionData.textColor}cc` }}>
              {sectionData.subtitle}
            </p>
          </div>

          {/* Right Button */}
          <div className="flex-shrink-0">
            <Link
              href={sectionData.buttonLink}
              className="inline-flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 group whitespace-nowrap"
              style={getButtonStyles()}
            >
              {sectionData.buttonText}
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;