import React from 'react'
import { useSelector } from 'react-redux'
import { reserveSlot, removeReservation } from "../feature/parkingSlice";
import { useState } from 'react';
import { useEffect } from 'react';
import { FaCarSide } from "react-icons/fa";

const ParkingLotHeader = () => {

  const [counts, setCount] = useState(null);

  const { parkings } = useSelector((state) => state.parking);

 useEffect(() => {
  if (parkings && parkings.length > 0) {
    let total = 0, occupied = 0, floors = 0;

    const floorDetails = parkings[0].floors.map(floor => {
      floors++;
      let floorTotal = floor.slots.length;
      let floorOccupied = floor.slots.filter(slot => slot.occupied).length;

      total += floorTotal;
      occupied += floorOccupied;

      return {
        floorId: floor.floorId,
        name: floor.name,
        total: floorTotal,
        occupied: floorOccupied,
        available: floorTotal - floorOccupied,
      };
    });


const result = {
      total,
      occupied,
      available: total - occupied,
      floors,
      floorDetails, // array of per-floor summaries
    }
    console.log(result);

    setCount({
      total,
      occupied,
      available: total - occupied,
      floors,
      floorDetails, // array of per-floor summaries
    });
  }
}, [parkings]);



  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full md:w-[80%] bg-orange-100 rounded-2xl p-4">
      {/* Card 1 */}
      <div className="h-full min-w-40 bg-white text-center flex flex-col justify-center rounded-lg shadow">
        <h3>Total Available</h3>
        <p className="text-2xl text-green-500">{counts?.available}</p>
        <p>of {counts?.total}</p>
      </div>

      {
        counts?.floorDetails.map((f,index)=>(       
        <div key={index}
         className="h-full min-w-40 bg-white text-center flex flex-col justify-center rounded-lg shadow">
        <h3>{f.name}</h3>
        <p className="text-2xl text-green-500">{f?.available}</p>
        <p>of {f?.total}</p>
      </div>

         ) )
      }

      
    </div>
  )
}

export default ParkingLotHeader