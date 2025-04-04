import React from "react";

const ServicesHero = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('https://d2pi0n2fm836iz.cloudfront.net/422345/1104202223072663659b2ef0dcd.jpg')" }}>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="bg-white opacity-80 backdrop-blur-md shadow-lg p-8 rounded-lg border border-white/20">
          <h1 className="text-2xl md:text-5xl font-bold text-black">
            Our <span className="text-green-400">Services</span>
          </h1>
          <p className="mt-4 text-sm md:text-lg text-gray-500">
          Explore our comprehensive range of services tailored to meet your needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
