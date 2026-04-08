import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import FAQCategories from "@/components/Faq/FAQCategories";
import FAQContent from "@/components/Faq/FAQContent";
import CTASection from "@/components/Faq/CTASection";
import FAQsHero from "@/components/Faq/FAQsHero";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function faq() {
  return (
        <Layout>
          <FAQsHero/>
          <FAQCategories/>
          <FAQContent/>
          <CTASection/>
        </Layout>
  );
}
