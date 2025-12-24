import { pendingCars } from "../lib/adminDummyData";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const adminService = {
  //CAR ACTIONS
  getPendingCars: async () => {
    return await axios.get(`${BASE_URL}/admin/cars/pending`, {
      withCredentials: true,
    });
  },

  approveCar: async (car_id) => {
   try {
     return await axios.patch(
       `${BASE_URL}/admin/cars/approve/${car_id}`,
       {},
       {
         withCredentials: true,
       }
     );
   } catch (error) {
    console.log(error);
    
   }
  },

  rejectCar: async (car_id) => {
    return await axios.patch(
      `${BASE_URL}/admin/cars/reject/${car_id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },
  getAdminCars: async () => {
  return await axios.get(`${BASE_URL}/admin/cars`,{withCredentials : true})
},
  toggleFeaturedCar: async (id) => {
  await axios.patch(`${BASE_URL}/admin/cars/featured/${id}`,{},{withCredentials: true})
},
  //USER ACTIONS
  getActiveUSers: async () => {
    return await axios.get(`${BASE_URL}/admin/users`, {
      withCredentials: true,
    });
  },

  blockUser: async (userId) => {
    return await axios.patch(
      `${BASE_URL}/admin/users/block/${userId}`,
      {},
      { withCredentials: true }
    );
  },

  unblockUser: async (userId) => {
    return await axios.patch(
      `${BASE_URL}/admin/users/unblock/${userId}`,
      {},
      { withCredentials: true }
    );
  },

  getUserById: async (userId) => {
    return await axios.get(`${BASE_URL}/admin/users/${userId}`, {
      withCredentials: true,
    });
  },
  getBlockedUsers: async () =>
    axios.get(`${BASE_URL}/admin/users/blocked`, {
      withCredentials: true,
    }),

  //seller actions
  getPendingSellers: async () =>
    axios.get(`${BASE_URL}/admin/sellers/pending`, {
      withCredentials: true,
    }),

  approveSeller: async (sellerId) =>
    axios.patch(
      `${BASE_URL}/admin/sellers/approve/${sellerId}`,
      {},
      { withCredentials: true }
    ),

  rejectSeller: async (sellerId) =>
    axios.patch(
      `${BASE_URL}/admin/sellers/reject/${sellerId}`,
      {},
      { withCredentials: true }
    ),

  getSellerById: async (sellerId) =>
    axios.get(`${BASE_URL}/admin/sellers/pending/${sellerId}`, {
      withCredentials: true,
    }),
  getActiveSellers: async () =>
    axios.get(`${BASE_URL}/admin/sellers/`, {
      withCredentials: true,
    }),
  blockSeller: async (sellerId) =>
    axios.patch(
      `${BASE_URL}/admin/sellers/block/${sellerId}`,
      {},
      { withCredentials: true }
    ),

  unblockSeller: async (sellerId) =>
    axios.patch(
      `${BASE_URL}/admin/sellers/unblock/${sellerId}`,
      {},
      { withCredentials: true }
    ),
  getBlockedSellers: async () =>
    axios.get(`${BASE_URL}/admin/sellers/blocked`, {
      withCredentials: true,
    }),

  getStats: async () => {
    return await axios.get(`${BASE_URL}/admin/stats`, {
      withCredentials: true,
    });
  },
};
