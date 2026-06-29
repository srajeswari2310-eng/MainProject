import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchParkingsService = async (token) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.get("/parking");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch parkings"
    );
  }
};

// Add a new floor to a parking location
export const addFloorService = async (token, locationId) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.post(`/parking/${locationId}/floors`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to add floor"
    );
  }
};

// Add slots to a floor
export const addSlotsService = async (token, parkingId, floorId) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.post(`/parking/${parkingId}/floors/${floorId}/slots`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to add slots"
    );
  }
};

// Toggle floor availability
export const toggleAvailabilityService = async (token, parkingId, floorId) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.put(`/parking/${parkingId}/floors/${floorId}/availability`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to update availability"
    );
  }
};