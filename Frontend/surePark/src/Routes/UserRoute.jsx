import React from "react";
import { useSelector } from "react-redux";

function UserRoute({ children }) {
  const { role } = useSelector((state) => state.user);

  if (role === "user" || role === "admin") {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-pink-100 to-teal-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">
        <h2 className="text-xl md:text-2xl font-semibold text-red-600 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          This section is restricted to registered users only.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default UserRoute;
