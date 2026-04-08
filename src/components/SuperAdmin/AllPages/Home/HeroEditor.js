// components/SuperAdmin/AllPages/Home/HeroEditor.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  FaUpload, 
  FaTrash, 
  FaSave, 
  FaEye, 
  FaEdit,
  FaPlus,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaImage,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGlobe,
  FaGraduationCap,
  FaUniversity,
  FaChartLine
} from 'react-icons/fa';
import { HiOutlineSparkles, HiOutlinePlayCircle, HiOutlineArrowLongRight } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const CLOUDINARY_CLOUD_NAME = 'dpbntoeen';
const CLOUDINARY_UPLOAD_PRESET = 'my-photos';
const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dpbntoeen/image/upload`;

export default function HeroEditor({ data, onSave, isSaving, showPreview, onTogglePreview }) {
  const [formData, setFormData] = useState({
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
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imagePublicIds, setImagePublicIds] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
      if (data.slides) {
        const urls = data.slides.map(slide => slide.image);
        setImageUrls(urls);
      }
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatsChange = (index, field, value) => {
    const updatedStats = [...formData.stats];
    updatedStats[index][field] = value;
    setFormData(prev => ({ ...prev, stats: updatedStats }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { icon: "chart", value: "New", label: "New Stat", color: "from-green-500 to-emerald-500" }]
    }));
  };

  const removeStat = (index) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const handleSlideChange = (index, field, value) => {
    const updatedSlides = [...formData.slides];
    updatedSlides[index][field] = value;
    setFormData(prev => ({ ...prev, slides: updatedSlides }));
  };

  const addSlide = () => {
    setFormData(prev => ({
      ...prev,
      slides: [...prev.slides, {
        id: Date.now(),
        image: "",
        alt: "New slide",
        overlayTitle: "New Title",
        overlaySubtitle: "New Subtitle"
      }]
    }));
  };

  const removeSlide = (index) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = async (e, slideIndex) => {
    setErrorMessage('');
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Some images exceed the 2MB limit');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingImages(true);
    
    try {
      for (const file of validFiles) {
        const result = await uploadToCloudinary(file);
        const updatedSlides = [...formData.slides];
        updatedSlides[slideIndex].image = result.url;
        updatedSlides[slideIndex].publicId = result.publicId;
        setFormData(prev => ({ ...prev, slides: updatedSlides }));
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImages(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_IMAGE_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const deleteFromCloudinary = async (publicId) => {
    try {
      // Note: In production, implement proper server-side signature
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: publicId,
          api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        }),
      });

      if (!response.ok) throw new Error('Deletion failed');
      return await response.json();
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      throw error;
    }
  };

  const removeSlideImage = async (slideIndex) => {
    const slide = formData.slides[slideIndex];
    if (slide.publicId) {
      try {
        await deleteFromCloudinary(slide.publicId);
        const updatedSlides = [...formData.slides];
        updatedSlides[slideIndex].image = "";
        updatedSlides[slideIndex].publicId = null;
        setFormData(prev => ({ ...prev, slides: updatedSlides }));
        toast.success('Image removed successfully');
      } catch (error) {
        toast.error('Failed to remove image');
      }
    }
  };

  const handleSubmit = () => {
    const saveData = {
      ...formData,
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    };
    onSave(saveData);
  };

  const HeroPreview = () => (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
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

        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-emerald-200/30 to-green-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 lg:py-0">
          {/* Left Content */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-8">
              <HiOutlineSparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{formData.badgeText}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              <span className="block">{formData.titleLine1}</span>
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {formData.titleLine2}
                </span>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              {formData.description}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4">
              <a href={formData.primaryCtaLink} className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl overflow-hidden shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5">
                <span className="relative z-10 flex items-center gap-2">
                  {formData.primaryCtaText}
                  <HiOutlineArrowLongRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a href={formData.secondaryCtaLink} className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all duration-300 hover:-translate-y-0.5">
                <HiOutlinePlayCircle className="w-5 h-5" />
                {formData.secondaryCtaText}
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.stats.map((stat, index) => (
                <motion.div key={index} whileHover={{ y: -5 }}
                  className="group relative p-4 bg-white rounded-2xl border border-gray-100 hover:border-green-200 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`relative w-10 h-10 mb-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center text-white`}>
                    {stat.icon === 'university' && <FaUniversity className="w-5 h-5" />}
                    {stat.icon === 'school' && <FaGraduationCap className="w-5 h-5" />}
                    {stat.icon === 'globe' && <FaGlobe className="w-5 h-5" />}
                    {stat.icon === 'chart' && <FaChartLine className="w-5 h-5" />}
                  </div>
                  <div className="relative">
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-tight">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              {formData.trustBadges.map((badge, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  {badge.text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Slider */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px]">
            <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              
              <AnimatePresence mode="wait">
                <motion.div key={currentSlideIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0">
                  {formData.slides[currentSlideIndex]?.image && (
                    <img src={formData.slides[currentSlideIndex].image} alt={formData.slides[currentSlideIndex].alt}
                      className="w-full h-full object-cover" />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
                <motion.div key={`content-${currentSlideIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <p className="text-sm font-medium text-green-300 mb-2">FEATURED PARTNER</p>
                  <h3 className="text-2xl font-bold mb-1">{formData.slides[currentSlideIndex]?.overlayTitle}</h3>
                  <p className="text-sm text-gray-200">{formData.slides[currentSlideIndex]?.overlaySubtitle}</p>
                </motion.div>
              </div>

              <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                {formData.slides.map((_, index) => (
                  <button key={index} onClick={() => setCurrentSlideIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlideIndex ? 'w-8 bg-green-500' : 'w-4 bg-white/50 hover:bg-white/80'
                    }`} />
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-green-200 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-emerald-200 rounded-full -z-10" />
            
            {formData.floatingCards.map((card, idx) => (
              <motion.div key={idx} animate={{ y: idx === 0 ? [0, -10, 0] : [0, 10, 0] }}
                transition={{ duration: idx === 0 ? 4 : 5, repeat: Infinity }}
                className={`absolute ${idx === 0 ? '-left-8 top-1/4' : '-right-8 bottom-1/4'} bg-white rounded-2xl p-4 shadow-xl hidden lg:block`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${card.color}-100 rounded-xl flex items-center justify-center`}>
                    {card.icon === 'globe' && <FaGlobe className={`w-5 h-5 text-${card.color}-600`} />}
                    {card.icon === 'graduation' && <FaGraduationCap className={`w-5 h-5 text-${card.color}-600`} />}
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

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 55C840 60 960 60 1080 50C1200 40 1320 20 1380 10L1440 0V120H0Z" fill="white" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Hero Section Editor</h3>
          <p className="text-sm text-gray-500">Customize the main hero section of your homepage</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <FaEye className="w-4 h-4" />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {previewMode ? (
        <HeroPreview />
      ) : (
        <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {/* Main Content Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaEdit className="w-4 h-4 text-green-600" />
              Main Content
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => handleInputChange('badgeText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Line 1</label>
                <input
                  type="text"
                  value={formData.titleLine1}
                  onChange={(e) => handleInputChange('titleLine1', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Line 2 (Gradient)</label>
                <input
                  type="text"
                  value={formData.titleLine2}
                  onChange={(e) => handleInputChange('titleLine2', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiOutlineArrowLongRight className="w-4 h-4 text-green-600" />
              Call to Action Buttons
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Text</label>
                <input
                  type="text"
                  value={formData.primaryCtaText}
                  onChange={(e) => handleInputChange('primaryCtaText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Link</label>
                <input
                  type="text"
                  value={formData.primaryCtaLink}
                  onChange={(e) => handleInputChange('primaryCtaLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
                <input
                  type="text"
                  value={formData.secondaryCtaText}
                  onChange={(e) => handleInputChange('secondaryCtaText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Link</label>
                <input
                  type="text"
                  value={formData.secondaryCtaLink}
                  onChange={(e) => handleInputChange('secondaryCtaLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stats Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <FaChartLine className="w-4 h-4 text-green-600" />
                Statistics
              </h4>
              <button
                onClick={addStat}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <FaPlus className="w-3 h-3" /> Add Stat
              </button>
            </div>
            <div className="space-y-3">
              {formData.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <select
                    value={stat.icon}
                    onChange={(e) => handleStatsChange(index, 'icon', e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="university">University</option>
                    <option value="school">School</option>
                    <option value="globe">Globe</option>
                    <option value="chart">Chart</option>
                  </select>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatsChange(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatsChange(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => removeStat(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Slides Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <FaImage className="w-4 h-4 text-green-600" />
                Hero Slider Images
              </h4>
              <button
                onClick={addSlide}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <FaPlus className="w-3 h-3" /> Add Slide
              </button>
            </div>
            <div className="space-y-4">
              {formData.slides.map((slide, index) => (
                <div key={slide.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-700">Slide {index + 1}</h5>
                    <button
                      onClick={() => removeSlide(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      {slide.image ? (
                        <div className="relative">
                          <img src={slide.image} alt={slide.alt} className="w-full h-32 object-cover rounded-lg" />
                          <button
                            onClick={() => removeSlideImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            className="hidden"
                            multiple={false}
                          />
                        </label>
                      )}
                      {uploadingImages && <FaSpinner className="w-4 h-4 animate-spin text-green-600 mt-2" />}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                      <input
                        type="text"
                        value={slide.alt}
                        onChange={(e) => handleSlideChange(index, 'alt', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-2">Overlay Title</label>
                      <input
                        type="text"
                        value={slide.overlayTitle}
                        onChange={(e) => handleSlideChange(index, 'overlayTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-2">Overlay Subtitle</label>
                      <input
                        type="text"
                        value={slide.overlaySubtitle}
                        onChange={(e) => handleSlideChange(index, 'overlaySubtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-green-600" />
              Trust Badges
            </h4>
            <div className="space-y-2">
              {formData.trustBadges.map((badge, index) => (
                <input
                  key={index}
                  type="text"
                  value={badge.text}
                  onChange={(e) => {
                    const updated = [...formData.trustBadges];
                    updated[index].text = e.target.value;
                    setFormData(prev => ({ ...prev, trustBadges: updated }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={`Badge ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}