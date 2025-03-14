import React from "react";
import { FaUsers, FaClock, FaShieldAlt, FaStar } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <section className="relative py-16 bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-10"></div>

      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose <span className="text-green-600">ApplyGhana?</span>
          </h2>
          <p className="mt-4 text-md text-gray-600 max-w-2xl mx-auto">
            At ApplyGhana, we prioritize <b>trust, efficiency, and customer satisfaction</b>. With <b>years of experience</b> in document processing and consultancy, we have helped thousands of clients <b>secure passports, register businesses, and gain university admissions</b> with ease.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full">
              <FaUsers size={28} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">10,000+ Clients</h3>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ve successfully assisted thousands of individuals and businesses in Ghana.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full">
              <FaClock size={28} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">Fast Processing</h3>
            <p className="mt-2 text-sm text-gray-600">
              We handle all applications quickly and efficiently, saving you time and stress.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full">
              <FaShieldAlt size={28} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">Reliable & Secure</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your personal data is 100% secure with us. We follow strict confidentiality standards.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full">
              <FaStar size={28} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">5-Star Reviews</h3>
            <p className="mt-2 text-sm text-gray-600">
              Our clients love us! We maintain a high customer satisfaction rate.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="px-8 py-3 text-lg font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
