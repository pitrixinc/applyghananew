import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import ContactUs from "@/components/ContactUs/ContactUs";
import ContactUsHero from "@/components/ContactUs/ContactUsHero";
import ContactInformation from "@/components/ContactUs/ContactInformation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function contactus() {
  return (
        <Layout>
            <ContactUsHero/>
            <ContactUs/>
            <ContactInformation/>
        </Layout>
  );
}
