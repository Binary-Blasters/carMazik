import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const getComparePairs = async () => {
  const res = await axios.get(`${BASE_URL}/compare/pairs`);
  return res.data;
};

export const getCompareDetails = async (carA, carB) => {
  const res = await axios.get(`${BASE_URL}/compare/details`, {
    params: { carA, carB },
  });
  return res.data;
};

export const getCompareBySlug = (slug) => {
  return axios.get(`${BASE_URL}/compare/${slug}`);
};