import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Home/layout";
import ServiceHero from "@/components/Services/Service/ServiceHero";
import ServiceDetails from "@/components/Services/Service/ServiceDetails";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const serviceRef = doc(db, "services", id);
    const serviceSnap = await getDoc(serviceRef);

    if (!serviceSnap.exists()) {
      return {
        notFound: true,
      };
    }

    const service = {
      id,
      ...serviceSnap.data(),
    };

    return {
      props: { service },
    };
  } catch (error) {
    console.error("Error fetching service details:", error);
    return {
      notFound: true,
    };
  }
}

export default function ServicePage({ service }) {
  // Truncate description for meta tags if it's too long
  const metaDescription = service?.description
    ? service.description.slice(0, 160) + (service.description.length > 160 ? "..." : "")
    : "Professional service provided by Apply Ghana";

  return (
    <Layout>
      <Head>
        <title>{`${service.serviceName} | Apply Ghana`}</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.applyghana.com/services/${service.id}`} />
        <meta property="og:title" content={`${service.serviceName} | Apply Ghana`} />
        <meta property="og:description" content={metaDescription} />
        {service.imageUrl && <meta property="og:image" content={service.imageUrl} />}
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://www.applyghana.com/services/${service.id}`} />
        <meta property="twitter:title" content={`${service.serviceName} | Apply Ghana`} />
        <meta property="twitter:description" content={metaDescription} />
        {service.imageUrl && <meta property="twitter:image" content={service.imageUrl} />}
      </Head>

      {service && (
        <>
          <ServiceHero
            serviceName={service.serviceName}
            tagline={service.tagline || "Experience expert service with Apply Ghana."}
            imageUrl={service.imageUrl}
          />
          <ServiceDetails service={service} />
        </>
      )}
    </Layout>
  );
}