import { Car } from "../models/car.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const normalizeCar = (car) => ({
  _id: car._id,
  brand: car.brand,
  model: car.model,
  price: car.price,
  year: car.year,
  fuelType: car.fuelType,
  transmission: car.transmission,
  mileage: car.mileage,
  range: car.range,
  location: car.location,
  images: car.images || [],
  engine: car.engine || {},
});

export const getComparePairs = asyncHandler(async (req, res) => {
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
});

export const getCompareDetails = asyncHandler(async (req, res) => {
  const { carA, carB } = req.query;

  if (!carA || !carB) {
    throw new ApiError(400, "Both carA and carB are required");
  }

  const [carADetails, carBDetails] = await Promise.all([
    Car.findById(carA).lean(),
    Car.findById(carB).lean(),
  ]);

  if (!carADetails || !carBDetails) {
    throw new ApiError(404, "One or both cars not found");
  }
  
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { carA: normalizeCar(carADetails), carB: normalizeCar(carBDetails) },
        "Compare details fetched successfully"
      )
    );
});

export const compareCarsBySlug = asyncHandler( async(req, res) => {
  
    const slug = req.params.slug; // swift-vs-baleno
    console.log("Slug:",slug);
    
    const [modelA, modelB] = slug.split(/-vs-+/i);
    console.log("ModelA:",modelA);
    

    const cars = await Car.find({
      model: { $in: [modelA, modelB] },
      status: "approved",
      isActive: true,
    }).limit(2);

    console.log("cars:", cars);
    

    if (cars.length < 2) {
      throw new ApiError(404, "One or both cars not found for comparison");
    }

    const [carA, carB] = cars;

    const comparison = {
      price: {
        a: compareValue(carA.price, carB.price, "lower"),
        b: compareValue(carB.price, carA.price, "lower"),
      },
      mileage: {
        a: compareValue(carA.mileage, carB.mileage),
        b: compareValue(carB.mileage, carA.mileage),
      },
      year: {
        a: compareValue(carA.year, carB.year),
        b: compareValue(carB.year, carA.year),
      },
    };

    const verdict = generateVerdict(carA, carB);

    res.json({
      success: true,
      data: {
        carA,
        carB,
        comparison,
        verdict,
      },
    });
  
});
