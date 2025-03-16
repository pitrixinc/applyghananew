import { FaStar, FaQuoteLeft, FaPlay } from "react-icons/fa";
import { useState } from "react";

const testimonials = [
  {
    name: "Kwame Asante",
    title: "University Student",
    review: "ApplyGhana made my university application process seamless. Highly recommended!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Adjoa Mensah",
    title: "Business Owner",
    review: "The business registration process was smooth and stress-free. Fantastic service!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Kojo Badu",
    title: "Government Worker",
    review: "I got my passport faster than expected. ApplyGhana is the best!",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

const videoTestimonial = {
  thumbnail: "https://media.istockphoto.com/id/655887334/photo/why-choose-us.jpg?s=612x612&w=0&k=20&c=TJLPS91NH3rTJhdcAgB92M984kcJ80S910X-4XnTpNE=", // Replace with actual thumbnail
  videoUrl: "/videos/fivefive.mp4", // Replace with actual video URL
};

const Testimonials = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          What Our <span className="text-green-500">Clients Say</span>
        </h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg rounded-lg p-6 text-center transition-all transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <FaQuoteLeft className="absolute top-4 left-4 text-gray-200 text-4xl" />
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 mx-auto rounded-full border-2 border-green-500 shadow-md"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-700">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
              <p className="text-gray-600 mt-4">{testimonial.review}</p>
              <div className="mt-4 flex justify-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonial */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-[90%] max-w-2xl">
            <img
              src={videoTestimonial.thumbnail}
              alt="Video Testimonial"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setShowVideo(true)}
                className="bg-green-500 text-white p-6 rounded-full text-3xl shadow-lg hover:bg-green-600 transition-all"
              >
                <FaPlay />
              </button>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black opacity-96 z-50">
            <div className="relative w-[90%] max-w-2xl bg-white rounded-lg shadow-lg p-4">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-lg"
              >
                ✖
              </button>
              <iframe
                className="w-full h-64 md:h-96 rounded-lg"
                src={videoTestimonial.videoUrl}
                title="Video Testimonial"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
