// components/Home/Services.js
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  HiOutlineArrowLongRight,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineGlobeAlt
} from 'react-icons/hi2';
import { PiStudent, PiChalkboardTeacher } from 'react-icons/pi';
import { TbCertificate } from 'react-icons/tb';
import { FaGlobe, FaGraduationCap, FaChartLine } from 'react-icons/fa';

export default function Services({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Default data structure matching the admin editor
  const defaultData = {
    sectionTitle: "Comprehensive Educational Services",
    sectionSubtitle: "From university placement to professional development, we provide end-to-end solutions that transform academic aspirations into global achievements.",
    badgeText: "What We Offer",
    services: [
      {
        id: 1,
        title: "Study Abroad",
        subtitle: "Global Education Access",
        description: "Comprehensive guidance for undergraduate and postgraduate admissions to top universities in UK, USA, Canada, Australia, and Europe.",
        features: ["University Selection", "Application Support", "Visa Guidance", "Scholarship Assistance"],
        icon: "globe",
        image: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Students studying abroad at historic university",
        gradient: "from-blue-500 to-cyan-500",
        stats: "500+ Universities",
        color: "blue",
        link: "/services/study-abroad"
      },
      {
        id: 2,
        title: "Academic Consulting",
        subtitle: "Excellence in Education",
        description: "Personalized academic mentoring, course selection, and career pathway planning to ensure your academic success and professional growth.",
        features: ["Course Advisory", "Career Planning", "Application Essays", "Interview Prep"],
        icon: "academic",
        image: "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Student consulting with academic advisor",
        gradient: "from-green-500 to-emerald-500",
        stats: "98% Success Rate",
        color: "green",
        link: "/services/academic-consulting"
      },
      {
        id: 3,
        title: "Training Programs",
        subtitle: "Skill Development",
        description: "Specialized training in IELTS, TOEFL, GMAT, and professional skills development to enhance your global competitiveness.",
        features: ["IELTS/TOEFL Prep", "Professional Skills", "Mock Interviews", "Workshops"],
        icon: "training",
        image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Students in professional training session",
        gradient: "from-purple-500 to-pink-500",
        stats: "5000+ Trained",
        color: "purple",
        link: "/services/training-programs"
      }
    ],
    trustIndicators: [
      { icon: "academic", text: "50+ Partner Universities" },
      { icon: "student", text: "5000+ Successful Students" },
      { icon: "certificate", text: "Certified Counselors" }
    ],
    bottomCtaText: "Explore All Services",
    bottomCtaLink: "/services"
  };

  const sectionData = data || defaultData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Helper function to render service icon
  const renderServiceIcon = (iconType, className = "w-6 h-6") => {
    switch(iconType) {
      case 'globe':
        return <FaGlobe className={className} />;
      case 'academic':
        return <FaGraduationCap className={className} />;
      case 'training':
        return <PiChalkboardTeacher className={className} />;
      default:
        return <HiOutlineGlobeAlt className={className} />;
    }
  };

  // Helper function to render trust indicator icon
  const renderTrustIcon = (iconType, className = "w-5 h-5") => {
    switch(iconType) {
      case 'academic':
        return <HiOutlineAcademicCap className={className} />;
      case 'student':
        return <PiStudent className={className} />;
      case 'certificate':
        return <TbCertificate className={className} />;
      case 'globe':
        return <HiOutlineGlobeAlt className={className} />;
      case 'briefcase':
        return <HiOutlineBriefcase className={className} />;
      default:
        return <HiOutlineAcademicCap className={className} />;
    }
  };

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden" ref={ref}>
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-white to-white opacity-70" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-200/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.02) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-6"
          >
            <HiOutlineBriefcase className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{sectionData.badgeText}</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
          >
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {sectionData.sectionTitle}
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            {sectionData.sectionSubtitle}
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-8"
        >
          {sectionData.services && sectionData.services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                
                {/* Image Container with Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={service.image}
                      alt={service.alt}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity`} />
                  
                  {/* Service Icon */}
                  <div className="absolute top-6 left-6 z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-90 backdrop-blur-sm flex items-center justify-center text-white shadow-xl`}>
                      {renderServiceIcon(service.icon, "w-6 h-6")}
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-6 right-6 z-10">
                    <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                      <span className="text-sm font-semibold text-gray-900">{service.stats}</span>
                    </div>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <span className={`text-sm font-medium text-${service.color}-300 mb-2 block`}>
                      {service.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {service.features && service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-center gap-3"
                      >
                        <HiOutlineCheckCircle className={`w-5 h-5 text-${service.color}-500 flex-shrink-0`} />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Link */}
                  <Link 
                    href={service.link || `/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`inline-flex items-center gap-2 text-${service.color}-600 font-semibold group/link`}
                  >
                    <span>Learn More</span>
                    <HiOutlineArrowLongRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>

                  {/* Decorative Bottom Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              </div>

              {/* Decorative Corner Elements */}
              <div className={`absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-${service.color}-200 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`absolute -bottom-2 -left-2 w-16 h-16 border-b-2 border-l-2 border-${service.color}-200 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-30" />
            
            <Link 
              href={sectionData.bottomCtaLink}
              className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <span>{sectionData.bottomCtaText}</span>
              <HiOutlineArrowLongRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
          >
            {sectionData.trustIndicators && sectionData.trustIndicators.map((indicator, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {renderTrustIcon(indicator.icon, "w-5 h-5 text-green-500")}
                <span>{indicator.text}</span>
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}