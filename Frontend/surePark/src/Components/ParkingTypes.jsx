import React from 'react'
import '../style.css'
import { MapPin, HandCoins, ShieldCheck, LaptopMinimalCheck, ShieldCog } from "lucide-react";

import bollrads from '../assets/bollrads.jpg'
import parking from '../assets/parking.jpg'
import parking_1 from '../assets/parking_1.jpg'

const ParkingTypes = () => {
    return (
        <>
        {/* Parking Type */}
            <section className='min-h-screen bg-gray-700 text-white'>

                <div className="container mx-auto px-6 items-center">
                    {/* Heading */}
                    <div className="text-center max-w-3xl mx-auto p-8">
                        <h2 className="text-3xl md:text-5xl font-bold">
                            Types of Parking Available
                        </h2>
                    </div>
                    <div className='p-9'>
                        <div className='flex flex-col lg:flex-row p-8 gap-8 '>
                            <p className='text-3xl md:text-4xl text-orange-400 text-nowrap fade-in-text'>Short-Term Parking</p>
                            <p className='text-xl md:text-2xl text-orange-400'>
                                Ideal for shopping trips, meetings, and quick city visits. Pay by the hour and enjoy convenient access to nearby attractions.</p>
                        </div>
                        <div className="w-full h-0.5 bg-orange-400 mx-auto rounded"></div>

                    </div>
                    <div className='p-9'>
                        <div className='flex flex-col lg:flex-row p-8 gap-8 '>
                            <p className='text-3xl md:text-4xl text-orange-400 text-nowrap fade-in-text'>Long-Term Parking</p>
                            <p className='text-xl md:text-2xl text-orange-400'>
                                Perfect for extended stays or business travel. Save more with daily and weekly rates.</p>
                        </div>
                        <div className="w-full h-0.5 bg-orange-400 mx-auto rounded"></div>

                    </div>
                    <div className='p-9'>
                        <div className='flex flex-col lg:flex-row p-8 gap-16 '>
                            <p className='text-3xl md:text-4xl text-orange-400 text-nowrap fade-in-text'>Monthly Parking</p>
                            <p className='text-xl md:text-2xl text-orange-400'>
                                A cost-effective solution for commuters and residents who need guaranteed parking spaces every day.</p>
                        </div>
                        <div className="w-full h-0.5 bg-orange-400 mx-auto rounded"></div>

                    </div>
                </div>

            </section>

{/* Why choose us */}
            <section className='min-h-screen bg-gray-100'>
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mt-4 mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r p-2 from-teal-500 via-orange-500 to-pink-500 
                        bg-clip-text text-transparent">
                        Why Choose our Prking?
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                        shadow rounded-lg 
                        w-full max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px]    
                        hover:shadow-xl transition transform hover:scale-105 fade-in-text"
                    >
                        <img
                            src={parking_1}
                            alt="parking pay"
                            className="w-full h-[400px] object-cover object-center
                                               rounded-lg
                                               w-full max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px] "
                        />
                    </div>

                    <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                        shadow rounded-lg 
                        w-full max-w-md min-h-[400px] 
                        overflow-hidden 
                        flex gap-6 flex-col
                        hover:shadow-xl transition transform hover:scale-105 p-6"
                    >
                        <div className='h-18 w-18 bg-orange-500 items-center flex justify-center rounded-2xl mt-3'>
                            <MapPin className="h-14 w-14 text-white" />
                        </div>

                        <p className='text-2xl text-gray-600 ms-4'>Prime location in City centers</p>

                        <div className='h-18 w-18 bg-orange-500 items-center flex justify-center rounded-2xl mt-3'>
                            <HandCoins className="h-14 w-14 text-white" />
                        </div>

                        <p className='text-2xl text-gray-600 ms-4'>
                            Competitive pricing with no hidden fees</p>


                    </div>

                    <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                        shadow rounded-lg 
                        w-full max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px]    
                        hover:shadow-xl transition transform hover:scale-105 fade-in-text"
                    >
                        <img
                            src={parking}
                            alt="parking pay"
                            className="w-full h-[400px] object-cover object-center
                                               rounded-lg
                                               w-full max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px] "
                        />
                    </div>

                      <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                        shadow rounded-lg 
                        w-full max-w-md min-h-[400px] 
                        overflow-hidden 
                        flex gap-6 flex-col
                        hover:shadow-xl transition transform hover:scale-105 p-6"
                    >
                        <div className='h-18 w-18 bg-orange-500 items-center flex justify-center rounded-2xl mt-3'>
                            <ShieldCheck className="h-14 w-14 text-white" />
                        </div>

                        <p className='text-2xl text-gray-600 ms-4'>
                            Advanced security systems
                        </p>

                        <div className='h-18 w-18 bg-orange-500 items-center flex justify-center rounded-2xl mt-3'>
                            <LaptopMinimalCheck className="h-14 w-14 text-white" />
                        </div>

                        <p className='text-2xl text-gray-600 ms-4'>
                            Easy online booking</p>


                    </div>


                    <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                        shadow rounded-lg 
                        w-full max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px]    
                        hover:shadow-xl transition transform hover:scale-105 fade-in-text"
                    >
                        <img
                            src={bollrads}
                            alt="parking pay"
                            className="w-full h-[400px] object-cover object-center
                                               rounded-lg
                                               w-full max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px] "
                        />
                    </div>

                      <div
                        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                        shadow rounded-lg 
                        w-full max-w-md min-h-[400px] 
                        overflow-hidden 
                        flex gap-6 flex-col
                        hover:shadow-xl transition transform hover:scale-105 p-6"
                    >
                        <div className='h-18 w-18 bg-orange-500 items-center flex justify-center rounded-2xl mt-3'>
                            <ShieldCog className="h-14 w-14 text-white" />
                        </div>

                        <p className='text-2xl text-gray-600 ms-4'>
                            Flexible cancellation policies
                        </p>

                        

                        <p className='text-2xl text-gray-600 ms-4 mt-15'>
                            We prioritize safety and convenience, ensuring that your vehicle is protected at all times.
                            </p>


                    </div>

                </div>

            </section>
        </>
    )
}

export default ParkingTypes