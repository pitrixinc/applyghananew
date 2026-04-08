import React from "react";

const ServiceHero = ({ serviceName, tagline, imageUrl }) => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url("https://info.ehl.edu/hubfs/Blog-EHL-Insights/Blog-Header-EHL-Insights/service-culture.jpeg")`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="bg-white/90 backdrop-blur-md shadow-lg p-8 rounded-lg border border-white/20">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            {serviceName}
          </h1>
          <p className="mt-4 text-sm md:text-lg text-gray-600">{tagline}</p>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
