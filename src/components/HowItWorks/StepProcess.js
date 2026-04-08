import { FaFileAlt, FaUsers, FaPaperPlane, FaCheckCircle, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

const steps = [
  {
    id: 1,
    title: "Submit Your Request",
    description: "Fill out our easy online form with your details.",
    details: "Start your journey by submitting your request through our simple and secure online form. Provide accurate information to ensure a smooth process. Once submitted, our team will reach out to you with the next steps.",
    icon: <FaFileAlt />,
  },
  {
    id: 2,
    title: "Consultation & Documentation",
    description: "Our experts review your request and guide you through the required documents.",
    details: "Our experienced team will review your request and schedule a consultation. We will guide you through gathering and preparing the necessary documents for your application. This step ensures all your paperwork is in order before submission.",
    icon: <FaUsers />,
  },
  {
    id: 3,
    title: "Processing & Submission",
    description: "We handle all the paperwork and submit your application efficiently.",
    details: "Once your documents are ready, we take care of processing and submitting your application. Our experts work diligently to ensure everything is completed accurately and efficiently, reducing the risk of delays or rejections.",
    icon: <FaPaperPlane />,
  },
  {
    id: 4,
    title: "Approval & Delivery",
    description: "Receive your approved documents or application results securely.",
    details: "After submission, we track your application’s progress and keep you updated. Once approved, we ensure safe and timely delivery of your documents or application outcome, providing you with peace of mind.",
    icon: <FaCheckCircle />,
  },
];

const StepProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".step");
      let index = 0;

      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6) {
          index = i;
        }
      });

      setActiveStep(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          How It <span className="text-green-500">Works</span>
        </h2>

        {/* Timeline - Desktop */}
        <div className="hidden md:flex justify-between items-center relative before:absolute before:top-1/2 before:left-0 before:w-full before:h-1 before:bg-gray-300">
          {steps.map((step, index) => (
            <div key={step.id} className="relative w-1/4 text-center">
              <button
                className={`w-16 h-16 mx-auto flex items-center justify-center text-white rounded-full shadow-lg text-3xl transition-all ${
                  activeStep >= index ? "bg-green-500 scale-110 shadow-xl" : "bg-gray-300"
                }`}
                onClick={() => setSelectedStep(step)}
              >
                {step.icon}
              </button>
              <h3 className="mt-4 text-md font-semibold text-gray-700">{step.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Timeline - Mobile */}
        <div className="md:hidden flex flex-col space-y-12 relative before:absolute before:left-4 before:top-0 before:h-full before:w-1 before:bg-gray-300">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`relative flex items-start space-x-4 step transition-all ${
                activeStep >= index ? "opacity-100 translate-x-0" : "opacity-50 translate-x-4"
              }`}
              onClick={() => setSelectedStep(step)}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center text-white rounded-full text-sm transition-all ${
                  activeStep >= index ? "bg-green-500 scale-110 shadow-lg" : "bg-gray-300"
                }`}
              >
                {step.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">{step.title}</h3>
                <p className="text-gray-500 text-[10px]">{step.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal for Step Details */}
      {selectedStep && (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
              onClick={() => setSelectedStep(null)}
            >
              <FaTimes />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white rounded-full shadow-lg text-3xl bg-green-500">
                {selectedStep.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedStep.title}</h3>
              <p className="text-gray-600 mt-3">{selectedStep.details}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StepProcess;
