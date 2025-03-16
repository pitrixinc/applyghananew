import React from 'react'

const Testimonials = () => {
  return (
    <div>
        <section 
            className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center" 
            style={{ backgroundImage: "url('https://yourimageurl.com/testimonials-bg.jpg')" }} // Replace with a suitable image
            >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl px-6">
                <div className="bg-white opacity-80 backdrop-blur-md shadow-lg p-8 rounded-lg border border-white/20">
                <h1 className="text-2xl md:text-5xl font-bold text-black">
                    What Our <span className="text-green-400">Clients Say</span>
                </h1>
                <p className="mt-4 text-sm md:text-lg text-gray-500">
                    See how ApplyGhana has helped individuals and businesses achieve their goals.
                </p>
                </div>
            </div>
            </section>

    </div>
  )
}

export default Testimonials