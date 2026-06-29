import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../feature/userSlice";
import redCar from "../assets/redCar.png";
import yellowCar from "../assets/yellowCar.png";
import orangeCar from "../assets/orangeCar.png";
import greenCar from "../assets/greenCar.png";
import { addFavoriteService, removeFavoriteService } from "../services/user.service";

const ParkingLotCard = ({
  floorId,
  slotDetails,  
  onSelectSlot,
  onAddFavorite,
  locationId,
  startDate,
  floorName,
}) => {

   const dispatch = useDispatch();
  const { selectedSlot } = useSelector((state) => state.parking);
  const { currentUser } = useSelector((state) => state.user);
  const [isFav, setIsFav] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleSelectSlot = (slotDetails) => {
    onSelectSlot({ slot: slotDetails, floorid: floorId });
  };

 const handleAddFavorite = (data) => {
  const nextFav = !isFav; // compute new state
  setIsFav(nextFav);      // update local UI state

  onAddFavorite({
    isFav: nextFav,
    slotId: data.slotId,
    floorId: data.floorId,
    locationId: data.locationId,
  });
};

  const maskedVehicleNo = slotDetails?.user
    ? `XXX${slotDetails.userVehicleNo.slice(-4)}`
    : null;

  useEffect(() => {
    if (currentUser) {
      const fav = currentUser?.favoriteSlot?.find(
        (x) =>
          x.locationId === locationId &&
          x.floorId === floorId &&
          slotDetails._id === x.slotId
      );
      setIsFav(!!fav);
    }

    const isReserve = slotDetails?.reservedDetail?.find(
      (x) => x.startDate === startDate
    );
    setIsReserved(!!isReserve);

    if (selectedSlot != null) {
      const isSlot =
        slotDetails._id === selectedSlot?.slotId &&
        floorId === selectedSlot?.floorId;
      setIsSelected(isSlot);
    } else {
      setIsSelected(false);
    }
  }, [currentUser, startDate, locationId, floorId, slotDetails, selectedSlot]);

  const carImage =
    slotDetails.occupied
      ? redCar
      : isSelected
      ? yellowCar
      : isReserved || slotDetails.reserved
      ? orangeCar
      : greenCar;

  return (
    <div className="relative inline-block">
      {/* Card */}
      <div
        className="relative w-40 h-28 rounded-lg shadow-md overflow-hidden cursor-pointer group hover:shadow-lg transition"
        onClick={() => handleSelectSlot(slotDetails)}
      >
        {/* Car Image */}
        <img
          src={carImage}
          alt="Car status"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          {floorName && (
            <h3 className="text-[10px] font-medium">{floorName}</h3>
          )}
          <h3 className="text-sm font-semibold">{slotDetails.slotName}</h3>

          {/* Tooltip */}
          {slotDetails.occupied && (
            <div className="absolute -top-6 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              {maskedVehicleNo}
            </div>
          )}
        </div>
      </div>

      {/* Favorite Button OUTSIDE card */}
      {currentUser.role === "user" && (
        <button
          type="button"
          className={`absolute -top-2 -right-2 flex items-center justify-center 
            w-8 h-8 rounded-full shadow-md transition 
            ${isFav ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"}
            hover:bg-red-400 hover:text-white active:scale-95`}
          onClick={() =>
            handleAddFavorite({
              slotId: slotDetails._id,
              floorId: floorId,
              locationId: locationId,
            })
          }
        >
          <FaHeart className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default ParkingLotCard;
