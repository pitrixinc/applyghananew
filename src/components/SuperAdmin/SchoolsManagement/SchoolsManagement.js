// src/pages/admin/schools.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  limit,
  startAfter,
  where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Filter,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  MapPin,
  DollarSign,
  BookOpen,
  Building2,
  GraduationCap,
  School,
  Star,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Globe,
  Phone,
  Mail,
  Calendar,
  Users,
  Award,
  TrendingUp,
  BarChart3,
  Settings,
  MoreVertical,
  Download,
  Printer,
  Copy,
  RefreshCw
} from 'lucide-react';
import { auth, db } from '@/firebase.config';

export default function SchoolsManagement() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalSchools, setTotalSchools] = useState(0);
  const [expandedSchool, setExpandedSchool] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState([]);
  
  const router = useRouter();
  const { id } = router.query;

  // School types with icons and colors
  const schoolTypes = [
    { value: 'all', label: 'All Schools', icon: School, color: 'gray' },
    { value: 'SHS', label: 'High Schools', icon: GraduationCap, color: 'blue' },
    { value: 'University', label: 'Universities', icon: Building2, color: 'purple' }
  ];

  // Stats cards data
  const stats = [
    { label: 'Total Schools', value: schools.length, icon: Building2, color: 'emerald', change: '+12%' },
    { label: 'High Schools', value: schools.filter(s => s.type === 'SHS').length, icon: GraduationCap, color: 'blue', change: '+5%' },
    { label: 'Universities', value: schools.filter(s => s.type === 'University').length, icon: Building2, color: 'purple', change: '+8%' },
    { label: 'Active Courses', value: schools.reduce((acc, s) => acc + (s.courses?.length || 0), 0), icon: BookOpen, color: 'orange', change: '+15%' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchSchools();
      } else {
        router.push('/auth/signin');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const schoolsRef = collection(db, 'schools');
      const q = query(schoolsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const schoolsData = [];
      querySnapshot.forEach((doc) => {
        schoolsData.push({ id: doc.id, ...doc.data() });
      });
      setSchools(schoolsData);
      setFilteredSchools(schoolsData);
      setTotalSchools(schoolsData.length);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = schools;
    
    if (searchTerm) {
      filtered = filtered.filter(school => 
        school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.location?.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(school => school.type === selectedType);
    }
    
    setFilteredSchools(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, schools]);

  const handleCreateSchool = async (schoolData) => {
    try {
      const schoolsRef = collection(db, 'schools');
      await addDoc(schoolsRef, {
        ...schoolData,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.uid,
        status: 'active',
        featuredImages: schoolData.featuredImages || [],
        totalCourses: schoolData.courses?.length || 0,
        rating: 0,
        reviews: 0
      });
      await fetchSchools();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating school:', error);
    }
  };

  const handleUpdateSchool = async (schoolData) => {
    try {
      const schoolRef = doc(db, 'schools', selectedSchool.id);
      await updateDoc(schoolRef, {
        ...schoolData,
        updatedAt: new Date(),
        updatedBy: user.uid
      });
      await fetchSchools();
      setShowEditModal(false);
      setSelectedSchool(null);
    } catch (error) {
      console.error('Error updating school:', error);
    }
  };

  const handleDeleteSchool = async () => {
    try {
      const schoolRef = doc(db, 'schools', selectedSchool.id);
      await deleteDoc(schoolRef);
      await fetchSchools();
      setShowDeleteModal(false);
      setSelectedSchool(null);
    } catch (error) {
      console.error('Error deleting school:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const promises = selectedSchools.map(id => {
        const schoolRef = doc(db, 'schools', id);
        return deleteDoc(schoolRef);
      });
      await Promise.all(promises);
      await fetchSchools();
      setSelectedSchools([]);
      setBulkSelectMode(false);
    } catch (error) {
      console.error('Error bulk deleting:', error);
    }
  };

  const handleExportData = () => {
    const dataToExport = filteredSchools.map(school => ({
      name: school.name,
      type: school.type,
      region: school.location?.region,
      city: school.location?.city,
      fees_min: school.fees?.min,
      fees_max: school.fees?.max,
      totalCourses: school.totalCourses,
      status: school.status,
      createdAt: school.createdAt?.toDate()
    }));
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schools_export_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchools.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const SchoolFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState(initialData || {
      name: '',
      type: 'SHS',
      location: { region: '', city: '', coordinates: { lat: '', lng: '' } },
      fees: { min: '', max: '' },
      description: '',
      contact: { phone: '', email: '', website: '' },
      accreditation: '',
      established: '',
      studentCount: '',
      logoUrl: '',
      bannerUrl: '',
      featuredImages: [],
      courses: []
    });
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e, type) => {
      const file = e.target.files[0];
      const formDataImg = new FormData();
      formDataImg.append('file', file);
      formDataImg.append('upload_preset', 'my-photos');
      
      setUploading(true);
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dpbntoeen/image/upload`,
          { method: 'POST', body: formDataImg }
        );
        const data = await response.json();
        
        if (type === 'logo') {
          setFormData({ ...formData, logoUrl: data.secure_url });
        } else if (type === 'banner') {
          setFormData({ ...formData, bannerUrl: data.secure_url });
        } else {
          setFormData({ ...formData, featuredImages: [...formData.featuredImages, data.secure_url] });
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    };

    const removeFeaturedImage = (index) => {
      const newImages = [...formData.featuredImages];
      newImages.splice(index, 1);
      setFormData({ ...formData, featuredImages: newImages });
    };

    return (
      <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {initialData ? 'Edit School' : 'Create New School'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <School className="w-5 h-5 text-green-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Prempeh College"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="SHS">Senior High School (SHS)</option>
                    <option value="University">University</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                  <input
                    type="text"
                    value={formData.established}
                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 1950"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Location
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
                  <select
                    value={formData.location.region}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, region: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Region</option>
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Western">Western</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Central">Central</option>
                    <option value="Volta">Volta</option>
                    <option value="Northern">Northern</option>
                    <option value="Upper East">Upper East</option>
                    <option value="Upper West">Upper West</option>
                    <option value="Bono">Bono</option>
                    <option value="Ahafo">Ahafo</option>
                    <option value="Savannah">Savannah</option>
                    <option value="North East">North East</option>
                    <option value="Oti">Oti</option>
                    <option value="Western North">Western North</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City/Town *</label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Kumasi"
                  />
                </div>
              </div>
            </div>

            {/* Fees Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Fee Structure (GHS per year)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Fee</label>
                  <input
                    type="number"
                    value={formData.fees.min}
                    onChange={(e) => setFormData({ ...formData, fees: { ...formData.fees, min: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Fee</label>
                  <input
                    type="number"
                    value={formData.fees.max}
                    onChange={(e) => setFormData({ ...formData, fees: { ...formData.fees, max: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 15000"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 0244123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., info@school.edu.gh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.contact.website}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, website: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="https://school.edu.gh"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Describe the school, its history, achievements, and unique features..."
              ></textarea>
            </div>

            {/* Images Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {formData.logoUrl ? (
                      <div className="relative">
                        <img src={formData.logoUrl} alt="Logo" width={100} height={100} className="mx-auto" />
                        <button
                          onClick={() => setFormData({ ...formData, logoUrl: '' })}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload logo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                      </label>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {formData.bannerUrl ? (
                      <div className="relative">
                        <img src={formData.bannerUrl} alt="Banner" width={200} height={100} className="mx-auto" />
                        <button
                          onClick={() => setFormData({ ...formData, bannerUrl: '' })}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload banner</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'banner')} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {formData.featuredImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Gallery ${idx}`} width={100} height={100} className="rounded-lg" />
                        <button
                          onClick={() => removeFeaturedImage(idx)}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="cursor-pointer block text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">Add gallery images</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery')} />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
              disabled={uploading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : initialData ? 'Update School' : 'Create School'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SchoolCard = ({ school, onEdit, onDelete, onExpand, isExpanded }) => {
    const [showMenu, setShowMenu] = useState(false);
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Banner Section */}
        <div className="relative h-32 bg-gradient-to-r from-green-600 to-emerald-600">
        {/*  {school.bannerUrl && (
            <img src={school.bannerUrl} alt={school.name} fill className="object-cover w-full" />
          )} */}
          <div className="absolute inset-0 bg-black opacity-30"></div>
          
          {/* Logo */}
          <div className="absolute -bottom-8 left-4">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg overflow-hidden border-4 border-white">
              {school.logoUrl ? (
                <img src={school.logoUrl} alt={school.name} width={64} height={64} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <School className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          
          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100 transition"
          >
            <MoreVertical className="w-4 h-4 text-gray-700" />
          </button>
          
          {showMenu && (
            <div className="absolute top-12 right-3 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
              <button
                onClick={() => { onEdit(school); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4 text-blue-500" /> Edit
              </button>
              <button
                onClick={() => { onDelete(school); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-red-500" /> Delete
              </button>
              <button
                onClick={() => { onExpand(school.id === isExpanded ? null : school.id); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-gray-500" /> {isExpanded === school.id ? 'Collapse' : 'Expand'}
              </button>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="pt-10 px-4 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{school.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  school.type === 'SHS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {school.type === 'SHS' ? 'High School' : 'University'}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {school.location?.city}, {school.location?.region}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-green-600">
                GHS {school.fees?.min?.toLocaleString()} - {school.fees?.max?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">per year</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{school.description}</p>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{school.totalCourses || 0} Courses</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{school.rating || 0} ({school.reviews || 0})</span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/my-admin/${id}/schools/${school.id}/courses`)}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Manage Courses →
            </button>
          </div>
        </div>
        
        {/* Expanded Details */}
        {isExpanded === school.id && (
          <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Contact</div>
                <div className="font-medium">{school.contact?.phone || 'N/A'}</div>
                <div className="text-xs text-gray-400">{school.contact?.email || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-500">Website</div>
                <a href={school.contact?.website} target="_blank" className="text-green-600 hover:underline text-sm">
                  {school.contact?.website || 'N/A'}
                </a>
              </div>
              <div>
                <div className="text-gray-500">Established</div>
                <div className="font-medium">{school.established || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-500">Accreditation</div>
                <div className="font-medium">{school.accreditation || 'Pending'}</div>
              </div>
            </div>
            {school.featuredImages?.length > 0 && (
              <div>
                <div className="text-gray-500 text-sm mb-2">Gallery</div>
                <div className="flex gap-2 overflow-x-auto">
                  {school.featuredImages.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="w-16 h-16 relative flex-shrink-0">
                      <img src={img} alt={`Gallery ${idx}`} fill className="rounded-lg object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Schools Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage all educational institutions in Ghana</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add New School
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-2">{stat.change} from last month</p>
                </div>
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="px-6 pb-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by school name, city, or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {schoolTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                      selectedType === type.value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
              <button
                onClick={() => setBulkSelectMode(!bulkSelectMode)}
                className={`px-3 py-2 border rounded-lg transition flex items-center gap-2 ${
                  bulkSelectMode ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {bulkSelectMode ? <Check className="w-4 h-4" /> : <Check className="w-4 h-4 text-gray-400" />}
                Select
              </button>
              {selectedSchools.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete ({selectedSchools.length})
                </button>
              )}
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-3">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Regions</option>
                <option>Greater Accra</option>
                <option>Ashanti</option>
                <option>Western</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Fee Ranges</option>
                <option>Below GHS 5,000</option>
                <option>GHS 5,000 - 10,000</option>
                <option>GHS 10,000 - 20,000</option>
                <option>Above GHS 20,000</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Accreditation Status</option>
                <option>Accredited</option>
                <option>Pending</option>
                <option>Provisional</option>
              </select>
              <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Schools Grid */}
      <div className="px-6 pb-6">
        {currentItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No schools found</h3>
            <p className="text-gray-500 mb-4">Create your first school to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New School
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {currentItems.map((school) => (
              <div key={school.id} className="relative">
                {bulkSelectMode && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-6 z-10">
                    <input
                      type="checkbox"
                      checked={selectedSchools.includes(school.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSchools([...selectedSchools, school.id]);
                        } else {
                          setSelectedSchools(selectedSchools.filter(id => id !== school.id));
                        }
                      }}
                      className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                  </div>
                )}
                <div className={`${bulkSelectMode ? 'ml-6' : ''}`}>
                  <SchoolCard
                    school={school}
                    onEdit={(school) => {
                      setSelectedSchool(school);
                      setShowEditModal(true);
                    }}
                    onDelete={(school) => {
                      setSelectedSchool(school);
                      setShowDeleteModal(true);
                    }}
                    onExpand={(id) => setExpandedSchool(expandedSchool === id ? null : id)}
                    isExpanded={expandedSchool}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSchools.length)} of {filteredSchools.length} schools
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <SchoolFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSchool}
      />
      
      <SchoolFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSchool(null);
        }}
        onSubmit={handleUpdateSchool}
        initialData={selectedSchool}
      />
      
      {/* Delete Confirmation Modal */}
      <div className={`fixed inset-0 z-50 ${showDeleteModal ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)}></div>
        <div className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete School</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedSchool?.name}</span>? This action cannot be undone and will also delete all associated courses.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSchool}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}