import React from 'react'
import { useRouter } from 'next/router';

const CTA = () => {
  const router = useRouter()

  return (
    <section>
  <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="bg-green-500 p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
          Fuel Dreams: Empower Tomorrow with Your Contribution Today
          </h2>

          <p className="hidden text-white/90 sm:mt-4 sm:block">
          Join us in transforming ideas into reality. Support innovative projects and make a difference. 
          Every contribution brings us closer to a brighter future. Empower change, one pledge at a time.
          </p>

          <div className="mt-4 md:mt-8">
            <div
              onClick={() => router.push(`/projects`)}
              className="cursor-pointer inline-block rounded border border-white bg-white px-12 py-3 text-sm font-medium text-green-500 transition hover:bg-transparent hover:text-white focus:outline-none focus:ring focus:ring-yellow-400"
            >
              Get Started Today
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80"
          className="h-40 w-full object-cover sm:h-56 md:h-full"
        />

        <img
          alt=""
          src="https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
          className="h-40 w-full object-cover sm:h-56 md:h-full"
        />
      </div>
    </div>
  </div>
</section>
  )
}

export default CTA