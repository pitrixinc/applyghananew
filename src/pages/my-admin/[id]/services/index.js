import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/SuperAdmin/Layout/layout";
import ServicesListing from "@/components/SuperAdmin/Services/ServicesListing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function services() {
  return (
        <Layout>
            <ServicesListing/>
        </Layout>
  );
}
