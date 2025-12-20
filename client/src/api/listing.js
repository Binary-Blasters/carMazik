import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});


export const getCars = async (params = {}) => {
  const res = await API.get("/cars", { params });
  return res.data.data;
};


export const searchCars = async (query) => {
  const res = await API.get("/cars/search", {
    params: { query },
  });
  return res.data.data;
};
