import React from "react";

const ContactUsHero = () => {
  const scrollToContactForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.samsung.com/is/image/samsung/assets/africa_en/support/Contact_Us_KV_1440x640.jpg.jpg?imwidth=1366')" }} // Replace with actual image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="bg-white opacity-90 backdrop-blur-md shadow-xl p-8 rounded-lg border border-white/20">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            Get in Touch with <span className="text-green-500">ApplyGhana</span>
          </h1>
          <p className="mt-4 text-sm md:text-lg text-gray-600">
            Have a question or need assistance? Our team is ready to help! Contact us today for seamless application processing.
          </p>
          <button
            onClick={scrollToContactForm}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all"
          >
            Contact Us Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactUsHero;
