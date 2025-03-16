import { FaHandshake, FaCheckCircle, FaArrowRight, FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.transitchicago.com/assets/1/6/wideheader_traintracker.jpg')" }} // Replace with actual image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 text-center max-w-3xl px-6"
      >
        <div className="bg-white opacity-90 backdrop-blur-md shadow-xl p-8 rounded-lg border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex justify-center items-center gap-3">
            <FaHandshake className="text-green-500" /> Ready to Begin?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Whether you're applying for a university, registering a business, or securing important documents, ApplyGhana is here to simplify the process.
          </p>

          {/* Trust Points */}
          <div className="flex justify-center gap-8 mt-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg shadow-md"
            >
              <FaCheckCircle className="text-green-500" size={24} />
              <span className="text-gray-700 font-semibold">1000+ Successful Applications</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg shadow-md"
            >
              <FaCheckCircle className="text-green-500" size={24} />
              <span className="text-gray-700 font-semibold">95% Client Satisfaction</span>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/services"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg flex items-center gap-2 transition-all"
            >
              <FaArrowRight /> Start Your Application
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/contact-us"
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-lg flex items-center gap-2 transition-all"
            >
              <FaPhoneAlt /> Contact Us
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
