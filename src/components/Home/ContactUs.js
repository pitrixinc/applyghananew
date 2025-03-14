import React from 'react'

const ContactUs = () => {
  return (
    <div style={{ background: "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)" }}>
                                                        <section class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="md:flex gap-x-24 clear-left md:mb-16 mb-10">
            <div class=" md:mb-0 mb-4">
                <h2 class="text-black font-manrope text-4xl font-semibold leading-10 mb-5 md:text-left text-center">Get In Touch</h2>
                <p class="text-gray-600 text-lg font-normal leading-7 mb-7 md:text-left text-center">Whether you have a concern or simply want to say hello, We are here to facilitate communication with you.</p>
                <div class="flex md:items-center md:justify-start justify-center">
                    <button class="w-36 h-12 rounded-full bg-indigo-600 transition-all duration-700 hover:bg-indigo-800 shadow text-white text-center text-base font-semibold leading-6">Contact Us</button>
                </div>
            </div>
            <div class="border-l-2 md:border-indigo-600 border-white px-10 py-6">
                <div class="mb-8">
                    <h6 class="text-gray-500 text-sm font-medium leading-5 pb-3 md:text-start text-center">Email Address</h6>
                    <h3 class="text-black text-xl font-semibold leading-8 md:text-start text-center">pagedone@gmail.com</h3>
                </div>
                <div>
                    <h6 class="text-gray-500 text-sm font-medium leading-5 pb-3 md:text-start text-center">Phone Number</h6>
                    <h3 class="text-black text-xl font-semibold leading-8 md:text-start text-center">470-601-1911</h3>
                </div>
            </div>
        </div>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
            <div class="h-96 relative flex justify-center">
                <div class="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50"></div>
                <img src="https://pagedone.io/asset/uploads/1696246502.png" alt="United Kingdom image" class="w-full h-full object-cover"/>
                <div class="absolute bottom-0 mb-6 text-center px-6">
                    <h5 class="text-white text-lg font-semibold leading-7 mb-2">United Kingdom</h5>
                    <p class="text-white text-base font-medium leading-6">123 High Street, Westminster, London</p>
                </div>
            </div>
            <div class="h-96 relative flex justify-center">
                <div class="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50"></div>
                <img src="https://pagedone.io/asset/uploads/1696246522.png" alt="Germany image" class="w-full h-full  object-cover"/>
                <div class="absolute bottom-0 mb-6 text-center px-6">
                    <h5 class="text-white text-lg font-semibold leading-7 mb-2">Germany</h5>
                    <p class="text-white text-base font-medium leading-6">101 Unter den Linden, Mitte <br/>District, Berlin</p>
                </div>
            </div>
            <div class="h-96 relative flex justify-center">
                <div class="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50"></div>
                <img src="https://pagedone.io/asset/uploads/1696246551.png" alt="France image" class="w-full h-full  object-cover"/>
                <div class="absolute bottom-0 mb-6 text-center px-6">
                    <h5 class="text-white text-lg font-semibold leading-7 mb-2">France</h5>
                    <p class="text-white text-base font-medium leading-6">456 Rue de la Paix, 8th Arrondissement, Paris</p>
                </div>
            </div>
            <div class="h-96 relative flex justify-center">
                <div class="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50"></div>
                <img src="https://pagedone.io/asset/uploads/1696246565.png" alt="Switzerland image" class="w-full h-full  object-cover"/>
                <div class="absolute bottom-0 mb-6 text-center px-6">
                    <h5 class="text-white text-lg font-semibold leading-7 mb-2">Switzerland</h5>
                    <p class="text-white text-base font-medium leading-6">987 Bahnhofstrasse, Zurich <br/> City Center, Zurich</p>
                </div>
            </div>
        </div>
      </div>
    </section>
                                            
    </div>
  )
}

export default ContactUs