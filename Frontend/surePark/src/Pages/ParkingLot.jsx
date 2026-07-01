import React from 'react'
import ParkingLotHeader from '../Components/ParkingLotHeader'
import ParkingLotList from '../Components/ParkingLotList'
import SlotSearchHeader from '../Components/SlotSearchHeader'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { calculatePayment } from '../feature/parkingSlice'

const ParkingLot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { reservationDetails } = useSelector((state) => state.parking);

  const handelPayment = () => {
    console.log(reservationDetails);

    dispatch(calculatePayment());

      navigate("/payment");
    
  }

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
        <SlotSearchHeader onReserve={handelPayment}/>
        <ParkingLotList/>
        </div>
  )
}

export default ParkingLot