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

export const getSellerPendingCars = async () => {
  const response = await axios.get(`${API_URL}/cars/seller/pending`,{withCredentials: true});
  return response.data;
}

export const getRejectedCars = async () => {
  const response = await axios.get(`${API_URL}/cars/seller/rejected`,{withCredentials: true});
  return response.data;
}

export const getSellerSoldCars = async () => {
  const response = await axios.get(`${API_URL}/cars/seller/sold`,{withCredentials: true});
  return response.data;
}

export const getLatestCars = async () => {
  const response = await axios.get(`${API_URL}/cars/latest`,{withCredentials: true});
  return response.data;
}

export const getCarByCategory = async (category) => {
  const response = await axios.get(`${API_URL}/cars?category=${category}`,{withCredentials: true});
  return response.data;
}
