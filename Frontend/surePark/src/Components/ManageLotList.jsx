import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ParkingLotCard from "../Components/ParkingLotCard";
import { removeReservation, setParkings, setSelectedParking } from '../feature/parkingSlice';
import {
  addSlotsService,
  toggleAvailabilityService,
  fetchParkingsService,
} from "../services/parking.service";
import MapComponent from "./MapComponent"; // ✅ Import MapComponent

const ManageLotList = () => {
  const dispatch = useDispatch();
  const { selectedParking } = useSelector((state) => state.parking);
  const { currentUser, token } = useSelector((state) => state.user);

  const [activeFloor, setActiveFloor] = useState(0);

  if (!selectedParking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-base">No parking data available</p>
      </div>
    );
  }

  const floors = selectedParking.floors;

  const handleAdminSelectSlot = (data) => {
    if (data.slot.occupied || data.slot.reserved) {
      dispatch(removeReservation({ floorId: data.floorid, slotId: data.slot.id }));
    }
  };

  const handleAddSlots = async (floorId) => {
    try {
      const data = await addSlotsService(token, selectedParking._id, floorId);
      dispatch(setSelectedParking({ selectParking: data }));

      const updatedParkings = await fetchParkingsService(token);
      dispatch(setParkings({ parking: updatedParkings }));
    } catch (error) {
      console.error("Error adding slots:", error.message);
    }
  };

  const handleToggleAvailability = async (floorId) => {
    try {
      const data = await toggleAvailabilityService(token, selectedParking._id, floorId);
      dispatch(setSelectedParking({ selectParking: data }));

      const updatedParkings = await fetchParkingsService(token);
      dispatch(setParkings({ parking: updatedParkings }));
    } catch (error) {
      console.error("Error updating availability:", error.message);
    }
  };

  const activeFloorObj = floors[activeFloor];

  return (
    <div className="w-full bg-gradient-to-r from-orange-50 via-pink-50 to-teal-50 rounded-xl mx-auto px-6 py-6 mt-6 mb-6 shadow-md">
      {/* Heading */}
      <h1 className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-6">
        {selectedParking.location} Parking Slots
      </h1>

      {/* Floor Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {floors.map((floor, index) => (
          <button
            key={floor._id}
            onClick={() => setActiveFloor(index)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition 
              ${activeFloor === index
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {floor.name}
          </button>
        ))}
      </div>

      {/* Admin Controls */}
      {currentUser?.role === "admin" && (
        <div className="flex gap-3 justify-center mb-5">
          <button
            onClick={() => handleAddSlots(activeFloorObj._id)}
            disabled={!activeFloorObj.available}
            className={`px-3 py-1.5 rounded-md text-sm shadow text-white transition
              ${activeFloorObj.available
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"}`}
          >
            + Add Slots
          </button>
          <button
            onClick={() => handleToggleAvailability(activeFloorObj._id)}
            className={`px-3 py-1.5 rounded-md text-sm shadow text-white transition
              ${activeFloorObj.available
                ? "bg-red-500 hover:bg-red-600"
                : "bg-orange-500 hover:bg-orange-600"}`}
          >
            {activeFloorObj.available ? "Disable Floor" : "Set Available"}
          </button>
        </div>
      )}

      {/* Content Layout: Slots + Map side by side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Slot Grid */}
        <div className="flex-1">
          {activeFloorObj.available ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-5xl mx-auto">
              {activeFloorObj.slots.map((slot) => (
                <ParkingLotCard
                  key={slot._id}
                  floorId={activeFloorObj._id}
                  slotDetails={slot}
                  currentUser={currentUser}
                  userVehicleNo={slot.userVehicleNo}
                  onSelectSlot={handleAdminSelectSlot}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4 text-sm">
              Floor is disabled. Enable it to view slots.
            </p>
          )}
        </div>

        {/* Map Section */}
        {selectedParking?.coordinates && (
          <div className="flex-1 flex">
            <MapComponent coordinates={selectedParking.coordinates} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLotList;
