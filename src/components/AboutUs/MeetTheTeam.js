import { useState } from "react";
import { FaLinkedin, FaTwitter, FaEnvelope, FaUserTie, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    role: "CEO & Founder",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQGwtpaR5hw7pA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1730767714559?e=2147483647&v=beta&t=mvzNX1MP7aWfRCSskck7Sl9IM9D8PWpL_Wu57qkx5fc", // Replace with actual image
    bio: "John is the visionary behind ApplyGhana. With 10+ years in document processing and application services, he leads the team with expertise and passion.",
    linkedin: "#",
    twitter: "#",
    email: "mailto:johndoe@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Operations Manager",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQG4RvdwwpWdAw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1650624989607?e=2147483647&v=beta&t=rmtpZN3XCd14wvZN645hAMIB3X_2rI-cpMJg3OZ935U",
    bio: "Jane oversees daily operations, ensuring smooth and efficient service delivery. Her experience in customer service and management is unmatched.",
    linkedin: "#",
    twitter: "#",
    email: "mailto:janesmith@example.com",
  },
  {
    id: 3,
    name: "Michael Johnson",
    role: "Lead Consultant",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFyzRrxLWjxOA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1554383018301?e=2147483647&v=beta&t=KIQuwhmHWjkgU-Leqlv2d1qDtQWDUk3-1ArqmpsMw9A",
    bio: "Michael specializes in university admissions and document processing, guiding clients through complex applications with ease.",
    linkedin: "#",
    twitter: "#",
    email: "mailto:michael@example.com",
  },
  {
    id: 4,
    name: "Sarah Brown",
    role: "Client Relations",
    image: "https://media.licdn.com/dms/image/v2/D4D22AQESeJ2YzZtBtg/feedshare-shrink_800/B4DZTalGnyG4Ak-/0/1738833952389?e=2147483647&v=beta&t=bZAsQSGRS8NjwZPMG2lgS5sKQALNAkiEQoFdwaody9M",
    bio: "Sarah ensures client satisfaction, providing top-notch support and clear communication throughout the application process.",
    linkedin: "#",
    twitter: "#",
    email: "mailto:sarah@example.com",
  },
];

const MeetTheTeam = () => {
  const [selectedMember, setSelectedMember] = useState(null);

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
          Meet Our <span className="text-green-500">Team</span>
        </motion.h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Our <b>dedicated experts</b> are here to guide you every step of the way.
        </p>

        {/* Team Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <motion.div 
              key={member.id} 
              whileHover={{ scale: 1.05 }} 
              className="bg-gray-50 p-6 rounded-lg shadow-lg text-center cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <img src={member.image} alt={member.name} className="w-24 h-24 mx-auto rounded-full border-4 border-green-500 shadow-md" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
              <div className="flex justify-center gap-4 mt-4 text-green-500">
                <a href={member.linkedin} className="hover:text-green-700">
                  <FaLinkedin size={20} />
                </a>
                <a href={member.twitter} className="hover:text-green-700">
                  <FaTwitter size={20} />
                </a>
                <a href={member.email} className="hover:text-green-700">
                  <FaEnvelope size={20} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for Team Member Details */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black opacity-95 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }} 
            className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-lg text-center relative"
          >
            <button 
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setSelectedMember(null)}
            >
              <FaTimes size={20} />
            </button>
            <img src={selectedMember.image} alt={selectedMember.name} className="w-28 h-28 mx-auto rounded-full border-4 border-green-500 shadow-md" />
            <h3 className="mt-4 text-2xl font-semibold text-gray-800">{selectedMember.name}</h3>
            <p className="text-gray-600">{selectedMember.role}</p>
            <p className="mt-4 text-gray-700">{selectedMember.bio}</p>
            <div className="flex justify-center gap-4 mt-4 text-green-500">
              <a href={selectedMember.linkedin} className="hover:text-green-700">
                <FaLinkedin size={24} />
              </a>
              <a href={selectedMember.twitter} className="hover:text-green-700">
                <FaTwitter size={24} />
              </a>
              <a href={selectedMember.email} className="hover:text-green-700">
                <FaEnvelope size={24} />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default MeetTheTeam;
