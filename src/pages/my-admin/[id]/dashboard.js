import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/SuperAdmin/Layout/Sidebar";

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
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard content goes here */}
          <div className="bg-green-100 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to Apply Ghana</h2>
            <p className="text-gray-600">Your admin dashboard overview</p>
          </div>
        </div>
      </div>
        </Sidebar>
  );
}
