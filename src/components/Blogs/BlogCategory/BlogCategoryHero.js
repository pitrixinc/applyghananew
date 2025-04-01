import React from "react";

const BlogCategoryHero = ({ category, description }) => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://taylorwells.com.au/wp-content/uploads/2020/05/ING_19061_177314-1200x675.jpg')" }} // Replace with a blog category-specific image
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

export default BlogCategoryHero;
