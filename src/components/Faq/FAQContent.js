import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

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

const FAQContent = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
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
  );
};

export default FAQContent;
