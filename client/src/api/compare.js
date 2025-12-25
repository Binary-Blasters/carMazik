import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const getComparePairs = async () => {
  const res = await axios.get(`${BASE_URL}/compare/pairs`);
  return res.data;
};
