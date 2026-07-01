// services/reservationService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Reserve Slot Service
export const reserveSlotService = async (token, reservationData) => {
     const axiosInstance = createAxiosInstance(token);
     console.log(reservationData)
  try {
    const response = await axiosInstance.post(`/parking/reserve`, reservationData);
    return response.data; // { success, message, reservationId }
  } catch (error) {
    console.error("Reservation API Error:", error.response?.data || error.message);
    throw error.response?.data || { success: false, message: "Server error" };
  }
};

// Reserve Slot Service
export const removeReservationService = async (token, userId, reservationId) => {
     const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.delete(`/parking/parking/reserve`, {
      data: { userId, reservationId }, 
    });
    return response.data; // { success, message, reservationId }
  } catch (error) {
    console.error("Reservation API Error:", error.response?.data || error.message);
    throw error.response?.data || { success: false, message: "Server error" };
  }
};
