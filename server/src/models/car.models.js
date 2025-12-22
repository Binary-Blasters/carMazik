import mongoose from "mongoose";

/* ---------- SUB SCHEMAS ---------- */

const engineSchema = new mongoose.Schema(
  {
    capacity: String, // 1498 cc
    power: String,    // 110 bhp
    torque: String,   // 250 Nm
  },
  { _id: false }
);

const batterySchema = new mongoose.Schema(
  {
    range: String,        // 450 km
    chargingTime: String // 6 hrs
  },
  { _id: false }
);

const cngSchema = new mongoose.Schema(
  {
    tankCapacity: String // 12 kg
  },
  { _id: false }
);

/* ---------- MAIN CAR SCHEMA ---------- */

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
    variant: String,
    bodyType: String,

    year: { type: Number, required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
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
      enum: [
        "1st Owner",
        "2nd Owner",
        "3rd Owner",
        "4th Owner or More",
      ],
      required: true,
    },

    color: String,
    mileage: String,
    seatingCapacity: Number,
    location: String,

    /* DYNAMIC */
    engine: engineSchema,   // Petrol / Diesel / Hybrid
    battery: batterySchema, // Electric / Hybrid
    cng: cngSchema,         // CNG

    features: [String],
    description: String,
    images: [String],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Car = mongoose.model("Car", carSchema);
