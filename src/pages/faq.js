import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import Faq from "@/components/Faq/Faq";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
        <Layout>
          <Faq/>
        </Layout>
  );
}
