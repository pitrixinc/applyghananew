import React from "react";

const CategoryHero = ({ category, description }) => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.capgemini.com/wp-content/uploads/2022/01/Capgemini_Business-Services_Digital-Employee-Operations-e1642433369908.jpg')" }} // Update with a relevant category image if needed
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="bg-white/90 backdrop-blur-md shadow-lg p-8 rounded-lg border border-white/20">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            {category}
          </h1>
          <p className="mt-4 text-sm md:text-lg text-gray-600">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;
