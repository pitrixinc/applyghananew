import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import BlogDetailContent from "@/components/Blogs/BlogDetail/BlogDetailContent";
import RecommendedBlogs from "@/components/Blogs/BlogDetail/RecommendedBlogs";
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/firebase.config';
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function BlogPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the specific blog by ID
        const blogRef = doc(db, 'blogs', id);
        const blogSnap = await getDoc(blogRef);
        
        if (blogSnap.exists()) {
          const blogData = blogSnap.data();
          
          // Check if blog is published
          if (blogData.published === false) {
            setError('This post has been unpublished');
            setLoading(false);
            return;
          }

          // Ensure we have all required fields
          if (!blogData.title || !blogData.content) {
            throw new Error('Blog data is incomplete');
          }
          
          setBlog({ id: blogSnap.id, ...blogData });

          // Fetch recommended blogs from same category
          if (blogData.category) {
            const recommendedQuery = query(
              collection(db, 'blogs'),
              where('category', '==', blogData.category),
              where('published', '==', true),
              where('__name__', '!=', id), // Exclude current blog
              limit(5)
            );
            const recommendedSnapshot = await getDocs(recommendedQuery);
            const recommendedData = recommendedSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setRecommendedBlogs(recommendedData);
          }
        } else {
          setError('Blog not found');
          return;
        }

        // Fetch all categories
        const blogsQuery = collection(db, 'blogs');
        const querySnapshot = await getDocs(blogsQuery);
        const categories = [...new Set(
          querySnapshot.docs
            .map(doc => doc.data().category)
            .filter(Boolean)
        )];
        setAllCategories(categories);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError(err.message || 'Failed to load blog');
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  {/*
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'This post has been unpublished' ? 'Post Unpublished' : 'Error Loading Blog'}
            </h1>
            <p className="text-gray-600 mb-4">
              {error === 'This post has been unpublished' 
                ? 'The author has unpublished this post.' 
                : error}
            </p>
            <button
              onClick={() => router.push('/blogs')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
            <p className="mt-2 text-gray-600">The blog you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/blogs')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </Layout>
    );
  }
*/}
  return (
    <>
    <Head>
        <title>{blog?.title}</title>
        <meta name="description" content={blog?.excerpt} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog?.title} />
        <meta property="og:description" content={blog?.excerpt} />
        <meta property="og:image" content={blog?.featuredImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Alt text for your logo" />
        <meta property="og:url" content={`/blogs/${id}`} />
        <meta property="og:site_name" content="Apply Ghana" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog?.title} />
        <meta name="twitter:description" content={blog?.excerpt} />
        <meta name="twitter:image" content={blog?.featuredImage} />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        
        {/* Article-specific meta */}
        <meta property="article:published_time" content={blog?.createdAt?.toDate?.()?.toISOString()} />
        {blog.updatedAt && (
          <meta property="article:modified_time" content={blog?.updatedAt?.toDate?.()?.toISOString()} />
        )}
        <meta property="article:author" content={blog?.authorName} />
        <meta property="article:section" content={blog?.category} />
      </Head>

    <Layout>
      <BlogDetailContent blog={blog} allCategories={allCategories} />
      {recommendedBlogs.length > 0 && (
        <RecommendedBlogs blogs={recommendedBlogs} currentBlogId={id} />
      )}
    </Layout>
    </>
  );
}