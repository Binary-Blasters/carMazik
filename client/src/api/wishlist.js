import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getWishlistCars = async () => {
  const res = await axios.get(`${BASE_URL}/user/wishlist`, {
    withCredentials: true,
  });

  return res.data.data || []; 
};
