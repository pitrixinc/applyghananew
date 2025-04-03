import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import BlogCategoryHero from "@/components/Blogs/BlogCategory/BlogCategoryHero";
import BlogCategoryContent from "@/components/Blogs/BlogCategory/BlogCategoryContent";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase.config';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Category descriptions mapping
const categoryDescriptions = {
  'technology': 'Cutting-edge insights and analysis on the latest technological advancements and trends.',
  'business': 'Expert advice and strategic perspectives for business growth and innovation.',
  'education': 'Resources and guidance for academic success and lifelong learning.',
  'health': 'Evidence-based information for maintaining optimal health and wellness.',
  'lifestyle': 'Inspiration and tips for enhancing your daily life and personal growth.',
};

export default function BlogCategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategoryName, setCurrentCategoryName] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch all blogs to get all categories and find the exact category name
        const allBlogsQuery = query(collection(db, 'blogs'));
        const allBlogsSnapshot = await getDocs(allBlogsQuery);
        const allBlogsData = allBlogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Extract unique categories
        const categories = [...new Set(allBlogsData.map(blog => blog.category))];
        setAllCategories(categories);

        // Find the exact category name that matches our URL parameter
        // This handles case sensitivity and spaces in category names
        const matchedCategory = categories.find(cat => 
          cat.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
        );

        if (!matchedCategory) {
          console.log('No matching category found for:', id);
          setCategoryBlogs([]);
          setLoading(false);
          return;
        }

        setCurrentCategoryName(matchedCategory);

        // Fetch blogs for current category using the exact category name from Firestore
        const categoryQuery = query(
          collection(db, 'blogs'),
          where('category', '==', matchedCategory),
          where('published', '==', true)
        );
        const categorySnapshot = await getDocs(categoryQuery);
        const categoryBlogsData = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setCategoryBlogs(categoryBlogsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [id]);

  return (
    <Layout>
      <BlogCategoryHero 
        category={currentCategoryName} 
        description={categoryDescriptions[id] || `Explore our collection of articles about ${currentCategoryName}.`}
      />
      
      <BlogCategoryContent 
        categoryBlogs={categoryBlogs} 
        currentCategory={currentCategoryName}
        allCategories={allCategories}
        loading={loading}
      />
    </Layout>
  );
}