import { FaQuoteLeft, FaStar, FaPlay, FaPause } from "react-icons/fa";
import { useState, useRef } from "react";

const FeaturedTestimonial = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

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

  return (
     <section className="py-16 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto text-center">
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured <span className="text-green-400">Testimonial</span>
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              A success story from one of our valued clients.
            </p>
          </div>
    
          {/* Testimonial Content */}
          <div className="mt-12 bg-white shadow-lg rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative">
            {/* Quote Icon */}
            <FaQuoteLeft className="absolute top-4 left-4 text-green-400 text-4xl opacity-30" />
    
            {/* Client Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-green-400 shadow-md">
              <img
                src="https://www.mynewsgh.com/wp-content/uploads/2020/05/kofi-buah.jpeg" // Replace with actual image URL
                alt="Client"
                className="w-full h-full object-cover"
              />
            </div>
    
            {/* Quote & Client Details */}
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl text-gray-700 font-medium italic">
              &lsquo;ApplyGhana made my university application process so easy and stress-free. Their team guided me through every step, ensuring I had all the necessary documents. I couldn&apos;t have done it without them!&lsquo;
              </p>
    
              {/* Client Info */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                <p className="text-sm text-gray-500">Business Owner & Student</p>
              </div>
    
              {/* Rating */}
              <div className="mt-4 flex justify-center md:justify-start gap-1 text-yellow-400">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
          </div>
    
          {/* Video Testimonial */}
          <div className="mt-10 flex justify-center">
            <div className="relative w-[90%] max-w-2xl rounded-lg overflow-hidden shadow-lg">
              <video ref={videoRef} className="w-full h-auto rounded-lg">
                <source src="/videos/fivefive.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
    
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all text-white text-4xl p-4 rounded-full"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>
          </div>
        </section>
  );
};

export default FeaturedTestimonial;
