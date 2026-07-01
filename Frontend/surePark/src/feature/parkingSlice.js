// feature/parkingSlice.js
import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import { reserveSlotService } from "../services/reservation.service";
import pricingDetails from "../models/pricing.model";

// Utility to format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split("T")[0];

// Utility to format time as HH:MM (24h)
const formatTime = (date) => date.toTimeString().slice(0, 5);

// Current date/time
const now = new Date();

// Start date = today
const startDate = formatDate(now);

// End date = tomorrow
const tomorrow = new Date();
tomorrow.setDate(now.getDate() + 1);
const endDate = formatDate(tomorrow);

// End date = +1 month
const oneMonthLater = new Date(now);
oneMonthLater.setMonth(now.getMonth() + 1);
const endMonth = formatDate(oneMonthLater); // format as YYYY-MM-DD

// Start time = current time
const startTime = formatTime(now);

// End time = +1 hour
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
const endTime = formatTime(oneHourLater);


const initialState = {
  parkings: null,
  pircing: pricingDetails,
  selectedLocation: null,
  selectedParking: null, // parking details of the location
  selectedPlan: "shortTerm",
  selectedVehicleNo: "",
  selectedSlot: null,
  selectedStartDate: "",
  selectedEndDate: "",
  selectedStartTime: "",
  selectedEndTime: "",
  parkingError: null,
  parkingSuccess: false,
  reservationDetails: null,
  paymentAmount: 0,
  isSuccess: false,
  isPayment: false
}



export const reserveSlotThunk = createAsyncThunk(
  "parking/reserveSlot",
  async ({ token, currentUser, reservationDetails }, { rejectWithValue, getState }) => {
    try {
      

      // Build payload
      const payload = {
        userId: reservationDetails.userId,
        slotId: reservationDetails.slotId,
        floorId: reservationDetails.floorId,
        locationId: reservationDetails.locationId,
        plan: reservationDetails.plan,
        startDate: reservationDetails.startDate,
        endDate: reservationDetails.endDate,
        startTime: reservationDetails.startTime,
        endTime: reservationDetails.endTime,
        userVehicleNo: reservationDetails.userVehicleNo,
      };

      const result = await reserveSlotService(token, payload);
      return result;
    } catch (err) {
      return rejectWithValue(err.message || "Reservation failed");
    }
  }
);




const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    setParkings:(state, action) =>{
      const  { parking } = action.payload;
      state.parkings = parking;
    },  
    calculatePayment: (state, action) => {
      if (state.reservationDetails) {
        if (state.reservationDetails.plan == "shortTerm") {
          const plan = state.pircing.pricing.shortTerm;
          console.log(plan);
          if (plan) {
            const rate = plan.ratePerHour;
            const { hours, minutes } = getTimeDiff(state.reservationDetails.startTime, state.reservationDetails.endTime);
            if (minutes < 15) {
              const price = hours * rate;
              state.paymentAmount = price;
            } else {
              const price = (hours + 1) * rate;
              state.paymentAmount = price;
            }
          }
        } else {

          if (state.reservationDetails.plan == "longTerm") {
            const { weeks, days } = getLongTermRange(state.reservationDetails.startDate, state.reservationDetails.endDate);
            const plan = state.pircing.pricing.longTerm;
            
            if (weeks == 0) {
              const rate = plan.ratePerDay;             
              const price = days * rate;
              state.paymentAmount = price;
            } else {
               const rate = plan.ratePerWeek;      
               if(days > 15)      {
                const price = (weeks +1) * rate;
                state.paymentAmount = price;
               }
               else{
                 const price = weeks * rate;
                state.paymentAmount = price;
               }

            }

          } else {

            const { months, days } = getMonthlyRange(state.reservationDetails.startDate, state.reservationDetails.endDate);

            const plan = state.pircing.pricing.monthly;
            const rate = plan.ratePerMonth;
            if (days > 10) {

              const price = (months + 1) * rate;
              state.paymentAmount = price;
            } else {
              const price = months * rate;
              state.paymentAmount = price;
            }
          }
        }
      }
    },
    paymentConfirm: (state, action) => {
      const { paymentMade } = action.payload;
      const { currentUser } = action.payload;

      if (paymentMade) {
        const location = state.parkings.find(l => l.locationId == state.selectedLocation);
        if (location) {
          const floor = location.floors.find(f => f.floorId == state.selectedSlot.floorId);
          if (floor) {
            const slot = floor.slots.find(s => s.id == state.selectedSlot.slotId);
            if (slot) {
              slot.reserved = true;
              const reservD = {
                plan: state.selectedPlan,
                startDate: state.selectedStartDate,
                endDate: state.selectedEndDate,
                startTime: state.selectedStartTime,
                endTime: state.selectedEndTime,
                user: currentUser.Id,
                userVehicleNo: state.selectedVehicleNo
              };

              slot.reservedDetail.push(reservD);
              state.selectedParking = state.parkings.find(x => x.locationId == location);
              state.selectedSlot = null;
              state.parkingError = null;
              state.isSuccess = true;
              state.isPayment = true;
            }
          }
        }

      }

    },
    removeReservation: (state, action) => {
      const { floorId, slotId } = action.payload;
      console.log(floorId)
      console.log(slotId)
      const parkingId = state.selectedParking.locationId;
      console.log(parkingId)
      const floor = state.parkings.find(x => x.locationId == parkingId)?.floors.find(f => f.floorId === floorId);
      if (floor) {
        const slot = floor.slots.find(s => s.id === slotId);
        if (slot) {
          slot.occupied = false;
          slot.user = null;
          slot.userVehicleNo = null;
          slot.reserved = null;
          slot.reservationDetails = [];
          state.selectedParking = state.parkings.find(x => x.locationId == parkingId);
        }
      }
    },
    setIntialValues: (state, action) => {
      const { currentUser } = action.payload;
      state.selectedVehicleNo = currentUser?.vehicles?.[0]?.no || "";
      
      state.selectedStartDate = startDate;
      state.selectedEndDate = endDate;
      state.selectedStartTime = startTime;
      state.selectedEndTime = endTime;
      state.selectedPlan = "shortTerm";
      state.selectedSlot = null;
      state.parkingError = null;
     
    },
    setSelectedLocation: (state, action) => {
      const { id } = action.payload;
      state.selectedParking = state.parkings.find(x => x._id == id);
      state.selectedLocation = id;
    },
    setSelectedParking: (state, action) => {
      const { selectParking } = action.payload;
      state.selectedParking = selectParking;
    },
    setSelectedVehicleNo: (state, action) => {
      const { vehicleNo } = action.payload;
      state.selectedVehicleNo = vehicleNo;
    },
    setSelectedPlan: (state, action) => {
      const { plan } = action.payload;
      state.selectedPlan = plan;
      if (state.selectedPlan == "monthly") {
        state.selectedStartDate = startDate;
        state.selectedEndDate = endMonth;
      } else {
         state.selectedStartDate = startDate;
        state.selectedEndDate = endDate;
      }
    },
    setSelectedStartDate: (state, action) => {
      const { sDate } = action.payload;
      const newDate = new Date(sDate).setHours(0, 0, 0, 0);
      const todayDate = new Date(startDate).setHours(0, 0, 0, 0);

      if (todayDate < newDate || todayDate == newDate) {
        state.selectedStartDate = sDate;
      }
    },
    setSelectedEndDate: (state, action) => {
      const { eDate } = action.payload;

      const newDate = new Date(eDate).setHours(0, 0, 0, 0);
      const todayDate = new Date(endDate).setHours(0, 0, 0, 0);

      if (todayDate < newDate || todayDate == newDate) {
        state.selectedEndDate = eDate;
      }

    },
    setSelectedStartTime: (state, action) => {
      const { sTime } = action.payload;
      console.log(sTime)
      state.selectedStartTime = sTime;

      // Parse "HH:MM" string into a Date object
      const [hours, minutes] = sTime.split(":").map(Number);
      const baseDate = new Date();
      baseDate.setHours(hours, minutes, 0, 0);

      // Add 1 hour
      const oneHourLater = new Date(baseDate.getTime() + 60 * 60 * 1000);

      // Format back to "HH:MM"
      const formatTime = (date) => date.toTimeString().slice(0, 5);
      state.selectedEndTime = formatTime(oneHourLater);

    },
    setSelectedEndTime: (state, action) => {
      const { eTime } = action.payload;
      state.selectedEndTime = eTime;
    },
    setSelectedSlot: (state, action) => {
      const { floorId, slotId } = action.payload;
      state.selectedSlot = { slotId: slotId, floorId: floorId };
      console.log(state.selectedSlot);
    },
    setError: (state, action) => {
      state.parkingError = null;
    },
    reset: (state, action) => {
      const { currentUser } = action.payload;
      if (currentUser) {
        state.selectedVehicleNo = currentUser?.vehicles?.[0]?.no || "";
      }
      state.selectedLocation = parkings?.[0]?.locationId || "";
      state.selectedStartDate = startDate;
      state.selectedEndDate = endDate;
      state.selectedStartTime = startTime;
      state.selectedEndTime = endTime;
      state.selectedPlan = "shortTerm";
      state.selectedSlot = null;
      state.parkingError = null;
      state.reservationDetails = null;
      state.isSuccess = false;
      state.isPayment = false;
      state.paymentAmount = 0,
        console.log(state.parkings);
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(reserveSlotThunk.pending, (state) => {
        state.parkingError = null;
        state.isSuccess = false;
        state.isPayment = false;
      })
      .addCase(reserveSlotThunk.fulfilled, (state, action) => {
        state.reservationDetails = action.payload;
        state.isSuccess = true;
        state.isPayment = true;
        state.parkingError = null;
      })
      .addCase(reserveSlotThunk.rejected, (state, action) => {        
       state.parkingError = action.payload;
        state.isSuccess = false;
        state.isPayment = false;
      });
  },
});

export const { setParkings, reserveSlot, removeReservation, setSelectedLocation, setSelectedParking, setIntialValues, setSelectedVehicleNo,
  setSelectedPlan, setSelectedStartDate, setSelectedEndDate, setSelectedStartTime, setSelectedEndTime, setError, setSelectedSlot,
  reset, paymentConfirm, calculatePayment

} = parkingSlice.actions;



export default parkingSlice.reducer;

//function getStartDate()

function getTimeDiff(startTime, endTime) {
  const parseTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m; // total minutes
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  const diffMinutes = endMinutes - startMinutes;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return { hours, minutes };
}

// Monthly plan: months + days
function getMonthlyRange(startDate, endDate) {
  let start = normalizeDate(startDate);
  let end = normalizeDate(endDate);

  if (end < start) throw new Error("End date must be after start date");

  let months = 0, days = 0;

  // Count months
  while (
    start.getFullYear() < end.getFullYear() ||
    (start.getFullYear() === end.getFullYear() && start.getMonth() < end.getMonth())
  ) {
    start.setMonth(start.getMonth() + 1);
    if (start <= end) {
      months++;
    } else {
      start.setMonth(start.getMonth() - 1);
      break;
    }
  }
  return { months, days };
}

// Utility: normalize dates
function normalizeDate(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Long-term plan: weeks + days only
function getLongTermRange(startDate, endDate) {
  let start = normalizeDate(startDate);
  let end = normalizeDate(endDate);

  if (end < start) throw new Error("End date must be after start date");

  let weeks = 0, days = 0;

  // Count weeks
  while (start.getTime() + 7 * 24 * 60 * 60 * 1000 <= end.getTime()) {
    start.setDate(start.getDate() + 7);
    weeks++;
  }

  // Remaining days
  while (start < end) {
    start.setDate(start.getDate() + 1);
    days++;
  }

  return { weeks, days };
}
