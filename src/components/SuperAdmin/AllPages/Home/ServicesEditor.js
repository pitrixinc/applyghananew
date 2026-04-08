// components/SuperAdmin/AllPages/Home/ServicesEditor.js
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
  FaCheckCircle,
  FaArrowRight,
  FaBriefcase,
  FaGlobe,
  FaGraduationCap,
  FaChartLine
} from 'react-icons/fa';
import { HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineArrowLongRight } from 'react-icons/hi2';
import { PiChalkboardTeacher, PiStudent } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const CLOUDINARY_CLOUD_NAME = 'dpbntoeen';
const CLOUDINARY_UPLOAD_PRESET = 'my-photos';
const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dpbntoeen/image/upload`;

export default function ServicesEditor({ data, onSave, isSaving }) {
  const [formData, setFormData] = useState({
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
  });

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [uploadingImages, setUploadingImages] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const handleFeatureChange = (serviceIndex, featureIndex, value) => {
    const updatedServices = [...formData.services];
    updatedServices[serviceIndex].features[featureIndex] = value;
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const addFeature = (serviceIndex) => {
    const updatedServices = [...formData.services];
    updatedServices[serviceIndex].features.push("New Feature");
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const removeFeature = (serviceIndex, featureIndex) => {
    const updatedServices = [...formData.services];
    updatedServices[serviceIndex].features.splice(featureIndex, 1);
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    const newService = {
      id: Date.now(),
      title: "New Service",
      subtitle: "Service Subtitle",
      description: "Service description goes here...",
      features: ["Feature 1", "Feature 2"],
      icon: "globe",
      image: "",
      alt: "Service image",
      gradient: "from-blue-500 to-cyan-500",
      stats: "New Stat",
      color: "blue",
      link: "/services/new-service"
    };
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
    setActiveServiceIndex(formData.services.length);
  };

  const removeService = (index) => {
    if (formData.services.length === 1) {
      toast.error("Cannot remove the last service");
      return;
    }
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, services: updatedServices }));
    if (activeServiceIndex >= updatedServices.length) {
      setActiveServiceIndex(updatedServices.length - 1);
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

  const handleImageUpload = async (e, serviceIndex) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploading(true);
    setUploadingImages(prev => ({ ...prev, [serviceIndex]: true }));

    try {
      const result = await uploadToCloudinary(file);
      const updatedServices = [...formData.services];
      updatedServices[serviceIndex].image = result.url;
      updatedServices[serviceIndex].publicId = result.publicId;
      setFormData(prev => ({ ...prev, services: updatedServices }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      setUploadingImages(prev => ({ ...prev, [serviceIndex]: false }));
    }
  };

  const removeImage = async (serviceIndex) => {
    const service = formData.services[serviceIndex];
    if (service.publicId) {
      try {
        // Note: In production, implement proper server-side deletion
        const updatedServices = [...formData.services];
        updatedServices[serviceIndex].image = "";
        updatedServices[serviceIndex].publicId = null;
        setFormData(prev => ({ ...prev, services: updatedServices }));
        toast.success('Image removed successfully');
      } catch (error) {
        toast.error('Failed to remove image');
      }
    } else {
      const updatedServices = [...formData.services];
      updatedServices[serviceIndex].image = "";
      setFormData(prev => ({ ...prev, services: updatedServices }));
    }
  };

  const handleTrustIndicatorChange = (index, field, value) => {
    const updatedIndicators = [...formData.trustIndicators];
    updatedIndicators[index][field] = value;
    setFormData(prev => ({ ...prev, trustIndicators: updatedIndicators }));
  };

  const addTrustIndicator = () => {
    setFormData(prev => ({
      ...prev,
      trustIndicators: [...prev.trustIndicators, { icon: "academic", text: "New Indicator" }]
    }));
  };

  const removeTrustIndicator = (index) => {
    setFormData(prev => ({
      ...prev,
      trustIndicators: prev.trustIndicators.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const saveData = {
      ...formData,
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    };
    onSave(saveData);
  };

  const renderIcon = (iconType, className = "w-6 h-6") => {
    switch(iconType) {
      case 'globe':
        return <FaGlobe className={className} />;
      case 'academic':
        return <FaGraduationCap className={className} />;
      case 'training':
        return <PiChalkboardTeacher className={className} />;
      case 'student':
        return <PiStudent className={className} />;
      case 'certificate':
        return <FaCheckCircle className={className} />;
      case 'briefcase':
        return <FaBriefcase className={className} />;
      default:
        return <HiOutlineAcademicCap className={className} />;
    }
  };

  const ServicesPreview = () => (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-white to-white opacity-70" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.02) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-6">
            <FaBriefcase className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{formData.badgeText}</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formData.sectionTitle}
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {formData.sectionSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-8">
          {formData.services.map((service, idx) => (
            <div key={service.id} className="group relative">
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0">
                    {service.image && (
                      <img
                        src={service.image}
                        alt={service.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity`} />
                  
                  <div className="absolute top-6 left-6 z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-90 backdrop-blur-sm flex items-center justify-center text-white shadow-xl`}>
                      {renderIcon(service.icon, "w-6 h-6")}
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 z-10">
                    <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                      <span className="text-sm font-semibold text-gray-900">{service.stats}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <span className={`text-sm font-medium text-${service.color}-300 mb-2 block`}>
                      {service.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-3">
                        <HiOutlineCheckCircle className={`w-5 h-5 text-${service.color}-500 flex-shrink-0`} />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={service.link} className={`inline-flex items-center gap-2 text-${service.color}-600 font-semibold group/link`}>
                    <span>Learn More</span>
                    <HiOutlineArrowLongRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>

                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-30" />
            <Link href={formData.bottomCtaLink} className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5 group">
              <span>{formData.bottomCtaText}</span>
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            {formData.trustIndicators.map((indicator, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {renderIcon(indicator.icon, "w-5 h-5 text-green-500")}
                <span>{indicator.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Services Section Editor</h3>
          <p className="text-sm text-gray-500">Customize the services section of your homepage</p>
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
        <ServicesPreview />
      ) : (
        <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {/* Section Header Editor */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaEdit className="w-4 h-4 text-blue-600" />
              Section Header
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => handleInputChange('badgeText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={formData.sectionTitle}
                  onChange={(e) => handleInputChange('sectionTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={formData.sectionSubtitle}
                  onChange={(e) => handleInputChange('sectionSubtitle', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Services List Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <FaBriefcase className="w-4 h-4 text-green-600" />
                Services
              </h4>
              <button
                onClick={addService}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <FaPlus className="w-3 h-3" /> Add Service
              </button>
            </div>

            {/* Service Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              {formData.services.map((service, idx) => (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceIndex(idx)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeServiceIndex === idx
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {renderIcon(service.icon, "w-4 h-4")}
                  {service.title}
                  {formData.services.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeService(idx);
                      }}
                      className="ml-2 hover:text-red-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  )}
                </button>
              ))}
            </div>

            {/* Active Service Editor */}
            {formData.services[activeServiceIndex] && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                    <input
                      type="text"
                      value={formData.services[activeServiceIndex].title}
                      onChange={(e) => handleServiceChange(activeServiceIndex, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={formData.services[activeServiceIndex].subtitle}
                      onChange={(e) => handleServiceChange(activeServiceIndex, 'subtitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.services[activeServiceIndex].description}
                      onChange={(e) => handleServiceChange(activeServiceIndex, 'description', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stats Text</label>
                    <input
                      type="text"
                      value={formData.services[activeServiceIndex].stats}
                      onChange={(e) => handleServiceChange(activeServiceIndex, 'stats', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Link</label>
                    <input
                      type="text"
                      value={formData.services[activeServiceIndex].link}
                      onChange={(e) => handleServiceChange(activeServiceIndex, 'link', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon Type</label>
                    <select
                      value={formData.services[activeServiceIndex].icon}
                      onChange={(e) => handleServiceChange(activeServiceIndex, 'icon', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="globe">Globe</option>
                      <option value="academic">Academic</option>
                      <option value="training">Training</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                    <select
                      value={formData.services[activeServiceIndex].color}
                      onChange={(e) => {
                        const color = e.target.value;
                        let gradient = "from-blue-500 to-cyan-500";
                        if (color === "green") gradient = "from-green-500 to-emerald-500";
                        if (color === "purple") gradient = "from-purple-500 to-pink-500";
                        handleServiceChange(activeServiceIndex, 'color', color);
                        handleServiceChange(activeServiceIndex, 'gradient', gradient);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
                  {formData.services[activeServiceIndex].image ? (
                    <div className="relative">
                      <img
                        src={formData.services[activeServiceIndex].image}
                        alt={formData.services[activeServiceIndex].alt}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(activeServiceIndex)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingImages[activeServiceIndex] ? (
                          <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
                        ) : (
                          <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400">Max 2MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, activeServiceIndex)}
                        className="hidden"
                        disabled={uploadingImages[activeServiceIndex]}
                      />
                    </label>
                  )}
                </div>

                {/* Features Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Features List</label>
                    <button
                      onClick={() => addFeature(activeServiceIndex)}
                      className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <FaPlus className="w-3 h-3" /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.services[activeServiceIndex].features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(activeServiceIndex, featureIdx, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Feature description"
                        />
                        <button
                          onClick={() => removeFeature(activeServiceIndex, featureIdx)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trust Indicators Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-600" />
                Trust Indicators
              </h4>
              <button
                onClick={addTrustIndicator}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <FaPlus className="w-3 h-3" /> Add Indicator
              </button>
            </div>
            <div className="space-y-3">
              {formData.trustIndicators.map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <select
                    value={indicator.icon}
                    onChange={(e) => handleTrustIndicatorChange(idx, 'icon', e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="academic">Academic</option>
                    <option value="student">Student</option>
                    <option value="certificate">Certificate</option>
                    <option value="globe">Globe</option>
                    <option value="briefcase">Briefcase</option>
                  </select>
                  <input
                    type="text"
                    value={indicator.text}
                    onChange={(e) => handleTrustIndicatorChange(idx, 'text', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Indicator text"
                  />
                  <button
                    onClick={() => removeTrustIndicator(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Editor */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaArrowRight className="w-4 h-4 text-purple-600" />
              Bottom Call to Action
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={formData.bottomCtaText}
                  onChange={(e) => handleInputChange('bottomCtaText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Link</label>
                <input
                  type="text"
                  value={formData.bottomCtaLink}
                  onChange={(e) => handleInputChange('bottomCtaLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}