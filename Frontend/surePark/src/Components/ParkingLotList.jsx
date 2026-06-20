import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import ParkingLotCard from "../Components/ParkingLotCard"; // reuse your card component
import { useState } from 'react';
import { removeReservation, setSelectedSlot } from '../feature/parkingSlice';
import { handleFav } from '../feature/userSlice';
import { Map } from 'leaflet';
import MapComponent from './MapComponent';

const ParkingLotList = () => {

  const dispatch = useDispatch();

  const { parkings, selectedLocation, selectedParking, selectedStartDate } = useSelector((state) => state.parking);
  const { currentUser } = useSelector((state) => state.user)

  // Track which tab is active: floors or favorites
  const [activeTab, setActiveTab] = useState("floor"); // "floor" or "favorites"

  // Track which floor tab is active
  const [activeFloor, setActiveFloor] = useState(0);


  if (!selectedParking || !selectedParking.floors) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">No parking data available</p>
      </div>
    );
  }


  const handelSelectSlot = (data) => {

    console.log(selectedParking);
    if (!data.slot.occupied) {
      dispatch(setSelectedSlot({ floorId: data.floorid, slotId: data.slot.id }))
    }
  }

  const handleAddFavorite = (data) => {
    console.log(selectedParking);
    dispatch(handleFav({ slotId: data.slotId, floorId: data.floorId, locationId: data.locationId }));
  }



  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full gap-6 p-4">
      
      {/* Slot list section */}
      <div className="flex flex-col w-full lg:w-1/2 items-center">
        <h1 className="text-2xl font-bold mb-6">{selectedParking.location} Slots</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          {selectedParking.floors.map((floor, index) => (
            <button
              key={floor.floorId}
              onClick={() => {
                setActiveTab("floor");
                setActiveFloor(index);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition 
                ${activeTab === "floor" && activeFloor === index 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700"}`}
            >
              {floor.name}
            </button>
          ))}
          {currentUser.role === "user" && (
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-4 py-2 rounded-lg font-semibold transition 
                ${activeTab === "favorites" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-200 text-gray-700"}`}
            >
              Favorites
            </button>
          )}
        </div>

        {/* Slot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {activeTab === "floor" &&
            selectedParking.floors[activeFloor].slots.map((slot) => (
              <ParkingLotCard
                key={slot.id}
                floorId={selectedParking.floors[activeFloor].floorId}
                slotDetails={slot}
                currentUser={currentUser}
                userVehicleNo={slot.userVehicleNo}
                onSelectSlot={handelSelectSlot}
                locationId={selectedParking.locationId}
                onAddFavorite={handleAddFavorite}
                startDate={selectedStartDate}
              />
            ))}

          {activeTab === "favorites" &&
            currentUser.favoriteSlot.map((fav, index) => {
              if (fav.locationId !== selectedParking.locationId) return null;
              const floor = selectedParking.floors.find((f) => f.floorId === fav.floorId);
              if (!floor) return null;
              const slot = floor.slots.find((s) => s.id === fav.slotId);
              if (!slot) return null;

              return (
                <ParkingLotCard
                  key={`${fav.location}-${fav.floorId}-${fav.slotId}-${index}`}
                  floorId={floor.floorId}
                  slotDetails={slot}
                  currentUser={currentUser}
                  userVehicleNo={slot.userVehicleNo}
                  onSelectSlot={handelSelectSlot}
                  locationId={selectedParking.locationId}
                  onAddFavorite={handleAddFavorite}
                  startDate={selectedStartDate}
                  floorName={floor.name}
                />
              );
            })}
        </div>
      </div>

      {/* Map section */}
      {selectedParking?.coordinates && (
        <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-auto">
          <MapComponent coordinates={selectedParking.coordinates} />
        </div>
      )}
    </div>
  );

}

export default ParkingLotList