// src/pages/admin/schools/[schoolId]/courses.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  GraduationCap,
  DollarSign,
  Clock,
  Users,
  Award,
  TrendingUp,
  Calendar,
  AlertCircle,
  Loader2,
  Copy,
  RefreshCw,
  BarChart3,
  Settings,
  MoreVertical,
  Eye,
  Star,
  Zap,
  Shield,
  Target,
  Brain,
  Heart,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Layers,
  Grid,
  List,
  SortAsc,
  SortDesc,
  FilterX,
  Briefcase,
  GripVertical,
  PlusCircle,
  MinusCircle,
  Save,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle
} from 'lucide-react';
import { auth, db } from '@/firebase.config';

export default function CoursesManagement() {
  const router = useRouter();
  const { schoolId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    averageFees: 0,
    popularCourses: 0
  });

  // Common subjects list for suggestions
  // Common subjects list for suggestions
  const commonSubjects = [
      "English Language", "Mathematics", "Integrated Science", "Social Studies", "Religious and Moral Education (RME)", "Information and Communication Technology (ICT)", 
      "Career Technology", "Creative Arts and Design", "Physical and Health Education (PHE)", "Ghanaian Language",

    "English Language", "Core Mathematics", "Integrated Science", "Social Studies", "Elective Mathematics", "Physics", "Chemistry", "Biology", "General Agriculture", 
    "Animal Husbandry", "Crop Husbandry", "Economics", "Geography", "History", "Government", "Literature in English", "French", "Ghanaian Language", 
    "Christian Religious Studies", "Islamic Religious Studies", "Financial Accounting", "Cost Accounting", "Business Management", "Principles of Costing", "Elective ICT", 
    "Graphic Design", "Picture Making", "Textiles", "Sculpture", "Ceramics", "Leatherwork", "Basketry", "Jewellery", "Management in Living", "Food and Nutrition", 
    "Clothing and Textiles", "Biology (Home Economics)", "Physics (Technical)", "Applied Electricity", "Electronics", "Technical Drawing", "Building Construction", "Woodwork", 
    "Metalwork", "Auto Mechanics", "Engineering Science", "ICT", "Physical Education", "Music", "Dance", "Theatre Arts",

    "Philosophy","Theology","Religious Studies","Languages","Linguistics","Literature","Creative Writing","Classics","Archaeology","Music","Dance","Theatre","Film Studies",
    "Fine Arts","Art History","Sociology","Psychology","Anthropology","Political Science","International Relations","Economics","Human Geography","Criminology","Social Work",
    "Development Studies","Public Administration","Gender Studies","Cultural Studies","Physics","Chemistry","Biology","Mathematics","Statistics","Astronomy","Earth Science",
    "Environmental Science","Geology","Oceanography","Ecology","Mechanical Engineering","Civil Engineering","Electrical Engineering","Electronic Engineering",
    "Chemical Engineering","Aerospace Engineering","Biomedical Engineering","Computer Engineering","Software Engineering","Information Technology","Data Science",
    "Artificial Intelligence","Cybersecurity","Robotics","Business Administration","Management","Accounting","Finance","Marketing","Entrepreneurship",
    "Human Resource Management","Operations Management","Supply Chain Management","International Business","Law","International Law","Criminal Law","Corporate Law",
    "Human Rights Law","Medicine","Nursing","Pharmacy","Dentistry","Public Health","Physiotherapy","Occupational Therapy","Nutrition","Medical Laboratory Science","Radiography",
    "Education","Early Childhood Education","Primary Education","Secondary Education","Special Education","Educational Leadership","Agriculture","Agronomy","Horticulture",
    "Animal Science","Forestry","Fisheries","Environmental Management","Journalism","Mass Communication","Media Studies","Public Relations","Advertising","Digital Media",
    "Architecture","Urban Planning","Landscape Architecture","Interior Design","Graphic Design","Industrial Design","Fashion Design","Hospitality Management",
    "Tourism Management","Culinary Arts","Event Management","Cognitive Science","Neuroscience","Biotechnology","Nanotechnology","Sustainability Studies","Global Studies",
    "Peace and Conflict Studies","Game Design","Sports Science"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (schoolId) {
          fetchSchoolData();
          fetchCourses();
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [schoolId]);

  const fetchSchoolData = async () => {
    try {
      const schoolRef = doc(db, 'schools', schoolId);
      const schoolSnap = await getDoc(schoolRef);
      if (schoolSnap.exists()) {
        setSchool({ id: schoolSnap.id, ...schoolSnap.data() });
      } else {
        router.push('/admin/schools');
      }
    } catch (error) {
      console.error('Error fetching school:', error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const coursesRef = collection(db, 'courses');
      const q = query(
        coursesRef, 
        where('schoolId', '==', schoolId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const coursesData = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() });
      });
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      
      const totalFees = coursesData.reduce((acc, course) => acc + (course.fees || 0), 0);
      setStats({
        totalCourses: coursesData.length,
        totalStudents: coursesData.reduce((acc, course) => acc + (course.enrolledStudents || 0), 0),
        averageFees: coursesData.length > 0 ? totalFees / coursesData.length : 0,
        popularCourses: coursesData.filter(c => (c.enrolledStudents || 0) > 100).length
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...courses];
    
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(course => course.department === filterDepartment);
    }
    
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === filterDifficulty);
    }
    
    if (filterDuration !== 'all') {
      filtered = filtered.filter(course => course.duration === filterDuration);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(course => course.status === filterStatus);
    }
    
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'fees') {
        aVal = a.fees || 0;
        bVal = b.fees || 0;
      } else if (sortBy === 'cutoff') {
        aVal = a.cutoffAggregate || 0;
        bVal = b.cutoffAggregate || 0;
      } else if (sortBy === 'students') {
        aVal = a.enrolledStudents || 0;
        bVal = b.enrolledStudents || 0;
      } else {
        aVal = (a.name || '').toLowerCase();
        bVal = (b.name || '').toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setFilteredCourses(filtered);
  }, [searchTerm, filterDepartment, filterDifficulty, filterDuration, filterStatus, sortBy, sortOrder, courses]);

  const handleCreateCourse = async (courseData) => {
    try {
      const coursesRef = collection(db, 'courses');
      await addDoc(coursesRef, {
        ...courseData,
        schoolId,
        schoolName: school?.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.uid,
        status: 'active',
        enrolledStudents: 0,
        rating: 0,
        reviews: 0
      });
      
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, {
        totalCourses: courses.length + 1,
        updatedAt: new Date()
      });
      
      await fetchCourses();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      const courseRef = doc(db, 'courses', selectedCourse.id);
      await updateDoc(courseRef, {
        ...courseData,
        updatedAt: new Date(),
        updatedBy: user.uid
      });
      await fetchCourses();
      setShowEditModal(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const courseRef = doc(db, 'courses', selectedCourse.id);
      await deleteDoc(courseRef);
      
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, {
        totalCourses: courses.length - 1,
        updatedAt: new Date()
      });
      
      await fetchCourses();
      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const batch = writeBatch(db);
      selectedCourses.forEach(courseId => {
        const courseRef = doc(db, 'courses', courseId);
        batch.delete(courseRef);
      });
      await batch.commit();
      
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, {
        totalCourses: courses.length - selectedCourses.length,
        updatedAt: new Date()
      });
      
      await fetchCourses();
      setSelectedCourses([]);
      setBulkSelectMode(false);
    } catch (error) {
      console.error('Error bulk deleting:', error);
    }
  };

  const handleDuplicateCourse = async (course) => {
    try {
      const coursesRef = collection(db, 'courses');
      await addDoc(coursesRef, {
        ...course,
        id: undefined,
        name: `${course.name} (Copy)`,
        code: `${course.code}_COPY`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.uid,
        enrolledStudents: 0,
        rating: 0,
        reviews: 0
      });
      
      await fetchCourses();
    } catch (error) {
      console.error('Error duplicating course:', error);
    }
  };

  const handleExportData = () => {
    const dataToExport = filteredCourses.map(course => ({
      name: course.name,
      code: course.code,
      department: course.department,
      duration: course.duration,
      fees: course.fees,
      cutoffAggregate: course.cutoffAggregate,
      enrolledStudents: course.enrolledStudents,
      subjectRequirements: course.subjectRequirements,
      status: course.status,
      createdAt: course.createdAt?.toDate()
    }));
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${school?.name}_courses_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dynamic Subject Requirements Component
  const SubjectRequirementsManager = ({ requirements, onChange, errors = {} }) => {
    const [subjectInput, setSubjectInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const gradeOptions = [
      { value: 'A1', label: 'A1 (Excellent)', color: 'bg-green-100 text-green-800', points: 1 },
      { value: 'B2', label: 'B2 (Very Good)', color: 'bg-blue-100 text-blue-800', points: 2 },
      { value: 'B3', label: 'B3 (Good)', color: 'bg-teal-100 text-teal-800', points: 3 },
      { value: 'C4', label: 'C4 (Credit)', color: 'bg-yellow-100 text-yellow-800', points: 4 },
      { value: 'C5', label: 'C5 (Credit)', color: 'bg-orange-100 text-orange-800', points: 5 },
      { value: 'C6', label: 'C6 (Credit)', color: 'bg-red-100 text-red-800', points: 6 },
      { value: 'D7', label: 'D7 (Pass)', color: 'bg-purple-100 text-purple-800', points: 7 },
      { value: 'E8', label: 'E8 (Pass)', color: 'bg-pink-100 text-pink-800', points: 8 },
      { value: 'F9', label: 'F9 (Fail)', color: 'bg-gray-100 text-gray-800', points: 9 }
    ];

    const updateSuggestions = (input) => {
      if (input.length > 0) {
        const filtered = commonSubjects.filter(subject => 
          subject.toLowerCase().includes(input.toLowerCase()) &&
          !requirements.some(req => req.subject.toLowerCase() === subject.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const handleSubjectInputChange = (e) => {
      const value = e.target.value;
      setSubjectInput(value);
      updateSuggestions(value);
    };

    const addSubject = (subjectName = null) => {
      const subjectToAdd = subjectName || subjectInput.trim();
      if (subjectToAdd && !requirements.some(req => req.subject.toLowerCase() === subjectToAdd.toLowerCase())) {
        onChange([...requirements, { 
          subject: subjectToAdd, 
          requiredGrade: 'C6',
          weight: 1,
          notes: ''
        }]);
        setSubjectInput('');
        setShowSuggestions(false);
      }
    };

    const removeSubject = (index) => {
      const newRequirements = requirements.filter((_, i) => i !== index);
      onChange(newRequirements);
    };

    const updateSubject = (index, field, value) => {
      const newRequirements = [...requirements];
      newRequirements[index][field] = value;
      onChange(newRequirements);
    };

    const getGradeColor = (grade) => {
      const gradeOption = gradeOptions.find(g => g.value === grade);
      return gradeOption?.color || 'bg-gray-100 text-gray-800';
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Subject Requirements *
          </label>
          <span className="text-xs text-gray-500">
            {requirements.length} subject(s) added
          </span>
        </div>

        {/* Subject Input Area */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={subjectInput}
                onChange={handleSubjectInputChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubject();
                  }
                }}
                placeholder="Type subject name (e.g., Mathematics, English, Physics)..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => addSubject(suggestion)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{suggestion}</span>
                      <PlusCircle className="w-3 h-3 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => addSubject()}
              disabled={!subjectInput.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tip: You can type any subject or select from suggestions. Press Enter to add quickly.
          </p>
        </div>

        {/* Subject Requirements List */}
        {requirements.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No subjects added yet</p>
            <p className="text-xs text-gray-400">Add subjects and their minimum grade requirements</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition">
                <div className="flex items-start gap-3">
                  {/* Drag Handle (optional - for reordering) */}
                  <div className="cursor-move text-gray-400 hover:text-gray-600 mt-2">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  
                  {/* Subject Name */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-xs font-medium text-gray-700">Subject</label>
                      {errors[`subject_${index}`] && (
                        <span className="text-xs text-red-500">{errors[`subject_${index}`]}</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={req.subject}
                      onChange={(e) => updateSubject(index, 'subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="Subject name"
                    />
                  </div>
                  
                  {/* Required Grade */}
                  <div className="w-40">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Min. Grade</label>
                    <select
                      value={req.requiredGrade}
                      onChange={(e) => updateSubject(index, 'requiredGrade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      {gradeOptions.map(grade => (
                        <option key={grade.value} value={grade.value}>
                          {grade.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Weight/Importance */}
                  <div className="w-32">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Weight</label>
                    <select
                      value={req.weight || 1}
                      onChange={(e) => updateSubject(index, 'weight', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      <option value="1">Standard (1x)</option>
                      <option value="1.5">Important (1.5x)</option>
                      <option value="2">Critical (2x)</option>
                    </select>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 mt-6">
                    <button
                      onClick={() => removeSubject(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Remove subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Optional Notes */}
                <div className="mt-3 ml-7">
                  <textarea
                    value={req.notes || ''}
                    onChange={(e) => updateSubject(index, 'notes', e.target.value)}
                    placeholder="Additional notes (e.g., 'Must be elective mathematics', 'Combined science acceptable')"
                    rows="1"
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-green-500"
                  />
                </div>
                
                {/* Grade Badge Preview */}
                <div className="mt-2 ml-7">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getGradeColor(req.requiredGrade)}`}>
                    <Target className="w-3 h-3" />
                    Minimum {req.requiredGrade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Summary Statistics */}
        {requirements.length > 0 && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <Info className="w-4 h-4" />
              <span className="font-medium">Requirements Summary:</span>
              <span>{requirements.length} subject(s) required</span>
              <span className="text-xs">• Total weighted score will be calculated based on grades</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CourseFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState(initialData || {
      name: '',
      code: '',
      department: '',
      duration: '4 years',
      fees: '',
      cutoffAggregate: '',
      description: '',
      subjectRequirements: [],
      careerPaths: [],
      courseHighlights: [],
      difficulty: 'intermediate',
      programType: 'full-time',
      language: 'English',
      accreditation: '',
      instructor: {
        name: '',
        title: '',
        email: '',
        bio: ''
      }
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newHighlight, setNewHighlight] = useState('');
    const [newCareerPath, setNewCareerPath] = useState('');

    const departments = ["General Science", "General Arts", "Business", "Visual Arts", "Home Economics", "Agricultural Science", 
      "Technical", "Vocational Skills", "Information and Communication Technology (ICT)", "Performing Arts", "Languages", "Pure Science",
      "Applied Science", "Engineering Science", "Building Construction", "Electricals/Electronics", "Auto Mechanics", "Wood Technology", "Metalwork", 
      "Fashion and Textiles", "Catering and Hospitality", "Tourism", "Secretarial Studies", "Accounting", "Marketing", "Entrepreneurship", 
      "Fisheries", "Forestry", "Environmental Science", "Religious Studies", "Physical Education", "Music", "Dance", "Theatre Arts",
      "Medicine", "Dentistry", "Pharmacy", "Nursing", "Public Health", "Biomedical Science", "Allied Health Sciences", "Law", "Political Science", 
      "International Relations", "Public Administration", "Economics", "Sociology", "Psychology", "Social Work", "Geography", "Linguistics", "English", "History", 
      "Philosophy", "Religious Studies", "Theatre Arts", "Music", "Dance", "Fine Arts", "Graphic Design", "Industrial Art", "Architecture", "Planning", "Civil Engineering", 
      "Mechanical Engineering", "Electrical and Electronic Engineering", "Computer Engineering", "Biomedical Engineering", "Agricultural Engineering", "Petroleum Engineering", 
      "Chemical Engineering", "Materials Engineering", "Computer Science", "Information Technology", "Information Systems", "Cyber Security", "Data Science", 
      "Artificial Intelligence", "Mathematics", "Statistics", "Actuarial Science", "Physics", "Chemistry", "Biochemistry", "Biological Sciences", "Environmental Science", 
      "Marine Science", "Agriculture", "Agribusiness", "Animal Science", "Crop Science", "Soil Science", "Forestry", "Fisheries", "Food Science", "Nutrition", 
      "Hospitality Management", "Tourism Management", "Business Administration", "Accounting", "Finance", "Banking", "Marketing", "Human Resource Management", 
      "Supply Chain Management", "Entrepreneurship", "Procurement", "Project Management", 
      "Education", "Basic Education", "Early Childhood Education", "Special Education", "Guidance and Counselling", "Educational Administration", "Sports Science"
    ];

    const difficulties = [
      { value: 'beginner', label: 'Beginner', color: 'green', description: 'Basic concepts, no prior experience needed' },
      { value: 'intermediate', label: 'Intermediate', color: 'blue', description: 'Some prior knowledge recommended' },
      { value: 'advanced', label: 'Advanced', color: 'purple', description: 'Strong foundation required' },
      { value: 'expert', label: 'Expert', color: 'red', description: 'Specialized knowledge needed' }
    ];

    const durations = ['1 year', '2 years', '3 years', '4 years', '5 years', '6 years'];
    const programTypes = ['full-time', 'part-time', 'online', 'hybrid', 'evening', 'weekend'];
    const languages = ['English', 'French', 'Bilingual'];

    const validateForm = () => {
      const newErrors = {};
      if (!formData.name) newErrors.name = 'Course name is required';
      if (!formData.code) newErrors.code = 'Course code is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.fees || formData.fees <= 0) newErrors.fees = 'Valid fees are required';
      if (!formData.cutoffAggregate) newErrors.cutoffAggregate = 'Cutoff aggregate is required';
      if (formData.subjectRequirements.length === 0) newErrors.subjectRequirements = 'At least one subject requirement is needed';
      
      formData.subjectRequirements.forEach((req, idx) => {
        if (!req.subject) newErrors[`subject_${idx}`] = 'Subject name required';
        if (!req.requiredGrade) newErrors[`grade_${idx}`] = 'Grade required';
      });
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {initialData ? 'Edit Course' : 'Create New Course'}
              </h2>
              {initialData && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  formData.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Basic Information
                </h3>
                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., CSC 101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department/Faculty <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Subject Requirements Section - The core feature */}
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-6">
                <SubjectRequirementsManager
                  requirements={formData.subjectRequirements}
                  onChange={(newRequirements) => setFormData({ ...formData, subjectRequirements: newRequirements })}
                  errors={errors}
                />
                {errors.subjectRequirements && (
                  <p className="text-sm text-red-500 mt-2">{errors.subjectRequirements}</p>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum WASSCE Aggregate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.cutoffAggregate}
                    onChange={(e) => setFormData({ ...formData, cutoffAggregate: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors.cutoffAggregate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 8"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower aggregate = higher requirement</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {durations.map(dur => (
                      <option key={dur} value={dur}>{dur}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {difficulties.map(diff => (
                      <option key={diff.value} value={diff.value}>{diff.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {difficulties.find(d => d.value === formData.difficulty)?.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
                  <select
                    value={formData.programType}
                    onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {programTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fees Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Fees & Financial
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Fees (GHS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.fees}
                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      errors.fees ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instruction Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Description
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Provide a comprehensive description of the course, including learning outcomes, structure, career opportunities, and unique features..."
              />
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                <span>Recommended: 150-300 words highlighting key aspects of the program</span>
              </div>
            </div>

            {/* Course Highlights */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Highlights
              </label>
              <div className="space-y-2">
                {formData.courseHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...formData.courseHighlights];
                        newHighlights[idx] = e.target.value;
                        setFormData({ ...formData, courseHighlights: newHighlights });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., State-of-the-art laboratories, Industry partnerships"
                    />
                    <button
                      onClick={() => {
                        const newHighlights = formData.courseHighlights.filter((_, i) => i !== idx);
                        setFormData({ ...formData, courseHighlights: newHighlights });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (newHighlight.trim()) {
                      setFormData({ 
                        ...formData, 
                        courseHighlights: [...formData.courseHighlights, newHighlight] 
                      });
                      setNewHighlight('');
                    }
                  }}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Add Highlight
                </button>
                {newHighlight.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Type a highlight..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setFormData({ 
                            ...formData, 
                            courseHighlights: [...formData.courseHighlights, newHighlight] 
                          });
                          setNewHighlight('');
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Career Paths */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Career Paths
              </label>
              <div className="space-y-2">
                {formData.careerPaths.map((career, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={career}
                      onChange={(e) => {
                        const newCareers = [...formData.careerPaths];
                        newCareers[idx] = e.target.value;
                        setFormData({ ...formData, careerPaths: newCareers });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Software Engineer, Data Scientist"
                    />
                    <button
                      onClick={() => {
                        const newCareers = formData.careerPaths.filter((_, i) => i !== idx);
                        setFormData({ ...formData, careerPaths: newCareers });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (newCareerPath.trim()) {
                      setFormData({ 
                        ...formData, 
                        careerPaths: [...formData.careerPaths, newCareerPath] 
                      });
                      setNewCareerPath('');
                    }
                  }}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Add Career Path
                </button>
                {newCareerPath.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newCareerPath}
                      onChange={(e) => setNewCareerPath(e.target.value)}
                      placeholder="Type a career path..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setFormData({ 
                            ...formData, 
                            careerPaths: [...formData.careerPaths, newCareerPath] 
                          });
                          setNewCareerPath('');
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Program Coordinator / Instructor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.instructor.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      instructor: { ...formData.instructor, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Prof. John Mensah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.instructor.title}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      instructor: { ...formData.instructor, title: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Head of Department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.instructor.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      instructor: { ...formData.instructor, email: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="prof.mensah@school.edu.gh"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows="2"
                    value={formData.instructor.bio}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      instructor: { ...formData.instructor, bio: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Brief biography and qualifications..."
                  />
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {initialData ? 'Update Course' : 'Create Course'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CourseCard = ({ course, onEdit, onDelete, onDuplicate, onExpand, isExpanded }) => {
    const [showMenu, setShowMenu] = useState(false);
    
    const difficultyColors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700',
      advanced: 'bg-purple-100 text-purple-700',
      expert: 'bg-red-100 text-red-700'
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className={`h-2 bg-gradient-to-r ${
          course.difficulty === 'beginner' ? 'from-green-400 to-emerald-500' :
          course.difficulty === 'intermediate' ? 'from-blue-400 to-indigo-500' :
          course.difficulty === 'advanced' ? 'from-purple-400 to-pink-500' :
          'from-red-400 to-orange-500'
        }`}></div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[course.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                  {course.difficulty?.charAt(0).toUpperCase() + course.difficulty?.slice(1)}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {course.duration}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {course.subjectRequirements?.length || 0} Subjects
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{course.name}</h3>
              <p className="text-sm text-gray-500">{course.code} • {course.department}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                  <button
                    onClick={() => { onEdit(course); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4 text-blue-500" /> Edit
                  </button>
                  <button
                    onClick={() => { onDuplicate(course); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4 text-gray-500" /> Duplicate
                  </button>
                  <button
                    onClick={() => { onDelete(course); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" /> Delete
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => { onExpand(course.id === isExpanded ? null : course.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-gray-500" /> {isExpanded === course.id ? 'Collapse' : 'Expand'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">GHS {course.fees?.toLocaleString()}</span>
                  <span className="text-xs">/year</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>Agg. {course.cutoffAggregate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{course.enrolledStudents || 0} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{course.rating || 0} ({course.reviews || 0})</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              {isExpanded === course.id ? 'Show Less' : 'Requirements'} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Expanded Details - Subject Requirements */}
        {isExpanded === course.id && (
          <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                Subject Requirements ({course.subjectRequirements?.length || 0} subjects)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.subjectRequirements?.map((req, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{req.subject}</div>
                      {req.notes && <div className="text-xs text-gray-500 mt-1">{req.notes}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        req.requiredGrade === 'A1' ? 'bg-green-100 text-green-800' :
                        req.requiredGrade === 'B2' ? 'bg-blue-100 text-blue-800' :
                        req.requiredGrade === 'B3' ? 'bg-teal-100 text-teal-800' :
                        req.requiredGrade === 'C4' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        Min. {req.requiredGrade}
                      </span>
                      {req.weight > 1 && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                          {req.weight}x
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {course.courseHighlights?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> Course Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {course.courseHighlights.map((highlight, idx) => (
                    <span key={idx} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-lg">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {course.careerPaths?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-500" /> Career Paths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {course.careerPaths.map((career, idx) => (
                    <span key={idx} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-lg">
                      {career}
                    </span>
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
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as before */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/admin/schools" className="text-gray-400 hover:text-gray-600 transition">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-sm text-gray-500">Schools /</span>
                <span className="text-sm font-medium text-gray-700">{school?.name}</span>
                <span className="text-sm text-gray-500">/ Courses</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage academic programs, subject requirements, and curriculum</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={() => setShowBulkUploadModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Bulk Upload
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Course
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Courses</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
                <p className="text-xs text-green-600 mt-2">Active programs</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Enrollment</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalStudents.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">Across all courses</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Average Fees</p>
                <p className="text-2xl font-bold text-gray-800">GHS {Math.round(stats.averageFees).toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">Per academic year</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Subject Requirements</p>
                <p className="text-2xl font-bold text-gray-800">
                  {courses.reduce((acc, c) => acc + (c.subjectRequirements?.length || 0), 0)}
                </p>
                <p className="text-xs text-green-600 mt-2">Total requirements set</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and Actions */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by course name, code, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border rounded-lg transition flex items-center gap-2 ${
                  showFilters ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
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
              
              {selectedCourses.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete ({selectedCourses.length})
                </button>
              )}
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Law">Law</option>
                  <option value="Arts">Arts</option>
                </select>
                
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Difficulty Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                
                <select
                  value={filterDuration}
                  onChange={(e) => setFilterDuration(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Durations</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="4 years">4 years</option>
                  <option value="5 years">5 years</option>
                  <option value="6 years">6 years</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setFilterDepartment('all');
                    setFilterDifficulty('all');
                    setFilterDuration('all');
                    setFilterStatus('all');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <FilterX className="w-3 h-3" /> Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Courses Grid/List */}
      <div className="px-6 pb-6">
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">Create your first course for {school?.name}</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Course
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredCourses.map((course) => (
              <div key={course.id} className="relative">
                {bulkSelectMode && (
                  <div className="absolute left-0 top-4 -ml-5 z-10">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourses([...selectedCourses, course.id]);
                        } else {
                          setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                        }
                      }}
                      className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                  </div>
                )}
                <div className={bulkSelectMode ? 'ml-6' : ''}>
                  <CourseCard
                    course={course}
                    onEdit={(course) => {
                      setSelectedCourse(course);
                      setShowEditModal(true);
                    }}
                    onDelete={(course) => {
                      setSelectedCourse(course);
                      setShowDeleteModal(true);
                    }}
                    onDuplicate={handleDuplicateCourse}
                    onExpand={(id) => setExpandedCourse(expandedCourse === id ? null : id)}
                    isExpanded={expandedCourse}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {bulkSelectMode && <th className="w-10 px-4 py-3"></th>}
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Course</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Code</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Subjects</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Fees (GHS)</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Aggregate</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Students</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition">
                    {bulkSelectMode && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCourses([...selectedCourses, course.id]);
                            } else {
                              setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                            }
                          }}
                          className="w-4 h-4 text-green-600 rounded border-gray-300"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{course.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{course.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{course.code}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-orange-500" />
                        <span className="text-sm text-gray-600">{course.subjectRequirements?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">GHS {course.fees?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{course.cutoffAggregate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{course.enrolledStudents || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateCourse(course)}
                          className="p-1 text-gray-500 hover:bg-gray-100 rounded transition"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                          className="p-1 text-gray-500 hover:bg-gray-100 rounded transition"
                          title="View Requirements"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
      </div>
      
      {/* Modals */}
      <CourseFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCourse}
      />
      
      <CourseFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCourse(null);
        }}
        onSubmit={handleUpdateCourse}
        initialData={selectedCourse}
      />
      
      {/* Delete Confirmation Modal */}
      <div className={`fixed inset-0 z-50 ${showDeleteModal ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)}></div>
        <div className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Course</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedCourse?.name}</span>? This action cannot be undone and will remove all associated data including subject requirements.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bulk Upload Modal */}
      <div className={`fixed inset-0 z-50 ${showBulkUploadModal ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowBulkUploadModal(false)}></div>
        <div className="relative bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Bulk Upload Courses</h3>
            <button onClick={() => setShowBulkUploadModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Upload CSV file with course data</p>
            <p className="text-sm text-gray-500 mb-4">Download template to see required format (including dynamic subjects)</p>
            <div className="flex gap-3 justify-center">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Download Template
              </button>
              <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" /> Choose File
                <input type="file" accept=".csv,.json" className="hidden" />
              </label>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">CSV Format Instructions:</p>
                <p>Each row represents a course. For subject requirements, use format: "Subject:Grade:Weight" separated by semicolons.</p>
                <p className="mt-1 text-blue-600">Example: Mathematics:A1:2;English:B3:1;Science:B2:1.5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}