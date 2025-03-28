import { FaBullseye, FaEye, FaAward, FaBalanceScale, FaUsers, FaRocket, FaHandsHelping } from "react-icons/fa";

const MissionVisionValues = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center">
          Our <span className="text-green-500">Mission, Vision & Values</span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          At ApplyGhana, we are committed to simplifying application processes with efficiency, trust, and professionalism.
        </p>

        {/* Mission & Vision */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mission */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
            <FaBullseye className="text-green-500 text-5xl mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
            <p className="mt-4 text-gray-600">
              To simplify and streamline the process of obtaining essential documents, university admissions, and business registrations while ensuring a seamless, stress-free experience for our clients.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
            <FaEye className="text-green-500 text-5xl mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
            <p className="mt-4 text-gray-600">
              To become Ghana’s most trusted and efficient consultancy agency, empowering individuals and businesses with hassle-free access to essential services.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800">Our Core Values</h3>
          <p className="mt-4 text-gray-600 text-center">
            We uphold the highest standards of integrity, excellence, and customer focus in all our services.
          </p>

          {/* Values Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-lg">
              <FaBalanceScale className="text-green-500 text-4xl mb-3" />
              <h4 className="text-xl font-semibold text-gray-800">Integrity</h4>
              <p className="text-gray-600 mt-2">We operate with honesty, transparency, and fairness, ensuring trust in every service we provide.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-lg">
              <FaAward className="text-green-500 text-4xl mb-3" />
              <h4 className="text-xl font-semibold text-gray-800">Excellence</h4>
              <p className="text-gray-600 mt-2">We strive for quality and precision, ensuring our clients receive the best service possible.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-lg">
              <FaUsers className="text-green-500 text-4xl mb-3" />
              <h4 className="text-xl font-semibold text-gray-800">Customer Focus</h4>
              <p className="text-gray-600 mt-2">Our clients come first. We listen, understand, and tailor solutions to meet their needs.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-lg">
              <FaRocket className="text-green-500 text-4xl mb-3" />
              <h4 className="text-xl font-semibold text-gray-800">Efficiency</h4>
              <p className="text-gray-600 mt-2">We streamline processes to deliver fast, reliable, and hassle-free services.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-lg">
              <FaHandsHelping className="text-green-500 text-4xl mb-3" />
              <h4 className="text-xl font-semibold text-gray-800">Trust & Support</h4>
              <p className="text-gray-600 mt-2">We build lasting relationships by offering dedicated support and guidance to our clients.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionValues;
