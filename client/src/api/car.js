import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createCar = async (carData) => {
  const response = await axios.post(`${API_URL}/cars`, carData, {
    withCredentials: true,
  });
  return response.data;
};

export const getSellerPendingCars = async () => {
  const response = await axios.get(`${API_URL}/cars/seller/pending`, {
    withCredentials: true,
  });
  return response.data;
};

export const getRejectedCars = async () => {
  const response = await axios.get(`${API_URL}/cars/seller/rejected`, {
    withCredentials: true,
  });
  return response.data;
};

export const getSellerSoldCars = async () => {
  const response = await axios.get(`${API_URL}/cars/seller/sold`, {
    withCredentials: true,
  });
  return response.data;
};

export const getLatestCars = async () => {
  const response = await axios.get(`${API_URL}/cars/latest`, {
    withCredentials: true,
  });
  return response.data;
};

export const getCarByCategory = async (category) => {
  const response = await axios.get(`${API_URL}/cars?category=${category}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getElectricCars = async () => {
  const response = await axios.get(`${API_URL}/cars/electric`, {
    withCredentials: true,
  });
  return response.data;
};

export const getCarById = async (id) => {
  const res = await axios.get(`${API_URL}/cars/${id}`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getRelatedCars = async ({ fuelType, brand, excludeId }) => {
  const res = await axios.get(`${API_URL}/cars`, {
    params: {
      fuelType,
      brand,
      limit: 4,
    },
    withCredentials: true,
  });

  return (res.data.data.cars || []).filter((car) => car._id !== excludeId);
};

export const getCars = async (filters = {}) => {
  const res = await axios.get(`${API_URL}/cars`, {
    params: filters,
    withCredentials: true,
  });
  return res.data.data;
};

export const getNewlyLaunchedCars = async () => {
  const res = await axios.get(`${API_URL}/cars/newly-launched`, {
    withCredentials: true,
  });
  return res.data.data;
};
