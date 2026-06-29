import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const loginApi = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    // Normalize error response
    throw new Error(
      err.response?.data?.message || err.message || "Unexpected error occurred"
    );
  }
};

export const forgotPasswordService = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to send OTP"
    );
  }
};

export const registerService = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Registration failed"
    );
  }
};

export const resetPasswordService = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Password change failed"
    );
  }
};