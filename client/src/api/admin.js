import { pendingCars } from "../lib/adminDummyData";


export const adminService = {
  getPendingCars: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: pendingCars });
      }, 600);
    });
  },

  approveCar: async (carId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  },

  rejectCar: async (carId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  },
};
