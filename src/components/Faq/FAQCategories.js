import { useState } from "react";
import { FaRegFileAlt, FaUniversity, FaBriefcase, FaInfoCircle, FaTimes } from "react-icons/fa";

const categories = [
  {
    title: "Document Services",
    icon: <FaRegFileAlt />,
    shortDescription: "Passports, Birth Certificates, and more.",
    detailedDescription:
      "Our document services include acquiring passports, biometric birth certificates, and other official documents. We ensure fast, secure, and hassle-free processing with expert guidance every step of the way.",
  },
  {
    title: "University Admissions",
    icon: <FaUniversity />,
    shortDescription: "Get help with school applications.",
    detailedDescription:
      "We assist students in securing admissions to top universities. From application processing to document submission, we simplify the process and increase your chances of success.",
  },
  {
    title: "Business Registration",
    icon: <FaBriefcase />,
    shortDescription: "Register and manage your business legally.",
    detailedDescription:
      "Starting a business? We help you register your company, obtain business permits, and ensure compliance with all legal requirements in Ghana.",
  },
  {
    title: "General Inquiries",
    icon: <FaInfoCircle />,
    shortDescription: "Common questions about our services.",
    detailedDescription:
      "Have any questions? Explore our FAQs or contact us for more details about our services, processes, and how we can assist you.",
  },
];

const FAQCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <section className="py-16 px-6 lg:px-12 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-lg text-gray-600 mt-4">Find answers related to specific services.</p>
          </div>
    
          {/* Categories Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => setSelectedCategory(category)}
                className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="text-green-500 text-4xl flex justify-center transition-transform duration-300 group-hover:scale-110">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 text-center">{category.title}</h3>
                <p className="text-gray-600 text-sm md:text-normal text-center mt-2">{category.shortDescription}</p>
              </div>
            ))}
          </div>
    
          {/* Modal */}
          {selectedCategory && (
            <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center p-6 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8 relative transform scale-95 transition-transform duration-300 animate-fadeIn">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
    
                {/* Modal Content */}
                <div className="text-center">
                  <div className="text-green-500 text-5xl flex justify-center">{selectedCategory.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mt-4">{selectedCategory.title}</h3>
                  <p className="text-gray-600 mt-3">{selectedCategory.detailedDescription}</p>
                </div>
    
                {/* Close Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
  );
};

export default FAQCategories;
