import { FaFileAlt, FaUsers, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

const steps = [
  {
    id: 1,
    title: "Submit Your Request",
    description: "Fill out our easy online form with your details.",
    icon: <FaFileAlt />,
  },
  {
    id: 2,
    title: "Consultation & Documentation",
    description: "Our experts review your request and guide you through the required documents.",
    icon: <FaUsers />,
  },
  {
    id: 3,
    title: "Processing & Submission",
    description: "We handle all the paperwork and submit your application efficiently.",
    icon: <FaPaperPlane />,
  },
  {
    id: 4,
    title: "Approval & Delivery",
    description: "Receive your approved documents or application results securely.",
    icon: <FaCheckCircle />,
  },
];

const StepProcess = () => {
  const [activeStep, setActiveStep] = useState(0);

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
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          How It <span className="text-green-500">Works</span>
        </h2>

        {/* Timeline - Desktop */}
        <div className="hidden md:flex justify-between items-center relative before:absolute before:top-1/2 before:left-0 before:w-full before:h-1 before:bg-gray-300">
          {steps.map((step, index) => (
            <div key={step.id} className="relative w-1/4 text-center">
              <div
                className={`w-16 h-16 mx-auto flex items-center justify-center text-white rounded-full shadow-md text-3xl transition-all ${
                  activeStep >= index ? "bg-green-500 scale-110" : "bg-gray-300"
                }`}
              >
                {step.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-700">{step.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Timeline - Mobile */}
        <div className="md:hidden flex flex-col space-y-12 relative before:absolute before:left-4 before:top-0 before:h-full before:w-1 before:bg-gray-300">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex items-start space-x-4 step transition-all ${
                activeStep >= index ? "opacity-100 translate-x-0" : "opacity-50 translate-x-4"
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center text-white rounded-full text-2xl transition-all ${
                  activeStep >= index ? "bg-green-500 scale-110" : "bg-gray-300"
                }`}
              >
                {step.icon}
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-700">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepProcess;
