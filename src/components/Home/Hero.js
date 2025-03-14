"use client";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "/images/1.svg", // Example Image URL
  "/images/2.svg",
  "/images/3.svg",
  "/images/4.svg",
  "/images/5.svg",
  "/images/6.svg",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Function to go to previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Auto slide change every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
     {/* Background Image Slider (Only Visible on Small Screens) */}
<div className="absolute inset-0 z-0 lg:hidden">
  <div className="w-full h-full relative">
    
    {/* Background Image Slider */}
    {images.map((image, index) => (
      <img
        key={index}
        src={image}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
          index === currentIndex ? "opacity-100" : "opacity-0"
        }`}
        alt="Hero Background"
      />
    ))}

    {/* Transparent Overlay */}
    <div className="absolute inset-0 bg-black bg-white/70 backdrop-blur-md shadow-md z-10"></div> {/* Adjust opacity as needed */}
    
  </div>
</div>


      <section className="relative mx-auto max-w-screen-xl px-4 pt-24 pb-12 lg:flex items-center md:px-8">
        {/* Hero Content */}
        <div className="relative z-10 flex-1 space-y-4 text-center lg:text-left">
          <h1 className="text-black font-bold text-2xl md:text-4xl xl:text-5xl">
            One page Template for <br />
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Digital agency
            </span>
          </h1>
          <p className="text-gray-500 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          </p>
          <div className="pt-10 flex flex-col sm:flex-row justify-center lg:justify-start space-y-3 sm:space-x-6 sm:space-y-0">
            <a href="#" className="px-7 py-3 bg-white text-gray-800 text-center rounded-md shadow-md sm:w-auto">
              Get started
            </a>
            <a href="#" className="px-7 py-3 bg-gradient-to-r from-green-400 to-green-600 text-gray-200 text-center rounded-md sm:w-auto">
              Request Consultation
            </a>
          </div>
        </div>

        {/* Image Slider (Only Visible on Large Screens) */}
        <div className="relative flex-1 hidden lg:block mt-0 mb-[300px]">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              className={`absolute inset-0 w-full h-auto rounded-lg shadow-lg transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              alt="Hero Slide"
            />
          ))}

          {/* Slider Controls 
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full shadow-md hover:bg-opacity-70 transition"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full shadow-md hover:bg-opacity-70 transition"
          >
            <FaChevronRight size={20} />
          </button>
          */}
        </div>
      </section>
    </div>
  );
};

export default Hero;
