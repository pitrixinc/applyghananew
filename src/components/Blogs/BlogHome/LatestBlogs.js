import React, { useState, useEffect } from 'react';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import Link from 'next/link';

const LatestBlogs = ({ blogs }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Articles</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover our most recent insights, stories, and expert opinions
            </p>
          </div>
          <Link 
            href="/blogs" 
            className="mt-4 md:mt-0 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View all articles <FiArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="group relative flex flex-col h-full">
              {/* Featured Image */}
              <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={blog.featuredImage || '/placeholder-image.jpg'}
                  alt={blog.title}
                  className="object-cover w-full h-30 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Category Tag */}
              <div className="mb-2">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full">
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-md md:text-md font-bold text-gray-900 mb-2 line-clamp-2">
                <Link href={`/blogs/${blog.slug}`} className="hover:text-indigo-600 transition-colors">
                  {blog.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-sm md:text-md text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>

              {/* Meta Info */}
              <div className="mt-auto block md:flex items-center justify-center md:justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <FiClock className="mr-1.5" />
                  <span>{blog.readingTime}</span>
                </div>
                <Link 
                  href={`/blogs/${blog.slug}`} 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  Read more <FiArrowRight className="ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;