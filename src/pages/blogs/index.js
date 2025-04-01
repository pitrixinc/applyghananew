import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import BlogHero from "@/components/Blogs/BlogHome/BlogHero";
import LatestBlogs from "@/components/Blogs/BlogHome/LatestBlogs";
import CategoriesSection from "@/components/Blogs/BlogHome/CategoriesSection";
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/firebase.config';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Blogs() {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [categoriesWithBlogs, setCategoriesWithBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest blogs
        const latestQuery = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc'),
          limit(12)
        );
        const latestSnapshot = await getDocs(latestQuery);
        const latestData = latestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLatestBlogs(latestData);

        // Fetch all blogs to categorize
        const allBlogsQuery = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc')
        );
        const allBlogsSnapshot = await getDocs(allBlogsQuery);
        const allBlogsData = allBlogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Group by category
        const categoriesMap = {};
        allBlogsData.forEach(blog => {
          if (!categoriesMap[blog.category]) {
            categoriesMap[blog.category] = [];
          }
          categoriesMap[blog.category].push(blog);
        });

        // Transform to array and limit to 12 blogs per category
        const categoriesArray = Object.keys(categoriesMap).map(category => ({
          category,
          blogs: categoriesMap[category].slice(0, 12)
        }));

        setCategoriesWithBlogs(categoriesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  return (
    <Layout>
      <BlogHero />
      <LatestBlogs blogs={latestBlogs} />
      <CategoriesSection categoriesWithBlogs={categoriesWithBlogs} />
    </Layout>
  );
}