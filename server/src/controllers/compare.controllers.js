import {Car} from "../models/car.models.js";

export const getComparePairs = async (req, res) => {
  try {
    const cars = await Car.find({
      status: "approved",
      price: { $exists: true, $gt: 0 },
      images: { $exists: true, $ne: [] },
    })
      .select("brand model price images")
      .sort({ createdAt: -1 })
      .limit(10) 
      .lean();

    console.log("COMPARE CARS FOUND:", cars.length);

    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (err) {
    console.error("❌ Compare API error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch compare cars",
    });
  }
};
