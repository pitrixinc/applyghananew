import React from "react";

const AboutUsHero = () => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://sarir.com/wp-content/uploads/2024/11/Aboutus_backgound-1.jpg')" }} // Replace with actual image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="bg-white opacity-90 backdrop-blur-md shadow-xl p-8 rounded-lg border border-white/20">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            Get to Know <span className="text-green-500">ApplyGhana</span>
          </h1>
          <p className="mt-4 text-sm md:text-lg text-gray-600">
            Empowering individuals and businesses with seamless application processing, trusted expertise, and unparalleled service.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHero;
