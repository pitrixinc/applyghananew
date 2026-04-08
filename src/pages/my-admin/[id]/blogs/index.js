import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/SuperAdmin/Layout/layout";
import BlogsListing from "@/components/SuperAdmin/Blogs/BlogsListing";
import Sidebar from "@/components/SuperAdmin/Layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Blogs() {
  return (
        <Sidebar>
            <BlogsListing/>
        </Sidebar>
  );
}
