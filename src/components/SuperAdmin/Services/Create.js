import { useEffect, useState } from "react";
import { db } from "../../../firebase.config";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { 
  FiPlus, FiTrash, FiUpload, FiCheckCircle, FiImage, 
  FiX, FiFileText, FiList, FiCalendar, FiDollarSign,
  FiHelpCircle, FiZap, FiSettings, FiEye, FiEyeOff,
  FiLoader, FiCloud, FiExternalLink, FiCopy, FiCheck
} from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dpbntoeen/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'my-photos';

const Create = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // State for each form field
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState([""]);
  const [processSteps, setProcessSteps] = useState([""]);
  const [price, setPrice] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [status, setStatus] = useState("Active");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [dateCreated] = useState(serverTimestamp());

  const [includeContactForm, setIncludeContactForm] = useState(false);
  const [contactFields, setContactFields] = useState([]);
  const [submitButtonText, setSubmitButtonText] = useState("Submit");

  const [includeApplyNowForm, setIncludeApplyNowForm] = useState(false);
  const [applyNowFields, setApplyNowFields] = useState([
    {
      label: "Select Price Type",
      type: "select",
      value: "price_type",
      options: [
        { label: "Regular Price", price: 0 },
        { label: "Express Price", price: 0 }
      ]
    }
  ]);
  const [applyNowSubmitButtonText, setApplyNowSubmitButtonText] = useState("Apply Now");

  // Image URLs from Cloudinary
  const [imageUrls, setImageUrls] = useState([]);

  // Helper function to generate slug from service name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  // Auto-generate slug when service name changes
  useEffect(() => {
    if (serviceName && !slug) {
      setSlug(generateSlug(serviceName));
    }
  }, [serviceName]);

  // Fetch Admin Details
  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, "users", id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserDetails(userDocSnapshot.data());
          } else {
        //    router.push("/auth/signin");
          }
        } catch (error) {
          console.error("Error fetching user data", error);
          toast.error("Failed to fetch user data");
        }
      }
    };

    fetchUserData();
  }, [id, router]);

  // Handle Cloudinary Image Upload (Multiple)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filter valid image files
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.error("Some files were not images and were skipped");
    }
    if (validFiles.length === 0) return;

    setUploadingImages(true);

    try {
      for (const file of validFiles) {
        // Check file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`Image ${file.name} exceeds 2MB size limit`);
          continue;
        }

        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formDataObj
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }

        const data = await response.json();
        
        setImageUrls(prev => [...prev, data.secure_url]);
        setImagePreviews(prev => [...prev, URL.createObjectURL(file)]);
        
        toast.success(`Uploaded: ${file.name}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error uploading images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove uploaded image
  const removeImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    toast.info("Image removed");
  };

  // Functions to handle adding/removing items in arrays
  const handleArrayChange = (index, value, setState, state) => {
    const updatedArray = [...state];
    updatedArray[index] = value;
    setState(updatedArray);
  };

  const addArrayField = (setState, state) => {
    setState([...state, ""]);
  };

  const removeArrayField = (index, setState, state) => {
    const updatedArray = [...state];
    updatedArray.splice(index, 1);
    setState(updatedArray);
  };

  // Handle FAQ changes
  const handleFAQChange = (index, key, value) => {
    const updatedFAQs = [...faqs];
    updatedFAQs[index][key] = value;
    setFaqs(updatedFAQs);
  };

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFAQ = (index) => {
    const updatedFAQs = [...faqs];
    updatedFAQs.splice(index, 1);
    setFaqs(updatedFAQs);
  };

  // Add Field to Contact Form
  const addField = (type) => {
    setContactFields([
      ...contactFields,
      { 
        type, 
        label: "", 
        placeholder: "",
        required: false,
        value: "", 
        options: type === "select" ? [] : null
      },
    ]);
  };

  // Update Field Properties
  const updateField = (index, key, value) => {
    const updatedFields = [...contactFields];
    updatedFields[index][key] = value;
    setContactFields(updatedFields);
  };

  // Handle Adding Options for Select Fields
  const addOption = (index) => {
    const updatedFields = [...contactFields];
    if (updatedFields[index].type === "select") {
      updatedFields[index].options.push("");
    }
    setContactFields(updatedFields);
  };

  // Update Select Field Options
  const updateOption = (index, optIndex, value) => {
    const updatedFields = [...contactFields];
    updatedFields[index].options[optIndex] = value;
    setContactFields(updatedFields);
  };

  // Remove Field from Contact Form
  const removeField = (index) => {
    setContactFields(contactFields.filter((_, i) => i !== index));
  };

  // Remove Select Field Option
  const removeOption = (fieldIndex, optIndex) => {
    const updatedFields = [...contactFields];
    updatedFields[fieldIndex].options.splice(optIndex, 1);
    setContactFields(updatedFields);
  };

  // Apply Now Form Functions
  const addApplyNowField = (type) => {
    setApplyNowFields([
      ...applyNowFields,
      { label: "", type, value: "", placeholder: "", required: false, options: type === "select" ? [] : null }
    ]);
  };

  const removeApplyNowField = (index) => {
    if (applyNowFields[index].value === "price_type") return;
    setApplyNowFields(applyNowFields.filter((_, i) => i !== index));
  };

  const updateApplyNowField = (index, key, value) => {
    const updatedFields = [...applyNowFields];
    updatedFields[index][key] = value;
    setApplyNowFields(updatedFields);
  };

  const addApplyNowOption = (index) => {
    const updatedFields = [...applyNowFields];
    updatedFields[index].options.push({ label: "", value: "", price: null });
    setApplyNowFields(updatedFields);
  };

  const updateApplyNowOptionLabel = (index, optIndex, value) => {
    const updatedFields = [...applyNowFields];
    updatedFields[index].options[optIndex].label = value;
    setApplyNowFields(updatedFields);
  };

  const updateApplyNowOptionValue = (index, optIndex, value) => {
    const updatedFields = [...applyNowFields];
    updatedFields[index].options[optIndex].value = value;
    setApplyNowFields(updatedFields);
  };

  const updateApplyNowOptionPrice = (index, optIndex, price) => {
    const updatedFields = [...applyNowFields];
    updatedFields[index].options[optIndex].price = Number(price);
    setApplyNowFields(updatedFields);
  };

  const removeApplyNowOption = (index, optIndex) => {
    const updatedFields = [...applyNowFields];
    updatedFields[index].options.splice(optIndex, 1);
    setApplyNowFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageUrls.length === 0) {
      toast.error("Please upload at least one service image before submitting.");
      return;
    }
    
    setLoading(true);

    try {
      // Create the document and let Firestore generate the ID
      const serviceRef = await addDoc(collection(db, "services"), {
        adminId: userDetails?.uid,
        adminName: userDetails?.displayName,
        adminEmail: userDetails?.email,
        adminImage: userDetails?.photoURL,
        serviceName,
        category,
        slug,
        description,
        keyFeatures: keyFeatures.filter(f => f.trim() !== ""),
        processSteps: processSteps.filter(s => s.trim() !== ""),
        price: parseFloat(price) || 0,
        faqs: faqs.filter(f => f.question.trim() !== "" || f.answer.trim() !== ""),
        status,
        imageUrls, // Store multiple image URLs
        dateCreated,
        contactForm: includeContactForm
          ? { fields: contactFields, submitText: submitButtonText }
          : null,
        applyNowForm: includeApplyNowForm
          ? { fields: applyNowFields, submitText: applyNowSubmitButtonText }
          : null,
      });

      // Retrieve the generated ID and update the document with it
      await setDoc(serviceRef, { id: serviceRef.id }, { merge: true });

      setLoading(false);
      toast.success("Service Created Successfully!");
      
      // Clean up object URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      setTimeout(() => {
        router.push(`/my-admin/${id}/services`);
      }, 1500);
    } catch (error) {
      console.error("Error creating service:", error);
      setLoading(false);
      toast.error("Failed to create service. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
            <FiPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Create New Service
          </h1>
          <p className="text-gray-500 mt-2">Fill in the details below to add a new service to your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiFileText className="w-5 h-5" />
                Basic Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter service name"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Educational Consultancy Services">Educational Consultancy Services</option>
                    <option value="Document Application and Acquisition Services">Document Application and Acquisition Services</option>
                    <option value="Additional Services">Additional Services</option>
                    <option value="Premium Services">Premium Services</option>
                  </select>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug / URL Identifier *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="auto-generated-from-name"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSlug(generateSlug(serviceName))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                      title="Generate from service name"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">URL-friendly identifier (lowercase, hyphens instead of spaces)</p>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Active"
                      checked={status === "Active"}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-4 h-4 text-green-500 focus:ring-green-500"
                    />
                    <span className="flex items-center gap-1">
                      <FiEye className="w-4 h-4 text-green-500" />
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Inactive"
                      checked={status === "Inactive"}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-4 h-4 text-red-500 focus:ring-red-500"
                    />
                    <span className="flex items-center gap-1">
                      <FiEyeOff className="w-4 h-4 text-red-500" />
                      Inactive
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe your service in detail..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiImage className="w-5 h-5" />
                Service Images
              </h2>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    {uploadingImages ? (
                      <FiLoader className="w-8 h-8 text-purple-500 animate-spin" />
                    ) : (
                      <FiCloud className="w-8 h-8 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">
                      {uploadingImages ? "Uploading to Cloudinary..." : "Click or drag to upload images"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Maximum 2MB per image, supports JPG, PNG, GIF</p>
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images ({imagePreviews.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        {imageUrls[index] && (
                          <a
                            href={imageUrls[index]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 left-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Features Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiZap className="w-5 h-5" />
                Key Features
              </h2>
            </div>
            <div className="p-6">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange(index, e.target.value, setKeyFeatures, keyFeatures)}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {keyFeatures.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, setKeyFeatures, keyFeatures)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField(setKeyFeatures, keyFeatures)}
                className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Feature
              </button>
            </div>
          </div>

          {/* Process Steps Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiList className="w-5 h-5" />
                Process Steps
              </h2>
            </div>
            <div className="p-6">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleArrayChange(index, e.target.value, setProcessSteps, processSteps)}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Step ${index + 1}`}
                  />
                  {processSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, setProcessSteps, processSteps)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField(setProcessSteps, processSteps)}
                className="mt-3 inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Step
              </button>
            </div>
          </div>

          {/* FAQs Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiHelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 relative">
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiTrash className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addFAQ}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add FAQ
              </button>
            </div>
          </div>

          {/* Contact Form Editor Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-teal-500 to-green-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiFileText className="w-5 h-5" />
                Contact Form Editor
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeContactForm}
                  onChange={() => setIncludeContactForm(!includeContactForm)}
                  className="w-5 h-5 rounded border-white/30 bg-white/20 checked:bg-white checked:border-white"
                />
                <span className="text-white text-sm">Enable</span>
              </label>
            </div>
            {includeContactForm && (
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => addField("text")} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">+ Input Field</button>
                  <button type="button" onClick={() => addField("textarea")} className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">+ Textarea</button>
                  <button type="button" onClick={() => addField("select")} className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors">+ Select Field</button>
                  <button type="button" onClick={() => addField("file")} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">+ File Upload</button>
                </div>

                {contactFields.map((field, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 relative bg-gray-50">
                    <button type="button" onClick={() => removeField(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                      <FiTrash className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field Label</label>
                        <input type="text" value={field.label} onChange={(e) => updateField(index, "label", e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Full Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                        <input type="text" value={field.placeholder} onChange={(e) => updateField(index, "placeholder", e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Enter your name" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={field.required} onChange={(e) => updateField(index, "required", e.target.checked)} className="rounded" />
                        <span className="text-sm">Required</span>
                      </label>
                      <span className="text-xs text-gray-400">Type: {field.type}</span>
                    </div>

                    {field.type === "select" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                        {field.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2 mb-2">
                            <input type="text" value={option} onChange={(e) => updateOption(index, optIndex, e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder={`Option ${optIndex + 1}`} />
                            <button type="button" onClick={() => removeOption(index, optIndex)} className="text-red-500 hover:text-red-700">✕</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addOption(index)} className="text-sm text-blue-600 hover:text-blue-700">+ Add Option</button>
                      </div>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
                  <input type="text" value={submitButtonText} onChange={(e) => setSubmitButtonText(e.target.value)} className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            )}
          </div>

          {/* Apply Now Form Editor Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiSettings className="w-5 h-5" />
                Apply Now Form Editor
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeApplyNowForm}
                  onChange={() => setIncludeApplyNowForm(!includeApplyNowForm)}
                  className="w-5 h-5 rounded border-white/30 bg-white/20 checked:bg-white checked:border-white"
                />
                <span className="text-white text-sm">Enable</span>
              </label>
            </div>
            {includeApplyNowForm && (
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => addApplyNowField("text")} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">+ Input Field</button>
                  <button type="button" onClick={() => addApplyNowField("textarea")} className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600">+ Textarea</button>
                  <button type="button" onClick={() => addApplyNowField("select")} className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600">+ Select Field</button>
                  <button type="button" onClick={() => addApplyNowField("file")} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">+ File Upload</button>
                </div>

                {applyNowFields.map((field, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 relative bg-gray-50">
                    {field.value !== "price_type" && (
                      <button type="button" onClick={() => removeApplyNowField(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                        <FiTrash className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field Label</label>
                        <input type="text" value={field.label} onChange={(e) => updateApplyNowField(index, "label", e.target.value)} className="w-full border rounded-lg px-3 py-2" readOnly={field.value === "price_type"} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                        <input type="text" value={field.placeholder} onChange={(e) => updateApplyNowField(index, "placeholder", e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={field.required} onChange={(e) => updateApplyNowField(index, "required", e.target.checked)} className="rounded" />
                        <span className="text-sm">Required</span>
                      </label>
                      <span className="text-xs text-gray-400">Type: {field.type}</span>
                    </div>

                    {field.type === "select" && field.value === "price_type" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Options</label>
                        {field.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2 mb-2">
                            <input type="text" value={option.label} readOnly className="flex-1 border rounded-lg px-3 py-2 bg-gray-100" placeholder="Label" />
                            <input type="number" value={option.price} onChange={(e) => updateApplyNowOptionPrice(index, optIndex, e.target.value)} className="w-32 border rounded-lg px-3 py-2" placeholder="Price" />
                          </div>
                        ))}
                      </div>
                    )}

                    {field.type === "select" && field.value !== "price_type" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                        {field.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2 mb-2">
                            <input type="text" value={option.label} onChange={(e) => updateApplyNowOptionLabel(index, optIndex, e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="Display Text" />
                            <input type="text" value={option.value} onChange={(e) => updateApplyNowOptionValue(index, optIndex, e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="Value" />
                            <button type="button" onClick={() => removeApplyNowOption(index, optIndex)} className="text-red-500">✕</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addApplyNowOption(index)} className="text-sm text-blue-600 hover:text-blue-700">+ Add Option</button>
                      </div>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
                  <input type="text" value={applyNowSubmitButtonText} onChange={(e) => setApplyNowSubmitButtonText(e.target.value)} className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-gray-200">
            <button
              type="submit"
              disabled={loading || uploadingImages || imageUrls.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Creating Service...
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-5 h-5" />
                  Create Service
                </>
              )}
            </button>
            {imageUrls.length === 0 && !uploadingImages && (
              <p className="text-center text-sm text-red-500 mt-3">Please upload at least one service image</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;