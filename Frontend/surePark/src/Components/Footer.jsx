import React from 'react'
import bollrads from '../assets/bollrads.jpg'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
   const navigate = useNavigate();

   const handelHome= ( e) => {
      e.preventDefault();
       navigate("/home");
   }

   const handelContact= ( e) => {
      e.preventDefault();
       navigate("/contact");
   }

  return (  

    <>
      <footer className="bg-gradient-to-r from-orange-200 via-orange-400 to-amber-500 py-6 mt-auto shadow-inner">
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
    
    {/* Logo */}
    <div className="flex items-center gap-2 mb-4 md:mb-0">
      <img src={logo} alt="logo" className="h-10 w-40 object-contain drop-shadow-md" />         
    </div>

    {/* Links */}
    <div className="flex gap-6 text-white font-medium">
      <button 
        onClick={handelHome} 
        className="hover:text-black hover:bg-white/20 px-3 py-1 rounded-lg transition"
      >
        Home
      </button>
      <button 
        onClick={handelContact} 
        className="hover:text-black hover:bg-white/20 px-3 py-1 rounded-lg transition"
      >
        Contact
      </button>
    </div>
  </div>

  {/* Bottom line */}
  <div className="text-center text-sm text-white/80 mt-4">
    © {new Date().getFullYear()} Sure Park. All rights reserved.
  </div>
      </footer>

    </>
    
  )
}

export default Footer