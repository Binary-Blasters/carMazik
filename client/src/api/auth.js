import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const login = async (identifier, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { identifier, password },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
