import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase.config';
import { toast } from 'react-toastify';
import { FiUpload, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const Create = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    readingTime: '',
    published: false,
  });

  const [errors, setErrors] = useState({});

  // Predefined categories
  const categories = [
    'Technology',
    'Lifestyle',
    'Business',
    'Health',
    'Travel',
    'Food',
    'Education',
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, 'users', id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserDetails(userData);
          } else {
            console.log('User not found');
            router.push('/auth/signin');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };

    fetchUserData();
  }, [id, router]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word characters
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/--+/g, '-'); // Replace multiple - with single -
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Generate slug when title changes
    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }

    // Clear error when field is filled
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));

    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: null,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image file
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setImageUploading(true);
      const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          toast.error('Image upload failed');
          setImageUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            featuredImage: downloadURL,
          }));
          setImageUploading(false);
          toast.success('Image uploaded successfully');
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim() || formData.content === '<p><br></p>') 
      newErrors.content = 'Content is required';
    if (!formData.featuredImage) newErrors.featuredImage = 'Featured image is required';
    if (!formData.readingTime.trim()) newErrors.readingTime = 'Reading time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!userDetails) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const blogData = {
        ...formData,
        authorName: userDetails.displayName,
        authorId: userDetails.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'blogs'), blogData);

      // Update the document to include its own ID as a field
      await updateDoc(docRef, {
        id: docRef.id,
      });

      toast.success('Blog created successfully!');
      router.push(`/blogs/${docRef.id}`);
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  // React Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create New Blog Post</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create a new blog post {userDetails?.displayName || 'Unknown'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="URL-friendly version of the title"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="A short description of your blog post"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Featured Image <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiUpload className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Upload Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
              {formData.featuredImage && (
                <div className="ml-4">
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    className="h-16 w-16 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            {imageUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploading: {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
            {errors.featuredImage && (
              <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>
            )}
          </div>

          {/* Reading Time */}
          <div>
            <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700">
              Reading Time <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="readingTime"
                name="readingTime"
                value={formData.readingTime}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.readingTime ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. 5 min read"
              />
              {errors.readingTime && (
                <p className="mt-1 text-sm text-red-600">{errors.readingTime}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                className={`h-64 mb-12 ${
                  errors.content ? 'border-red-500 rounded-md border' : ''
                }`}
                placeholder="Write your blog content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, published: !prev.published }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                formData.published ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.published ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {formData.published ? (
                <span className="flex items-center">
                  <FiEye className="mr-1" /> Published
                </span>
              ) : (
                <span className="flex items-center">
                  <FiEyeOff className="mr-1" /> Draft
                </span>
              )}
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/blogs"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="-ml-1 mr-2 h-5 w-5" />
              {loading ? 'Saving...' : 'Save Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;