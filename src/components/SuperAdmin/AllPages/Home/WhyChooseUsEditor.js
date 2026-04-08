// components/SuperAdmin/AllPages/Home/WhyChooseUsEditor.js
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
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaHeart,
  FaHandshake,
  FaTrophy,
  FaRocket
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const CLOUDINARY_CLOUD_NAME = 'dpbntoeen';
const CLOUDINARY_UPLOAD_PRESET = 'my-photos';
const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dpbntoeen/image/upload`;

export default function WhyChooseUsEditor({ data, onSave, isSaving }) {
  const [formData, setFormData] = useState({
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
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index][field] = value;
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };

  const addFeature = () => {
    const newFeature = {
      id: Date.now(),
      title: "New Feature",
      description: "Feature description goes here...",
      icon: "heart",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500",
      stats: "New",
      statLabel: "Stat Label"
    };
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
    setActiveFeatureIndex(formData.features.length);
  };

  const removeFeature = (index) => {
    if (formData.features.length === 1) {
      toast.error("Cannot remove the last feature");
      return;
    }
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
    if (activeFeatureIndex >= updatedFeatures.length) {
      setActiveFeatureIndex(updatedFeatures.length - 1);
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

  const handleBackgroundUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setUploadingImage(true);

    try {
      const result = await uploadToCloudinary(file);
      handleInputChange('backgroundImage', result.url);
      handleInputChange('backgroundPublicId', result.publicId);
      toast.success('Background image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeBackgroundImage = async () => {
    handleInputChange('backgroundImage', '');
    handleInputChange('backgroundPublicId', null);
    toast.success('Background image removed');
  };

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
        return <FaCheckCircle className={className} />;
    }
  };

  const getIconColor = (color) => {
    const colorMap = {
      'green': 'text-green-600',
      'blue': 'text-blue-600',
      'purple': 'text-purple-600',
      'yellow': 'text-yellow-600',
      'red': 'text-red-600',
      'indigo': 'text-indigo-600',
      'pink': 'text-pink-600'
    };
    return colorMap[color] || 'text-green-600';
  };

  const WhyChooseUsPreview = () => (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background with optional image */}
      <div className="absolute inset-0">
        {formData.backgroundImage ? (
          <>
            <img 
              src={formData.backgroundImage} 
              alt="Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-10" />
        )}
      </div>

      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-6">
            <FaHeart className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{formData.badgeText}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            {formData.sectionTitle.split(' ').map((word, index) => 
              word.toLowerCase() === 'applyghana?' || word.toLowerCase() === 'applyghana' ? (
                <span key={index} className="text-green-600">{word} </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>
          <p className="mt-4 text-md text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {formData.sectionSubtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {formData.features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Icon */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110 duration-300`}>
                    {renderIcon(feature.icon, "w-7 h-7")}
                  </div>
                  
                  {/* Stats Badge */}
                  {formData.showStats && feature.stats && (
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
                {formData.showStats && feature.statLabel && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500">{feature.statLabel}</span>
                  </div>
                )}

                {/* Decorative Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href={formData.ctaButtonLink}
            className="inline-flex items-center gap-2 px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            {formData.ctaButtonText}
            <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Why Choose Us Editor</h3>
          <p className="text-sm text-gray-500">Customize the Why Choose Us section of your homepage</p>
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
        <WhyChooseUsPreview />
      ) : (
        <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {/* Section Header Editor */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaEdit className="w-4 h-4 text-green-600" />
              Section Header
            </h4>
            <div className="grid grid-cols-1 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={formData.sectionTitle}
                  onChange={(e) => handleInputChange('sectionTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Note: "ApplyGhana?" will automatically get green color</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={formData.sectionSubtitle}
                  onChange={(e) => handleInputChange('sectionSubtitle', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Background Image Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUpload className="w-4 h-4 text-blue-600" />
              Background Image (Optional)
            </h4>
            {formData.backgroundImage ? (
              <div className="relative">
                <img
                  src={formData.backgroundImage}
                  alt="Background"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={removeBackgroundImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadingImage ? (
                    <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
                  ) : (
                    <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                  )}
                  <p className="text-sm text-gray-500">Click to upload background image</p>
                  <p className="text-xs text-gray-400">Recommended size: 1920x1080px, Max 2MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            )}
          </div>

          {/* Features Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <FaStar className="w-4 h-4 text-green-600" />
                Features
              </h4>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.showStats}
                    onChange={(e) => handleInputChange('showStats', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  Show Statistics
                </label>
                <button
                  onClick={addFeature}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <FaPlus className="w-3 h-3" /> Add Feature
                </button>
              </div>
            </div>

            {/* Feature Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              {formData.features.map((feature, idx) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeatureIndex(idx)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeFeatureIndex === idx
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {renderIcon(feature.icon, "w-4 h-4")}
                  {feature.title.length > 20 ? feature.title.substring(0, 20) + '...' : feature.title}
                  {formData.features.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFeature(idx);
                      }}
                      className="ml-2 hover:text-red-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  )}
                </button>
              ))}
            </div>

            {/* Active Feature Editor */}
            {formData.features[activeFeatureIndex] && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feature Title</label>
                    <input
                      type="text"
                      value={formData.features[activeFeatureIndex].title}
                      onChange={(e) => handleFeatureChange(activeFeatureIndex, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon Type</label>
                    <select
                      value={formData.features[activeFeatureIndex].icon}
                      onChange={(e) => handleFeatureChange(activeFeatureIndex, 'icon', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="users">Users</option>
                      <option value="clock">Clock</option>
                      <option value="shield">Shield</option>
                      <option value="star">Star</option>
                      <option value="heart">Heart</option>
                      <option value="handshake">Handshake</option>
                      <option value="trophy">Trophy</option>
                      <option value="rocket">Rocket</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.features[activeFeatureIndex].description}
                      onChange={(e) => handleFeatureChange(activeFeatureIndex, 'description', e.target.value)}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                    <select
                      value={formData.features[activeFeatureIndex].color.split(' ')[1]?.split('-')[1] || 'green'}
                      onChange={(e) => {
                        const color = e.target.value;
                        let gradient = "from-green-500 to-emerald-500";
                        let bgColor = "bg-green-500";
                        if (color === "blue") {
                          gradient = "from-blue-500 to-cyan-500";
                          bgColor = "bg-blue-500";
                        } else if (color === "purple") {
                          gradient = "from-purple-500 to-pink-500";
                          bgColor = "bg-purple-500";
                        } else if (color === "yellow") {
                          gradient = "from-yellow-500 to-orange-500";
                          bgColor = "bg-yellow-500";
                        } else if (color === "red") {
                          gradient = "from-red-500 to-rose-500";
                          bgColor = "bg-red-500";
                        } else if (color === "indigo") {
                          gradient = "from-indigo-500 to-purple-500";
                          bgColor = "bg-indigo-500";
                        }
                        handleFeatureChange(activeFeatureIndex, 'color', gradient);
                        handleFeatureChange(activeFeatureIndex, 'bgColor', bgColor);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="yellow">Yellow</option>
                      <option value="red">Red</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                  {formData.showStats && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Statistics Value</label>
                        <input
                          type="text"
                          value={formData.features[activeFeatureIndex].stats || ''}
                          onChange={(e) => handleFeatureChange(activeFeatureIndex, 'stats', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g., 10,000+"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Statistics Label</label>
                        <input
                          type="text"
                          value={formData.features[activeFeatureIndex].statLabel || ''}
                          onChange={(e) => handleFeatureChange(activeFeatureIndex, 'statLabel', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g., Happy Clients"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CTA Button Editor */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaArrowRight className="w-4 h-4 text-blue-600" />
              Call to Action Button
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={formData.ctaButtonText}
                  onChange={(e) => handleInputChange('ctaButtonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={formData.ctaButtonLink}
                  onChange={(e) => handleInputChange('ctaButtonLink', e.target.value)}
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