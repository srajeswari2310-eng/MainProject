import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ParkingLotCard from "../Components/ParkingLotCard";
import { setSelectedSlot } from "../feature/parkingSlice";
import { handleFav, updateUser } from "../feature/userSlice";
import MapComponent from "./MapComponent";
import { removeFavoriteService , addFavoriteService} from "../services/user.service";

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
    if (!data.slot.occupied && !data.slot.reserved) {
      dispatch(setSelectedSlot({ floorId: data.floorid, slotId: data.slot._id }));
    }
  };

  const handleAddFavorite = async (data) => {
    try {        
     if (!data.isFav) {
          const res = await removeFavoriteService(token, currentUser._id,data.slotId, data.floorId, data.locationId);
            dispatch(updateUser({ user: res }));
        } else {
          const res = await addFavoriteService(token, currentUser._id, data.slotId, data.floorId, data.locationId);
          console.log(res);
          dispatch(updateUser({ user: res }));
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
        {currentUser?.role === "user" && (
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
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
    // Ensure the favorite belongs to the currently selected parking
    if (fav.locationId.toString() !== selectedParking._id.toString()) return null;

    return (
      <ParkingLotCard
        key={`${fav.locationId}-${fav.slot._id}-${index}`}
        floorId={fav.floor._id}             // ✅ floor id
        slotDetails={fav.slot}              // ✅ slot object with id + slotName
        currentUser={currentUser}
        userVehicleNo={fav.slot.userVehicleNo}
        onSelectSlot={handleSelectSlot}
        locationId={fav.locationId}         // ✅ location id
        onAddFavorite={handleAddFavorite}
        startDate={selectedStartDate}
        floorName={fav.floor.name}          // ✅ floor name
        locationName={fav.location}         // ✅ location name
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
