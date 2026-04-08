// components/SuperAdmin/AllPages/Home/TestimonialEditor.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FaUpload, 
  FaTrash, 
  FaSave, 
  FaEye, 
  FaEdit,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaQuoteLeft,
  FaQuoteRight,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUserCircle,
  FaBriefcase,
  FaHeart,
  FaComment
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CLOUDINARY_CLOUD_NAME = 'dpbntoeen';
const CLOUDINARY_UPLOAD_PRESET = 'my-photos';
const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dpbntoeen/image/upload`;

export default function TestimonialEditor({ data, onSave, isSaving }) {
  const [formData, setFormData] = useState({
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
      cardStyle: "modern", // modern, classic, minimal
      showRatings: true,
      showDates: false
    },
    backgroundColor: "#ffffff",
    accentColor: "#10b981"
  });

  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [uploadingImages, setUploadingImages] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (setting, value) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [setting]: value }
    }));
  };

  const handleTestimonialChange = (index, field, value) => {
    const updatedTestimonials = [...formData.testimonials];
    updatedTestimonials[index][field] = value;
    setFormData(prev => ({ ...prev, testimonials: updatedTestimonials }));
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      name: "New Client",
      role: "Position, Company",
      feedback: "Testimonial feedback goes here...",
      image: "",
      rating: 5,
      date: new Date().toISOString().split('T')[0]
    };
    setFormData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }));
    setActiveTestimonialIndex(formData.testimonials.length);
  };

  const removeTestimonial = (index) => {
    if (formData.testimonials.length === 1) {
      toast.error("Cannot remove the last testimonial");
      return;
    }
    const updatedTestimonials = formData.testimonials.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, testimonials: updatedTestimonials }));
    if (activeTestimonialIndex >= updatedTestimonials.length) {
      setActiveTestimonialIndex(updatedTestimonials.length - 1);
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

  const handleImageUpload = async (e, testimonialIndex) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setUploadingImages(prev => ({ ...prev, [testimonialIndex]: true }));

    try {
      const result = await uploadToCloudinary(file);
      const updatedTestimonials = [...formData.testimonials];
      updatedTestimonials[testimonialIndex].image = result.url;
      updatedTestimonials[testimonialIndex].publicId = result.publicId;
      setFormData(prev => ({ ...prev, testimonials: updatedTestimonials }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [testimonialIndex]: false }));
    }
  };

  const removeImage = async (testimonialIndex) => {
    const updatedTestimonials = [...formData.testimonials];
    updatedTestimonials[testimonialIndex].image = "";
    updatedTestimonials[testimonialIndex].publicId = null;
    setFormData(prev => ({ ...prev, testimonials: updatedTestimonials }));
    toast.success('Image removed successfully');
  };

  const renderStars = (rating) => {
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
    return stars;
  };

  const TestimonialPreview = () => {
    const itemsPerView = window.innerWidth >= 1024 ? formData.settings.itemsPerView.desktop : 
                         window.innerWidth >= 768 ? formData.settings.itemsPerView.tablet : 
                         formData.settings.itemsPerView.mobile;
    const totalSlides = Math.ceil(formData.testimonials.length / itemsPerView);
    const currentTestimonials = formData.testimonials.slice(
      currentPreviewIndex * itemsPerView,
      currentPreviewIndex * itemsPerView + itemsPerView
    );

    const nextSlide = () => {
      setCurrentPreviewIndex((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
      setCurrentPreviewIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    return (
      <section className="relative w-full py-16" style={{ backgroundColor: formData.backgroundColor }}>
        {/* Background Layout */}
        <div className="absolute inset-0 flex">
          <div className="w-3/4"></div>
          <div className="w-1/4" style={{ backgroundColor: formData.accentColor }}></div>
        </div>

        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-6">
              <FaComment className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{formData.badgeText}</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              {formData.sectionTitle.split(' ').map((word, index) => 
                word.toLowerCase() === 'clients' ? (
                  <span key={index} className="text-green-600">{word} </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {formData.sectionSubtitle}
            </p>
          </div>

          {/* Testimonial Slider */}
          <div className="relative w-full overflow-hidden">
            <div className={`grid gap-8 ${
              itemsPerView === 1 ? 'grid-cols-1' : 
              itemsPerView === 2 ? 'grid-cols-1 md:grid-cols-2' : 
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {currentTestimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className={`p-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${
                    formData.settings.cardStyle === 'modern' ? 'bg-white' :
                    formData.settings.cardStyle === 'classic' ? 'bg-gradient-to-br from-gray-50 to-white border border-gray-100' :
                    'bg-white shadow-none border border-gray-200'
                  }`}>
                    {/* Quote Icon */}
                    <FaQuoteLeft className="w-8 h-8 text-green-500 opacity-30 mb-4" />
                    
                    {/* Feedback */}
                    <p className="text-gray-600 italic leading-relaxed">“{testimonial.feedback}”</p>
                    <FaQuoteRight className="w-6 h-6 text-green-500 opacity-30 ml-auto mt-2" />
                    
                    {/* Rating Stars */}
                    {formData.settings.showRatings && testimonial.rating && (
                      <div className="flex gap-1 mt-4">
                        {renderStars(testimonial.rating)}
                      </div>
                    )}
                    
                    {/* Author Info */}
                    <div className="flex items-center mt-6">
                      {testimonial.image ? (
                        <img 
                          className="w-14 h-14 rounded-full border-2 object-cover" 
                          style={{ borderColor: formData.accentColor }}
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
                        {formData.settings.showDates && testimonial.date && (
                          <p className="text-xs text-gray-400 mt-1">{testimonial.date}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {formData.settings.showArrows && totalSlides > 1 && (
            <div className="mt-8 flex justify-center gap-6">
              <button 
                onClick={prevSlide} 
                className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition transform hover:scale-110"
              >
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextSlide} 
                className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition transform hover:scale-110"
              >
                <FaChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Dots Navigation */}
          {formData.settings.showDots && totalSlides > 1 && (
            <div className="mt-6 flex justify-center space-x-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPreviewIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentPreviewIndex 
                      ? 'bg-green-500 w-8' 
                      : 'bg-gray-300 w-3 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Testimonial Editor</h3>
          <p className="text-sm text-gray-500">Customize the testimonials section of your homepage</p>
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
            onClick={() => onSave(formData)}
            disabled={isSaving}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {previewMode ? (
        <TestimonialPreview />
      ) : (
        <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {/* Section Header Editor */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaEdit className="w-4 h-4 text-purple-600" />
              Section Header
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => handleInputChange('badgeText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={formData.sectionTitle}
                  onChange={(e) => handleInputChange('sectionTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Note: "Clients" will automatically get green color</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={formData.sectionSubtitle}
                  onChange={(e) => handleInputChange('sectionSubtitle', e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaHeart className="w-4 h-4 text-red-500" />
              Color Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                  className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Slider Settings */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaChevronLeft className="w-4 h-4 text-blue-600" />
              Slider Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.settings.autoPlay}
                    onChange={(e) => handleSettingChange('autoPlay', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  Auto Play
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.settings.showArrows}
                    onChange={(e) => handleSettingChange('showArrows', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  Show Navigation Arrows
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.settings.showDots}
                    onChange={(e) => handleSettingChange('showDots', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  Show Dots Navigation
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.settings.showRatings}
                    onChange={(e) => handleSettingChange('showRatings', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  Show Ratings
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.settings.showDates}
                    onChange={(e) => handleSettingChange('showDates', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  Show Dates
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto Play Speed (ms)</label>
                <input
                  type="number"
                  value={formData.settings.autoPlaySpeed}
                  onChange={(e) => handleSettingChange('autoPlaySpeed', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={!formData.settings.autoPlay}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Style</label>
                <select
                  value={formData.settings.cardStyle}
                  onChange={(e) => handleSettingChange('cardStyle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items Per View - Desktop</label>
                <select
                  value={formData.settings.itemsPerView.desktop}
                  onChange={(e) => handleSettingChange('itemsPerView', { ...formData.settings.itemsPerView, desktop: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
            </div>
          </div>

          {/* Testimonials Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <FaQuoteLeft className="w-4 h-4 text-green-600" />
                Testimonials
              </h4>
              <button
                onClick={addTestimonial}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <FaPlus className="w-3 h-3" /> Add Testimonial
              </button>
            </div>

            {/* Testimonial Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              {formData.testimonials.map((testimonial, idx) => (
                <button
                  key={testimonial.id}
                  onClick={() => setActiveTestimonialIndex(idx)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTestimonialIndex === idx
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaUserCircle className="w-4 h-4" />
                  {testimonial.name.length > 15 ? testimonial.name.substring(0, 15) + '...' : testimonial.name}
                  {formData.testimonials.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTestimonial(idx);
                      }}
                      className="ml-2 hover:text-red-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  )}
                </button>
              ))}
            </div>

            {/* Active Testimonial Editor */}
            {formData.testimonials[activeTestimonialIndex] && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={formData.testimonials[activeTestimonialIndex].name}
                      onChange={(e) => handleTestimonialChange(activeTestimonialIndex, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role / Position</label>
                    <input
                      type="text"
                      value={formData.testimonials[activeTestimonialIndex].role}
                      onChange={(e) => handleTestimonialChange(activeTestimonialIndex, 'role', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                    <textarea
                      value={formData.testimonials[activeTestimonialIndex].feedback}
                      onChange={(e) => handleTestimonialChange(activeTestimonialIndex, 'feedback', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                    <select
                      value={formData.testimonials[activeTestimonialIndex].rating}
                      onChange={(e) => handleTestimonialChange(activeTestimonialIndex, 'rating', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4.5}>4.5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3.5}>3.5 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.testimonials[activeTestimonialIndex].date}
                      onChange={(e) => handleTestimonialChange(activeTestimonialIndex, 'date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Avatar Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Avatar</label>
                  {formData.testimonials[activeTestimonialIndex].image ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.testimonials[activeTestimonialIndex].image}
                        alt={formData.testimonials[activeTestimonialIndex].name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
                      />
                      <button
                        onClick={() => removeImage(activeTestimonialIndex)}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-green-500 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        {uploadingImages[activeTestimonialIndex] ? (
                          <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
                        ) : (
                          <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-xs text-gray-500 text-center">Upload Avatar</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, activeTestimonialIndex)}
                        className="hidden"
                        disabled={uploadingImages[activeTestimonialIndex]}
                      />
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Recommended size: 200x200px, Max 2MB</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}