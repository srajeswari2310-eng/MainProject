import React from 'react'
import hero_vid from '../assets/hero_vedio.mp4'
import { useDispatch, useSelector } from 'react-redux';

const Hero = () => {
  // Get user info from Redux store
  const { currentUser } =  useSelector((state) => state.user);
  return (
   
     <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        src={hero_vid}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay (optional dark layer for readability) */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl" >
        <h1 className="text-3xl md:text-7xl font-extrabold text-white drop-shadow-lg">
          Find the Best Parking Slot
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-200 animate-slideUp">
          Reserve secure and affordable parking spaces.
        </p>
        <p className="mt-4 text-lg md:text-xl text-gray-200 animate-slideUp">
          Easy booking, instant confirmation and 24/7 access
        </p>

        { currentUser.role =="user" && (

        <div className="mt-8 flex justify-center gap-4">
          <a
            className="bg-orange-500 text-white px-20 py-3 rounded-4xl font-semibold shadow hover:scale-105 transform transition"
            href="home/parking"
          >
            Get Started
          </a>
         
        </div>
        )
}
      </div>
    </section>
  )
}

export default Hero