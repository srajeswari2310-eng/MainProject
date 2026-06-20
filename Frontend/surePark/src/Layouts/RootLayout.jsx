import React from 'react'
import {Outlet} from 'react-router-dom'
import {  useSelector } from "react-redux";
import { useRef } from 'react';


import NavBar from '../Components/NavBar'
import Footer from '../Components/Footer'
import LoginPage  from '../Pages/LoginPage'


function RootLayout({isUserLogged}){

  const { isLoggedIn } = useSelector((state) => state.user);

   const aboutRef = useRef(null);
     const howRef = useRef(null);
     const priceRef = useRef(null);

     const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHow = () => {
    howRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPrice = () => {
    priceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  //    if (!isLoggedIn) {
  //   // If not logged in, show login-related routes
  //   return <LoginPage />;
  // }

  return !isLoggedIn ? (
   // If not logged in, show whatever child route (LoginPage or ForgotPassword)
    <Outlet />
   )  : (
 <>
    <NavBar onScrollToAbout={scrollToAbout} onScrollToHow={scrollToHow} onScrollToPrice={scrollToPrice}/>
    <Outlet context={{ aboutRef, howRef, priceRef }}/>
    <Footer/>
 </>   
  )
}

export default RootLayout