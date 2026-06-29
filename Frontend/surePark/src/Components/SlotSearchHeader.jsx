import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  reserveSlot,
  reset,
  setError,
  setIntialValues,
  setSelectedEndDate,
  setSelectedEndTime,
  setSelectedLocation,
  setSelectedParking,
  setSelectedPlan,
  setSelectedStartDate,
  setSelectedStartTime,
  setSelectedVehicleNo,
  setParkings
} from '../feature/parkingSlice';

const SlotSearchHeader = ({ onReserve }) => {
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state) => state.user);
  const {
    parkings,
    selectedLocation,
    selectedParking,
    selectedVehicleNo,
    selectedPlan,
    selectedStartDate,
    selectedEndDate,
    selectedStartTime,
    selectedEndTime,
    parkingError,
    isSuccess
  } = useSelector((state) => state.parking);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Fetch parking data from API
  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const res = await axiosInstance.get('/parking');
        if (Array.isArray(res.data)) {
          dispatch(setParkings({ parking: res.data }));
          if (res.data.length > 0) {
            dispatch(setSelectedLocation({ id: res.data[0]._id }));
            // dispatch(setSelectedParking({ selectParking: res.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching parkings:', err.message);
      }
    };
    fetchParkings();
  }, []);

  const handleConfirm = (e) => {
    e.preventDefault();
    dispatch(reserveSlot({ currentUser }));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(reset({ currentUser }));
  };

  useEffect(() => {
    if (currentUser) {
      dispatch(setIntialValues({ currentUser }));
    }
  }, [currentUser, dispatch]);


  useEffect(() => {
    // if (selectedLocation) {
    //   dispatch(setSelectedParking({ location: selectedLocation }));
    // }
    console.log(selectedLocation)
    console.log(selectedParking)

    if (isSuccess) {
      onReserve();
    }
  }, [selectedLocation, selectedVehicleNo, parkingError, isSuccess, currentUser, dispatch, onReserve, selectedParking]);


  return (
    <div className="w-full md:w-[85%] bg-gradient-to-r from-orange-50 via-pink-50 to-teal-50 rounded-xl mx-auto px-6 py-6 mt-6 mb-6 shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-6">
        Vehicle Reservation
      </h2>

      {/* Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Location */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Select Location</h3>
          <select
            value={selectedLocation || ''}
            onChange={(e) => dispatch(setSelectedLocation({ id: e.target.value }))}
            className="border border-gray-300 p-2 rounded-md w-full text-sm focus:ring-2 focus:ring-orange-400"
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
        </div>

        {/* Vehicle */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Select Vehicle</h3>
          <select
            value={selectedVehicleNo || ''}
            onChange={(e) => dispatch(setSelectedVehicleNo({ vehicleNo: e.target.value }))}
            className="border border-gray-300 p-2 rounded-md w-full text-sm focus:ring-2 focus:ring-orange-400"
          >
            {currentUser?.vehicles?.map((vehc, i) => (
              <option key={i} value={vehc.no}>{vehc.no}</option>
            ))}
          </select>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Reservation Plan</h3>
          <div className="flex gap-2">
            {['shortTerm', 'longTerm', 'monthly'].map((p) => (
              <button
                key={p}
                onClick={() => dispatch(setSelectedPlan({ plan: p }))}
                className={`px-3 py-1.5 rounded-md text-sm font-medium shadow transition 
                  ${selectedPlan === p ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {p === 'shortTerm' ? 'Short-Term' : p === 'longTerm' ? 'Long-Term' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {selectedPlan && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {selectedPlan === 'shortTerm' ? 'Select Date' : 'Start Date'}
            </h3>
            <input
              type="date"
              value={selectedStartDate || ''}
              onChange={(e) => dispatch(setSelectedStartDate({ sDate: e.target.value }))}
              className="border border-gray-300 p-2 rounded-md w-full text-sm focus:ring-2 focus:ring-orange-400"
            />
          </div>
        )}

        {selectedPlan === 'shortTerm' && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Time Range</h3>
            <div className="flex gap-2">
              <input
                type="time"
                value={selectedStartTime || ''}
                onChange={(e) => dispatch(setSelectedStartTime({ sTime: e.target.value }))}
                className="border border-gray-300 p-2 rounded-md w-full text-sm focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="time"
                value={selectedEndTime || ''}
                onChange={(e) => dispatch(setSelectedEndTime({ eTime: e.target.value }))}
                className="border border-gray-300 p-2 rounded-md w-full text-sm focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        )}

        {(selectedPlan === 'longTerm' || selectedPlan === 'monthly') && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">End Date</h3>
            <input
              type="date"
              value={selectedEndDate || ''}
              onChange={(e) => dispatch(setSelectedEndDate({ eDate: e.target.value }))}
              className="border border-gray-300 p-2 rounded-md w-full text-sm focus:ring-2 focus:ring-orange-400"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleConfirm}
          className="bg-orange-500 text-white text-sm px-4 py-2 rounded-md font-medium shadow hover:scale-105 transition"
        >
          Confirm Reservation
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-400 text-white text-sm px-4 py-2 rounded-md font-medium shadow hover:scale-105 transition"
        >
          Cancel
        </button>
      </div>

      {parkingError && (
        <div className="text-red-500 text-xs text-center mt-3">{parkingError}</div>
      )}
    </div>
  );
};

export default SlotSearchHeader;
