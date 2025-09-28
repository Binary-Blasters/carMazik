import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    kmDriven: {
      type: Number,
      required: true,
    },
    ownership: {
      type: String,
      enum: ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner or More"],
      required: true,
    },
    color: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },

    engine: {
      capacity: String,
      power: String,
      torque: String,
    },
    mileage: {
      type: String,
    },
    seatingCapacity: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Car = mongoose.model("Car", carSchema);
