import React from 'react';
import Link from 'next/link';
import { FiClock, FiArrowRight } from 'react-icons/fi';

const RecommendedBlogs = ({ blogs, currentBlogId }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recommended Reads</h2>
          <p className="text-gray-600 mt-2">More articles you might enjoy</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-6">
          {blogs
            .filter(blog => blog.id !== currentBlogId) // Double-check to exclude current blog
            .map((blog) => (
              <article 
                key={blog.id} 
                className="group relative flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
              >
                {/* Featured Image */}
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={blog.featuredImage || '/placeholder-image.jpg'}
                    alt={blog.title}
                    className="object-cover w-full h-30 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Blog Content */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Category */}
                  <span className="inline-block mb-2 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full">
                    {blog.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/blogs/${blog.id}`} className="hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </Link>
                  </h3>

                  {/* Meta Info */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1.5" />
                      <span>{blog.readingTime}</span>
                    </div>
                    <Link 
                      href={`/blogs/${blog.id}`} 
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      Read <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedBlogs;