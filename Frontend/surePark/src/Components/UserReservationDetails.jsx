import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import reservePark from '../assets/reservePark.jpg'
import { useNavigate } from "react-router-dom";
import { setSelectedLocation, setParkings, setSelectedParking } from '../feature/parkingSlice';
import { fetchParkingsService } from "../services/parking.service";
import { removeReservationService } from '../services/reservation.service'
import { updateUser } from '../feature/userSlice';
import { toast } from "react-toastify";

export default function UserReservationDetails({ user, reservation, handleCancel }) {

  const { currentUser, error, token } = useSelector((state) => state.user);
  const { parkings } = useSelector((state) => state.parking);
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const fetchParkings = async () => {
      try {
        const data = await fetchParkingsService(token);

        if (Array.isArray(data)) {
          dispatch(setParkings({ parking: data }));

        }
      } catch (error) {
        console.error("Error fetching parkings:", error.message);
      }
    };

  useEffect(() => {
   
    fetchParkings();
  }, []);

  useEffect(() => {
   
    
  }, [currentUser]);


  const handleDirection = (index) => {
    console.log(index);
    navigate("/direction", { state: { locationId: index } })
  }

  const handleRemove = async (reservationId) => {

    toast.info(
      <div>
        <p>Are you sure you want to cancel booking?</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={async () =>  {
              try {
                console.log(currentUser._id, reservationId)
                const res = await removeReservationService(token, currentUser._id, reservationId);
                console.log("Reservation removed:", res);

                // Update Redux user state after removal
                dispatch(updateUser({ user: res.user }));
              } catch (error) {
                console.error("Reservation removal failed:", error.message);
                alert(error.message);
              }
              toast.dismiss(); // close toast
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );


  };



  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getLocationName(id) {
    const result = parkings?.find(x => x.locationId == id);
    return result?.location;
  }
  return (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 min-h-[500px] p-8">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Left: Image Card (Smaller) */}
        <div
          className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
          shadow-lg rounded-2xl 
          w-full lg:w-1/3 min-h-[400px] 
          bg-cover bg-center
          hover:shadow-xl transition-transform hover:scale-105 p-2"
          style={{ backgroundImage: `url(${reservePark})` }}
        >
          <div className="bg-black/20 w-full h-full rounded-2xl"></div>
        </div>

        {/* Right: Reservation Details */}
        <div className="flex flex-col items-center w-full lg:w-2/3">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Reservation Details
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Manage your reserved slots with ease
            </p>
          </div>

          {/* Conditional Table */}
          {currentUser?.reservedSlot?.length > 0 ? (
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full">
              {/* Scrollable Table Wrapper with restricted height */}
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg border border-gray-200">
                <table className="min-w-full border-collapse bg-white">
                  <thead className="bg-orange-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-left font-semibold">#</th>
                      {/* <th className="p-3 text-left font-semibold">Location</th> */}
                      <th className="p-3 text-left font-semibold">Vehicle No</th>
                      <th className="p-3 text-left font-semibold">Plan</th>
                      <th className="p-3 text-left font-semibold">Start Date</th>
                      <th className="p-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUser.reservedSlot.map((v, i) => (
                      <tr key={i} className="border-b hover:bg-orange-50 transition">
                        <td className="p-3">{i + 1}</td>
                        {/* <td className="p-3">{getLocationName(v.location)}</td> */}
                        <td className="p-3">{v.userVehicleNo}</td>
                        <td className="p-3 capitalize">{v.plan}</td>
                        <td className="p-3">{formatDate(v.startDate)}</td>
                        <td className="p-3 flex flex-col md:flex-row gap-2">
                          <button
                            type="button"
                            onClick={() => handleDirection(v.locationId)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition w-full md:w-auto"
                          >
                            Get Direction
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(v._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full md:w-auto"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-40 bg-white shadow rounded-2xl">
              <p className="text-gray-500 text-lg">No Reservation Made</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );


}
