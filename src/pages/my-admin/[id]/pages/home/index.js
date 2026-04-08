// /my-admin/[id]/pages/home.js
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { 
  FaTimes, 
  FaImage, 
  FaSave, 
  FaEye, 
  FaEdit,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { MdDashboard, MdHome, MdInfo, MdContactPage } from 'react-icons/md';
import HeroEditor from '@/components/SuperAdmin/AllPages/Home/HeroEditor';
import ServicesEditor from '@/components/SuperAdmin/AllPages/Home/ServicesEditor';
import WhyChooseUsEditor from '@/components/SuperAdmin/AllPages/Home/WhyChooseUsEditor';
import TestimonialEditor from '@/components/SuperAdmin/AllPages/Home/TestimonialEditor';
import TrustedPartnersEditor from '@/components/SuperAdmin/AllPages/Home/TrustedPartnersEditor';
import CTAEditor from '@/components/SuperAdmin/AllPages/Home/CTAEditor';
import { db } from '@/firebase.config';

export default function HomePageEditor() {
  const [homeData, setHomeData] = useState({
    heroSection: null,
    servicesSection: null,
    whyChooseUsSection: null,
    testimonialSection: null,
    trustedPartnersSection: null,
    ctaSection: null
  });

  const router = useRouter();
  const { id } = router.query;

  const [activeSection, setActiveSection] = useState('heroSection');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const handleClose = () => {
    if (id) {
      router.push(`/my-admin/${id}/dashboard`);
    }
  };

  useEffect(() => {
    const fetchAllHomeSections = async () => {
      if (!id) return;
      
      try {
        const sections = [
          'heroSection',
          'servicesSection', 
          'whyChooseUsSection',
          'testimonialSection',
          'trustedPartnersSection',
          'ctaSection'
        ];

        const sectionData = {};
        
        for (const section of sections) {
          const sectionRef = doc(db, 'pages/home/sections', section);
          const sectionSnap = await getDoc(sectionRef);
          sectionData[section] = sectionSnap.exists() ? sectionSnap.data() : null;
        }

        setHomeData(sectionData);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        toast.error('Failed to load page data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllHomeSections();
  }, [id]);

  const handleSave = async (section, sectionData) => {
    setIsSaving(true);
    try {
      const sectionRef = doc(db, 'pages/home/sections', section);
      const sectionSnap = await getDoc(sectionRef);

      if (sectionSnap.exists()) {
        await updateDoc(sectionRef, sectionData);
      } else {
        await setDoc(sectionRef, sectionData);
      }

      setHomeData(prev => ({
        ...prev,
        [section]: sectionData
      }));

      toast.success(`${section.replace('Section', '')} section saved successfully!`);
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error(`Error saving section: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'heroSection', name: 'Hero Section', icon: <FaImage className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'servicesSection', name: 'Services Section', icon: <MdHome className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'whyChooseUsSection', name: 'Why Choose Us', icon: <MdInfo className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
    { id: 'testimonialSection', name: 'Testimonials', icon: <MdContactPage className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
    { id: 'trustedPartnersSection', name: 'Trusted Partners', icon: <MdDashboard className="w-5 h-5" />, color: 'from-indigo-500 to-purple-500' },
    { id: 'ctaSection', name: 'Call to Action', icon: <FaEdit className="w-5 h-5" />, color: 'from-rose-500 to-pink-500' }
  ];

  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'heroSection':
        return (
          <HeroEditor
            data={homeData.heroSection}
            onSave={(data) => handleSave('heroSection', data)}
            isSaving={isSaving}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview(!showPreview)}
          />
        );
      case 'servicesSection':
        return (
          <ServicesEditor
            data={homeData.servicesSection}
            onSave={(data) => handleSave('servicesSection', data)}
            isSaving={isSaving}
          />
        );
      case 'whyChooseUsSection':
        return (
          <WhyChooseUsEditor
            data={homeData.whyChooseUsSection}
            onSave={(data) => handleSave('whyChooseUsSection', data)}
            isSaving={isSaving}
          />
        );
      case 'testimonialSection':
        return (
          <TestimonialEditor
            data={homeData.testimonialSection}
            onSave={(data) => handleSave('testimonialSection', data)}
            isSaving={isSaving}
          />
        );
      case 'trustedPartnersSection':
        return (
          <TrustedPartnersEditor
            data={homeData.trustedPartnersSection}
            onSave={(data) => handleSave('trustedPartnersSection', data)}
            isSaving={isSaving}
          />
        );
      case 'ctaSection':
        return (
          <CTAEditor
            data={homeData.ctaSection}
            onSave={(data) => handleSave('ctaSection', data)}
            isSaving={isSaving}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Section</h3>
              <p className="text-gray-500">Choose a section from the sidebar to start editing</p>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Home Page Editor
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage all sections of your homepage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  showPreview 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaEye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-24 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-800">Page Sections</h2>
                <p className="text-sm text-gray-500 mt-1">Click to edit each section</p>
              </div>
              <nav className="p-4">
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
                        activeSection === section.id 
                          ? `bg-gradient-to-r ${section.color} text-white shadow-lg` 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`${activeSection === section.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {section.icon}
                      </div>
                      <span className="flex-1 font-medium">{section.name}</span>
                      {activeSection === section.id && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </nav>
              
              {/* Info Box */}
              <div className="p-4 m-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaSave className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Changes are saved automatically when you click the save button in each editor. Make sure to save before switching sections.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {sections.find(s => s.id === activeSection)?.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Edit and customize the {sections.find(s => s.id === activeSection)?.name.toLowerCase()}
                    </p>
                  </div>
                  {isSaving && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                {renderSectionEditor()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}