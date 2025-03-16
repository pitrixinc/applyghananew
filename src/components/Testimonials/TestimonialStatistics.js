import { useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaUserGraduate, FaStar, FaClock } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";

const TestimonialStatistics = () => {
  const stats = [
    { id: 1, icon: <FaUserGraduate />, value: 1000, label: "Successful Applications", suffix: "+" },
    { id: 2, icon: <FaStar />, value: 95, label: "Client Satisfaction Rate", suffix: "%" },
    { id: 3, icon: <FaClock />, value: 10, label: "Years of Experience", suffix: "+" },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));
  const sectionRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          controls.start({ opacity: 1, y: 0 });
          stats.forEach((stat, index) => {
            let start = 0;
            const end = stat.value;
            const duration = 2000;
            const increment = (end / duration) * 10;

            const updateCount = () => {
              start += increment;
              if (start >= end) {
                setCounts((prev) => {
                  const newCounts = [...prev];
                  newCounts[index] = end;
                  return newCounts;
                });
              } else {
                setCounts((prev) => {
                  const newCounts = [...prev];
                  newCounts[index] = Math.floor(start);
                  return newCounts;
                });
                setTimeout(updateCount, 10);
              }
            };

            updateCount();
          });
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [controls]);

  return (
    <section ref={sectionRef} className="py-16 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our <span className="text-green-400">Impact</span> in Numbers
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              See how ApplyGhana has helped individuals and businesses achieve their goals.
            </p>
          </div>
    
          {/* Stats Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            transition={{ duration: 0.6 }}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="bg-white shadow-md rounded-xl p-8 flex flex-col items-center transition-all hover:shadow-xl"
              >
                <div className="text-green-500 text-5xl">{stat.icon}</div>
                <h3 className="text-4xl font-bold text-gray-900 mt-4">
                  {counts[index]}
                  {stat.suffix}
                </h3>
                <p className="text-gray-600 text-lg mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
    
          {/* Logos Section */}
          <div className="mt-12">
            <h3 className="text-xl text-gray-700 text-center font-semibold">We've Worked With:</h3>
            <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
              <img
                src="/images/pitrix.png" // Replace with actual logo URLs
                alt="Company 1"
                className="h-12 w-auto object-contain"
              />
              <img
                src="/images/legon.png"
                alt="Company 2"
                className="h-12 w-auto object-contain"
              />
              <img
                src="/images/pitrix.png"
                alt="Company 3"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </section>
  );
};

export default TestimonialStatistics;
