import React from 'react'

const HowItWorksHero = () => {
  return (
    <div>
        <section
  className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center" 
  style={{ backgroundImage: "url('https://thumbs.dreamstime.com/b/group-young-diverse-smiling-business-people-men-women-talking-office-meeting-company-employees-working-339550703.jpg')" }} // Replace with an actual high-quality background
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-60"></div>

  {/* Content */}
  <div className="relative z-10 text-center max-w-3xl px-6">
    <div className="bg-white opacity-85 backdrop-blur-md shadow-lg p-8 rounded-lg border border-white/20">
      <h1 className="text-2xl md:text-5xl font-bold text-black">
        How <span className="text-green-400">ApplyGhana</span> Works
      </h1>
      <p className="mt-4 text-sm md:text-lg text-gray-600">
        A seamless process designed to make applications stress-free and efficient.  
        Follow our simple steps and get your documents or admissions processed with ease.
      </p>
      {/* Call to Action */}
      <div className="mt-6">
        <a
          href="/apply"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Get Started Now
        </a>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default HowItWorksHero