import React, { useState } from 'react';
import { FiChevronDown, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const CategoriesSection = ({ categoriesWithBlogs }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category) {
      window.location.href = `/blogs/category/${encodeURIComponent(category.toLowerCase())}`;
    }
  };

  // Gradient colors for category headers
  const categoryGradients = [
    'from-blue-50 to-purple-50',
    'from-green-50 to-teal-50',
    'from-amber-50 to-orange-50',
    'from-rose-50 to-pink-50',
    'from-indigo-50 to-blue-50',
    'from-emerald-50 to-green-50',
    'from-yellow-50 to-amber-50',
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline and Category Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900">All Categories</h2>
            <p className="text-lg text-gray-600 mt-2">
              Explore our content by category
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="appearance-none w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categoriesWithBlogs.map((categoryData) => (
                <option key={categoryData.category} value={categoryData.category}>
                  {categoryData.category}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-16">
          {categoriesWithBlogs.map((categoryData, index) => {
            const gradientClass = categoryGradients[index % categoryGradients.length];
            
            return (
              <div key={categoryData.category} className="space-y-6">
                {/* Category Header with Gradient */}
                <div className={`bg-gradient-to-r ${gradientClass} p-6 rounded-xl`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                      {categoryData.category}
                    </h3>
                    <Link
                      href={`/blogs/category/${encodeURIComponent(categoryData.category.toLowerCase())}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View all {categoryData.category} articles <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>

                {/* Blogs Grid for this Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryData.blogs.map((blog) => (
                    <article key={blog.id} className="group relative flex flex-col h-full border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      {/* Featured Image */}
                      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                        <img
                          src={blog.featuredImage || '/placeholder-image.jpg'}
                          alt={blog.title}
                          className="object-cover w-full h-30 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Blog Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Title */}
                        <h3 className="text-md font-bold text-gray-900 mb-2 line-clamp-2">
                          <Link href={`/blogs/${blog.slug}`} className="hover:text-indigo-600 transition-colors">
                            {blog.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>

                        {/* Meta Info */}
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm text-gray-500">{blog.readingTime}</span>
                          <Link 
                            href={`/blogs/${blog.slug}`} 
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            Read more <FiArrowRight className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;