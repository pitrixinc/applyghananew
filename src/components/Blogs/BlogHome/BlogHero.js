import React from "react";

const BlogHero = () => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2022/03/what-is-a-blog-1.png')" }} // Replace with an actual blog-related image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="bg-white/90 backdrop-blur-md shadow-lg p-8 rounded-lg border border-white/20">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            Stay Informed with Our <span className="text-green-400">Latest Insights</span>
          </h1>
          <p className="mt-4 text-sm md:text-lg text-gray-600">
            Explore expert articles, tips, and updates to stay ahead in your journey.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
