import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/firebase.config"; // Firebase config
import { collection, getDocs, query, where } from "firebase/firestore";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import CategoryHero from "@/components/Services/ServicesCategory/CategoryHero";
import ServicesList from "@/components/Services/ServicesCategory/ServicesList";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function selectedcategory() {
  const router = useRouter();
  const { id } = router.query;
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [services, setServices] = useState([]); // Store all services in the category

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!id) return;

      try {
        const servicesRef = collection(db, "services");
        const q = query(servicesRef, where("category", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const servicesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setServices(servicesData);
          setCategoryName(servicesData[0].category);
          setCategoryDescription(servicesData[0].categoryDescription || "Explore our expert services in this category.");
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  return (
    <Layout>
      <CategoryHero category={categoryName} description={categoryDescription} />
      <ServicesList services={services} />
    </Layout>
  );
}
