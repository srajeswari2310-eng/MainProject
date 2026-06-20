import { createSlice } from "@reduxjs/toolkit";

const dummyCurrentUser = {
  _id: "6a354a96a5e7afe118c4aa3b",
  name: "Raji",
  email: "raji@example.com",
  password: "raji@123", // keep unhashed for testing
  role: "admin",
  vehicles: [ ],
  favoriteSlot: [
    
  ],
  reservedSlot: [
    
  ]
};

const initialState = {
  currentUser: dummyCurrentUser,
  token: null,
  role: "admin",
  isLoggedIn: true,
  loading: false,
  error: null,
  success: false,

  // forgot password flow
  generatedOtp: "",
  step: "forgot", // "forgot" | "confirm" | "change"
  userChange: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Auth flow
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.loading = false;
      state.isLoggedIn = true;
      state.currentUser = user;
      state.role = user.role;
      state.token = token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.currentUser = action.payload;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.role = null;
      state.token = null;
      state.currentUser = null;
      state.isLoggedIn = false;
      state.success = false;
      state.error = null;
      state.step = "forgot";
      state.generatedOtp = "";
      state.userChange = null;
    },
    updateUser: (state, action) => {
         const { user } = action.payload;
         state.currentUser = user;

    },


    //Forgot password flow
    forgotPwdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    forgotPwdSuccess: (state, action) => {
      const { user, otp } = action.payload;
      state.loading = false;
      state.generatedOtp = otp;
      state.userChange = user;
      state.step = "confirm";
      state.error = null;
      
    },
    forgotPwdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    setForgotState: (state) => {
      state.error = null;
      state.step = "forgot";
      state.generatedOtp = "";
      state.userChange = null;
      state.success = false;
    },
    confirmOtp: (state, action) => {
      const { otp } = action.payload;
      if (otp === state.generatedOtp) {
        state.error = null;
        state.step = "change";
      } else {
        state.error = "Invalid OTP";
      }
    },
    changePwdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    changePwdSuccess: (state, action) => {
       if (state.userChange) {
        state.success = true;
        state.error = null;
        state.userChange = null;
        state.generatedOtp = null;
        state.step = "forgot";
      }
    },
    changesPwdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

   
   
    

    // ✅ Vehicles
    addUserVehicles: (state, action) => {
      const { vehicleNo } = action.payload;
      const exists = state.currentUser?.vehicles?.find((v) => v.no === vehicleNo);
      if (!exists) {
        state.currentUser.vehicles.push({ no: vehicleNo });
        state.error = null;
      } else {
        state.error = "Vehicle already exists";
      }
    },
    editUserVehicles: (state, action) => {
      const { vehicleNo, index } = action.payload;
      const exists = state.currentUser?.vehicles?.find((v) => v.no === vehicleNo);
      if (!exists) {
        state.currentUser.vehicles[index].no = vehicleNo;
        state.error = null;
      } else {
        state.error = "Vehicle already exists";
      }
    },
    deleteUserVehicles: (state, action) => {
      const { index } = action.payload;
      state.currentUser.vehicles = state.currentUser.vehicles.filter((_, i) => i !== index);
    },

    // ✅ Favorites
    handleFav: (state, action) => {
      const { slotId, floorId, locationId } = action.payload;
      const fav = state.currentUser.favoriteSlot.find(
        (f) => f.slotId === slotId && f.floorId === floorId && f.locationId === locationId
      );
      if (fav) {
        state.currentUser.favoriteSlot = state.currentUser.favoriteSlot.filter((f) => f !== fav);
      } else {
        state.currentUser.favoriteSlot.push({ slotId, floorId, locationId });
      }
    },

    // ✅ Reservations
    insertReservation: (state, action) => {
      const { details, location, floorId, slotId } = action.payload;
      state.currentUser.reservedSlot.push({ details, location, floorId, slotId });
    },

    // ✅ Utility
    resetUserError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUser,
  forgotPwdStart,
  forgotPwdFailure,
  forgotPwdSuccess,
  changePwdStart,
  changePwdSuccess,
  changesPwdFailure,
  confirmOtp,  
  setForgotState,


  addUserVehicles,
  editUserVehicles,
  deleteUserVehicles,
  handleFav,
  insertReservation,
  resetUserError,
} = userSlice.actions;

export default userSlice.reducer;
