import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ParkingLotCard from "../Components/ParkingLotCard";
import { setSelectedSlot } from "../feature/parkingSlice";
import { handleFav } from "../feature/userSlice";
import MapComponent from "./MapComponent";

const ParkingLotList = () => {
  const dispatch = useDispatch();
  const { selectedParking, selectedStartDate } = useSelector((state) => state.parking);
  const { currentUser, token } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("floor");
  const [activeFloor, setActiveFloor] = useState(0);

  if (!selectedParking || !selectedParking.floors) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-base">No parking data available</p>
      </div>
    );
  }

  const handleSelectSlot = (data) => {
    if (!data.slot.occupied) {
      dispatch(setSelectedSlot({ floorId: data.floorid, slotId: data.slot._id }));
    }
  };

  const handleAddFavorite = async (data) => {
    // dispatch(
    //   handleFav({
    //     slotId: data.slotId,
    //     floorId: data.floorId,
    //     locationId: data.locationId,
    //   })
    // );

    try {        
    
        if (!data.isFav) {
          await removeFavoriteService(data.slotId, data.floorId, data.locationId);
          setIsFav(false);
        } else {
          const res = await addFavoriteService(token, currentUser._id, slotId, floorId, locationId);
          dispatch(updateUser({ user: res.data }));
          setIsFav(true);
        }
      } catch (error) {
        console.error("Favorite toggle failed:", error.message);
        alert(error.message);
      }
  };

  const activeFloorObj = selectedParking.floors[activeFloor];

  return (
    <div className="w-full bg-gradient-to-r from-orange-50 via-pink-50 to-teal-50 rounded-xl mx-auto px-6 py-6 mt-6 mb-6 shadow-md">
      {/* Heading */}
      <h1 className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-6">
        {selectedParking.location} Parking Slots
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {selectedParking.floors.map((floor, index) => (
          <button
            key={floor._id}
            onClick={() => {
              setActiveTab("floor");
              setActiveFloor(index);
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition 
              ${activeTab === "floor" && activeFloor === index
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {floor.name}
          </button>
        ))}
        {currentUser.role === "user" && (
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition 
              ${activeTab === "favorites"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Favorites
          </button>
        )}
      </div>

      {/* Content Layout: Slots + Map side by side */}
      <div className="flex flex-col lg:flex-row gap-8">
  {/* Slot Grid */}
    <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {activeTab === "floor" &&
              activeFloorObj.slots.map((slot) => (
                <ParkingLotCard
                  key={slot._id}
                  floorId={activeFloorObj._id}
                  slotDetails={slot}
                  currentUser={currentUser}
                  userVehicleNo={slot.userVehicleNo}
                  onSelectSlot={handleSelectSlot}
                  locationId={selectedParking._id}
                  onAddFavorite={handleAddFavorite}
                  startDate={selectedStartDate}
                />
              ))}

            {activeTab === "favorites" &&
              currentUser.favoriteSlot.map((fav, index) => {
                if (fav.locationId !== selectedParking._id) return null;
                const floor = selectedParking.floors.find((f) => f._id === fav.floorId);
                if (!floor) return null;
                const slot = floor.slots.find((s) => s._id === fav.slotId);
                if (!slot) return null;

                return (
                  <ParkingLotCard
                    key={`${fav.locationId}-${fav.slotId}-${index}`}
                    floorId={floor._id}
                    slotDetails={slot}
                    currentUser={currentUser}
                    userVehicleNo={slot.userVehicleNo}
                    onSelectSlot={handleSelectSlot}
                    locationId={selectedParking._id}
                    onAddFavorite={handleAddFavorite}
                    startDate={selectedStartDate}
                    floorName={floor.name}
                  />
                );
              })}
          </div>
        </div>

        {/* Map Section */}
        {selectedParking?.coordinates && (
          //<div className="flex-1 h-72 lg:h-[500px] rounded-lg overflow-hidden shadow-md">
           <div className="flex-1 flex">
            <MapComponent coordinates={selectedParking.coordinates} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLotList;
