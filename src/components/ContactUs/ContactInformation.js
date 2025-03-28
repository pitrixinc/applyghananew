import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const ContactInformation = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
          Get in <span className="text-green-500">Touch</span>
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          We’d love to hear from you! Reach out to us through any of the following channels.
        </p>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phone */}
          <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center text-center transition transform hover:scale-105">
            <FaPhoneAlt className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Call Us</h3>
            <p className="text-gray-600 mt-2">
              <a href="tel:+233245510173" className="text-green-500 font-semibold hover:underline">
                +233 24 551 0173
              </a>
            </p>
          </div>

          {/* Email */}
          <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center text-center transition transform hover:scale-105">
            <FaEnvelope className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Email Us</h3>
            <p className="text-gray-600 mt-2">
              <a href="mailto:contact@applyghana.com" className="text-green-500 font-semibold hover:underline">
                contact@applyghana.com
              </a>
            </p>
          </div>

          {/* Location */}
          <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center text-center transition transform hover:scale-105">
            <FaMapMarkerAlt className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Visit Us</h3>
            <p className="text-gray-600 mt-2">
              Greater Accra, Accra, Ghana
            </p>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <iframe
            title="ApplyGhana Location"
            className="w-full h-64 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126915.47607672656!2d-0.2521105036588482!3d5.560025226309467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b2b7b5a8d03%3A0x7b8f4f93eeb8b6df!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1619473170596!5m2!1sen!2sgh"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Social Media Links */}
        <div className="mt-12 flex justify-center space-x-6">
          <a href="#" className="text-blue-600 text-3xl transition transform hover:scale-125">
            <FaFacebook />
          </a>
          <a href="#" className="text-blue-400 text-3xl transition transform hover:scale-125">
            <FaTwitter />
          </a>
          <a href="#" className="text-pink-600 text-3xl transition transform hover:scale-125">
            <FaInstagram />
          </a>
          <a href="#" className="text-blue-700 text-3xl transition transform hover:scale-125">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactInformation;
