import React, { useState } from "react";
import { 
  FaCheckCircle, 
  FaClipboardList, 
  FaDollarSign, 
  FaQuestionCircle, 
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaTag,
  FaIdCard,
  FaInfo,
  FaImage,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ServiceDetails = ({ service }) => {
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  if (!service) return null;

  const toggleFaq = (index) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto mb-8 border-b border-gray-200">
        {['overview', 'features', 'process', 'faqs'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'features' && 'Key Features'}
            {tab === 'process' && 'Process Steps'}
            {tab === 'faqs' && 'FAQs'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{service.serviceName}</h2>
                <p className="text-gray-500 flex items-center mb-4">
                  <FaTag className="mr-2" /> {service.category}
                </p>
                
                <div className="prose max-w-none text-gray-600">
                  {service.description}
                </div>
{/*
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 flex items-center mb-2">
                      <FaIdCard className="text-blue-500 mr-2" /> Service ID
                    </h4>
                    <p className="text-gray-600">{service.slug}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 flex items-center mb-2">
                      <FaCalendarAlt className="text-green-500 mr-2" /> Date Created
                    </h4>
                    <p className="text-gray-600">
                      {service.dateCreated?.toDate?.().toLocaleDateString() || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 flex items-center mb-2">
                      <FaInfo className="text-purple-500 mr-2" /> Status
                    </h4>
                    <div className="flex items-center">
                      {service.status === 'Active' ? (
                        <FaToggleOn className="text-green-500 text-xl mr-2" />
                      ) : (
                        <FaToggleOff className="text-gray-400 text-xl mr-2" />
                      )}
                      <span className="text-gray-600">{service.status}</span>
                    </div>
                  </div>

                  {service.price && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 flex items-center mb-2">
                        <FaDollarSign className="text-yellow-500 mr-2" /> Price
                      </h4>
                      <p className="text-gray-600">${service.price}</p>
                    </div>
                  )}
                </div>
                 */}
              </div>
            </div>
          </div>
          

          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaImage className="text-indigo-500 mr-2" /> Service Image
                </h3>
                <img
                  src={service.imageUrl || "https://via.placeholder.com/600x400?text=Service+Image"}
                  alt={service.serviceName}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Features Tab */}
      {activeTab === 'features' && service.keyFeatures?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
              <FaCheckCircle className="text-green-500 mr-3" /> Key Features
            </h3>
            <ul className="space-y-4">
              {service.keyFeatures.map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <FaCheckCircle className="text-green-500 text-lg" />
                  </div>
                  <p className="ml-4 text-gray-700">{feature}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Process Steps Tab */}
      {activeTab === 'process' && service.processSteps?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
              <FaClipboardList className="text-blue-500 mr-3" /> Process Steps
            </h3>
            <ol className="space-y-6">
              {service.processSteps.map((step, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full mr-4 mt-1">
                    {index + 1}
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg flex-1">
                    <p className="text-gray-700">{step}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && service.faqs?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
              <FaQuestionCircle className="text-purple-500 mr-3" /> Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {service.faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <FaQuestionCircle className="text-purple-500 mr-3" />
                      {faq.question}
                    </h4>
                    {expandedFaqs[index] ? (
                      <FaChevronUp className="text-gray-500" />
                    ) : (
                      <FaChevronDown className="text-gray-500" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedFaqs[index] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white border-t border-gray-100">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceDetails;