import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import VisitorsAnalyticsPage from "@/components/SuperAdmin/VisitorAnalyticsPage/VisitorAnalyticsPage";
import Layout from "@/components/SuperAdmin/Layout/layout";
import Sidebar from "@/components/SuperAdmin/Layout/Sidebar";

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
    <Sidebar
      className={`${geistSans.className} ${geistMono.className}`}
    >
      <main className="">
        <VisitorsAnalyticsPage/>
      </main>
    </Sidebar>
  );
}
