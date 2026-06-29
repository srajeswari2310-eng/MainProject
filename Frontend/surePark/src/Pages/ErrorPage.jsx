import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../feature/userSlice';

const ErrorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/"); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-pink-100 to-teal-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-lg w-full">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-red-600 mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The file you’re looking for doesn’t exist. Please go back to Home.
        </p>

        {/* Action Button */}
        <button
          onClick={handleLogin}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
