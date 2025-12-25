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

export const getCategoryStats = async () => {
  const res = await API.get("/cars/category-stats");
  return res.data.data;
}
export const getFeaturedCars = async () => {
  const res = await API.get("/cars", {
    params: {
      category: "featured",
      limit: 8,
    },
  });
  
  return res.data.data;
};


export const getUpcomingCars = async () => {
  const res = await API.get("/upcoming-cars");
  return res.data;
};

export const getCarsByBudget = async ({ minPrice, maxPrice }) => {
  const res = await API.get("/cars/budget", {
    params: { minPrice, maxPrice },
  });
  return res.data;
};

