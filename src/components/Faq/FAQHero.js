import React from "react";

const FAQHero = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('https://melcomtravels.com/images/others/FAQ-2.jpeg')" }}>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="bg-white opacity-80 backdrop-blur-md shadow-lg p-8 rounded-lg border border-white/20">
          <h1 className="text-2xl md:text-5xl font-bold text-black">
            Frequently Asked <span className="text-green-400">Questions</span>
          </h1>
          <p className="mt-4 text-sm md:text-lg text-gray-500">
            Everything you need to know about our services and how we can assist you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQHero;
