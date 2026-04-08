// components/Home/TrustedPartners.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineGlobeAlt,
  HiOutlineCalendar,
  HiOutlineArrowLongRight,
  HiOutlineXMark,
  HiOutlineBuildingLibrary,
  HiOutlineStar,
  HiOutlineAcademicCap,
  HiOutlineBriefcase
} from 'react-icons/hi2';
import { PiStudent, PiGraduationCap } from 'react-icons/pi';
import { TbWorld, TbCertificate } from 'react-icons/tb';
import { FaUniversity, FaChartLine } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function TrustedPartners({ data }) {
  const router = useRouter()
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Default data structure matching the admin editor
  const defaultData = {
    sectionTitle: "Trusted Academic Partners",
    sectionSubtitle: "We've established strong partnerships with leading universities in Ghana and abroad, ensuring our students have access to quality education worldwide.",
    badgeText: "Our Network",
    stats: [
      { label: "Ghanaian Universities", value: "15", icon: "building" },
      { label: "International Partners", value: "5", icon: "globe" },
      { label: "Years of Partnerships", value: "20+", icon: "calendar" }
    ],
    ghanaianPartners: [
      {
        id: 1,
        name: "University of Ghana",
        location: "Accra, Ghana",
        type: "Public Research University",
        established: "1948",
        students: "38,000+",
        ranking: "#1 in Ghana",
        description: "The premier university in Ghana, known for excellence in research and academic programs across all disciplines.",
        achievements: "Produced 3 Nobel laureates, 2 heads of state",
        programs: ["Medicine", "Engineering", "Law", "Business", "Arts"],
        image: "https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/UoG_CoA_2017.svg/1280px-UoG_CoA_2017.svg.png",
        studentsPlaced: 1250,
        successRate: "96%"
      },
      {
        id: 2,
        name: "Kwame Nkrumah University of Science and Technology",
        location: "Kumasi, Ghana",
        type: "Public Technical University",
        established: "1952",
        students: "42,000+",
        ranking: "#1 in Science & Technology",
        description: "Ghana's premier science and technology university, renowned for engineering and innovation.",
        achievements: "Leading research in sustainable technology",
        programs: ["Engineering", "Technology", "Sciences", "Architecture", "Pharmacy"],
        image: "https://images.pexels.com/photos/207732/pexels-photo-207732.jpeg",
        logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Knust_seal.jpg",
        studentsPlaced: 980,
        successRate: "94%"
      }
    ],
    internationalPartners: [
      {
        id: 16,
        name: "University of Oxford",
        location: "Oxford, United Kingdom",
        type: "Public Research University",
        established: "1096",
        students: "24,000+",
        ranking: "#1 Worldwide",
        description: "The oldest university in the English-speaking world, renowned for academic excellence.",
        achievements: "110+ Nobel laureates, 50+ world leaders",
        programs: ["All Disciplines", "Research", "Graduate Studies", "Professional Programs"],
        image: "https://images.pexels.com/photos/460721/pexels-photo-460721.jpeg",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585",
        studentsPlaced: 85,
        successRate: "92%"
      },
      {
        id: 17,
        name: "Harvard University",
        location: "Cambridge, USA",
        type: "Private Ivy League",
        established: "1636",
        students: "21,000+",
        ranking: "#1 in USA",
        description: "America's oldest institution of higher learning, world leader in education and research.",
        achievements: "160+ Nobel laureates, 8 US presidents",
        programs: ["All Disciplines", "Law", "Business", "Medicine", "Government"],
        image: "https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585",
        studentsPlaced: 65,
        successRate: "88%"
      }
    ],
    ctaButtonText: "Start Your Application",
    ctaButtonLink: "/contact-us",
    backgroundColor: "#ffffff",
    accentColor: "#10b981"
  };

  const sectionData = data || defaultData;
  const ghanaianPartners = sectionData.ghanaianPartners || defaultData.ghanaianPartners;
  const internationalPartners = sectionData.internationalPartners || defaultData.internationalPartners;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Helper function to render stat icon
  const renderStatIcon = (iconType, className = "w-6 h-6") => {
    switch(iconType) {
      case 'building':
        return <HiOutlineBuildingLibrary className={className} />;
      case 'globe':
        return <TbWorld className={className} />;
      case 'calendar':
        return <HiOutlineCalendar className={className} />;
      case 'users':
        return <HiOutlineUsers className={className} />;
      default:
        return <FaUniversity className={className} />;
    }
  };

  return (
    <>
      <section 
        className="relative py-24 lg:py-32 overflow-hidden"
        style={{ backgroundColor: sectionData.backgroundColor }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Academic Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="academic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 30 60 M 0 30 L 60 30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <circle cx="30" cy="30" r="2" fill="currentColor" fillOpacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#academic-grid)" />
            </svg>
          </div>

          {/* Gradient Orbs */}
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${sectionData.accentColor}15` }}
          />
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${sectionData.accentColor}10` }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ 
                background: `linear-gradient(135deg, ${sectionData.accentColor}10, ${sectionData.accentColor}05)`,
                border: `1px solid ${sectionData.accentColor}20`
              }}
            >
              <HiOutlineBuildingLibrary className="w-4 h-4" style={{ color: sectionData.accentColor }} />
              <span className="text-sm font-medium" style={{ color: sectionData.accentColor }}>
                {sectionData.badgeText}
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              {sectionData.sectionTitle.split(' ').map((word, index) => 
                word.toLowerCase() === 'partners' ? (
                  <span key={index} className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {word}{' '}
                  </span>
                ) : (
                  <span key={index}>{word}{' '}</span>
                )
              )}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              {sectionData.sectionSubtitle}
            </motion.p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mb-20"
          >
            {sectionData.stats && sectionData.stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="flex items-center justify-center mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                    style={{ backgroundColor: `${sectionData.accentColor}10` }}
                  >
                    {renderStatIcon(stat.icon, "w-6 h-6")}
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: sectionData.accentColor }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Ghanaian Partners Section */}
          {ghanaianPartners && ghanaianPartners.length > 0 && (
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${sectionData.accentColor}10` }}
                  >
                    <HiOutlineMapPin className="w-5 h-5" style={{ color: sectionData.accentColor }} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Ghanaian Universities</h3>
                </div>
                <div className="h-1 w-20 rounded-full" style={{ backgroundColor: sectionData.accentColor }} />
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
              >
                {ghanaianPartners.map((partner) => (
                  <motion.div
                    key={partner.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedPartner({ ...partner, type: 'ghanaian' })}
                    className="group relative cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
                      {/* Logo Container with Gradient Border */}
                      <div className="relative mb-4">
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                          style={{ backgroundColor: sectionData.accentColor }}
                        />
                        <div 
                          className="relative w-24 h-24 rounded-full p-1 group-hover:scale-110 transition-transform duration-300"
                          style={{ background: `linear-gradient(135deg, ${sectionData.accentColor}, ${sectionData.accentColor}80)` }}
                        >
                          <div className="w-full h-full rounded-full bg-white p-2">
                            {partner.logo ? (
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full flex items-center justify-center">
                                <FaUniversity className="w-8 h-8" style={{ color: sectionData.accentColor }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* University Name */}
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                        {partner.name}
                      </h4>
                      
                      {/* Location */}
                      <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                        <HiOutlineMapPin className="w-3 h-3" />
                        {partner.location.split(',')[0]}
                      </p>
                      
                      {/* Stats Badge */}
                      <div 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: `${sectionData.accentColor}10` }}
                      >
                        <PiStudent className="w-3 h-3" style={{ color: sectionData.accentColor }} />
                        <span className="text-xs font-semibold" style={{ color: sectionData.accentColor }}>
                          {partner.studentsPlaced}+ Placed
                        </span>
                      </div>

                      {/* Decorative Bottom Line */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                        style={{ backgroundColor: sectionData.accentColor }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* International Partners Section */}
          {internationalPartners && internationalPartners.length > 0 && (
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${sectionData.accentColor}10` }}
                  >
                    <TbWorld className="w-5 h-5" style={{ color: sectionData.accentColor }} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">International Partners</h3>
                </div>
                <div className="h-1 w-20 rounded-full" style={{ backgroundColor: sectionData.accentColor }} />
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
              >
                {internationalPartners.map((partner) => (
                  <motion.div
                    key={partner.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedPartner({ ...partner, type: 'international' })}
                    className="group relative cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
                      {/* Logo Container with Gradient Border */}
                      <div className="relative mb-4">
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                          style={{ backgroundColor: sectionData.accentColor }}
                        />
                        <div 
                          className="relative w-24 h-24 rounded-full p-1 group-hover:scale-110 transition-transform duration-300"
                          style={{ background: `linear-gradient(135deg, ${sectionData.accentColor}, ${sectionData.accentColor}80)` }}
                        >
                          <div className="w-full h-full rounded-full bg-white p-2">
                            {partner.logo ? (
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full flex items-center justify-center">
                                <TbWorld className="w-8 h-8" style={{ color: sectionData.accentColor }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* University Name */}
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                        {partner.name}
                      </h4>
                      
                      {/* Location */}
                      <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                        <HiOutlineGlobeAlt className="w-3 h-3" />
                        {partner.location.split(',')[0]}
                      </p>
                      
                      {/* Success Rate Badge */}
                      <div 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: `${sectionData.accentColor}10` }}
                      >
                        <HiOutlineStar className="w-3 h-3" style={{ color: sectionData.accentColor }} />
                        <span className="text-xs font-semibold" style={{ color: sectionData.accentColor }}>
                          {partner.successRate} Success
                        </span>
                      </div>

                      {/* Decorative Bottom Line */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                        style={{ backgroundColor: sectionData.accentColor }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="relative inline-block">
              <div 
                className="absolute inset-0 rounded-full blur-2xl opacity-50"
                style={{ backgroundColor: sectionData.accentColor }}
              />
              <button 
                className="cursor-pointer relative inline-flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
                style={{ background: `linear-gradient(135deg, ${sectionData.accentColor}, ${sectionData.accentColor}cc)` }}
                onClick={()=> router.push(`${sectionData.ctaButtonLink}`)}
              >
                <span className="text-lg">{sectionData.ctaButtonText}</span>
                <HiOutlineArrowLongRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Detail Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={() => setSelectedPartner(null)}
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />

            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-colors shadow-lg"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>

                <div className="flex flex-col lg:flex-row">
                  {/* Left Column - Image */}
                  <div className="lg:w-5/12 relative h-80 lg:h-auto">
                    <img
                      src={selectedPartner.image}
                      alt={selectedPartner.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: `${sectionData.accentColor}cc` }}>
                        <HiOutlineBuildingLibrary className="w-4 h-4" />
                        <span className="text-xs font-medium">{selectedPartner.type}</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-2">{selectedPartner.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-200">
                        <HiOutlineMapPin className="w-4 h-4" />
                        <span>{selectedPartner.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="lg:w-7/12 p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="rounded-xl p-4" style={{ backgroundColor: `${sectionData.accentColor}08` }}>
                        <HiOutlineCalendar className="w-5 h-5 mb-2" style={{ color: sectionData.accentColor }} />
                        <div className="text-xs text-gray-500">Established</div>
                        <div className="text-lg font-bold text-gray-900">{selectedPartner.established}</div>
                      </div>
                      <div className="rounded-xl p-4" style={{ backgroundColor: `${sectionData.accentColor}08` }}>
                        <PiStudent className="w-5 h-5 mb-2" style={{ color: sectionData.accentColor }} />
                        <div className="text-xs text-gray-500">Students</div>
                        <div className="text-lg font-bold text-gray-900">{selectedPartner.students}</div>
                      </div>
                      <div className="rounded-xl p-4" style={{ backgroundColor: `${sectionData.accentColor}08` }}>
                        <TbCertificate className="w-5 h-5 mb-2" style={{ color: sectionData.accentColor }} />
                        <div className="text-xs text-gray-500">Ranking</div>
                        <div className="text-lg font-bold text-gray-900">{selectedPartner.ranking}</div>
                      </div>
                      <div className="rounded-xl p-4" style={{ backgroundColor: `${sectionData.accentColor}08` }}>
                        <HiOutlineUsers className="w-5 h-5 mb-2" style={{ color: sectionData.accentColor }} />
                        <div className="text-xs text-gray-500">Placed Students</div>
                        <div className="text-lg font-bold text-gray-900">{selectedPartner.studentsPlaced}+</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">About</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedPartner.description}</p>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Notable Achievements</h4>
                      <p className="text-gray-700">{selectedPartner.achievements}</p>
                    </div>

                    {/* Programs */}
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Programs</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPartner.programs.map((program, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-full text-sm transition-colors cursor-default"
                            style={{ backgroundColor: `${sectionData.accentColor}10`, color: sectionData.accentColor }}
                          >
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Success Stats */}
                    <div className="flex items-center justify-between p-5 rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${sectionData.accentColor}, ${sectionData.accentColor}cc)` }}>
                      <div>
                        <div className="text-sm opacity-90">Our Success Rate</div>
                        <div className="text-2xl font-bold">{selectedPartner.successRate}</div>
                      </div>
                      <div className="w-px h-12 bg-white/30" />
                      <div>
                        <div className="text-sm opacity-90">Students Placed</div>
                        <div className="text-2xl font-bold">{selectedPartner.studentsPlaced}+</div>
                      </div>
                      <button className="px-5 py-2 bg-white rounded-lg font-semibold text-sm transition-all hover:scale-105" style={{ color: sectionData.accentColor }}>
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}