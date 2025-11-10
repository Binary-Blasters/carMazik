import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String },
    bodyType: { type: String },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
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
    kmDriven: { type: Number, required: true },
    ownership: {
      type: String,
      enum: ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner or More"],
      required: true,
    },
    color: { type: String },
    mileage: { type: String },
    seatingCapacity: { type: Number },
    location: { type: String },
    engine: {
      capacity: { type: String },
      power: { type: String },
      torque: { type: String },
    },
    features: [{ type: String }],
    description: { type: String },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isSold: { type: Boolean, default: false },
    rejectionReason: {
      type: String,
      default: "",
    },
    rejectedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Car = mongoose.model("Car", carSchema);
