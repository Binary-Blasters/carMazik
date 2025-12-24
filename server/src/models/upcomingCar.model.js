import mongoose from "mongoose";

const upcomingCarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    variant: String,
    bodyType: String,

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
    },

    expectedLaunchDate: {
      type: Date,
      required: true,
    },

    year: Number,

    engine: {
      capacity: String,
      power: String,
      torque: String,
    },

    battery: {
      range: String,
      chargingTime: String,
    },

    features: [String],
    description: String,

    images: [String],

    status: {
      type: String,
      enum: ["upcoming", "launched"],
      default: "upcoming",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const UpcomingCar = mongoose.model(
  "UpcomingCar",
  upcomingCarSchema
);
