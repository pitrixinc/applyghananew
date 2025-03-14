import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Robert",
    role: "CTO, Robert Consultancy",
    feedback: "ApplyGhana made the entire process so easy for me. Their team is efficient and highly professional.",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  },
  {
    name: "Jeny Doe",
    role: "CEO, Jeny Consultancy",
    feedback: "A seamless experience from start to finish. I highly recommend ApplyGhana for all document processing needs.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
  },
  {
    name: "Mia Brown",
    role: "Marketing Manager, Stech",
    feedback: "The team was incredibly supportive and guided me through every step. Very trustworthy!",
    image: "https://images.unsplash.com/photo-1499470932971-a90681ce8530?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "David Smith",
    role: "Founder, Smith Corp",
    feedback: "I was impressed with their efficiency. They handled my document processing smoothly and quickly.",
    image: "https://images.unsplash.com/photo-1488508872907-592763824245?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "Linda Williams",
    role: "HR Manager, Global Inc.",
    feedback: "The best customer service experience I have had. Highly recommended!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    // Detect screen size to set number of items per slide
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 3 : 1);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [itemsPerPage]);

  return (
    <section className="relative w-full  py-16">
      {/* Background Layout */}
      <div className="absolute inset-0 flex">
        <div className="w-3/4 "></div>
        <div className="w-1/4 bg-green-500"></div>
      </div>

      {/* Testimonial Content */}
      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            What Our <span className="text-green-600">Clients</span> Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We take pride in delivering top-notch services to our customers.
            Here’s what they have to say about ApplyGhana.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative w-full overflow-hidden">
          <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {testimonials
              .slice(currentIndex * itemsPerPage, currentIndex * itemsPerPage + itemsPerPage)
              .map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="p-8 bg-white rounded-lg shadow-lg">
                    <p className="text-gray-600 italic">“{testimonial.feedback}”</p>
                    <div className="flex items-center mt-6">
                      <img className="w-14 h-14 rounded-full border-2 border-green-500" src={testimonial.image} alt={testimonial.name} />
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="mt-8 flex justify-center gap-6">
          <button onClick={prevSlide} className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
            <FaChevronLeft className="w-6 h-6" />
          </button>

          <button onClick={nextSlide} className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
            <FaChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="mt-6 flex justify-center space-x-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentIndex ? "bg-green-500 w-6" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
