import React from 'react'
import { useOutletContext } from 'react-router-dom';

import Hero from '../Components/Hero';
import About from '../Components/About';
import ParkingTypes from '../Components/ParkingTypes';
import HowItWorks from '../Components/HowItWorks';
import { useState } from 'react';
import { useEffect } from 'react';
import Pricing from '../Components/Pricing';
import UserReservationDetails from '../Components/UserReservationDetails';

const Home = () => {
  

  const { aboutRef } =  useOutletContext(); // get ref from parent
  const { howRef } =  useOutletContext(); 
  const { priceRef } =  useOutletContext(); 
  const { role } = useOutletContext();
  return (
  <>
  <Hero/>
   
   {role == "user" && <UserReservationDetails/>}
  <section ref={aboutRef}>
  <About/>
  </section>
 
  <ParkingTypes/>
  <section ref={howRef}>
  <HowItWorks/>
  </section>
  <section ref={priceRef}>
  <Pricing/>
  </section>
  </>
  )
}

export default Home