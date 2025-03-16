import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaHandshake, FaPhoneAlt, FaQuoteLeft, FaStar, FaPlay, FaPause, FaCheckCircle, FaUserGraduate, FaClock,  FaArrowRight, FaRegLightbulb, FaUserTie  } from "react-icons/fa";


const testimonials = [
    {
      name: "Robert",
      role: "CTO, Robert Consultancy",
      feedback: "ApplyGhana made the entire process so easy for me. Their team is efficient and highly professional.",
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    },
    {
      name: "Jeny Doe",
      role: "CEO, Jeny Consultancy",
      feedback: "A seamless experience from start to finish. I highly recommend ApplyGhana for all document processing needs.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
    },
    {
      name: "Mia Brown",
      role: "Marketing Manager, Stech",
      feedback: "The team was incredibly supportive and guided me through every step. Very trustworthy!",
      image: "https://images.unsplash.com/photo-1499470932971-a90681ce8530?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    },
    {
      name: "David Smith",
      role: "Founder, Smith Corp",
      feedback: "I was impressed with their efficiency. They handled my document processing smoothly and quickly.",
      image: "https://images.unsplash.com/photo-1488508872907-592763824245?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    },
    {
      name: "Linda Williams",
      role: "HR Manager, Global Inc.",
      feedback: "The best customer service experience I have had. Highly recommended!",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
    },
  ];


const stories = [
    {
      id: 1,
      client: "John Mensah",
      title: "From Application Struggles to Success",
      before: "John had trouble securing admission to a top university due to missing documents and deadlines.",
      process: "ApplyGhana streamlined the process, guided him through every step, and ensured all paperwork was in order.",
      after: "John got admitted to his dream university and is now pursuing a degree in Computer Science.",
    },
    {
      id: 2,
      client: "Akosua Agyemang",
      title: "Business Registration Made Easy",
      before: "Akosua struggled with the lengthy and confusing business registration process.",
      process: "With ApplyGhana’s expert guidance, she completed her registration in record time with zero stress.",
      after: "She successfully launched her business and now operates legally in Ghana.",
    },
  ];

  
const Testimonials = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
      const [itemsPerPage, setItemsPerPage] = useState(1);
    
      useEffect(() => {
        // Detect screen size to set number of items per slide
        const handleResize = () => {
          setItemsPerPage(window.innerWidth >= 1024 ? 3 : 1);
        };
    
        handleResize(); // Set initial value
        window.addEventListener("resize", handleResize);
    
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
      const totalSlides = Math.ceil(testimonials.length / itemsPerPage);
    
      const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      };
    
      const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      };
    
      // Auto-slide every 6 seconds
      useEffect(() => {
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
      }, [itemsPerPage]);
    
  
    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

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
    <div>
        

          

    
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

    <section className="py-16 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          <span className="text-green-500">Success Stories</span> from Our Clients
        </h2>
        <p className="text-lg text-gray-600 mt-4">
          Real clients, real transformations. See how ApplyGhana has made a difference.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="mt-12 max-w-4xl mx-auto">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative flex flex-col lg:flex-row items-center gap-8 pb-12"
          >
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-5 top-0 h-full border-l-4 border-green-500"></div>

            {/* Timeline Icon */}
            <div className="bg-green-500 text-white p-4 rounded-full shadow-lg z-10">
              <FaUserTie size={24} />
            </div>

            {/* Story Content */}
            <div className="bg-gray-100 shadow-md rounded-lg p-6 lg:ml-12 flex-1">
              <h3 className="text-xl font-bold text-gray-900">{story.client}</h3>
              <p className="text-green-500 font-semibold">{story.title}</p>

              {/* Before */}
              <div className="flex items-start gap-4 mt-4">
                <FaRegLightbulb className="text-yellow-500 mt-1" size={20} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Before</h4>
                  <p className="text-gray-600">{story.before}</p>
                </div>
              </div>

              {/* Process */}
              <div className="flex items-start gap-4 mt-4">
                <FaArrowRight className="text-blue-500 mt-1" size={20} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Process</h4>
                  <p className="text-gray-600">{story.process}</p>
                </div>
              </div>

              {/* After */}
              <div className="flex items-start gap-4 mt-4">
                <FaCheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">After</h4>
                  <p className="text-gray-600">{story.after}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

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
              href="/contact"
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-lg flex items-center gap-2 transition-all"
            >
              <FaPhoneAlt /> Contact Us
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>

    </div>
  )
}

export default Testimonials