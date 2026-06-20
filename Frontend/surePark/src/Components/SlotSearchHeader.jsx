import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { reserveSlot, reset, setError, setIntialValues, setSelectedEndDate, setSelectedEndTime, setSelectedLocation, setSelectedParking, setSelectedPlan, setSelectedStartDate, setSelectedStartTime, setSelectedVehicleNo } from '../feature/parkingSlice';
import { insertReservation } from '../feature/userSlice';
import { useNavigate } from 'react-router-dom';

const SlotSearchHeader = ({onReserve}) => {

   const {currentUser} = useSelector((state) => state.user); // Redux selector
   const {parkings, selectedLocation, selectedVehicleNo, selectedPlan,
    selectedStartDate,selectedEndDate,selectedStartTime,selectedEndTime,parkingError, isSuccess, reservationDetails, isPayment
   } = useSelector((state) => state.parking); // Redux selector


  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  

   const dispatch = useDispatch();
   

  const handleConfirm = (e) => {
    e.preventDefault();
    
    dispatch(reserveSlot({ currentUser }));    
  };

// set selecting location
  const handleLocation = (e) => {
   e.preventDefault(); 
   console.log(e.target.value);
    dispatch(setSelectedLocation({location: e.target.value}));
  }

  //set selecting vehicle
  const handleVehicle = (e) => {
   e.preventDefault(); 
    dispatch(setSelectedVehicleNo({vehicleNo: e.target.value}));
  }

  //set selecting plan
  const handlPlan = (p) => {
    dispatch(setSelectedPlan({plan: p}));
  }

   //set selecting SDate
  const handleSDate = (e) => {
    dispatch(setSelectedStartDate({sDate: e}));
  }

   //set selecting EDate
  const handleEDate = (e) => {
    dispatch(setSelectedEndDate({eDate: e}));
  }

    //set selecting STime
  const handleSTime = (e) => {
    e.preventDefault();     
    dispatch(setSelectedStartTime({sTime: e.target.value}));
  }

   //set selecting EDate
  const handleETime = (e) => {
    e.preventDefault(); 
    dispatch(setSelectedEndTime({eTime: e.target.value}));
  }

   //set selecting EDate
  const hadleError = () => {
    dispatch(setError());
  }

  const handleCancel= (e) =>{
     e.preventDefault(); 
    dispatch(reset({ currentUser }));
  }

useEffect(() => {
  if (currentUser) {   
    
     console.log(currentUser);
    dispatch(setIntialValues({ currentUser }));    
  }
//}, [currentUser,isPayment, dispatch]);
}, []);

  useEffect(()=>{
    if(selectedLocation){
    dispatch(setSelectedParking({location: selectedLocation}));// use to set parking details for particular location
    }
    if(isSuccess == true){
      
     onReserve();
    }
      console.log(currentUser);
  },[selectedLocation, selectedVehicleNo, parkingError, isSuccess,currentUser])

  

  

  
  return (
   
      <div className="w-full md:w-[80%] bg-orange-100 rounded-2xl mx-auto px-4 py-2 mt-4 mb-3 flex flex-col items-center">
        {/* Heading */}
       
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r p-2 from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Vehicle Reservation
          </h2>
         

        <div className="flex flex-col lg:flex-row items-center gap-10 items-center justify-center">
        {/* Location Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Select Location</h3>
          <select
            value={selectedLocation}
            onChange={(e) => handleLocation(e)}
            className="border p-2 rounded w-full"
          >
            {parkings.map((parking,i) => (
                <option key={i} value={parking.locationId}>{parking.location}</option>

            ))}           
          </select>
        </div>

        {/* Vehicle Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Vehicle Selection</h3>
          <select
            value={selectedVehicleNo}
            onChange={(e) => handleVehicle(e)}
            className="border p-2 rounded w-full"
          >
            {currentUser.vehicles.map((vehc,i) => (
                <option key={i} value={vehc.no}>{vehc.no}</option>

            ))}  
          </select>
        </div>

        {/* Plan Selection */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Reservation Plan</h3>
            <div className="flex gap-4 overflow-x-auto">
              {['shortTerm','longTerm','monthly'].map(p => (
                <button
                  key={p}
                  onClick={() => handlPlan(p)}
                  className={`px-6 py-3 rounded-lg shadow ${selectedPlan === p ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'} hover:scale-105 transition`}
                >
                  {p === 'shortTerm' ? 'Short-Term' : p === 'longTerm' ? 'Long-Term' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>
        </div>

       

        {/* Horizontal Selection */}
        <div className="flex flex-col lg:flex-row gap-6 mb-2 items-center justify-center" > 
        {/* Time/Date Pickers */}

        {selectedPlan != "" && (        
          <div>
            <h3 className="text-xl font-semibold mb-2">Select {selectedPlan === "shortTerm" ? "Date" : "Start Date"}</h3>
             <div className="flex flex-col lg:flex-row items-center gap-4">
            <input
              type="date"
              value={selectedStartDate}              
              onChange={(e) => handleSDate(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            </div>
          </div>
        )}
          {selectedPlan === "shortTerm" && (
          <>
          <div>
            <h3 className="text-xl font-semibold mb-2">Select Time Range</h3>
             <div className="flex flex-col lg:flex-row items-center gap-4">
            <input
              type="time"
              value={selectedStartTime}
              onChange={(e) => handleSTime(e)}
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="time"
              value={selectedEndTime}
              onChange={(e) => handleETime(e)}
              className="border p-2 rounded w-full mb-4"
            />
            </div>
          </div>
          </>
        )}

        {(selectedPlan === "longTerm" || selectedPlan === "monthly") && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Select End Date</h3>
             <div className="flex flex-col lg:flex-row items-center gap-4">
             <input
              type="date"
              value={selectedEndDate}
              onChange={(e) => handleEDate(e.target.value)}
              className="border p-2 rounded w-full  mb-4"
            />
            </div>
          </div>
        )}

         <div className="flex flex-col lg:flex-row mt-4 gap-4">
          <button
            onClick={handleConfirm}
            className="bg-orange-500 text-white text-xl px-6 py-2 rounded font-semibold shadow hover:scale-105 transform transition"
          >
            Confirm Reservation
          </button>
          <button
            onClick={(e) => {handleCancel(e)}}
            className="bg-gray-400 text-white text-xl px-6 py-2 rounded font-semibold shadow hover:scale-105 transform transition"
          >
            Cancel
          </button>
        </div>

      
        </div>

          {parkingError && <div className="text-red-500 text-sm text-center">{parkingError}</div>}
     
        </div>
  );
}

export default SlotSearchHeader