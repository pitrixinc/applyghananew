// components/Home/WhyChooseUs.js
import React, { useState, useEffect } from "react";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  FaUsers, 
  FaClock, 
  FaShieldAlt, 
  FaStar,
  FaHeart,
  FaHandshake,
  FaTrophy,
  FaRocket,
  FaArrowRight
} from "react-icons/fa";

const WhyChooseUs = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Default data structure matching the admin editor
  const defaultData = {
    sectionTitle: "Why Choose ApplyGhana?",
    sectionSubtitle: "At ApplyGhana, we prioritize trust, efficiency, and customer satisfaction. With years of experience in document processing and consultancy, we have helped thousands of clients secure passports, register businesses, and gain university admissions with ease.",
    badgeText: "Our Advantages",
    features: [
      {
        id: 1,
        title: "10,000+ Clients",
        description: "We've successfully assisted thousands of individuals and businesses in Ghana.",
        icon: "users",
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-500",
        stats: "10,000+",
        statLabel: "Happy Clients"
      },
      {
        id: 2,
        title: "Fast Processing",
        description: "We handle all applications quickly and efficiently, saving you time and stress.",
        icon: "clock",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500",
        stats: "98%",
        statLabel: "On-Time Delivery"
      },
      {
        id: 3,
        title: "Reliable & Secure",
        description: "Your personal data is 100% secure with us. We follow strict confidentiality standards.",
        icon: "shield",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500",
        stats: "100%",
        statLabel: "Data Security"
      },
      {
        id: 4,
        title: "5-Star Reviews",
        description: "Our clients love us! We maintain a high customer satisfaction rate.",
        icon: "star",
        color: "from-yellow-500 to-orange-500",
        bgColor: "bg-yellow-500",
        stats: "4.9",
        statLabel: "Average Rating"
      }
    ],
    ctaButtonText: "Get Started Today",
    ctaButtonLink: "/contact",
    backgroundImage: "",
    showStats: true
  };

  const sectionData = data || defaultData;

  // Helper function to render icon based on icon type
  const renderIcon = (iconType, className = "w-6 h-6") => {
    switch(iconType) {
      case 'users':
        return <FaUsers className={className} />;
      case 'clock':
        return <FaClock className={className} />;
      case 'shield':
        return <FaShieldAlt className={className} />;
      case 'star':
        return <FaStar className={className} />;
      case 'heart':
        return <FaHeart className={className} />;
      case 'handshake':
        return <FaHandshake className={className} />;
      case 'trophy':
        return <FaTrophy className={className} />;
      case 'rocket':
        return <FaRocket className={className} />;
      default:
        return <FaStar className={className} />;
    }
  };

  // Helper function to split title and highlight specific word
  const renderTitle = () => {
    const title = sectionData.sectionTitle;
    if (title.includes('ApplyGhana?')) {
      const parts = title.split('ApplyGhana?');
      return (
        <>
          {parts[0]}
          <span className="text-green-600">ApplyGhana?</span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section 
      ref={ref}
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{
        backgroundImage: sectionData.backgroundImage ? `url(${sectionData.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0">
        {sectionData.backgroundImage ? (
          <div className="absolute inset-0 bg-black/50" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-10" />
        )}
      </div>

      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          {sectionData.badgeText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-6"
            >
              <FaHeart className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{sectionData.badgeText}</span>
            </motion.div>
          )}

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
          >
            {renderTitle()}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-4 text-md text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {sectionData.sectionSubtitle}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {sectionData.features && sectionData.features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                {/* Icon Container */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110 duration-300`}>
                    {renderIcon(feature.icon, "w-7 h-7")}
                  </div>
                  
                  {/* Stats Badge */}
                  {sectionData.showStats && feature.stats && (
                    <div className="absolute -top-2 -right-2">
                      <div className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                        <span className="text-xs font-bold text-white">{feature.stats}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="mt-4 text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats Label */}
                {sectionData.showStats && feature.statLabel && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500">{feature.statLabel}</span>
                  </div>
                )}

                {/* Decorative Bottom Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            href={sectionData.ctaButtonLink}
            className="inline-flex items-center gap-2 px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            {sectionData.ctaButtonText}
            <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;