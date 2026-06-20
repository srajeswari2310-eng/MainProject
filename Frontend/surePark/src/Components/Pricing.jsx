import React from 'react'

const Pricing = () => {
  return (
    <section id="pricing" className="py-12 bg-white">
  <div className="container mx-auto px-6">
    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r p-2 from-teal-500 via-orange-500 to-pink-500 
        bg-clip-text text-transparent">
        Parking Pricing Plans
      </h2>
      <p className="mt-5 text-2xl text-gray-600">
        Flexible options for short-term and long-term parking needs.
      </p>
    </div>

    {/* Content Grid */}
    <div className="flex flex-col lg:flex-row items-center gap-10">

      {/* Hourly Plan */}
      <div
        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
        shadow rounded-lg 
        w-full max-w-md min-h-[350px] 
        overflow-hidden 
        flex gap-6 flex-col
        hover:shadow-xl transition transform hover:scale-105 p-6"
      >
        <h2 className='text-3xl font-semibold'>Short Term</h2>
        <p className='text-2xl text-gray-600 ms-4 fade-in-text'>₹50 per hour</p>
        <p className='text-xl text-gray-600 ms-4 fade-in-text'>Grace period: 15 mins</p>
        <p className='text-xl text-gray-600 ms-4 fade-in-text'>Convenient access to mall and nearby attractions</p>
        <p className='text-xl text-gray-600 ms-4 fade-in-text'>Best for short visits under 6 hours</p>
      </div>

      {/* Long Term*/}
      <div
        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
        shadow rounded-lg 
        w-full max-w-md min-h-[350px] 
        overflow-hidden 
        flex gap-6 flex-col
        hover:shadow-xl transition transform hover:scale-105 p-6"
      >
        <h2 className='text-3xl font-semibold'>Long Term</h2>
        <p className='text-2xl text-gray-600 ms-4 fade-in-text'>₹400 per day</p>
        <p className='text-2xl text-gray-600 ms-4 fade-in-text'>₹2500 per week</p>
        <ul className='text-xl text-gray-600 ms-4 fade-in-text list-disc list-inside'>
          <li>Discounted daily and weekly packages</li>
          <li>Ideal for business travelers or extended city stays</li>
        </ul>
      </div>

      {/* Monthly Plan */}
      <div
        className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
        shadow rounded-lg 
        w-full max-w-md min-h-[350px] 
        overflow-hidden 
        flex gap-6 flex-col
        hover:shadow-xl transition transform hover:scale-105 p-6"
      >
        <h2 className='text-3xl font-semibold'>Monthly</h2>
        <p className='text-2xl text-gray-600 ms-4 fade-in-text'>₹5000 per month</p>
        <ul className='text-xl text-gray-600 ms-4 fade-in-text list-disc list-inside'>
          <li className='mb-2'>Guaranteed reserved slot</li>
          <li className='mb-2'>24/7 access</li>
          <li className='mb-2'>Free vehicle wash once a month</li>
        </ul>
      </div>

    </div>
  </div>
</section>

  )
}

export default Pricing