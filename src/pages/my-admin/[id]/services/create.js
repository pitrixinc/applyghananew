import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Create from "@/components/SuperAdmin/Services/Create";
import Sidebar from "@/components/SuperAdmin/Layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function servicecreate() {
  return (
        <Sidebar>
            <Create/>
        </Sidebar>
  );
}
