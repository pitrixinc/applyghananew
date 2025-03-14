import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import Hero from "@/components/Home/Hero";
import Services from "@/components/Home/Services";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import How from "@/components/Home/How";
import Testimonial from "@/components/Home/Testimonial";
import CTA from "@/components/Home/CTA";

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
          <Hero/>
          <Services/>
          <WhyChooseUs/>
          <How/>
          <Testimonial/>
          <CTA/>
          {/** 
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        */}
        </Layout>
  );
}
