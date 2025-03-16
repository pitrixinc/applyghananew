import { FaBolt, FaUserTie, FaShieldAlt, FaCheckCircle, FaUsers } from "react-icons/fa";

const benefits = [
  {
    title: "Fast & Reliable Processing",
    description: "We process applications quickly and efficiently, ensuring minimal delays.",
    icon: <FaBolt />,
  },
  {
    title: "Experienced Professionals",
    description: "Our team consists of industry experts with years of experience.",
    icon: <FaUserTie />,
  },
  {
    title: "Secure & Confidential Handling",
    description: "Your personal information is handled with the highest level of security.",
    icon: <FaShieldAlt />,
  },
  {
    title: "1000+ Successful Applications",
    description: "We have successfully processed thousands of applications with a high success rate.",
    icon: <FaCheckCircle />,
  },
];

const WhyChoose = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          Why Choose <span className="text-green-500">ApplyGhana?</span>
        </h2>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg rounded-lg p-6 text-center transition-all transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center text-white rounded-full text-3xl bg-green-500 shadow-md">
                {benefit.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-700">{benefit.title}</h3>
              <p className="text-gray-500 mt-2">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Client Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          <div className="flex items-center space-x-3">
            <FaUsers className="text-green-500 text-4xl" />
            <div>
              <h3 className="text-2xl font-bold text-gray-700">10+ Years</h3>
              <p className="text-gray-500">Industry Experience</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaCheckCircle className="text-green-500 text-4xl" />
            <div>
              <h3 className="text-2xl font-bold text-gray-700">95% Success Rate</h3>
              <p className="text-gray-500">High Application Approvals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
