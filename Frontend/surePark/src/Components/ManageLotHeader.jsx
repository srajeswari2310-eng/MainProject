import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSelectedLocation, setParkings, setSelectedParking } from '../feature/parkingSlice';
import { fetchParkingsService, addFloorService } from "../services/parking.service";

const ManageLotHeader = () => {
  const [counts, setCounts] = useState(null);
  const dispatch = useDispatch();

  const { parkings = [], selectedLocation, selectedParking } = useSelector((state) => state.parking);
  const { token } = useSelector((state) => state.user) || {};

 

  useEffect(() => {
  const fetchParkings = async () => {
    try {
      const data = await fetchParkingsService(token);

      if (Array.isArray(data)) {
        dispatch(setParkings({ parking: data }));
        if (data.length > 0) {
          dispatch(setSelectedLocation({ id: data[0]._id }));
        }
      }
    } catch (error) {
      console.error("Error fetching parkings:", error.message);
    }
  };
    fetchParkings();
  }, []);

  const handleLocation = (e) => {
    if (e.target.value) {
      dispatch(setSelectedLocation({ id: e.target.value }));
    }
  };

  const handleAddFloor = async () => {
  try {
    if (!selectedLocation) return;

    const data = await addFloorService(token, selectedLocation);
    dispatch(setSelectedParking({ selectParking: data }));

    const updatedParkings = await fetchParkingsService(token);
    dispatch(setParkings({ parking: updatedParkings }));
  } catch (error) {
    console.error("Error adding floor:", error.message);
  }
};

  useEffect(() => {
    if (selectedParking && Array.isArray(selectedParking.floors)) {
      let total = 0, occupied = 0;

      const floorDetails = selectedParking.floors.map((floor) => {
        const floorTotal = Array.isArray(floor.slots) ? floor.slots.length : 0;
        const floorOccupied = Array.isArray(floor.slots)
          ? floor.slots.filter((slot) => slot.occupied).length
          : 0;

        total += floorTotal;
        occupied += floorOccupied;

        return {
          floorId: floor._id || floor.floorId || Math.random(),
          name: floor.name || "Unnamed Floor",
          total: floorTotal,
          occupied: floorOccupied,
          available: floorTotal - floorOccupied,
        };
      });

      setCounts({
        total,
        occupied,
        available: total - occupied,
        floors: selectedParking.floors.length,
        floorDetails,
      });
    } else {
      setCounts(null);
    }
  }, [selectedParking]);

  return (
    <div className="w-full md:w-[85%] bg-gradient-to-r from-orange-50 via-pink-50 to-teal-50 rounded-xl mx-auto px-6 py-6 mt-6 mb-6 shadow-md">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent tracking-wide">
        Manage Parking Details
      </h2>

      {/* Location Selection + Add Floor */}
      <div className="mt-4 flex flex-col md:flex-row items-center gap-3">
        <h3 className="text-sm md:text-base font-medium text-gray-700">Select Location</h3>
        <select
          value={selectedLocation || ''}
          onChange={handleLocation}
          className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-orange-400 w-full md:w-1/2 text-sm"
        >
          {parkings?.length > 0 ? (
            parkings.map((parking) => (
              <option key={parking._id} value={parking._id}>
                {parking.location}
              </option>
            ))
          ) : (
            <option disabled>No locations available</option>
          )}
        </select>
        <button
          onClick={handleAddFloor}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition text-sm"
        >
          + Add Floor
        </button>
      </div>

      {/* Summary Cards */}
      {counts ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-600">Total Available</h3>
            <p className="text-xl font-bold text-green-500 mt-1">{counts.available}</p>
            <p className="text-xs text-gray-500">of {counts.total}</p>
          </div>
          {counts.floorDetails.map((f) => (
            <div
              key={f.floorId}
              className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition"
            >
              <h3 className="text-sm font-medium text-gray-600">{f.name}</h3>
              <p className="text-xl font-bold text-green-500 mt-1">{f.available}</p>
              <p className="text-xs text-gray-500">of {f.total}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500 text-center text-sm">No parking data available</p>
      )}
    </div>
  );
};

export default ManageLotHeader;
