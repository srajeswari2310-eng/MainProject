import React from 'react'
import parkingPay from '../assets/parking-pay.jpg'
import '../style.css'

const About = () => {
    return (
        <section id="about" className="py-12 bg-white">
            <div className="container mx-auto px-6">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r p-2 from-teal-500 via-orange-500 to-pink-500 
                        bg-clip-text text-transparent">
                        About Parking Services
                    </h2>
                    <p className="mt-5 text-2xl text-gray-600">
                        Parking should be simple, convenient, and stress-free.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="flex flex-col lg:flex-row items-center gap-10">

                    <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                        shadow rounded-lg 
                        w-full max-w-md min-h-[400px] 
                        overflow-hidden 
                        flex gap-6 flex-col
                        hover:shadow-xl transition transform hover:scale-105 p-6"
                    >
                        <h2 className='text-3xl'>We Offer:</h2>
                        <div className='flex flex-col gap-6'>
                            <p className='text-2xl text-gray-600 ms-4 fade-in-text'>-- Secure monitore parking facilities</p>
                            <p className='text-2xl text-gray-600 ms-4 fade-in-text'>-- Covered and uncovered parking options</p>
                            <p className='text-2xl text-gray-600 ms-4 fade-in-text'>-- Hourly, daily and monthly parking plas</p>
                        </div>
                    </div>
                    <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                        shadow rounded-lg 
                        w-full max-w-md min-h-[400px] 
                        overflow-hidden 
                        flex gap-6 flex-col
                        items-start
                        hover:shadow-xl transition transform hover:scale-105 p-6"
                    >
                        <div className='flex flex-col gap-6'>
                            <p className='text-2xl text-gray-600 ms-4 fade-in-text'>-- Easy online reservation system</p>
                            <p className='text-2xl text-gray-600 ms-4 fade-in-text'>-- 24/7 customer support</p>
                        </div>

                        <div className="mt-8 flex justify-center gap-4">
                            <button
                                className="bg-orange-500 text-white text-xl px-10 py-3 rounded-4xl font-semibold shadow hover:scale-105 transform transition"
                                onClick={() => navigate("/users")}
                            >
                                Booking Parking Now
                            </button>
                        </div>
                        <div>
                            <p className="text-xl text-gray-600 mt-4">Our parking solutions provide drivers with safe, well-located spaces for short-term and long-term needs.</p>
                        </div>


                    </div>
                    <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
    shadow rounded-lg 
    w-full max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px]    
    hover:shadow-xl transition transform hover:scale-105 fade-in-text"
                    >
                        <img
                            src={parkingPay}
                            alt="parking pay"
                            className="w-full h-[400px] object-cover object-center
                                             rounded-lg
                                             w-full max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px] "
                        />

                    </div>
                </div>
            </div>
        </section>
    )
}

export default About