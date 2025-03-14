import React from "react";
import { FaPassport, FaUniversity, FaFileSignature, FaBuilding } from "react-icons/fa";

const Services = () => {
  return (
    <section className="relative py-16 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
          Our <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Premium Services</span>
        </h2>
        <p className="mt-4 text-md text-gray-600">
          We provide seamless and efficient document acquisition and consultation services to individuals and businesses across Ghana.
        </p>

        {/* Services Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Passport Application */}
          <div className="group bg-white shadow-md rounded-xl p-6 transform hover:scale-105 transition duration-300">
            <div className="flex justify-center items-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
              <FaPassport className="text-3xl" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-green-600 transition">
              Passport Application
            </h3>
            <p className="mt-2 text-gray-600">
              Hassle-free passport processing with expert guidance.
            </p>
          </div>

          {/* University Admissions */}
          <div className="group bg-white shadow-md rounded-xl p-6 transform hover:scale-105 transition duration-300">
            <div className="flex justify-center items-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
              <FaUniversity className="text-3xl" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-green-600 transition">
              University Admissions
            </h3>
            <p className="mt-2 text-gray-600">
              Expert assistance in applying for university programs.
            </p>
          </div>

          {/* Business Registration */}
          <div className="group bg-white shadow-md rounded-xl p-6 transform hover:scale-105 transition duration-300">
            <div className="flex justify-center items-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
              <FaBuilding className="text-3xl" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-green-600 transition">
              Business Registration
            </h3>
            <p className="mt-2 text-gray-600">
              Register your business with ease and professionalism.
            </p>
          </div>

          {/* Commissioning of Oaths */}
          <div className="group bg-white shadow-md rounded-xl p-6 transform hover:scale-105 transition duration-300">
            <div className="flex justify-center items-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
              <FaFileSignature className="text-3xl" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-green-600 transition">
              Commissioning of Oaths
            </h3>
            <p className="mt-2 text-gray-600">
              Get certified legal documents with professional guidance.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <a
            href="/services"
            className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition"
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
