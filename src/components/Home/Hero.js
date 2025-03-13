import React from 'react'

const Hero = () => {

        // Replace javascript:void(0) path with your path
        const navigation = [
            { title: "Customers", path: "javascript:void(0)" },
            { title: "Careers", path: "javascript:void(0)" },
        ]
        
          return (
              <div className="bg-transparent">
                  <section className="mt-24 mx-auto max-w-screen-xl pb-12 px-4 items-center lg:flex md:px-8">
                      <div className="space-y-4 flex-1 sm:text-center lg:text-left">
                          <h1 className="text-black font-bold text-4xl xl:text-5xl">
                              One page Template for <br/>
                              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
  Digital agency
</span>


                          </h1>
                          <p className="text-gray-500 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
                              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum
                          </p>
                          <div className="pt-10 items-center justify-center space-y-3 sm:space-x-6 sm:space-y-0 sm:flex lg:justify-start">
                              <a href="javascript:void(0)" className="px-7 py-3 w-full bg-white text-gray-800 text-center rounded-md shadow-md block sm:w-auto">
                                  Get started
                              </a>
                              <a href="javascript:void(0)" className="px-7 py-3 w-full bg-gradient-to-r from-green-400 to-green-600 text-gray-200 text-center rounded-md block sm:w-auto">
                                  Try it out
                              </a>
                          </div>
                      </div>
                      <div className="flex-1 text-center mt-7 lg:mt-0 lg:ml-3">
                          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj74zjIUpjjrhUpBiE4xZqpXJ9MADpiYV3V-Ck-eJplUspe669W5CVFndCouTONRRMzGymCPFb5Y_xstQR4Oqr8QVK7t8DUfuMA8yyt92_mbkbiG2KgOsFsSm9-WklpbHc8-4-Dapv8WLg/s0/Flag_of_Ghana.gif" className="w-full mx-auto sm:w-10/12  lg:w-full" />
                      </div>
                  </section>
              </div>
          )
      }

export default Hero