import { FaClock, FaUsers, FaShieldAlt, FaStar, FaBolt, FaBalanceScale } from "react-icons/fa";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.h2 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-3xl md:text-5xl font-bold text-gray-900 text-center"
        >
          Why <span className="text-green-500">Choose Us?</span>
        </motion.h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          We stand out in the industry with <b>fast processing, expert guidance, and trusted support.</b>
        </p>

        {/* Benefits Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <FaClock />, title: "Fast Processing", text: "We process applications quickly and efficiently, saving you valuable time." },
            { icon: <FaUsers />, title: "Experienced Team", text: "Our experts have years of experience in document processing and university admissions." },
            { icon: <FaShieldAlt />, title: "Secure & Confidential", text: "We ensure the highest level of security and confidentiality for your documents." },
            { icon: <FaStar />, title: "95% Client Satisfaction", text: "Thousands of happy clients trust ApplyGhana for their application needs." },
            { icon: <FaBolt />, title: "Hassle-Free Service", text: "We handle all the complexities so you can focus on your goals." },
            { icon: <FaBalanceScale />, title: "Integrity & Transparency", text: "No hidden fees, no surprises. Just honest, quality service." }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              whileHover={{ scale: 1.05 }} 
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg"
            >
              <div className="text-green-500 text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-800">How We Compare</h3>
          <p className="mt-2 text-gray-600 text-center">
            See how ApplyGhana stands out from the competition.
          </p>

          <div className="overflow-x-auto mt-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-green-500 text-white text-lg">
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-center">ApplyGhana</th>
                  <th className="p-4 text-center">Others</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  { feature: "Processing Speed", ours: "Fast & Efficient", others: "Slow & Complex" },
                  { feature: "Customer Satisfaction", ours: "95% Positive Reviews", others: "60-70% Satisfaction" },
                  { feature: "Security", ours: "Strict Confidentiality", others: "Unclear Policies" },
                  { feature: "Hidden Fees", ours: "Transparent Pricing", others: "Extra & Unexpected Fees" },
                  { feature: "Support", ours: "Personalized Assistance", others: "Limited Help & Guidance" }
                ].map((row, index) => (
                  <tr key={index} className={`border-t border-gray-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="p-4">{row.feature}</td>
                    <td className="p-4 text-center font-semibold text-green-600">{row.ours}</td>
                    <td className="p-4 text-center text-gray-600">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
