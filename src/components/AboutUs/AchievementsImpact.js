import { useEffect, useState, useRef } from "react";
import { FaUsers, FaThumbsUp, FaGlobe, FaAward } from "react-icons/fa";
import { motion } from "framer-motion";

const achievements = [
  { id: 1, icon: <FaUsers size={40} />, number: 1000, suffix: "+", text: "Successful Applications" },
  { id: 2, icon: <FaThumbsUp size={40} />, number: 95, suffix: "%", text: "Client Satisfaction" },
  { id: 3, icon: <FaGlobe size={40} />, number: 10, suffix: "+", text: "Years of Experience" },
  { id: 4, icon: <FaAward size={40} />, number: 50, suffix: "+", text: "Awards & Recognitions" },
];

const partners = [
  { id: 1, logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDPn5V3mpI8pEvyXYQZsx9novyt8q7Sn7xQQ&s", name: "University of Ghana" },
  { id: 2, logo: "https://www.mint.gov.gh/wp-content/uploads/2017/05/Ghana_Immigration_Service_logo.jpg", name: "Ghana Immigration" },
  { id: 3, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Coat_of_arms_of_Ghana.svg/800px-Coat_of_arms_of_Ghana.svg.png", name: "Ministry of Education" },
  { id: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/NSS_%28National_Service_Secretariat%29_logo_%E2%88%92_%28Ghana_National_Service_Scheme%29.jpg", name: "National Service Scheme" },
];

const AchievementCounter = ({ number, suffix }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500;
          const incrementTime = 50;
          const steps = Math.ceil(duration / incrementTime);
          const stepValue = number / steps;

          const counter = setInterval(() => {
            start += stepValue;
            setCount(Math.min(Math.round(start), number));
            if (start >= number) clearInterval(counter);
          }, incrementTime);

          return () => clearInterval(counter);
        }

        // Reset when leaving the section
        if (!entry.isIntersecting) {
          setHasAnimated(false);
          setCount(0);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [number, hasAnimated]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-green-500">
      {count}
      {suffix}
    </span>
  );
};

const AchievementsImpact = () => {
  return (
    <section className="py-16 bg-gray-50 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold text-gray-900"
        >
          Our <span className="text-green-500">Achievements</span> & Impact
        </motion.h2>
        <p className="mt-4 text-lg text-gray-600">
          Over the years, ApplyGhana has made a significant impact by simplifying application processes for thousands.
        </p>

        {/* Animated Achievement Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {achievements.map((achieve) => (
            <motion.div
              key={achieve.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
            >
              <div className="text-green-500">{achieve.icon}</div>
              <AchievementCounter number={achieve.number} suffix={achieve.suffix} />
              <p className="text-gray-600 mt-2">{achieve.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Partner Logos */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-800">Organizations We&apos;ve Worked With</h3>
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {partners.map((partner) => (
              <motion.img
                key={partner.id}
                src={partner.logo}
                alt={partner.name}
                className="w-32 h-auto  transition-all"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsImpact;
