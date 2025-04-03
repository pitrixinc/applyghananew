import React from 'react';
import Link from 'next/link';
import { FiClock, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';
import Image from 'next/image';

const BlogDetailContent = ({ blog, allCategories }) => {
  // Format dates
  const createdAt = blog?.createdAt?.toDate
    ? format(blog.createdAt.toDate(), 'MMMM dd, yyyy')
    : 'Unknown date';
  
  const updatedAt = blog?.updatedAt?.toDate
    ? format(blog.updatedAt.toDate(), 'MMMM dd, yyyy')
    : null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Blog Content Column */}
          <div className="lg:w-3/4">
            {/* Blog Header */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full mb-4">
                {blog?.category}
              </span>
              <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog?.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-[10px] md:text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <FiClock className="mr-1.5" />
                  <span>{blog?.readingTime}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-1.5" />
                  <span>Published: {createdAt}</span>
                </div>
                {updatedAt && (
                  <div className="flex items-center">
                    <FiCalendar className="mr-1.5" />
                    <span>Updated: {updatedAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            {blog?.featuredImage && (
              <div className="aspect-[1.91] w-full bg-gray-100 rounded-xl overflow-hidden">
                <Image
                    src={blog.featuredImage}
                    alt={`Featured image for ${blog.title}`}
                    width={1200}
                    height={630}
                    priority
                    className="rounded-xl"
                    />
              </div>
            )}

            {/* Blog Content */}
            <div className="prose max-w-none prose-lg">
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: blog?.content }}
              />
            </div>
          </div>

          {/* Sidebar Column (Categories) */}
          <div className="lg:w-1/4">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">All Categories</h3>
              <ul className="space-y-3">
                {allCategories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/blogs/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        category === blog?.category
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailContent;