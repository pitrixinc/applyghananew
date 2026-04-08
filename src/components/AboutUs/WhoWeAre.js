import { FaGlobe, FaUsers, FaBriefcase, FaHandshake } from "react-icons/fa";

const WhoWeAre = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Who <span className="text-green-500">We Are</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            ApplyGhana is a trusted consultancy agency dedicated to simplifying 
            application processes for individuals and businesses. From 
            document acquisition to university admissions and business 
            registration, we ensure a smooth, efficient, and stress-free 
            experience.
          </p>
          
          {/* Key Highlights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <FaGlobe className="text-green-500 text-3xl" />
              <span className="text-gray-700 text-lg font-semibold">
                Nationwide Services
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaUsers className="text-green-500 text-3xl" />
              <span className="text-gray-700 text-lg font-semibold">
                Experienced Professionals
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaBriefcase className="text-green-500 text-3xl" />
              <span className="text-gray-700 text-lg font-semibold">
                Business & Academic Experts
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaHandshake className="text-green-500 text-3xl" />
              <span className="text-gray-700 text-lg font-semibold">
                Trusted by Thousands
              </span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="https://scontent.facc5-2.fna.fbcdn.net/v/t39.30808-6/431207572_965447165580883_3993945547321886403_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=S9-fhO6yhswQ7kNvgH7nxDF&_nc_oc=Adl6jimmMJzmHsSoNvVYt-jP7msHcKUaWE4n3Z5OVgOCSrQANMdiCc0gHzR5ocrnFQ4&_nc_zt=23&_nc_ht=scontent.facc5-2.fna&_nc_gid=zthIuBAImZ8k1AeQVXPMXg&oh=00_AYGBgDHDtpZwNIHMfBndm7qk1GArTrnZcUu0zpZrtSVQXg&oe=67EBA85D" // Replace with actual image
            alt="ApplyGhana Team"
            className="w-full max-w-lg rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
