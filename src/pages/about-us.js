import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import AboutUsHero from "@/components/AboutUs/AboutUsHero";
import WhoWeAre from "@/components/AboutUs/WhoWeAre";
import MissionVisionValues from "@/components/AboutUs/MissionVisionValues";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import MeetTheTeam from "@/components/AboutUs/MeetTheTeam";
import CTASection from "@/components/AboutUs/CTASection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function aboutus() {
  return (
        <Layout>
            <AboutUsHero/> 
            <WhoWeAre/>
            <MissionVisionValues/>
            <WhyChooseUs/>
            <MeetTheTeam/>
            <CTASection/>
        </Layout>
  );
}
