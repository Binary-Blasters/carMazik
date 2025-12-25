import { Car } from "../models/car.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { compareValue } from "../utils/compareUtils.js"
import { generateVerdict } from "../utils/aiVerdict.js"

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

  // 🔥 COMPARISON LOGIC
  const comparison = {
    price: {
      a: compareValue(carADetails.price, carBDetails.price, "lower"),
      b: compareValue(carBDetails.price, carADetails.price, "lower"),
    },
    mileage: {
      a: compareValue(carADetails.mileage, carBDetails.mileage),
      b: compareValue(carBDetails.mileage, carADetails.mileage),
    },
    year: {
      a: compareValue(carADetails.year, carBDetails.year),
      b: compareValue(carBDetails.year, carADetails.year),
    },
    fuelType: {
      a: carADetails.fuelType === carBDetails.fuelType ? "equal" : "better",
      b: carADetails.fuelType === carBDetails.fuelType ? "equal" : "better",
    },
    transmission: {
      a:
        carADetails.transmission === carBDetails.transmission
          ? "equal"
          : "better",
      b:
        carADetails.transmission === carBDetails.transmission
          ? "equal"
          : "better",
    },
  };

  const verdict = generateVerdict(carADetails, carBDetails);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        carA: normalizeCar(carADetails),
        carB: normalizeCar(carBDetails),
        comparison,
        verdict,
      },
      "Compare details fetched successfully"
    )
  );
});


export const compareCarsBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug; // swift-vs-creta
  console.log("Slug:", slug);

  const [modelA, modelB] = slug.split(/-vs-+/i);
  console.log("ModelA:", modelA, "ModelB:", modelB);

  const cars = await Car.find({
    model: {
      $in: [
        new RegExp(`^${modelA}$`, "i"),
        new RegExp(`^${modelB}$`, "i"),
      ],
    },
    status: "approved",
    isSold: false, // ✅ CORRECT FIELD
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

  res.status(200).json({
    success: true,
    data: {
      carA,
      carB,
      comparison,
      verdict,
    },
  });
});


