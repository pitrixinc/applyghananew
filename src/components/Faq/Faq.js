import React, {useState} from 'react'
import { FaRegFileAlt, FaUniversity, FaBriefcase, FaInfoCircle, FaTimes } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

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

const faqs = [
  {
    question: "How do I apply for a passport through ApplyGhana?",
    answer:
      "To apply for a passport, fill out our online request form with your details. Our team will guide you through the process, including document submission and appointment scheduling.",
  },
  {
    question: "What documents are required for university admissions?",
    answer:
      "You'll need your academic transcripts, identification documents, and any required application forms. ApplyGhana helps streamline this process to increase your chances of successful admission.",
  },
  {
    question: "How long does business registration take?",
    answer:
      "The duration depends on the type of business and the registration requirements. On average, registration takes 7-14 business days. We handle the process efficiently to ensure a smooth experience.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept mobile money (MTN, Vodafone, AirtelTigo), bank transfers, and cash payments at our office. Payment details will be provided upon request.",
  },
];

const Faq = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>  
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

    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full"
      >
        {/* Left Image Section */}
        <div className="w-full lg:w-1/2">
          <img
            src="https://pagedone.io/asset/uploads/1696230182.png"
            alt="FAQ Section"
            className="w-full rounded-xl object-cover"
          />
        </div>

        {/* Right FAQ Section */}
        <div className="w-full lg:w-1/2">
          <div className="lg:max-w-xl">
            <div className="mb-8 lg:mb-12">
              <h6 className="text-lg font-medium text-green-600 text-center lg:text-left">
                FAQs
              </h6>
              <h2 className="text-lg md:text-3xl text-center font-bold text-gray-900 leading-[3.25rem] mb-5 lg:text-left">
                Have Questions? We&apos;ve Got Answers!
              </h2>
            </div>

            {/* FAQ List */}
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4"
                >
                  <button
                    className="accordion-toggle group inline-flex items-center justify-between text-[11px] md:text-lg font-semibold leading-8 text-gray-600 w-full transition duration-500 hover:text-indigo-600 accordion-active:text-indigo-600 accordion-active:font-medium always-open"
                  aria-controls="basic-collapse-one-with-arrow-always-open"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                    <FaChevronDown
                      className={`transition-transform duration-300 ${
                        openIndex === index ? "rotate-180 text-green-600" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`mt-2 text-gray-600 text-[11px] md:text-base transition-all duration-300 overflow-hidden ${
                      openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
 </div>
  )
}

export default Faq