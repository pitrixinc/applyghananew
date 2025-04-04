import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, deleteDoc, doc, query, where, orderBy, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import { FiChevronDown, FiChevronUp, FiEdit, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

// Dynamically import ReactQuill for the edit modal
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const BlogsListing = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userDetails, setUserDetails] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedBlogs, setExpandedBlogs] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    readingTime: '',
    published: false,
  });

  // Predefined categories
  const categories = [
    'Educational Consultancy Services',
    'Document Application and Acquisition Services',
    'Additional Services',
    'Premium Services',
    'Sports',
    'International',
    'Technology',
    'Lifestyle',
    'Business',
    'Health',
    'Travel',
    'Food',
    'Education',
  ];

  // Fetch user data
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

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const blogsCollection = collection(db, 'blogs');
        const blogsQuery = query(blogsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(blogsQuery);

        const blogsData = [];
        querySnapshot.forEach((doc) => {
          blogsData.push({ id: doc.id, ...doc.data() });
        });

        setBlogs(blogsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to load blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Toggle blog expansion
  const toggleBlog = (blogId) => {
    setExpandedBlogs((prev) => ({
      ...prev,
      [blogId]: !prev[blogId],
    }));
  };

  // Expand all categories
  const expandAll = () => {
    const allExpanded = {};
    filteredCategories.forEach((category) => {
      allExpanded[category] = true;
    });
    setExpandedCategories(allExpanded);
  };

  // Collapse all categories
  const collapseAll = () => {
    setExpandedCategories({});
  };

  // Open edit modal with blog data
  const openEditModal = (blog) => {
    setCurrentBlog(blog);
    setEditFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage,
      readingTime: blog.readingTime,
      published: blog.published,
    });
    setEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentBlog(null);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle content change in editor
  const handleContentChange = (value) => {
    setEditFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  // Handle image resize (this would be implemented in the editor itself)
  // Note: Actual image resizing would require additional libraries or backend processing

  // Update blog
  const updateBlog = async (e) => {
    e.preventDefault();
    try {
      const blogRef = doc(db, 'blogs', currentBlog.id);
      await updateDoc(blogRef, {
        ...editFormData,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === currentBlog.id ? { ...blog, ...editFormData } : blog
        )
      );

      toast.success('Blog updated successfully!');
      closeEditModal();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    }
  };

  // Delete blog
  const deleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteDoc(doc(db, 'blogs', blogId));
        setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
        toast.success('Blog deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.category.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.authorName.toLowerCase().includes(query) ||
      blog.authorId.toLowerCase().includes(query)
    );
  });

  // Get unique categories from filtered blogs
  const filteredCategories = [
    ...new Set(filteredBlogs.map((blog) => blog.category)),
  ];

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
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Blog Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage all your blog posts in one place
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className='inset-y-0 left-0 pl-3 cursor-pointer'><Link href={`/my-admin/${id}/blogs/create`}><FaPlus/></Link></div>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Expand/Collapse Controls */}
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Collapse All
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* No Blogs Found */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No blogs found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'No blogs have been created yet'}
            </p>
          </div>
        )}

        {/* Categories and Blogs */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div key={category} className="bg-white shadow overflow-hidden rounded-lg">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-semibold">{category}</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {filteredBlogs.filter((blog) => blog.category === category).length}
                    </span>
                  </div>
                  {expandedCategories[category] ? (
                    <FiChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {/* Blogs in Category */}
                {expandedCategories[category] && (
                  <div className="border-t border-gray-200 divide-y divide-gray-200">
                    {filteredBlogs
                      .filter((blog) => blog.category === category)
                      .map((blog) => (
                        <div key={blog.id} className="px-6 py-4">
                          {/* Blog Header */}
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => toggleBlog(blog.id)}
                              className="flex-1 text-left focus:outline-none"
                            >
                              <div className="flex items-center">
                                <h3 className="text-base font-medium text-gray-900">
                                  {blog.title}
                                </h3>
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  {blog.published ? 'Published' : 'Draft'}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {new Date(blog.createdAt?.toDate()).toLocaleDateString()} • {blog.readingTime} • By {blog.authorName}
                              </p>
                            </button>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => openEditModal(blog)}
                                className="p-1 text-indigo-600 hover:text-indigo-900"
                                title="Edit"
                              >
                                <FiEdit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => deleteBlog(blog.id)}
                                className="p-1 text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Blog Content */}
                          {expandedBlogs[blog.id] && (
                            <div className="mt-4 pl-4 border-l-4 border-indigo-200">
                              <div className="prose max-w-none">
                                <h4 className="text-sm font-medium text-gray-900">Excerpt:</h4>
                                <p className="text-sm text-gray-600 mb-4">{blog.excerpt}</p>
                                
                                {blog.featuredImage && (
                                  <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-900">Featured Image:</h4>
                                    <img
                                      src={blog.featuredImage}
                                      alt={blog.title}
                                      className="mt-2 max-h-60 rounded-md"
                                    />
                                  </div>
                                )}

                                <h4 className="text-sm font-medium text-gray-900">Content Preview:</h4>
                                <div
                                  className="text-sm text-gray-600 mt-2"
                                  dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 500) + (blog.content.length > 500 ? '...' : '') }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-end justify-center overflow-y-auto min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Blog Post
                    </h3>
                    <button
                      onClick={closeEditModal}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={updateBlog} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={editFormData.title}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                          Slug
                        </label>
                        <input
                          type="text"
                          name="slug"
                          id="slug"
                          value={editFormData.slug}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700">
                          Reading Time
                        </label>
                        <input
                          type="text"
                          name="readingTime"
                          id="readingTime"
                          value={editFormData.readingTime}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="e.g. 5 min read"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                          Excerpt
                        </label>
                        <textarea
                          name="excerpt"
                          id="excerpt"
                          rows={3}
                          value={editFormData.excerpt}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Featured Image
                        </label>
                        {editFormData.featuredImage && (
                          <img
                            src={editFormData.featuredImage}
                            alt="Featured"
                            className="mt-2 max-h-40 rounded-md"
                          />
                        )}
                        {/* Note: Actual image upload/update would need additional implementation */}
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Content
                        </label>
                        <div className="mt-1 h-64">
                          <ReactQuill
                            theme="snow"
                            value={editFormData.content}
                            onChange={handleContentChange}
                            modules={modules}
                            formats={formats}
                            className="h-48"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <div className="flex items-center">
                          <input
                            id="published"
                            name="published"
                            type="checkbox"
                            checked={editFormData.published}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                published: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                            Published
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      >
                        Update Blog
                      </button>
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsListing;