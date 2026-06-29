import { configureStore } from "@reduxjs/toolkit";

import userReducer from '../feature/userSlice'
import parkingReducer from '../feature/parkingSlice'
import parkings from "../../../../../Mini_Project/surePark/src/models/parking";

export const store = configureStore({
  reducer: {
    user: userReducer,
    parking: parkingReducer
  },
});

