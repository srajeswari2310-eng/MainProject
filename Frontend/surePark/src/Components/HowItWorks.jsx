import React from 'react'
import parkinglot from '../assets/parking-lot.jpg'

const HowItWorks = () => {
    return (
        <>
         
            <section id="how" className='min-h-screen bg-white text-black'>

                <div className="container mx-auto px-6 items-center">
                    <div className="text-center w-full mx-auto p-8">
                        <img
                            src={parkinglot}
                            alt="parking pay"
                            className="w-full h-[400px] object-cover object-center rounded-lg "
                        />

                    </div>


                    {/* Heading */}
                    <div className="text-center max-w-3xl mx-auto p-8">
                        <h2 className="text-3xl md:text-5xl font-bold">
                            How it Works?
                        </h2>
                        <p className="mt-5 text-xl text-gray-600">
                            Our system provides instant confirmation and clear instructions for hassle-free access.
                        </p>
                    </div>


                    <div className='p-5' >
                        <div className='p-5 text-center'>
                            <p className='text-2xl md:text-4xl md:text-nowrap fade-in-text'>1. Search available parking dates</p>
                        </div>
                        <div className="w-full h-0.5 bg-black mx-auto rounded"></div>

                    </div>
                    <div className='p-9' >
                        <div className='p-8 text-center'>
                            <p className='text-2xl md:text-4xl md:text-nowrap fade-in-text'>2. Choose your preferred parking option</p>
                        </div>
                        <div className="w-full h-0.5 bg-black mx-auto rounded"></div>

                    </div>
                    <div className='p-9' >
                        <div className='p-8 text-center'>
                            <p className='text-2xl md:text-4xl md:text-nowrap fade-in-text'>3. ​Reserve online or call us directly</p>
                        </div>
                        <div className="w-full h-0.5 bg-black mx-auto rounded"></div>

                    </div>
                    <div className='p-9' >
                        <div className='p-8 text-center'>
                            <p className='text-2xl md:text-4xl md:text-nowrap fade-in-text'>4. Arrive and park stress-free.</p>
                        </div>
                        <div className="w-full h-0.5 bg-black mx-auto rounded"></div>

                    </div>
                </div>

            </section>

        </>
    )
}

export default HowItWorks