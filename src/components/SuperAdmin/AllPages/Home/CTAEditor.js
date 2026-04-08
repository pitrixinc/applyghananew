// components/SuperAdmin/AllPages/Home/CTAEditor.js
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
  FaArrowRight,
  FaHeart,
  FaHandHoldingHeart,
  FaRocket,
  FaLightbulb,
  FaStar,
  FaCheckCircle,
  FaPalette,
  FaImage,
  FaFont,
  FaAlignLeft,
  FaBullhorn
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CLOUDINARY_CLOUD_NAME = 'dpbntoeen';
const CLOUDINARY_UPLOAD_PRESET = 'my-photos';
const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dpbntoeen/image/upload`;

export default function CTAEditor({ data, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    layout: "split", // split, centered, compact
    title: "Fuel Dreams: Empower Tomorrow with Your Contribution Today",
    subtitle: "Join us in transforming ideas into reality. Support innovative projects and make a difference. Every contribution brings us closer to a brighter future. Empower change, one pledge at a time.",
    buttonText: "Get Started Today",
    buttonLink: "/contact",
    buttonVariant: "outline", // solid, outline, gradient
    leftImage: "https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&auto=format&fit=crop&w=654&q=80",
    rightImage: "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    backgroundColor: "#10b981",
    textColor: "#ffffff",
    accentColor: "#ffffff",
    overlayOpacity: 0.1,
    showBadge: true,
    badgeText: "Limited Time Offer",
    badgeIcon: "heart",
    animated: true
  });

  const [uploadingImages, setUploadingImages] = useState({});
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleImageUpload = async (e, imageField) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setUploadingImages(prev => ({ ...prev, [imageField]: true }));

    try {
      const result = await uploadToCloudinary(file);
      handleInputChange(imageField, result.url);
      handleInputChange(`${imageField}PublicId`, result.publicId);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [imageField]: false }));
    }
  };

  const removeImage = (imageField) => {
    handleInputChange(imageField, '');
    handleInputChange(`${imageField}PublicId`, null);
    toast.success('Image removed successfully');
  };

  const getButtonStyles = () => {
    switch(formData.buttonVariant) {
      case 'solid':
        return {
          backgroundColor: formData.accentColor,
          color: formData.backgroundColor,
          border: 'none'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: formData.accentColor,
          border: `2px solid ${formData.accentColor}`
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${formData.backgroundColor}, ${formData.accentColor})`,
          color: formData.textColor,
          border: 'none'
        };
      default:
        return {
          backgroundColor: formData.accentColor,
          color: formData.backgroundColor,
          border: 'none'
        };
    }
  };

  const renderBadgeIcon = () => {
    switch(formData.badgeIcon) {
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

  const CTAPreview = () => {
    if (formData.layout === 'split') {
      return (
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Left Content Column */}
              <div 
                className="p-8 md:p-12 lg:px-16 lg:py-24 relative overflow-hidden"
                style={{ backgroundColor: formData.backgroundColor }}
              >
                {/* Overlay Pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundColor: formData.accentColor }}
                />
                
                {/* Animated Background Elements */}
                {formData.animated && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
                      style={{ backgroundColor: `${formData.accentColor}20` }}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
                      style={{ backgroundColor: `${formData.accentColor}15` }}
                    />
                  </>
                )}

                <div className="relative z-10 mx-auto max-w-xl text-center">
                  {/* Badge */}
                  {formData.showBadge && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                      style={{ backgroundColor: `${formData.accentColor}20`, color: formData.accentColor }}
                    >
                      {renderBadgeIcon()}
                      <span className="text-sm font-medium">{formData.badgeText}</span>
                    </motion.div>
                  )}

                  {/* Title */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold md:text-3xl lg:text-4xl"
                    style={{ color: formData.textColor }}
                  >
                    {formData.title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hidden sm:mt-4 sm:block text-sm md:text-base"
                    style={{ color: `${formData.textColor}cc` }}
                  >
                    {formData.subtitle}
                  </motion.p>

                  {/* Button */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 md:mt-8"
                  >
                    <Link
                      href={formData.buttonLink}
                      className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3 text-sm md:text-base font-medium rounded-lg transition-all duration-300 hover:scale-105 group"
                      style={getButtonStyles()}
                    >
                      {formData.buttonText}
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Right Images Column */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
                {formData.leftImage && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative h-40 sm:h-56 md:h-full overflow-hidden rounded-xl"
                  >
                    <img
                      alt="CTA visual 1"
                      src={formData.leftImage}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </motion.div>
                )}
                {formData.rightImage && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative h-40 sm:h-56 md:h-full overflow-hidden rounded-xl"
                  >
                    <img
                      alt="CTA visual 2"
                      src={formData.rightImage}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (formData.layout === 'centered') {
      return (
        <section 
          className="relative py-20 lg:py-32 overflow-hidden"
          style={{ backgroundColor: formData.backgroundColor }}
        >
          {/* Background Image Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${formData.leftImage})` }}
          />
          
          {/* Animated Background */}
          {formData.animated && (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-10 left-10 w-72 h-72 rounded-full"
                style={{ backgroundColor: `${formData.accentColor}15` }}
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, -180, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-10 right-10 w-96 h-96 rounded-full"
                style={{ backgroundColor: `${formData.accentColor}10` }}
              />
            </>
          )}

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {formData.showBadge && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: `${formData.accentColor}20`, color: formData.accentColor }}
              >
                {renderBadgeIcon()}
                <span className="text-sm font-medium">{formData.badgeText}</span>
              </motion.div>
            )}

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: formData.textColor }}
            >
              {formData.title}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: `${formData.textColor}cc` }}
            >
              {formData.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href={formData.buttonLink}
                className="inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 text-base md:text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105 group"
                style={getButtonStyles()}
              >
                {formData.buttonText}
                <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      );
    }

    // Compact layout
    return (
      <section 
        className="relative py-12 lg:py-16 overflow-hidden"
        style={{ backgroundColor: formData.backgroundColor }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center lg:text-left">
              {formData.showBadge && (
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs"
                  style={{ backgroundColor: `${formData.accentColor}20`, color: formData.accentColor }}
                >
                  {renderBadgeIcon()}
                  <span className="font-medium">{formData.badgeText}</span>
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-bold" style={{ color: formData.textColor }}>
                {formData.title}
              </h3>
              <p className="text-sm mt-2 max-w-2xl" style={{ color: `${formData.textColor}cc` }}>
                {formData.subtitle}
              </p>
            </div>
            <div>
              <Link
                href={formData.buttonLink}
                className="inline-flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-medium rounded-lg transition-all duration-300 hover:scale-105 group whitespace-nowrap"
                style={getButtonStyles()}
              >
                {formData.buttonText}
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Call to Action Editor</h3>
          <p className="text-sm text-gray-500">Customize the CTA section of your homepage</p>
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
        <CTAPreview />
      ) : (
        <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {/* Layout Selection */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaEdit className="w-4 h-4 text-rose-600" />
              Layout Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleInputChange('layout', 'split')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.layout === 'split'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-rose-200'
                }`}
              >
                <div className="text-center">
                  <div className="w-full h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2 flex items-center justify-center gap-2">
                    <div className="w-1/2 h-full bg-rose-500/30 rounded-lg"></div>
                    <div className="w-1/2 h-full bg-gray-400/30 rounded-lg"></div>
                  </div>
                  <p className="font-medium text-gray-700">Split Layout</p>
                  <p className="text-xs text-gray-500 mt-1">Content + Images</p>
                </div>
              </button>
              <button
                onClick={() => handleInputChange('layout', 'centered')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.layout === 'centered'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-rose-200'
                }`}
              >
                <div className="text-center">
                  <div className="w-full h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-rose-500/30 rounded-lg"></div>
                  </div>
                  <p className="font-medium text-gray-700">Centered Layout</p>
                  <p className="text-xs text-gray-500 mt-1">Content centered</p>
                </div>
              </button>
              <button
                onClick={() => handleInputChange('layout', 'compact')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.layout === 'compact'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-rose-200'
                }`}
              >
                <div className="text-center">
                  <div className="w-full h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2 flex items-center justify-between px-4">
                    <div className="w-1/2 h-8 bg-rose-500/30 rounded"></div>
                    <div className="w-1/4 h-8 bg-gray-400/30 rounded"></div>
                  </div>
                  <p className="font-medium text-gray-700">Compact Layout</p>
                  <p className="text-xs text-gray-500 mt-1">Inline content</p>
                </div>
              </button>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaFont className="w-4 h-4 text-blue-600" />
              Content Settings
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <textarea
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter main title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter subtitle description"
                />
              </div>
            </div>
          </div>

          {/* Badge Settings */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaStar className="w-4 h-4 text-yellow-600" />
              Badge Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.showBadge}
                    onChange={(e) => handleInputChange('showBadge', e.target.checked)}
                    className="w-4 h-4 text-yellow-600 rounded"
                  />
                  Show Badge
                </label>
              </div>
              {formData.showBadge && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                    <input
                      type="text"
                      value={formData.badgeText}
                      onChange={(e) => handleInputChange('badgeText', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge Icon</label>
                    <select
                      value={formData.badgeIcon}
                      onChange={(e) => handleInputChange('badgeIcon', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="heart">Heart</option>
                      <option value="hand">Hand Holding Heart</option>
                      <option value="rocket">Rocket</option>
                      <option value="lightbulb">Lightbulb</option>
                      <option value="star">Star</option>
                      <option value="bullhorn">Bullhorn</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Button Settings */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaArrowRight className="w-4 h-4 text-green-600" />
              Button Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Variant</label>
                <select
                  value={formData.buttonVariant}
                  onChange={(e) => handleInputChange('buttonVariant', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="solid">Solid</option>
                  <option value="outline">Outline</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaPalette className="w-4 h-4 text-purple-600" />
              Color Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => handleInputChange('textColor', e.target.value)}
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

          {/* Image Uploads (for split layout) */}
          {formData.layout === 'split' && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaImage className="w-4 h-4 text-indigo-600" />
                Images (Split Layout)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Left Image</label>
                  {formData.leftImage ? (
                    <div className="relative">
                      <img
                        src={formData.leftImage}
                        alt="Left CTA visual"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage('leftImage')}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingImages.leftImage ? (
                          <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                        ) : (
                          <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm text-gray-500">Click to upload left image</p>
                        <p className="text-xs text-gray-400">Recommended: 800x600px</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'leftImage')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Right Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Right Image</label>
                  {formData.rightImage ? (
                    <div className="relative">
                      <img
                        src={formData.rightImage}
                        alt="Right CTA visual"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage('rightImage')}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingImages.rightImage ? (
                          <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                        ) : (
                          <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm text-gray-500">Click to upload right image</p>
                        <p className="text-xs text-gray-400">Recommended: 800x600px</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'rightImage')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Animation Settings */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaAlignLeft className="w-4 h-4 text-orange-600" />
              Animation Settings
            </h4>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.animated}
                  onChange={(e) => handleInputChange('animated', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                Enable Animated Background Elements
              </label>
              <p className="text-xs text-gray-500 mt-1">Adds floating animated shapes to the background</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}