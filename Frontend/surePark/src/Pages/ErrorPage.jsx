import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//import { reset } from '../feature/parkingSlice';
import { current } from '@reduxjs/toolkit';
import { logout } from '../feature/userSlice';

const ErrorPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = (e) =>{
         e.preventDefault();
         // dispatch(reset({currentUser:null}));
             dispatch(logout());
        
            navigate("/"); // navigate programmatically
           
      }
  return (
    <>
               <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
   
                   {/* Heading */}
                   <div className="text-start max-w-3xl mx-auto p-10">
                       <h2 className="text-3xl md:text-5xl font-bold text-red-500">
                          No such file Please go back to Home
                       </h2>

                         <button onClick={handleLogin} className="text-blue-600 hover:underline">
                Back to Login
              </button>
   
                   </div>
   
                
               </div>
           </>
  )
}

export default ErrorPage