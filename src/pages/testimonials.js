import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import TestimonialHero from "@/components/Testimonials/TestimonialHero";
import FeaturedTestimonial from "@/components/Testimonials/FeaturedTestimonial";
import TestimonialsContent from "@/components/Testimonials/TestimonialsContent";
import TestimonialStatistics from "@/components/Testimonials/TestimonialStatistics";
import ClientStories from "@/components/Testimonials/ClientStories";
import CTASection from "@/components/Testimonials/CTASection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function testimonials() {
  return (
        <Layout>
          <TestimonialHero/>
          <FeaturedTestimonial/>
          <TestimonialsContent/>
          <TestimonialStatistics/>
          <ClientStories/>
          <CTASection/>
        </Layout>
  );
}
