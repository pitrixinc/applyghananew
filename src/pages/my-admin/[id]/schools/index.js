import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/SuperAdmin/Layout/Sidebar";
import SchoolsManagement from "@/components/SuperAdmin/SchoolsManagement/SchoolsManagement";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function dashboard() {
  return (
        <Sidebar>
       <div className="space-y-6">
        <SchoolsManagement/>
      </div>
        </Sidebar>
  );
}
