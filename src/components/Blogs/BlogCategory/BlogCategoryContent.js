import React, { useState, useEffect } from 'react';
import { FiSearch, FiClock, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const BlogCategoryContent = ({ 
  categoryBlogs, 
  currentCategory,
  loading,
  allCategories
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  // Update filtered blogs when categoryBlogs changes
  useEffect(() => {
    setFilteredBlogs(categoryBlogs);
  }, [categoryBlogs]);

  // Filter blogs based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredBlogs(categoryBlogs);
      return;
    }

    const filtered = categoryBlogs.filter((blog) => {
      const searchLower = query.toLowerCase();
      return (
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.authorName.toLowerCase().includes(searchLower) ||
        blog.authorId.toLowerCase().includes(searchLower)
      );
    });

    setFilteredBlogs(filtered);
  };

  // Get other categories excluding the current one
  const relatedCategories = allCategories.filter(
    (cat) => cat !== currentCategory
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Column (Blogs) */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search in ${currentCategory}...`}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {filteredBlogs.length} articles found
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-xl"></div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Blog Grid */
              filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <article 
                      key={blog.id} 
                      className="group relative flex flex-col h-full border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Featured Image */}
                      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                        <img
                          src={blog.featuredImage || '/placeholder-image.jpg'}
                          alt={blog.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Blog Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Category */}
                        <span className="inline-block mb-2 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full">
                          {blog.category}
                        </span>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          <Link href={`/blogs/${blog.slug}`} className="hover:text-indigo-600 transition-colors">
                            {blog.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>

                        {/* Meta Info */}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1.5" />
                            <span>{blog.readingTime}</span>
                          </div>
                          <Link 
                            href={`/blogs/${blog.slug}`} 
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            Read <FiArrowRight className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {searchQuery
                      ? 'Try adjusting your search query'
                      : 'No articles have been published in this category yet'}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Sidebar Column (All Categories) */}
          <div className="lg:w-1/4">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">All Categories</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse h-12 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {allCategories.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/blogs/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                          category === currentCategory
                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                            : 'bg-white hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>{category}</span>
                        <FiArrowRight className="text-gray-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCategoryContent;