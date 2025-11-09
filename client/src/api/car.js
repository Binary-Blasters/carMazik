import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ;

export const createCar = async (carData) => {
  const response = await axios.post(`${API_URL}/cars`, carData,{withCredentials: true});
  return response.data;
};

export const getCarById = async (id) => {
  const response = await axios.get(`${API_URL}/cars/${id}`,{withCredentials: true});
  return response.data;
}
