// components/SuperAdmin/AllPages/Home/TrustedPartnersEditor.js
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
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendar,
  FaUsers,
  FaStar,
  FaGlobe,
  FaUniversity,
  FaGraduationCap,
  FaChartLine,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import { HiOutlineBuildingLibrary, HiOutlineMapPin, HiOutlineUsers, HiOutlineCalendar, HiOutlineStar } from 'react-icons/hi2';
import { PiStudent, PiGraduationCap } from 'react-icons/pi';
import { TbCertificate, TbWorld } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';

const CLOUDINARY_CLOUD_NAME = 'dpbntoeen';
const CLOUDINARY_UPLOAD_PRESET = 'my-photos';
const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dpbntoeen/image/upload`;

export default function TrustedPartnersEditor({ data, onSave, isSaving }) {
  const [formData, setFormData] = useState({
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
        image: "https://scontent.facc5-1.fna.fbcdn.net/v/t39.30808-6/547196686_1298013629003290_9138187764548139471_n.jpg",
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
        image: "https://cedirates.com/_next/image/?url=https%3A%2F%2Fwww.myjoyonline.com%2Fwp-content%2Fuploads%2F2026%2F02%2Flogo2-1024x683.jpg",
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
    ctaButtonLink: "/contact",
    backgroundColor: "#ffffff",
    accentColor: "#10b981"
  });

  const [activePartnerType, setActivePartnerType] = useState('ghanaianPartners');
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);
  const [uploadingImages, setUploadingImages] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...formData.stats];
    updatedStats[index][field] = value;
    setFormData(prev => ({ ...prev, stats: updatedStats }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { label: "New Stat", value: "0", icon: "building" }]
    }));
  };

  const removeStat = (index) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const handlePartnerChange = (type, index, field, value) => {
    const updatedPartners = [...formData[type]];
    updatedPartners[index][field] = value;
    setFormData(prev => ({ ...prev, [type]: updatedPartners }));
  };

  const addPartner = (type) => {
    const newPartner = {
      id: Date.now(),
      name: "New University",
      location: "Location",
      type: "University Type",
      established: "2024",
      students: "0",
      ranking: "Ranking",
      description: "University description goes here...",
      achievements: "Notable achievements",
      programs: ["Program 1", "Program 2"],
      image: "",
      logo: "",
      studentsPlaced: 0,
      successRate: "0%"
    };
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], newPartner]
    }));
    setActivePartnerIndex(formData[type].length);
  };

  const removePartner = (type, index) => {
    if (formData[type].length === 1) {
      toast.error(`Cannot remove the last ${type} partner`);
      return;
    }
    const updatedPartners = formData[type].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [type]: updatedPartners }));
    if (activePartnerIndex >= updatedPartners.length) {
      setActivePartnerIndex(updatedPartners.length - 1);
    }
  };

  const addProgram = (type, partnerIndex) => {
    const updatedPartners = [...formData[type]];
    updatedPartners[partnerIndex].programs.push("New Program");
    setFormData(prev => ({ ...prev, [type]: updatedPartners }));
  };

  const removeProgram = (type, partnerIndex, programIndex) => {
    const updatedPartners = [...formData[type]];
    updatedPartners[partnerIndex].programs.splice(programIndex, 1);
    setFormData(prev => ({ ...prev, [type]: updatedPartners }));
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

  const handleImageUpload = async (e, type, partnerIndex, imageType) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const uploadKey = `${type}-${partnerIndex}-${imageType}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const result = await uploadToCloudinary(file);
      const updatedPartners = [...formData[type]];
      updatedPartners[partnerIndex][imageType] = result.url;
      updatedPartners[partnerIndex][`${imageType}PublicId`] = result.publicId;
      setFormData(prev => ({ ...prev, [type]: updatedPartners }));
      toast.success(`${imageType} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const removeImage = (type, partnerIndex, imageType) => {
    const updatedPartners = [...formData[type]];
    updatedPartners[partnerIndex][imageType] = "";
    updatedPartners[partnerIndex][`${imageType}PublicId`] = null;
    setFormData(prev => ({ ...prev, [type]: updatedPartners }));
    toast.success(`${imageType} removed successfully`);
  };

  const renderIcon = (iconType, className = "w-6 h-6") => {
    switch(iconType) {
      case 'building':
        return <FaBuilding className={className} />;
      case 'globe':
        return <FaGlobe className={className} />;
      case 'calendar':
        return <FaCalendar className={className} />;
      case 'users':
        return <FaUsers className={className} />;
      default:
        return <FaUniversity className={className} />;
    }
  };

  const TrustedPartnersPreview = () => (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: formData.backgroundColor }}>
      {/* Background Elements */}
      <div className="absolute inset-0">
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

        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: `${formData.accentColor}20` }}
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${formData.accentColor}20` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${formData.accentColor}10`, borderColor: formData.accentColor, borderWidth: 1 }}>
            <HiOutlineBuildingLibrary className="w-4 h-4" style={{ color: formData.accentColor }} />
            <span className="text-sm font-medium" style={{ color: formData.accentColor }}>{formData.badgeText}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {formData.sectionTitle.split(' ').map((word, index) => 
              word.toLowerCase() === 'partners' ? (
                <span key={index} className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{word} </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            {formData.sectionSubtitle}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {formData.stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold" style={{ color: formData.accentColor }}>{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Ghanaian Partners */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-3">
            <HiOutlineMapPin className="w-6 h-6" style={{ color: formData.accentColor }} />
            <span>Ghanaian Universities</span>
            <span className="text-sm font-normal text-gray-400 ml-2">({formData.ghanaianPartners.length} Partners)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formData.ghanaianPartners.map((partner, idx) => (
              <motion.div
                key={partner.id}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedPartner({ ...partner, type: 'ghanaian' })}
                className="group relative cursor-pointer"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 mb-3 rounded-full p-2 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${formData.accentColor}10` }}>
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <FaUniversity className="w-10 h-10" style={{ color: formData.accentColor }} />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                    {partner.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">{partner.location.split(',')[0]}</p>
                  
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: `${formData.accentColor}10` }}>
                    <PiStudent className="w-3 h-3" style={{ color: formData.accentColor }} />
                    <span className="text-xs font-medium" style={{ color: formData.accentColor }}>{partner.studentsPlaced}+</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* International Partners */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-3">
            <TbWorld className="w-6 h-6" style={{ color: formData.accentColor }} />
            <span>International Partners</span>
            <span className="text-sm font-normal text-gray-400 ml-2">({formData.internationalPartners.length} Countries)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formData.internationalPartners.map((partner, idx) => (
              <motion.div
                key={partner.id}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedPartner({ ...partner, type: 'international' })}
                className="group relative cursor-pointer"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 mb-3 rounded-full p-2 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${formData.accentColor}10` }}>
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <FaGlobe className="w-10 h-10" style={{ color: formData.accentColor }} />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                    {partner.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">{partner.location}</p>
                  
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: `${formData.accentColor}10` }}>
                    <HiOutlineStar className="w-3 h-3" style={{ color: formData.accentColor }} />
                    <span className="text-xs font-medium" style={{ color: formData.accentColor }}>{partner.successRate}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Want to study at one of these institutions?</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 group" style={{ background: `linear-gradient(135deg, ${formData.accentColor}, ${formData.accentColor}cc)` }}>
            <span>{formData.ctaButtonText}</span>
            <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Partner Modal Preview */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setSelectedPartner(null)}>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <button onClick={() => setSelectedPartner(null)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-colors shadow-lg">
                <FaTimes className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-5/12 relative h-64 lg:h-auto">
                  <img src={selectedPartner.image} alt={selectedPartner.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <HiOutlineBuildingLibrary className="w-5 h-5 text-green-300" />
                      <span className="text-sm font-medium text-green-300">{selectedPartner.type}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{selectedPartner.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <HiOutlineMapPin className="w-4 h-4" />
                      <span>{selectedPartner.location}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-7/12 p-8">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl p-4" style={{ backgroundColor: `${formData.accentColor}10` }}>
                      <HiOutlineCalendar className="w-5 h-5 mb-2" style={{ color: formData.accentColor }} />
                      <div className="text-sm text-gray-500">Established</div>
                      <div className="text-lg font-bold text-gray-900">{selectedPartner.established}</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: `${formData.accentColor}10` }}>
                      <PiStudent className="w-5 h-5 mb-2" style={{ color: formData.accentColor }} />
                      <div className="text-sm text-gray-500">Students</div>
                      <div className="text-lg font-bold text-gray-900">{selectedPartner.students}</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: `${formData.accentColor}10` }}>
                      <TbCertificate className="w-5 h-5 mb-2" style={{ color: formData.accentColor }} />
                      <div className="text-sm text-gray-500">Ranking</div>
                      <div className="text-lg font-bold text-gray-900">{selectedPartner.ranking}</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: `${formData.accentColor}10` }}>
                      <HiOutlineUsers className="w-5 h-5 mb-2" style={{ color: formData.accentColor }} />
                      <div className="text-sm text-gray-500">Placed Students</div>
                      <div className="text-lg font-bold text-gray-900">{selectedPartner.studentsPlaced}</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">About</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedPartner.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Notable Achievements</h4>
                    <p className="text-gray-700">{selectedPartner.achievements}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Programs</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.programs.map((program, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-green-100 hover:text-green-600 transition-colors cursor-default">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${formData.accentColor}, ${formData.accentColor}cc)` }}>
                    <div>
                      <div className="text-sm opacity-90">Our Success Rate</div>
                      <div className="text-2xl font-bold">{selectedPartner.successRate}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Students Placed</div>
                      <div className="text-2xl font-bold">{selectedPartner.studentsPlaced}+</div>
                    </div>
                    <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Trusted Partners Editor</h3>
          <p className="text-sm text-gray-500">Customize the trusted partners section of your homepage</p>
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
        <TrustedPartnersPreview />
      ) : (
        <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {/* Section Header Editor */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaEdit className="w-4 h-4 text-indigo-600" />
              Section Header
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => handleInputChange('badgeText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={formData.sectionTitle}
                  onChange={(e) => handleInputChange('sectionTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={formData.sectionSubtitle}
                  onChange={(e) => handleInputChange('sectionSubtitle', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-pink-500" />
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

          {/* Stats Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <FaChartLine className="w-4 h-4 text-blue-600" />
                Statistics
              </h4>
              <button
                onClick={addStat}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <FaPlus className="w-3 h-3" /> Add Stat
              </button>
            </div>
            <div className="space-y-3">
              {formData.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <select
                    value={stat.icon}
                    onChange={(e) => handleStatChange(idx, 'icon', e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="building">Building</option>
                    <option value="globe">Globe</option>
                    <option value="calendar">Calendar</option>
                    <option value="users">Users</option>
                  </select>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => removeStat(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Partners Editor */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
              <button
                onClick={() => setActivePartnerType('ghanaian')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  activePartnerType === 'ghanaian'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaBuilding className="w-4 h-4" />
                Ghanaian Partners
              </button>
              <button
                onClick={() => setActivePartnerType('international')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  activePartnerType === 'international'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaGlobe className="w-4 h-4" />
                International Partners
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <FaUniversity className="w-4 h-4 text-green-600" />
                {activePartnerType === 'ghanaian' ? 'Ghanaian Universities' : 'International Universities'}
              </h4>
              <button
                onClick={() => addPartner(activePartnerType)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <FaPlus className="w-3 h-3" /> Add Partner
              </button>
            </div>

            {/* Partner Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              {formData[activePartnerType].map((partner, idx) => (
                <button
                  key={partner.id}
                  onClick={() => setActivePartnerIndex(idx)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activePartnerIndex === idx
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaUniversity className="w-4 h-4" />
                  {partner.name.length > 20 ? partner.name.substring(0, 20) + '...' : partner.name}
                  {formData[activePartnerType].length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePartner(activePartnerType, idx);
                      }}
                      className="ml-2 hover:text-red-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  )}
                </button>
              ))}
            </div>

            {/* Active Partner Editor */}
            {formData[activePartnerType][activePartnerIndex] && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
                    <input
                      type="text"
                      value={formData[activePartnerType][activePartnerIndex].name}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData[activePartnerType][activePartnerIndex].location}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University Type</label>
                    <input
                      type="text"
                      value={formData[activePartnerType][activePartnerIndex].type}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Established</label>
                    <input
                      type="text"
                      value={formData[activePartnerType][activePartnerIndex].established}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'established', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student Count</label>
                    <input
                      type="text"
                      value={formData[activePartnerType][activePartnerIndex].students}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'students', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ranking</label>
                    <input
                      type="text"
                      value={formData[activePartnerType][activePartnerIndex].ranking}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'ranking', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Students Placed</label>
                    <input
                      type="number"
                      value={formData[activePartnerType][activePartnerIndex].studentsPlaced}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'studentsPlaced', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Success Rate</label>
                    <input
                      type="text"
                      value={formData[activePartnerType][activePartnerIndex].successRate}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'successRate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., 96%"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData[activePartnerType][activePartnerIndex].description}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'description', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                    <textarea
                      value={formData[activePartnerType][activePartnerIndex].achievements}
                      onChange={(e) => handlePartnerChange(activePartnerType, activePartnerIndex, 'achievements', e.target.value)}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                    {formData[activePartnerType][activePartnerIndex].image ? (
                      <div className="relative">
                        <img
                          src={formData[activePartnerType][activePartnerIndex].image}
                          alt="Cover"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(activePartnerType, activePartnerIndex, 'image')}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingImages[`${activePartnerType}-${activePartnerIndex}-image`] ? (
                            <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
                          ) : (
                            <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                          )}
                          <p className="text-sm text-gray-500">Click to upload cover image</p>
                          <p className="text-xs text-gray-400">Recommended: 1200x800px</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, activePartnerType, activePartnerIndex, 'image')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    {formData[activePartnerType][activePartnerIndex].logo ? (
                      <div className="relative inline-block">
                        <img
                          src={formData[activePartnerType][activePartnerIndex].logo}
                          alt="Logo"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(activePartnerType, activePartnerIndex, 'logo')}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          {uploadingImages[`${activePartnerType}-${activePartnerIndex}-logo`] ? (
                            <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
                          ) : (
                            <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                          )}
                          <p className="text-xs text-gray-500 text-center">Upload Logo</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, activePartnerType, activePartnerIndex, 'logo')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Programs Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Popular Programs</label>
                    <button
                      onClick={() => addProgram(activePartnerType, activePartnerIndex)}
                      className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <FaPlus className="w-3 h-3" /> Add Program
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData[activePartnerType][activePartnerIndex].programs.map((program, programIdx) => (
                      <div key={programIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={program}
                          onChange={(e) => {
                            const updatedPartners = [...formData[activePartnerType]];
                            updatedPartners[activePartnerIndex].programs[programIdx] = e.target.value;
                            setFormData(prev => ({ ...prev, [activePartnerType]: updatedPartners }));
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Program name"
                        />
                        <button
                          onClick={() => removeProgram(activePartnerType, activePartnerIndex, programIdx)}
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

          {/* CTA Button Editor */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaArrowRight className="w-4 h-4 text-green-600" />
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