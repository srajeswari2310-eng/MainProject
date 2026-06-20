import React from "react";
import { useSelector } from "react-redux";
import reservePark from '../assets/reservePark.jpg'
import { useNavigate } from "react-router-dom";

export default function UserReservationDetails({ user, reservation, handleCancel }) {

    const { currentUser, error } = useSelector((state) => state.user);
    const { parkings } = useSelector((state) => state.parking);
    const navigate = useNavigate();
    

    const handleDirection = (index) =>{
      navigate("/home/direction",{ state: { locationId: index }} )
    }

    function getLocationName(id){
        const result = parkings.find(x => x.locationId == id);
        return result.location;
        }
    return (
        <div className="bg-orange-100 p-5 min-h-[500px]">
  <div className="flex flex-col lg:flex-row gap-10">
    
    {/* Left: Image Card */}
    <div
      className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
        shadow rounded-lg 
        w-full lg:w-1/2 min-h-[500px] 
        bg-cover bg-center
        hover:shadow-xl transition transform hover:scale-105 p-6"
      style={{ backgroundImage: `url(${reservePark})` }}
    >
     
    </div>

    {/* Right: Reservation Details */}
    <div className="flex flex-col items-center p-2 w-full lg:w-1/2">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-4">
        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r p-2 from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
          Reservation Details
        </h2>
      </div>

      {/* Conditional Table */}
      {currentUser?.reservedSlot?.length > 0 ? (
        <div className="bg-white shadow-xl rounded-2xl p-4 w-full overflow-x-auto">
          <table className="min-w-full border-collapse shadow-lg bg-white rounded-lg">
            <thead className="bg-orange-200">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Vehicle No</th>
                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUser.reservedSlot.map((v, i) => (
                <tr key={i} className="border-b hover:bg-orange-50">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{getLocationName(v.location)}</td>
                  <td className="p-3">{v.details.userVehicleNo}</td>
                  <td className="p-3">{v.details.plan}</td>
                  <td className="p-3">{v.details.startDate}</td>
                  <td className="p-3 flex flex-col md:flex-row gap-2">
                   
                    <button
                      type="button"
                      onClick={() => handleDirection(v.location)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full md:w-auto"
                    >
                      Get Direction
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-40 bg-white shadow rounded-lg">
          <p className="text-gray-500 text-lg">No Reservation Made</p>
        </div>
      )}
    </div>
  </div>
</div>
    );
}
