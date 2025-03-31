import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/firebase.config"; // Firebase config
import { doc, getDoc } from "firebase/firestore";
import ServiceHero from "@/components/Services/Service/ServiceHero";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import ServiceDetails from "@/components/Services/Service/ServiceDetails";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ServicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState(null);

  
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!id) return;

      try {
        const serviceRef = doc(db, "services", id);
        const serviceSnap = await getDoc(serviceRef);

        if (serviceSnap.exists()) {
          setService(serviceSnap.data());
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    fetchServiceDetails();
  }, [id]);


  return (
        <Layout>
            {service && (
              <>
                <ServiceHero
                  serviceName={service.serviceName}
                  tagline={service.tagline || "Experience expert service with ApplyGhana."}
                  imageUrl={service.imageUrl}
                />
                <ServiceDetails service={service} />
              </>
            )}
        </Layout>
  );
}
