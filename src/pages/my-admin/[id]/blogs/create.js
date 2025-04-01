import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/SuperAdmin/Layout/layout";
import Create from "@/components/SuperAdmin/Blogs/Create";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function blogcreate() {
  return (
        <Layout>
            <Create/>
        </Layout>
  );
}
