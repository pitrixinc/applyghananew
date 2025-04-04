import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import Head from "next/head";
import Services from "@/components/Services/Services";
import ServicesHero from "@/components/Services/ServicesHero";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ServicesPage() {
  return (
    <Layout>
      <Head>
        <title>Our Services | Apply Ghana</title>
        <meta name="description" content="Explore our comprehensive range of services tailored to meet your needs." />
        <meta property="og:title" content="Our Services | Apply Ghana" />
        <meta property="og:description" content="Explore our comprehensive range of services tailored to meet your needs." />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ServicesHero/>
      <Services />
    </Layout>
  );
}