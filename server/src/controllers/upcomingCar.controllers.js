// controllers/upcomingCar.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UpcomingCar } from "../models/upcomingCar.model.js";
import { Car } from "../models/car.models.js";


export const getUpcomingCars = asyncHandler(async (req, res) => {
  const cars = await UpcomingCar.find({ isActive: true })
    .sort({ expectedLaunchDate: 1 });

  return res.status(200).json(
    new ApiResponse(200, cars, "Upcoming cars fetched")
  );
});


export const addUpcomingCar = asyncHandler(async (req, res) => {

  const {
    engine,
    battery,
    features,
    ...rest
  } = req.body;

  const images = req.files?.map(
    (file) => `/images/cars/${file.filename}`
  ) || [];

  const car = await UpcomingCar.create({
    ...rest,
    engine: engine ? JSON.parse(engine) : {},
    battery: battery ? JSON.parse(battery) : {},
    features: features ? JSON.parse(features) : [],
    images,
  });

  return res.status(201).json(
    new ApiResponse(201, car, "Upcoming car added")
  );
});



export const updateUpcomingCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    engine,
    battery,
    features,
    ...rest
  } = req.body;

  const images = req.files?.map(
    (file) => `/uploads/upcoming/${file.filename}`
  );

  const updateData = {
    ...rest,
    engine: engine ? JSON.parse(engine) : undefined,
    battery: battery ? JSON.parse(battery) : undefined,
    features: features ? JSON.parse(features) : undefined,
  };

  if (images?.length) {
    updateData.images = images;
  }

  const car = await UpcomingCar.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!car) throw new ApiError(404, "Upcoming car not found");

  return res.status(200).json(
    new ApiResponse(200, car, "Upcoming car updated")
  );
});



export const launchUpcomingCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const upcomingCar = await UpcomingCar.findById(id);
  if (!upcomingCar) throw new ApiError(404, "Upcoming car not found");

  if (upcomingCar.status === "launched") {
    throw new ApiError(400, "Car already launched");
  }

  // 👉 Create REAL car entry (NO SELLER)
  const newCar = await Car.create({
    title: upcomingCar.title,
    brand: upcomingCar.brand,
    model: upcomingCar.model,
    variant: upcomingCar.variant,
    bodyType: upcomingCar.bodyType,

    fuelType: upcomingCar.fuelType,
    transmission: upcomingCar.transmission,

    year: upcomingCar.year || new Date().getFullYear(),
    price: 0,
    negotiable: false,

    engine: upcomingCar.engine,
    battery: upcomingCar.battery,

    features: upcomingCar.features,
    description: upcomingCar.description,
    images: upcomingCar.images,

    seller: null, 
    status: "launched",
    featured: false,
  });

  upcomingCar.status = "launched";
  upcomingCar.isActive = false;
  await upcomingCar.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { upcomingCar, newCar },
      "Car launched successfully"
    )
  );
});

export const getLaunchedCars = asyncHandler(async (req, res) => {
  const cars = await UpcomingCar.find({ status: "launched" })
    .sort({ updatedAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, cars, "Launched cars fetched")
  );
});
