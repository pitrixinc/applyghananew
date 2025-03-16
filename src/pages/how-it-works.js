import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import HowItWorksHero from "@/components/HowItWorks/HowItWorksHero";
import StepProcess from "@/components/HowItWorks/StepProcess";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function howotworks() {
  return (
        <Layout>
            <HowItWorksHero/>
            <StepProcess/>
        </Layout>
  );
}
