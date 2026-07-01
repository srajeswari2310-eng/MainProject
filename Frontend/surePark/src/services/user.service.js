// userService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchUsersService = async (token) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.get("/user/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch users"
    );
  }
};

export const fetchUserService = async (token, userId) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user"
    );
  }
};


export const createUserService = async (token, userData) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.post("/user", userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to create user"
    );
  }
};

export const updateUserService = async (token, userId, payload) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.put(`/user/${userId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to update user"
    );
  }
};

// Fetch vehicles for a user
export const fetchVehiclesService = async (token, userId) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data.vehicles;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch vehicles"
    );
  }
};

// Add a new vehicle
export const addVehicleService = async (token, userId, vehicleNo) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.post(`/user/${userId}/vehicles`, { no: vehicleNo });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Failed to add vehicle"
    );
  }
};

// Update an existing vehicle
export const updateVehicleService = async (token, userId, vehicleId, vehicleNo) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.put(`/user/${userId}/vehicles/${vehicleId}`, { no: vehicleNo });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Failed to update vehicle"
    );
  }
};

// Delete a vehicle
export const deleteVehicleService = async (token, userId, vehicleId) => {
  const axiosInstance = createAxiosInstance(token);
  try {
    const response = await axiosInstance.delete(`/user/${userId}/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Failed to delete vehicle"
    );
  }
};

// Add a favorite slot
export const addFavoriteService = async (token, userId, slotId, floorId, locationId) => {
  try {

  const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.post(`/user/${userId}/favorites`, {
      slotId,
      floorId,
      locationId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error ||  error.message || "Failed to add favorite");
  }
};

// Remove a favorite slot
export const removeFavoriteService = async (token, userId, slotId, floorId, locationId) => {
  try {
     const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.delete(`/user/${userId}/favorites`, {
      data: { slotId },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to remove favorite");
  }
};